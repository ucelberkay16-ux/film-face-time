import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
    // Free TURN servers for better NAT traversal
    {
      urls: 'turn:openrelay.metered.ca:80',
      username: 'openrelayproject',
      credential: 'openrelayproject'
    },
    {
      urls: 'turn:openrelay.metered.ca:443',
      username: 'openrelayproject',
      credential: 'openrelayproject'
    },
    {
      urls: 'turn:openrelay.metered.ca:443?transport=tcp',
      username: 'openrelayproject',
      credential: 'openrelayproject'
    }
  ],
  iceCandidatePoolSize: 10
};

interface PendingIceCandidates {
  [peerId: string]: RTCIceCandidateInit[];
}

export const useWebRTC = (roomId: string, userId: string) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const isCleaningUp = useRef(false);
  const pendingIceCandidates = useRef<PendingIceCandidates>({});
  const remoteDescriptionSet = useRef<Set<string>>(new Set());

  const removePeerConnection = useCallback((peerId: string) => {
    console.log('Removing peer connection for:', peerId);
    const pc = peerConnectionsRef.current.get(peerId);
    if (pc) {
      pc.close();
      peerConnectionsRef.current.delete(peerId);
    }
    remoteDescriptionSet.current.delete(peerId);
    delete pendingIceCandidates.current[peerId];
    setRemoteStreams(prev => {
      const newMap = new Map(prev);
      newMap.delete(peerId);
      return newMap;
    });
  }, []);

  const addPendingIceCandidates = useCallback(async (peerId: string, pc: RTCPeerConnection) => {
    const candidates = pendingIceCandidates.current[peerId] || [];
    console.log(`Adding ${candidates.length} pending ICE candidates for:`, peerId);
    for (const candidate of candidates) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.error('Error adding pending ICE candidate:', e);
      }
    }
    pendingIceCandidates.current[peerId] = [];
  }, []);

  const createPeerConnection = useCallback((peerId: string, stream: MediaStream) => {
    // Close existing connection if any
    const existingPc = peerConnectionsRef.current.get(peerId);
    if (existingPc) {
      existingPc.close();
      peerConnectionsRef.current.delete(peerId);
    }

    console.log('Creating peer connection for:', peerId);
    const pc = new RTCPeerConnection(ICE_SERVERS);

    // Initialize pending candidates array
    pendingIceCandidates.current[peerId] = [];
    remoteDescriptionSet.current.delete(peerId);

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
      console.log('Received remote track from:', peerId, 'kind:', event.track.kind);
      
      // Create or get existing remote stream
      setRemoteStreams(prev => {
        const newMap = new Map(prev);
        let remoteStream = newMap.get(peerId);
        
        if (!remoteStream) {
          remoteStream = new MediaStream();
          newMap.set(peerId, remoteStream);
        }
        
        // Add track to the stream if not already present
        const existingTrack = remoteStream.getTracks().find(t => t.id === event.track.id);
        if (!existingTrack) {
          remoteStream.addTrack(event.track);
          console.log('Added track to remote stream:', event.track.kind, 'total tracks:', remoteStream.getTracks().length);
        }
        
        return newMap;
      });
    };

    pc.onconnectionstatechange = () => {
      console.log('Connection state:', pc.connectionState, 'for peer:', peerId);
      if (pc.connectionState === 'failed') {
        console.log('Connection failed, attempting to restart ICE');
        pc.restartIce();
      }
      if ((pc.connectionState === 'disconnected' || pc.connectionState === 'closed') && !isCleaningUp.current) {
        setTimeout(() => {
          if (pc.connectionState === 'disconnected' || pc.connectionState === 'closed') {
            removePeerConnection(peerId);
          }
        }, 5000);
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log('ICE connection state:', pc.iceConnectionState, 'for peer:', peerId);
      if (pc.iceConnectionState === 'failed') {
        console.log('ICE connection failed, restarting ICE');
        pc.restartIce();
      }
    };

    pc.onicegatheringstatechange = () => {
      console.log('ICE gathering state:', pc.iceGatheringState, 'for peer:', peerId);
    };

    // Add local tracks
    stream.getTracks().forEach(track => {
      console.log('Adding track to peer connection:', track.kind);
      pc.addTrack(track, stream);
    });

    peerConnectionsRef.current.set(peerId, pc);
    return pc;
  }, [userId, removePeerConnection]);

  const handleSignal = useCallback(async (message: SignalMessage) => {
    if (message.to !== userId) return;
    if (!localStreamRef.current) {
      console.log('No local stream yet, ignoring signal');
      return;
    }

    console.log('Received signal:', message.type, 'from:', message.from);

    let pc = peerConnectionsRef.current.get(message.from);

    try {
      if (message.type === 'offer') {
        pc = createPeerConnection(message.from, localStreamRef.current);
        await pc.setRemoteDescription(new RTCSessionDescription(message.data as RTCSessionDescriptionInit));
        remoteDescriptionSet.current.add(message.from);
        
        // Add any pending ICE candidates
        await addPendingIceCandidates(message.from, pc);
        
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
          if (pc.signalingState === 'have-local-offer') {
            await pc.setRemoteDescription(new RTCSessionDescription(message.data as RTCSessionDescriptionInit));
            remoteDescriptionSet.current.add(message.from);
            
            // Add any pending ICE candidates
            await addPendingIceCandidates(message.from, pc);
          } else {
            console.log('Ignoring answer, signaling state is:', pc.signalingState);
          }
        }
      } else if (message.type === 'ice-candidate') {
        const candidateData = message.data as RTCIceCandidateInit;
        
        if (pc && remoteDescriptionSet.current.has(message.from)) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidateData));
            console.log('Added ICE candidate from:', message.from);
          } catch (e) {
            console.error('Error adding ICE candidate:', e);
          }
        } else {
          // Queue the ICE candidate
          console.log('Queueing ICE candidate for:', message.from);
          if (!pendingIceCandidates.current[message.from]) {
            pendingIceCandidates.current[message.from] = [];
          }
          pendingIceCandidates.current[message.from].push(candidateData);
        }
      }
    } catch (err) {
      console.error('Error handling signal:', err);
    }
  }, [userId, createPeerConnection, addPendingIceCandidates]);

  const startCall = useCallback(async () => {
    if (isConnecting || localStreamRef.current) return;
    
    setIsConnecting(true);
    setError(null);
    isCleaningUp.current = false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 24 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      localStreamRef.current = stream;
      setLocalStream(stream);
      setIsCameraOn(true);
      setIsMicOn(true);

      // Setup signaling channel
      const channel = supabase.channel(`webrtc-${roomId}`, {
        config: {
          broadcast: { self: false }
        }
      });
      
      channel
        .on('broadcast', { event: 'signal' }, ({ payload }) => {
          handleSignal(payload as SignalMessage);
        })
        .on('broadcast', { event: 'user-joined' }, async ({ payload }) => {
          if (payload.userId !== userId && localStreamRef.current) {
            console.log('User joined:', payload.userId);
            
            // Small delay to ensure both sides are ready
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const pc = createPeerConnection(payload.userId, localStreamRef.current);

            const offer = await pc.createOffer({
              offerToReceiveAudio: true,
              offerToReceiveVideo: true
            });
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
            // Small delay to ensure other clients are ready
            setTimeout(() => {
              channel.send({
                type: 'broadcast',
                event: 'user-joined',
                payload: { userId }
              });
            }, 1000);
          }
        });

      channelRef.current = channel;

    } catch (err) {
      console.error('Error starting call:', err);
      setError('Kamera veya mikrofon erişimi reddedildi');
      localStreamRef.current = null;
      setLocalStream(null);
    } finally {
      setIsConnecting(false);
    }
  }, [roomId, userId, createPeerConnection, handleSignal, removePeerConnection, isConnecting]);

  const endCall = useCallback(() => {
    console.log('Ending call');
    isCleaningUp.current = true;
    
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'user-left',
        payload: { userId }
      });
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    setLocalStream(null);

    peerConnectionsRef.current.forEach((pc) => {
      pc.close();
    });
    peerConnectionsRef.current.clear();
    setRemoteStreams(new Map());
    
    pendingIceCandidates.current = {};
    remoteDescriptionSet.current.clear();

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    setIsCameraOn(false);
    setIsMicOn(false);
    isCleaningUp.current = false;
  }, [userId]);

  const toggleCamera = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(videoTrack.enabled);
      }
    }
  }, []);

  const toggleMic = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      isCleaningUp.current = true;
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      peerConnectionsRef.current.forEach(pc => pc.close());
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
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
