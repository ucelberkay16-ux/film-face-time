import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Video, VideoOff, Mic, MicOff, PhoneCall, PhoneOff, 
  Users, Maximize2, Minimize2, Settings, Volume2, VolumeX
} from 'lucide-react';
import { useWebRTC } from '@/hooks/useWebRTC';
import { cn } from '@/lib/utils';

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
  const [isMuted, setIsMuted] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  const isInCall = localStream !== null;
  const participantCount = remoteStreams.size + (isInCall ? 1 : 0);

  return (
    <div className={cn(
      "bg-gradient-to-b from-card to-card/95 backdrop-blur-xl border border-border/50 overflow-hidden transition-all duration-500 ease-out shadow-xl",
      isExpanded 
        ? 'fixed inset-4 z-50 rounded-2xl' 
        : 'relative rounded-xl'
    )}>
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-border/50 flex items-center justify-between bg-gradient-to-r from-background/80 to-background/40">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
            isInCall ? "bg-green-500/20" : "bg-primary/10"
          )}>
            <Video className={cn(
              "w-4 h-4 transition-colors",
              isInCall ? "text-green-500" : "text-primary"
            )} />
          </div>
          <div>
            <span className="font-semibold text-sm text-foreground">Video</span>
            {isInCall && (
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[10px] text-green-500 font-medium">Canlı</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {isInCall && (
            <>
              <div className="flex items-center gap-1 px-2 py-1 bg-muted/50 rounded-full mr-1">
                <Users className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">{participantCount}</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 rounded-lg hover:bg-muted/50"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className={cn("p-3", isExpanded && "p-4")}>
        {error && (
          <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 border border-destructive/20 p-2.5 rounded-lg mb-3">
            <div className="w-4 h-4 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px]">!</span>
            </div>
            {error}
          </div>
        )}

        {!isInCall ? (
          <div className="text-center py-6 px-4">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 animate-pulse"></div>
              <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-primary/10 to-transparent flex items-center justify-center border border-primary/20">
                <Video className="w-7 h-7 text-primary" />
              </div>
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">Görüntülü Konuşma</h3>
            <p className="text-xs text-muted-foreground mb-4 max-w-[200px] mx-auto">
              Odadaki diğer kişilerle yüz yüze sohbet edin
            </p>
            <Button 
              onClick={startCall} 
              disabled={isConnecting}
              className="gap-2 px-5 h-9 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25 transition-all duration-300"
            >
              {isConnecting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Bağlanıyor...</span>
                </>
              ) : (
                <>
                  <PhoneCall className="w-4 h-4" />
                  <span>Aramaya Katıl</span>
                </>
              )}
            </Button>
          </div>
        ) : (
          <>
            {/* Video Grid */}
            <div className={cn(
              "grid gap-2 mb-3",
              isExpanded 
                ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-fr" 
                : "grid-cols-2"
            )}>
              {/* Local Video */}
              <VideoTile
                videoRef={localVideoRef}
                name="Sen"
                isLocal
                isCameraOn={isCameraOn}
                isMicOn={isMicOn}
                isExpanded={isExpanded}
              />

              {/* Remote Videos */}
              {Array.from(remoteStreams.entries()).map(([peerId, stream]) => (
                <RemoteVideoTile 
                  key={peerId} 
                  stream={stream} 
                  name={participantNames.get(peerId) || 'Katılımcı'} 
                  isExpanded={isExpanded}
                  isMuted={isMuted}
                />
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-2 py-2">
              <ControlButton
                active={isCameraOn}
                onClick={toggleCamera}
                icon={isCameraOn ? Video : VideoOff}
                label={isCameraOn ? "Kamerayı Kapat" : "Kamerayı Aç"}
              />
              <ControlButton
                active={isMicOn}
                onClick={toggleMic}
                icon={isMicOn ? Mic : MicOff}
                label={isMicOn ? "Mikrofonu Kapat" : "Mikrofonu Aç"}
              />
              <ControlButton
                active={!isMuted}
                onClick={() => setIsMuted(!isMuted)}
                icon={isMuted ? VolumeX : Volume2}
                label={isMuted ? "Sesi Aç" : "Sesi Kapat"}
              />
              <div className="w-px h-6 bg-border mx-1" />
              <Button
                variant="destructive"
                size="icon"
                onClick={endCall}
                className="h-10 w-10 rounded-full shadow-lg shadow-destructive/25 hover:scale-105 transition-transform"
              >
                <PhoneOff className="w-4 h-4" />
              </Button>
            </div>

            {remoteStreams.size === 0 && (
              <div className="flex items-center justify-center gap-2 py-2 px-3 bg-muted/30 rounded-lg mt-2">
                <div className="flex -space-x-1">
                  <div className="w-5 h-5 rounded-full bg-muted border-2 border-background animate-pulse"></div>
                  <div className="w-5 h-5 rounded-full bg-muted border-2 border-background animate-pulse delay-100"></div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Diğer katılımcılar bekleniyor...
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

interface VideoTileProps {
  videoRef?: React.RefObject<HTMLVideoElement>;
  name: string;
  isLocal?: boolean;
  isCameraOn?: boolean;
  isMicOn?: boolean;
  isExpanded?: boolean;
}

const VideoTile = ({ videoRef, name, isLocal, isCameraOn = true, isMicOn = true, isExpanded }: VideoTileProps) => {
  return (
    <div className={cn(
      "relative bg-gradient-to-br from-muted to-muted/80 rounded-xl overflow-hidden group transition-all duration-300",
      isExpanded ? "aspect-video" : "aspect-video"
    )}>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          !isCameraOn && "opacity-0"
        )}
      />
      
      {/* Camera Off State */}
      {!isCameraOn && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted/80">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10">
            <span className="text-lg font-semibold text-primary">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Name Badge */}
      <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between">
        <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white px-2 py-0.5 rounded-full">
          {isLocal && (
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
          )}
          <span className="text-[11px] font-medium truncate max-w-[60px]">{name}</span>
        </div>
        
        {/* Mic Status */}
        {!isMicOn && (
          <div className="w-5 h-5 rounded-full bg-destructive/90 flex items-center justify-center">
            <MicOff className="w-2.5 h-2.5 text-white" />
          </div>
        )}
      </div>

      {/* Speaking Indicator */}
      {isLocal && isMicOn && (
        <div className="absolute top-1.5 right-1.5">
          <div className="flex items-center gap-0.5 bg-black/50 backdrop-blur-sm rounded-full px-1.5 py-0.5">
            <div className="w-1 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <div className="w-1 h-3 bg-green-500 rounded-full animate-pulse delay-75"></div>
            <div className="w-1 h-2 bg-green-500 rounded-full animate-pulse delay-150"></div>
          </div>
        </div>
      )}
    </div>
  );
};

interface RemoteVideoTileProps {
  stream: MediaStream;
  name: string;
  isExpanded?: boolean;
  isMuted?: boolean;
}

const RemoteVideoTile = ({ stream, name, isExpanded, isMuted }: RemoteVideoTileProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.muted = isMuted || false;
    }
  }, [stream, isMuted]);

  return (
    <div className={cn(
      "relative bg-gradient-to-br from-muted to-muted/80 rounded-xl overflow-hidden group transition-all duration-300",
      isExpanded ? "aspect-video" : "aspect-video"
    )}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Name Badge */}
      <div className="absolute bottom-1.5 left-1.5">
        <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white px-2 py-0.5 rounded-full">
          <span className="text-[11px] font-medium truncate max-w-[80px]">{name}</span>
        </div>
      </div>

      {/* Muted Indicator */}
      {isMuted && (
        <div className="absolute top-1.5 right-1.5">
          <div className="w-5 h-5 rounded-full bg-muted/90 backdrop-blur-sm flex items-center justify-center">
            <VolumeX className="w-2.5 h-2.5 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
};

interface ControlButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}

const ControlButton = ({ active, onClick, icon: Icon, label }: ControlButtonProps) => {
  return (
    <Button
      variant={active ? 'secondary' : 'destructive'}
      size="icon"
      onClick={onClick}
      className={cn(
        "h-10 w-10 rounded-full transition-all duration-200 hover:scale-105",
        active 
          ? "bg-muted hover:bg-muted/80 shadow-lg" 
          : "shadow-lg shadow-destructive/25"
      )}
      title={label}
    >
      <Icon className="w-4 h-4" />
    </Button>
  );
};

export default VideoChat;
