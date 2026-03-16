import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Play, Pause, Users, MessageCircle, Send, ArrowLeft, 
  Link as LinkIcon, Copy, X, Video, SkipBack, SkipForward, 
  RefreshCw, Film, Settings, ChevronRight, Hash
} from 'lucide-react';
import VideoChat from '@/components/VideoChat';
import YouTubePlayer from '@/components/YouTubePlayer';

interface RoomData {
  id: string;
  name: string;
  owner_id: string;
  video_url: string | null;
  playback_time: number;
  is_playing: boolean;
}

interface Message {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles?: { display_name: string | null };
}

interface Participant {
  id: string;
  user_id: string;
  profiles?: { display_name: string | null };
}

type SidePanel = 'chat' | 'participants' | 'videochat';

const Room = () => {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastSyncTimeRef = useRef<number>(0);
  const isLocalSeekRef = useRef<boolean>(false);
  const syncDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [room, setRoom] = useState<RoomData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [sidePanel, setSidePanel] = useState<SidePanel>('chat');
  const [showSide, setShowSide] = useState(true);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [playerReady, setPlayerReady] = useState(false);
  const [showVideoInput, setShowVideoInput] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user && id) {
      fetchRoom();
      fetchMessages();
      fetchParticipants();
      joinRoom();

      const roomChannel = supabase
        .channel(`room-${id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms', filter: `id=eq.${id}` }, (payload) => {
          if (payload.new) {
            const newRoom = payload.new as RoomData;
            setRoom(prev => {
              if (isLocalSeekRef.current && prev) {
                isLocalSeekRef.current = false;
                return { ...prev, is_playing: newRoom.is_playing, video_url: newRoom.video_url };
              }
              return newRoom;
            });
          }
        })
        .subscribe();

      const messagesChannel = supabase
        .channel(`messages-${id}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'room_messages', filter: `room_id=eq.${id}` }, () => {
          fetchMessages();
        })
        .subscribe();

      const participantsChannel = supabase
        .channel(`participants-${id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'room_participants', filter: `room_id=eq.${id}` }, () => {
          fetchParticipants();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(roomChannel);
        supabase.removeChannel(messagesChannel);
        supabase.removeChannel(participantsChannel);
        if (syncDebounceRef.current) clearTimeout(syncDebounceRef.current);
      };
    }
  }, [user, id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handlePlayerStateChange = useCallback(async (state: number) => {
    if (!room || !id) return;
    if (state === 1 && !room.is_playing) {
      await supabase.from('rooms').update({ is_playing: true }).eq('id', id);
    } else if (state === 2 && room.is_playing) {
      await supabase.from('rooms').update({ is_playing: false }).eq('id', id);
    }
  }, [room?.is_playing, id]);

  const handleTimeUpdate = useCallback((time: number) => {
    setCurrentTime(time);
    lastSyncTimeRef.current = time;
  }, []);

  const fetchRoom = async () => {
    const { data } = await supabase.from('rooms').select('*').eq('id', id).maybeSingle();
    if (data) setRoom(data);
    setLoading(false);
  };

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('room_messages').select('*').eq('room_id', id).order('created_at', { ascending: true });
    if (data) {
      const withProfiles = await Promise.all(data.map(async (msg) => {
        const { data: profile } = await supabase.from('profiles').select('display_name').eq('user_id', msg.user_id).maybeSingle();
        return { ...msg, profiles: profile };
      }));
      setMessages(withProfiles);
    }
  };

  const fetchParticipants = async () => {
    const { data } = await supabase.from('room_participants').select('*').eq('room_id', id);
    if (data) {
      const withProfiles = await Promise.all(data.map(async (p) => {
        const { data: profile } = await supabase.from('profiles').select('display_name').eq('user_id', p.user_id).maybeSingle();
        return { ...p, profiles: profile };
      }));
      setParticipants(withProfiles);
    }
  };

  const joinRoom = async () => {
    if (!user || !id) return;
    await supabase.from('room_participants').upsert({ room_id: id, user_id: user.id });
  };

  const sendMessage = async () => {
    const trimmed = newMessage.trim();
    if (!trimmed || !user || !id) return;
    if (trimmed.length > 500) {
      toast({ title: 'Hata', description: 'Mesaj en fazla 500 karakter olabilir.', variant: 'destructive' });
      return;
    }
    await supabase.from('room_messages').insert({ room_id: id, user_id: user.id, content: trimmed });
    setNewMessage('');
  };

  const setVideo = async () => {
    if (!videoUrl.trim() || !room || user?.id !== room.owner_id) return;
    await supabase.from('rooms').update({ video_url: videoUrl.trim(), playback_time: 0, is_playing: false }).eq('id', id);
    setVideoUrl('');
    setShowVideoInput(false);
    toast({ title: 'Video ayarlandı', description: 'Video URL güncellendi.' });
  };

  const togglePlay = async () => {
    if (!room) return;
    await supabase.from('rooms').update({ is_playing: !room.is_playing }).eq('id', id);
  };

  const seekTo = useCallback(async (time: number) => {
    if (!room || !id) return;
    isLocalSeekRef.current = true;
    lastSyncTimeRef.current = time;
    setCurrentTime(time);
    if (syncDebounceRef.current) clearTimeout(syncDebounceRef.current);
    syncDebounceRef.current = setTimeout(async () => {
      await supabase.from('rooms').update({ playback_time: time }).eq('id', id);
    }, 300);
  }, [room, id]);

  const handleManualSync = useCallback(async () => {
    if (!room || !id || currentTime <= 0) return;
    isLocalSeekRef.current = true;
    await supabase.from('rooms').update({ playback_time: currentTime }).eq('id', id);
    toast({ title: '✓ Senkronize edildi', description: 'Tüm kullanıcılar bu noktaya alındı.' });
  }, [room, id, currentTime, toast]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: '✓ Kopyalandı', description: 'Oda linki panoya kopyalandı.' });
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match?.[1] || null;
  };

  const isOwner = user?.id === room?.owner_id;

  const participantNames = useMemo(() => {
    const map = new Map<string, string>();
    participants.forEach(p => map.set(p.user_id, p.profiles?.display_name || 'Anonim'));
    return map;
  }, [participants]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
            <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
          <p className="text-sm text-muted-foreground animate-pulse">Oda yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto">
            <Film className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Oda bulunamadı</h1>
          <p className="text-muted-foreground text-sm">Bu oda mevcut değil ya da silinmiş olabilir.</p>
          <Button onClick={() => navigate('/rooms')} className="mt-2">Odalara Dön</Button>
        </div>
      </div>
    );
  }

  const youtubeId = room.video_url ? getYouTubeId(room.video_url) : null;

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Top Bar */}
      <header className="flex-shrink-0 h-14 border-b border-border/60 bg-card/40 backdrop-blur-xl px-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-lg hover:bg-muted/60 text-muted-foreground hover:text-foreground"
            onClick={() => navigate('/rooms')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="w-px h-5 bg-border/60" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
              <Hash className="w-3.5 h-3.5 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-foreground leading-tight">{room.name}</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                <span className="text-[10px] text-muted-foreground">{participants.length} kişi aktif</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {isOwner && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground rounded-lg px-3"
              onClick={() => setShowVideoInput(!showVideoInput)}
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Video Ayarla</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground rounded-lg px-3"
            onClick={copyLink}
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Davet</span>
          </Button>
          <div className="w-px h-5 bg-border/60 mx-0.5" />
          {/* Panel toggle buttons */}
          <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-0.5">
            <PanelTab active={sidePanel === 'chat' && showSide} onClick={() => { setSidePanel('chat'); setShowSide(true); }} icon={<MessageCircle className="w-3.5 h-3.5" />} label="Sohbet" />
            <PanelTab active={sidePanel === 'participants' && showSide} onClick={() => { setSidePanel('participants'); setShowSide(true); }} icon={<Users className="w-3.5 h-3.5" />} label="Kişiler" />
            <PanelTab active={sidePanel === 'videochat' && showSide} onClick={() => { setSidePanel('videochat'); setShowSide(true); }} icon={<Video className="w-3.5 h-3.5" />} label="Video" />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg hover:bg-muted/60 text-muted-foreground"
            onClick={() => setShowSide(!showSide)}
            title={showSide ? 'Paneli Gizle' : 'Paneli Göster'}
          >
            <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${showSide ? 'rotate-0' : 'rotate-180'}`} />
          </Button>
        </div>
      </header>

      {/* Video URL Input (owner only, collapsible) */}
      {isOwner && showVideoInput && (
        <div className="flex-shrink-0 border-b border-border/60 bg-card/20 backdrop-blur px-4 py-3 z-10">
          <div className="flex gap-2 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Film className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="YouTube URL yapıştırın... (örn: https://youtube.com/watch?v=...)"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && setVideo()}
                className="pl-9 h-9 text-sm bg-background/60 border-border/60 focus:border-primary/50"
              />
            </div>
            <Button onClick={setVideo} disabled={!videoUrl.trim()} size="sm" className="h-9 px-4 gap-1.5">
              <LinkIcon className="w-3.5 h-3.5" />
              Ayarla
            </Button>
            <Button variant="ghost" size="sm" className="h-9 px-3" onClick={() => setShowVideoInput(false)}>
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-black/20 relative">
          {/* Video */}
          <div className="flex-1 flex items-center justify-center overflow-hidden">
            {youtubeId ? (
              <div className="w-full h-full">
                <YouTubePlayer
                  videoId={youtubeId}
                  isPlaying={room.is_playing}
                  playbackTime={room.playback_time}
                  onStateChange={handlePlayerStateChange}
                  onTimeUpdate={handleTimeUpdate}
                  onReady={() => setPlayerReady(true)}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-5 text-center px-8 select-none">
                <div className="relative">
                  <div className="w-24 h-24 rounded-3xl bg-card/50 border border-border/40 flex items-center justify-center">
                    <Film className="w-10 h-10 text-muted-foreground/40" />
                  </div>
                  <div className="absolute -inset-3 rounded-[2rem] border border-border/20 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground/70 mb-1">
                    {isOwner ? 'Video henüz seçilmedi' : 'Video bekleniyor'}
                  </h3>
                  <p className="text-sm text-muted-foreground/60 max-w-xs">
                    {isOwner 
                      ? 'Yukarıdan "Video Ayarla" butonuna tıklayarak bir YouTube videosu ekleyin' 
                      : 'Oda sahibi yakında bir video ekleyecek'}
                  </p>
                </div>
                {isOwner && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="gap-2 border-border/60"
                    onClick={() => setShowVideoInput(true)}
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    Video Ekle
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Playback Controls */}
          {youtubeId && (
            <div className="flex-shrink-0 flex items-center justify-between gap-3 px-4 py-3 bg-gradient-to-t from-black/60 to-transparent border-t border-border/30 backdrop-blur-sm">
              {/* Left: Time */}
              <div className="flex items-center gap-1.5 min-w-[60px]">
                <span className="text-xs font-mono text-muted-foreground tabular-nums">{formatTime(currentTime)}</span>
              </div>

              {/* Center: Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/10"
                  onClick={() => seekTo(Math.max(0, currentTime - 10))}
                  title="-10 saniye"
                >
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button
                  onClick={togglePlay}
                  size="icon"
                  className="h-11 w-11 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 text-primary-foreground transition-all hover:scale-105"
                >
                  {room.is_playing 
                    ? <Pause className="w-5 h-5 fill-current" /> 
                    : <Play className="w-5 h-5 fill-current ml-0.5" />
                  }
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/10"
                  onClick={() => seekTo(currentTime + 10)}
                  title="+10 saniye"
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>

              {/* Right: Sync */}
              <div className="flex items-center gap-2 min-w-[60px] justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-white/10 rounded-lg px-3"
                  onClick={handleManualSync}
                  title="Herkesi senkronize et"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Senkronize Et</span>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Side Panel */}
        {showSide && (
          <aside className="w-72 xl:w-80 flex-shrink-0 border-l border-border/60 bg-card/30 backdrop-blur-xl flex flex-col overflow-hidden">
            {/* Panel Header */}
            <div className="flex-shrink-0 flex items-center gap-1 px-3 pt-3 pb-2">
              <button
                onClick={() => setSidePanel('chat')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                  sidePanel === 'chat' 
                    ? 'bg-primary/15 text-primary' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5 inline mr-1" />
                Sohbet
              </button>
              <button
                onClick={() => setSidePanel('participants')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                  sidePanel === 'participants' 
                    ? 'bg-primary/15 text-primary' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                }`}
              >
                <Users className="w-3.5 h-3.5 inline mr-1" />
                Kişiler ({participants.length})
              </button>
              <button
                onClick={() => setSidePanel('videochat')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                  sidePanel === 'videochat' 
                    ? 'bg-primary/15 text-primary' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                }`}
              >
                <Video className="w-3.5 h-3.5 inline mr-1" />
                Video
              </button>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {/* CHAT */}
              {sidePanel === 'chat' && (
                <>
                  <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3 scrollbar-thin">
                    {messages.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-32 gap-2 text-center">
                        <MessageCircle className="w-6 h-6 text-muted-foreground/30" />
                        <p className="text-xs text-muted-foreground/50">Henüz mesaj yok. İlk mesajı gönder!</p>
                      </div>
                    )}
                    {messages.map((msg, i) => {
                      const isMe = msg.user_id === user?.id;
                      const prevMsg = messages[i - 1];
                      const sameUser = prevMsg?.user_id === msg.user_id;
                      return (
                        <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} ${sameUser ? 'mt-0.5' : 'mt-3'}`}>
                          {!sameUser && (
                            <span className={`text-[10px] font-medium mb-1 px-1 ${isMe ? 'text-primary/70' : 'text-muted-foreground'}`}>
                              {isMe ? 'Sen' : (msg.profiles?.display_name || 'Anonim')}
                            </span>
                          )}
                          <div className={`px-3 py-2 rounded-2xl max-w-[90%] text-sm leading-relaxed ${
                            isMe 
                              ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                              : 'bg-muted/70 text-foreground rounded-tl-sm border border-border/30'
                          }`}>
                            {msg.content}
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="flex-shrink-0 p-3 border-t border-border/40">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Mesaj yazın..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        maxLength={500}
                        className="flex-1 h-9 text-sm bg-background/60 border-border/60 focus:border-primary/50 rounded-xl"
                      />
                      <Button
                        size="icon"
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className="h-9 w-9 rounded-xl flex-shrink-0 bg-primary hover:bg-primary/90"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    {newMessage.length > 400 && (
                      <p className="text-[10px] text-muted-foreground mt-1 text-right">{newMessage.length}/500</p>
                    )}
                  </div>
                </>
              )}

              {/* PARTICIPANTS */}
              {sidePanel === 'participants' && (
                <div className="flex-1 overflow-y-auto px-3 py-2">
                  <div className="space-y-1">
                    {participants.map((p) => {
                      const isOwnerP = p.user_id === room.owner_id;
                      const isMe = p.user_id === user?.id;
                      const name = p.profiles?.display_name || 'Anonim';
                      return (
                        <div key={p.id} className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-muted/30 transition-colors group">
                          <div className="relative flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 border border-border/40 flex items-center justify-center">
                              <span className="text-xs font-semibold text-primary">
                                {name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-background" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-medium text-foreground truncate">{name}</span>
                              {isMe && <span className="text-[9px] text-muted-foreground">(Sen)</span>}
                            </div>
                            {isOwnerP && (
                              <span className="text-[10px] text-primary/70 font-medium">Oda Sahibi</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* VIDEO CHAT */}
              {sidePanel === 'videochat' && user && (
                <div className="flex-1 overflow-y-auto p-3">
                  <VideoChat
                    roomId={id!}
                    userId={user.id}
                    participantNames={participantNames}
                  />
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

interface PanelTabProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const PanelTab = ({ active, onClick, icon, label }: PanelTabProps) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all ${
      active ? 'bg-background/80 text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
    }`}
    title={label}
  >
    {icon}
    <span className="hidden xl:inline">{label}</span>
  </button>
);

export default Room;
