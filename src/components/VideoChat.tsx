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
      <div className="p-2 border-b border-border flex items-center justify-between bg-background/50">
        <div className="flex items-center gap-1.5">
          <Video className="w-3.5 h-3.5 text-primary" />
          <span className="font-medium text-xs text-foreground">Görüntülü Sohbet</span>
          {isInCall && (
            <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full">
              Bağlı
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {isInCall && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
            </Button>
          )}
        </div>
      </div>

      <div className="p-2">
        {error && (
          <div className="text-xs text-destructive bg-destructive/10 p-1.5 rounded-lg mb-2">
            {error}
          </div>
        )}

        {!isInCall ? (
          <div className="text-center py-3">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center">
              <Video className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              Görüntülü sohbet başlatın
            </p>
            <Button 
              onClick={startCall} 
              disabled={isConnecting}
              size="sm"
              className="gap-1.5 text-xs h-7"
            >
              {isConnecting ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Bağlanıyor...
                </>
              ) : (
                <>
                  <PhoneCall className="w-3 h-3" />
                  Aramayı Başlat
                </>
              )}
            </Button>
          </div>
        ) : (
          <>
            <div className={`grid gap-1.5 mb-2 ${
              isExpanded 
                ? 'grid-cols-3 md:grid-cols-4' 
                : 'grid-cols-2'
            }`}>
              {/* Local Video */}
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className={`w-full h-full object-cover ${!isCameraOn ? 'hidden' : ''}`}
                  style={{ transform: 'scaleX(1)', WebkitTransform: 'scaleX(1)' }}
                />
                {!isCameraOn && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <VideoOff className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                )}
                <div className="absolute bottom-0.5 left-0.5 text-[10px] bg-black/60 text-white px-1 py-0.5 rounded">
                  Sen
                </div>
                {!isMicOn && (
                  <div className="absolute top-0.5 right-0.5">
                    <MicOff className="w-2.5 h-2.5 text-destructive" />
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
            <div className="flex items-center justify-center gap-1.5">
              <Button
                variant={isCameraOn ? 'secondary' : 'destructive'}
                size="icon"
                onClick={toggleCamera}
                className="h-8 w-8 rounded-full"
              >
                {isCameraOn ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
              </Button>
              <Button
                variant={isMicOn ? 'secondary' : 'destructive'}
                size="icon"
                onClick={toggleMic}
                className="h-8 w-8 rounded-full"
              >
                {isMicOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={endCall}
                className="h-8 w-8 rounded-full"
              >
                <PhoneOff className="w-3.5 h-3.5" />
              </Button>
            </div>

            {remoteStreams.size === 0 && (
              <p className="text-[10px] text-center text-muted-foreground mt-2">
                <Users className="w-2.5 h-2.5 inline mr-1" />
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
    <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
        style={{ transform: 'none' }}
      />
      <div className="absolute bottom-0.5 left-0.5 text-[10px] bg-black/60 text-white px-1 py-0.5 rounded">
        {name}
      </div>
    </div>
  );
};

export default VideoChat;
