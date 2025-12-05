import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Play, Pause, Users, MessageCircle, Send, ArrowLeft, 
  Link as LinkIcon, Copy, X, Video
} from 'lucide-react';
import VideoChat from '@/components/VideoChat';

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

const Room = () => {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const playerRef = useRef<HTMLIFrameElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [room, setRoom] = useState<RoomData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [showChat, setShowChat] = useState(true);
  const [showVideoChat, setShowVideoChat] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
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
          if (payload.new) setRoom(payload.new as RoomData);
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
      };
    }
  }, [user, id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Sync YouTube playback for all users when owner changes is_playing
  useEffect(() => {
    if (playerRef.current && room?.video_url) {
      const iframe = playerRef.current;
      const command = room.is_playing ? 'playVideo' : 'pauseVideo';
      iframe.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: command }),
        '*'
      );
    }
  }, [room?.is_playing]);

  const fetchRoom = async () => {
    const { data } = await supabase.from('rooms').select('*').eq('id', id).maybeSingle();
    if (data) setRoom(data);
    setLoading(false);
  };

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('room_messages')
      .select('*')
      .eq('room_id', id)
      .order('created_at', { ascending: true });
    
    if (data) {
      const messagesWithProfiles = await Promise.all(
        data.map(async (msg) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('user_id', msg.user_id)
            .maybeSingle();
          return { ...msg, profiles: profile };
        })
      );
      setMessages(messagesWithProfiles);
    }
  };

  const fetchParticipants = async () => {
    const { data } = await supabase
      .from('room_participants')
      .select('*')
      .eq('room_id', id);
    
    if (data) {
      const participantsWithProfiles = await Promise.all(
        data.map(async (p) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('user_id', p.user_id)
            .maybeSingle();
          return { ...p, profiles: profile };
        })
      );
      setParticipants(participantsWithProfiles);
    }
  };

  const joinRoom = async () => {
    if (!user || !id) return;
    await supabase.from('room_participants').upsert({ room_id: id, user_id: user.id });
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !id) return;
    await supabase.from('room_messages').insert({ room_id: id, user_id: user.id, content: newMessage.trim() });
    setNewMessage('');
  };

  const setVideo = async () => {
    if (!videoUrl.trim() || !room || user?.id !== room.owner_id) return;
    await supabase.from('rooms').update({ video_url: videoUrl.trim(), playback_time: 0, is_playing: false }).eq('id', id);
    setVideoUrl('');
    toast({ title: 'Video ayarlandı', description: 'Video URL güncellendi.' });
  };

  const togglePlay = async () => {
    if (!room || user?.id !== room.owner_id) return;
    await supabase.from('rooms').update({ is_playing: !room.is_playing }).eq('id', id);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: 'Kopyalandı', description: 'Oda linki panoya kopyalandı.' });
  };

  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match?.[1] || null;
  };

  const isOwner = user?.id === room?.owner_id;

  const participantNames = useMemo(() => {
    const map = new Map<string, string>();
    participants.forEach(p => {
      map.set(p.user_id, p.profiles?.display_name || 'Anonim');
    });
    return map;
  }, [participants]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Oda bulunamadı</h1>
          <Button onClick={() => navigate('/rooms')}>Odalara Dön</Button>
        </div>
      </div>
    );
  }

  const youtubeId = room.video_url ? getYouTubeId(room.video_url) : null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/rooms')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-bold text-foreground">{room.name}</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Users className="w-3 h-3" /> {participants.length} kişi
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant={showVideoChat ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setShowVideoChat(!showVideoChat)}
            >
              <Video className="w-4 h-4 mr-2" />
              Video
            </Button>
            <Button variant="outline" size="sm" onClick={copyLink}>
              <Copy className="w-4 h-4 mr-2" />
              Link
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setShowChat(!showChat)} className="lg:hidden">
              <MessageCircle className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="flex-1 flex flex-col p-4">
          {isOwner && (
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="YouTube URL yapıştırın..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={setVideo} disabled={!videoUrl.trim()}>
                <LinkIcon className="w-4 h-4 mr-2" />
                Ayarla
              </Button>
            </div>
          )}

          <div className="flex-1 bg-card rounded-xl border border-border overflow-hidden relative">
            {youtubeId ? (
              <div className="aspect-video w-full">
                <iframe
                  ref={playerRef}
                  src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&autoplay=${room.is_playing ? 1 : 0}&origin=${window.location.origin}`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="aspect-video w-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>{isOwner ? 'YouTube URL ekleyin' : 'Oda sahibi video ekleyecek'}</p>
                </div>
              </div>
            )}
          </div>

          {isOwner && youtubeId && (
            <div className="flex justify-center gap-4 mt-4">
              <Button onClick={togglePlay} size="lg">
                {room.is_playing ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                {room.is_playing ? 'Durdur' : 'Oynat'}
              </Button>
            </div>
          )}

        </div>

        <div className={`w-full lg:w-80 border-l border-border bg-card/50 flex flex-col ${showChat ? 'flex' : 'hidden lg:flex'} h-[500px] lg:h-auto`}>
          <div className="p-3 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground flex items-center gap-2 text-sm">
              <MessageCircle className="w-4 h-4" />
              Sohbet
            </h2>
            <Button variant="ghost" size="icon" onClick={() => setShowChat(false)} className="lg:hidden h-7 w-7">
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Video Chat Area */}
          {showVideoChat && user && (
            <div className="border-b border-border">
              <VideoChat 
                roomId={id!} 
                userId={user.id} 
                participantNames={participantNames}
              />
            </div>
          )}

          {/* Messages - now at bottom */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg) => (
              <div key={msg.id} className={`${msg.user_id === user?.id ? 'text-right' : ''}`}>
                <p className="text-[10px] text-muted-foreground mb-0.5">
                  {msg.profiles?.display_name || 'Anonim'}
                </p>
                <div className={`inline-block px-2.5 py-1.5 rounded-lg max-w-[85%] text-sm ${
                  msg.user_id === user?.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-border">
            <div className="flex gap-2">
              <Input
                placeholder="Mesaj yazın..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                className="h-9 text-sm"
              />
              <Button size="icon" onClick={sendMessage} disabled={!newMessage.trim()} className="h-9 w-9">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;
