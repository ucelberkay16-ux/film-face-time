import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Video, VideoOff, Mic, MicOff, PhoneCall, PhoneOff, 
  Users, Maximize2, Minimize2 
} from 'lucide-react';
import { useWebRTC } from '@/hooks/useWebRTC';
import { useState } from 'react';

interface VideoChatProps {
  roomId: string;
  userId: string;
  participantNames: Map<string, string>;
}

const VideoChat = ({ roomId, userId, participantNames }: VideoChatProps) => {
  const {
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
  } = useWebRTC(roomId, userId);

  const [isExpanded, setIsExpanded] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  const isInCall = localStream !== null;

  return (
    <div className={`bg-card/80 backdrop-blur-sm border border-border rounded-xl overflow-hidden transition-all duration-300 ${
      isExpanded ? 'fixed inset-4 z-50' : 'relative'
    }`}>
      <div className="p-3 border-b border-border flex items-center justify-between bg-background/50">
        <div className="flex items-center gap-2">
          <Video className="w-4 h-4 text-primary" />
          <span className="font-medium text-sm text-foreground">Görüntülü Sohbet</span>
          {isInCall && (
            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
              Bağlı
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {isInCall && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
            </Button>
          )}
        </div>
      </div>

      <div className="p-3">
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-2 rounded-lg mb-3">
            {error}
          </div>
        )}

        {!isInCall ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Video className="w-8 h-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Diğer katılımcılarla görüntülü sohbet başlatın
            </p>
            <Button 
              onClick={startCall} 
              disabled={isConnecting}
              className="gap-2"
            >
              {isConnecting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Bağlanıyor...
                </>
              ) : (
                <>
                  <PhoneCall className="w-4 h-4" />
                  Aramayı Başlat
                </>
              )}
            </Button>
          </div>
        ) : (
          <>
            <div className={`grid gap-2 mb-3 ${
              isExpanded 
                ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
                : remoteStreams.size > 0 ? 'grid-cols-2' : 'grid-cols-1'
            }`}>
              {/* Local Video */}
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className={`w-full h-full object-cover ${!isCameraOn ? 'hidden' : ''}`}
                />
                {!isCameraOn && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <VideoOff className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                )}
                <div className="absolute bottom-1 left-1 text-xs bg-black/60 text-white px-1.5 py-0.5 rounded">
                  Sen
                </div>
                {!isMicOn && (
                  <div className="absolute top-1 right-1">
                    <MicOff className="w-3 h-3 text-destructive" />
                  </div>
                )}
              </div>

              {/* Remote Videos */}
              {Array.from(remoteStreams.entries()).map(([peerId, stream]) => (
                <RemoteVideo 
                  key={peerId} 
                  stream={stream} 
                  name={participantNames.get(peerId) || 'Katılımcı'} 
                />
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-2">
              <Button
                variant={isCameraOn ? 'secondary' : 'destructive'}
                size="icon"
                onClick={toggleCamera}
                className="h-10 w-10 rounded-full"
              >
                {isCameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </Button>
              <Button
                variant={isMicOn ? 'secondary' : 'destructive'}
                size="icon"
                onClick={toggleMic}
                className="h-10 w-10 rounded-full"
              >
                {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={endCall}
                className="h-10 w-10 rounded-full"
              >
                <PhoneOff className="w-4 h-4" />
              </Button>
            </div>

            {remoteStreams.size === 0 && (
              <p className="text-xs text-center text-muted-foreground mt-3">
                <Users className="w-3 h-3 inline mr-1" />
                Diğer katılımcılar bekleniyor...
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const RemoteVideo = ({ stream, name }: { stream: MediaStream; name: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-1 left-1 text-xs bg-black/60 text-white px-1.5 py-0.5 rounded">
        {name}
      </div>
    </div>
  );
};

export default VideoChat;
