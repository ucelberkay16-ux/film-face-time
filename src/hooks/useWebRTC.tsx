import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PeerConnection {
  peerId: string;
  connection: RTCPeerConnection;
  stream?: MediaStream;
}

interface SignalMessage {
  type: 'offer' | 'answer' | 'ice-candidate';
  from: string;
  to: string;
  data: RTCSessionDescriptionInit | RTCIceCandidateInit;
}

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ]
};

export const useWebRTC = (roomId: string, userId: string) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const createPeerConnection = useCallback((peerId: string) => {
    console.log('Creating peer connection for:', peerId);
    const pc = new RTCPeerConnection(ICE_SERVERS);

    pc.onicecandidate = (event) => {
      if (event.candidate && channelRef.current) {
        console.log('Sending ICE candidate to:', peerId);
        channelRef.current.send({
          type: 'broadcast',
          event: 'signal',
          payload: {
            type: 'ice-candidate',
            from: userId,
            to: peerId,
            data: event.candidate.toJSON()
          }
        });
      }
    };

    pc.ontrack = (event) => {
      console.log('Received remote track from:', peerId);
      setRemoteStreams(prev => {
        const newMap = new Map(prev);
        newMap.set(peerId, event.streams[0]);
        return newMap;
      });
    };

    pc.onconnectionstatechange = () => {
      console.log('Connection state:', pc.connectionState, 'for peer:', peerId);
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        removePeerConnection(peerId);
      }
    };

    if (localStream) {
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });
    }

    peerConnectionsRef.current.set(peerId, pc);
    return pc;
  }, [userId, localStream]);

  const removePeerConnection = useCallback((peerId: string) => {
    const pc = peerConnectionsRef.current.get(peerId);
    if (pc) {
      pc.close();
      peerConnectionsRef.current.delete(peerId);
    }
    setRemoteStreams(prev => {
      const newMap = new Map(prev);
      newMap.delete(peerId);
      return newMap;
    });
  }, []);

  const handleSignal = useCallback(async (message: SignalMessage) => {
    if (message.to !== userId) return;

    console.log('Received signal:', message.type, 'from:', message.from);

    let pc = peerConnectionsRef.current.get(message.from);

    if (message.type === 'offer') {
      if (!pc) {
        pc = createPeerConnection(message.from);
      }
      await pc.setRemoteDescription(new RTCSessionDescription(message.data as RTCSessionDescriptionInit));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      
      channelRef.current?.send({
        type: 'broadcast',
        event: 'signal',
        payload: {
          type: 'answer',
          from: userId,
          to: message.from,
          data: answer
        }
      });
    } else if (message.type === 'answer') {
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(message.data as RTCSessionDescriptionInit));
      }
    } else if (message.type === 'ice-candidate') {
      if (pc) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(message.data as RTCIceCandidateInit));
        } catch (e) {
          console.error('Error adding ICE candidate:', e);
        }
      }
    }
  }, [userId, createPeerConnection]);

  const startCall = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      setLocalStream(stream);
      setIsCameraOn(true);
      setIsMicOn(true);

      // Setup signaling channel
      const channel = supabase.channel(`webrtc-${roomId}`);
      
      channel
        .on('broadcast', { event: 'signal' }, ({ payload }) => {
          handleSignal(payload as SignalMessage);
        })
        .on('broadcast', { event: 'user-joined' }, async ({ payload }) => {
          if (payload.userId !== userId) {
            console.log('User joined:', payload.userId);
            const pc = createPeerConnection(payload.userId);
            
            stream.getTracks().forEach(track => {
              pc.addTrack(track, stream);
            });

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            
            channel.send({
              type: 'broadcast',
              event: 'signal',
              payload: {
                type: 'offer',
                from: userId,
                to: payload.userId,
                data: offer
              }
            });
          }
        })
        .on('broadcast', { event: 'user-left' }, ({ payload }) => {
          if (payload.userId !== userId) {
            console.log('User left:', payload.userId);
            removePeerConnection(payload.userId);
          }
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            console.log('Subscribed to WebRTC channel');
            channel.send({
              type: 'broadcast',
              event: 'user-joined',
              payload: { userId }
            });
          }
        });

      channelRef.current = channel;

    } catch (err) {
      console.error('Error starting call:', err);
      setError('Kamera veya mikrofon erişimi reddedildi');
    } finally {
      setIsConnecting(false);
    }
  }, [roomId, userId, createPeerConnection, handleSignal, removePeerConnection]);

  const endCall = useCallback(() => {
    console.log('Ending call');
    
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }

    peerConnectionsRef.current.forEach((pc, peerId) => {
      pc.close();
    });
    peerConnectionsRef.current.clear();
    setRemoteStreams(new Map());

    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'user-left',
        payload: { userId }
      });
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    setIsCameraOn(false);
    setIsMicOn(false);
  }, [localStream, userId]);

  const toggleCamera = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(videoTrack.enabled);
      }
    }
  }, [localStream]);

  const toggleMic = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    }
  }, [localStream]);

  useEffect(() => {
    return () => {
      endCall();
    };
  }, []);

  return {
    localStream,
    remoteStreams,
    isCameraOn,
    isMicOn,
    isConnecting,
    error,
    startCall,
    endCall,
    toggleCamera,
    toggleMic
  };
};
