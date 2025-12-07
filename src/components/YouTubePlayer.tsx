import { useEffect, useRef, useState, useCallback } from 'react';

interface YouTubePlayerProps {
  videoId: string;
  isPlaying: boolean;
  playbackTime: number;
  onStateChange?: (state: number) => void;
  onTimeUpdate?: (time: number) => void;
  onReady?: () => void;
}

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        config: {
          videoId: string;
          playerVars?: Record<string, unknown>;
          events?: {
            onReady?: (event: { target: YTPlayer }) => void;
            onStateChange?: (event: { data: number; target: YTPlayer }) => void;
          };
        }
      ) => YTPlayer;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
        BUFFERING: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getPlayerState: () => number;
  destroy: () => void;
  getIframe: () => HTMLIFrameElement;
}

const YouTubePlayer = ({
  videoId,
  isPlaying,
  playbackTime,
  onStateChange,
  onTimeUpdate,
  onReady
}: YouTubePlayerProps) => {
  const playerRef = useRef<YTPlayer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isApiReady, setIsApiReady] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const lastSyncedTimeRef = useRef<number>(0);
  const isInternalChangeRef = useRef<boolean>(false);
  const playerIdRef = useRef<string>(`yt-player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const initAttemptRef = useRef<number>(0);

  // Load YouTube IFrame API
  useEffect(() => {
    const checkAndSetReady = () => {
      if (window.YT && window.YT.Player) {
        setIsApiReady(true);
        return true;
      }
      return false;
    };

    if (checkAndSetReady()) return;

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="youtube.com/iframe_api"]');
    if (existingScript) {
      // Wait for it to load
      const checkInterval = setInterval(() => {
        if (checkAndSetReady()) {
          clearInterval(checkInterval);
        }
      }, 100);
      return () => clearInterval(checkInterval);
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.async = true;
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    const originalCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      originalCallback?.();
      setIsApiReady(true);
    };
  }, []);

  // Initialize player
  useEffect(() => {
    if (!isApiReady || !containerRef.current) return;

    // Cleanup existing player
    if (playerRef.current) {
      try {
        playerRef.current.destroy();
      } catch (e) {
        console.warn('Error destroying player:', e);
      }
      playerRef.current = null;
    }

    setIsPlayerReady(false);
    initAttemptRef.current += 1;
    const currentAttempt = initAttemptRef.current;

    // Clear container
    containerRef.current.innerHTML = '';
    
    // Create new player div
    const playerDiv = document.createElement('div');
    playerDiv.id = playerIdRef.current;
    containerRef.current.appendChild(playerDiv);

    // Small delay to ensure DOM is ready
    const initTimeout = setTimeout(() => {
      if (currentAttempt !== initAttemptRef.current) return;
      
      try {
        playerRef.current = new window.YT.Player(playerIdRef.current, {
          videoId,
          playerVars: {
            autoplay: 0,
            controls: 1,
            modestbranding: 1,
            rel: 0,
            fs: 1,
            playsinline: 1,
            enablejsapi: 1,
            origin: window.location.origin
          },
          events: {
            onReady: (event) => {
              if (currentAttempt !== initAttemptRef.current) return;
              
              console.log('YouTube player ready for video:', videoId);
              setIsPlayerReady(true);
              
              // Seek to playback time if needed
              if (playbackTime > 1) {
                event.target.seekTo(playbackTime, true);
                lastSyncedTimeRef.current = playbackTime;
              }
              
              // Start playing if needed
              if (isPlaying) {
                setTimeout(() => {
                  isInternalChangeRef.current = true;
                  event.target.playVideo();
                }, 500);
              }
              
              onReady?.();
            },
            onStateChange: (event) => {
              if (currentAttempt !== initAttemptRef.current) return;
              
              // Only emit state change if not internal
              if (!isInternalChangeRef.current) {
                onStateChange?.(event.data);
              }
              isInternalChangeRef.current = false;
            }
          }
        });
      } catch (e) {
        console.error('Error creating YouTube player:', e);
      }
    }, 100);

    return () => {
      clearTimeout(initTimeout);
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          console.warn('Error in cleanup:', e);
        }
        playerRef.current = null;
      }
    };
  }, [isApiReady, videoId]);

  // Handle play/pause changes
  useEffect(() => {
    if (!playerRef.current || !isPlayerReady) return;

    const player = playerRef.current;
    
    try {
      const currentState = player.getPlayerState();
      
      // 1 = playing, 2 = paused, -1 = unstarted, 0 = ended, 3 = buffering
      if (isPlaying && currentState !== 1 && currentState !== 3) {
        isInternalChangeRef.current = true;
        player.playVideo();
      } else if (!isPlaying && currentState === 1) {
        isInternalChangeRef.current = true;
        player.pauseVideo();
      }
    } catch (e) {
      console.warn('Error controlling playback:', e);
    }
  }, [isPlaying, isPlayerReady]);

  // Handle seek changes from external source
  useEffect(() => {
    if (!playerRef.current || !isPlayerReady) return;
    
    const timeDiff = Math.abs(playbackTime - lastSyncedTimeRef.current);
    
    // Only seek if difference is significant (more than 2 seconds)
    if (timeDiff > 2) {
      try {
        console.log('Seeking to:', playbackTime, 'from:', lastSyncedTimeRef.current);
        isInternalChangeRef.current = true;
        playerRef.current.seekTo(playbackTime, true);
        lastSyncedTimeRef.current = playbackTime;
      } catch (e) {
        console.warn('Error seeking:', e);
      }
    }
  }, [playbackTime, isPlayerReady]);

  // Track current time periodically
  useEffect(() => {
    if (!playerRef.current || !isPlayerReady || !onTimeUpdate) return;

    const interval = setInterval(() => {
      if (playerRef.current && isPlayerReady) {
        try {
          const time = playerRef.current.getCurrentTime();
          if (typeof time === 'number' && !isNaN(time)) {
            onTimeUpdate(time);
            lastSyncedTimeRef.current = time;
          }
        } catch (e) {
          // Player might be destroyed
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [onTimeUpdate, isPlayerReady]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full bg-muted/50 flex items-center justify-center"
      style={{ minHeight: '300px' }}
    >
      {!isPlayerReady && (
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
          <span className="text-sm">Video yükleniyor...</span>
        </div>
      )}
    </div>
  );
};

export default YouTubePlayer;
