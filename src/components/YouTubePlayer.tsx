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
  const lastSyncedTimeRef = useRef<number>(0);
  const isInternalChangeRef = useRef<boolean>(false);

  // Load YouTube IFrame API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setIsApiReady(true);
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      setIsApiReady(true);
    };
  }, []);

  // Initialize player
  useEffect(() => {
    if (!isApiReady || !containerRef.current || playerRef.current) return;

    const playerId = `youtube-player-${videoId}`;
    
    // Create container div for player
    const playerDiv = document.createElement('div');
    playerDiv.id = playerId;
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(playerDiv);

    playerRef.current = new window.YT.Player(playerId, {
      videoId,
      playerVars: {
        autoplay: isPlaying ? 1 : 0,
        controls: 0,
        modestbranding: 1,
        rel: 0,
        fs: 1,
        playsinline: 1,
        start: Math.floor(playbackTime)
      },
      events: {
        onReady: (event) => {
          console.log('YouTube player ready');
          if (playbackTime > 0) {
            event.target.seekTo(playbackTime, true);
          }
          if (isPlaying) {
            event.target.playVideo();
          }
          onReady?.();
        },
        onStateChange: (event) => {
          if (!isInternalChangeRef.current) {
            onStateChange?.(event.data);
          }
          isInternalChangeRef.current = false;
        }
      }
    });

    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [isApiReady, videoId]);

  // Handle play/pause changes
  useEffect(() => {
    if (!playerRef.current) return;

    const player = playerRef.current;
    const currentState = player.getPlayerState();
    
    isInternalChangeRef.current = true;
    
    if (isPlaying && currentState !== 1) {
      player.playVideo();
    } else if (!isPlaying && currentState === 1) {
      player.pauseVideo();
    }
  }, [isPlaying]);

  // Handle seek changes
  useEffect(() => {
    if (!playerRef.current) return;
    
    const timeDiff = Math.abs(playbackTime - lastSyncedTimeRef.current);
    if (timeDiff > 2) {
      isInternalChangeRef.current = true;
      playerRef.current.seekTo(playbackTime, true);
      lastSyncedTimeRef.current = playbackTime;
    }
  }, [playbackTime]);

  // Track current time
  useEffect(() => {
    if (!playerRef.current || !onTimeUpdate) return;

    const interval = setInterval(() => {
      if (playerRef.current) {
        const time = playerRef.current.getCurrentTime();
        if (time) {
          onTimeUpdate(time);
          lastSyncedTimeRef.current = time;
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [onTimeUpdate]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full"
      style={{ minHeight: '100%' }}
    />
  );
};

export default YouTubePlayer;
