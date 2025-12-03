import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Plus, Users, Play, LogOut, Copy, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface Room {
  id: string;
  name: string;
  owner_id: string;
  video_url: string | null;
  created_at: string;
  profiles?: { display_name: string | null };
}

const Rooms = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRoomName, setNewRoomName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchRooms();
      const channel = supabase
        .channel('rooms-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms' }, () => {
          fetchRooms();
        })
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [user]);

  const fetchRooms = async () => {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      const roomsWithProfiles = await Promise.all(
        data.map(async (room) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('user_id', room.owner_id)
            .maybeSingle();
          return { ...room, profiles: profile };
        })
      );
      setRooms(roomsWithProfiles);
    }
    setLoading(false);
  };

  const createRoom = async () => {
    if (!newRoomName.trim() || !user) return;

    const { data, error } = await supabase
      .from('rooms')
      .insert({ name: newRoomName.trim(), owner_id: user.id })
      .select()
      .single();

    if (error) {
      toast({ title: 'Hata', description: 'Oda oluşturulamadı.', variant: 'destructive' });
    } else if (data) {
      await supabase.from('room_participants').insert({ room_id: data.id, user_id: user.id });
      toast({ title: 'Başarılı', description: 'Oda oluşturuldu!' });
      setNewRoomName('');
      setDialogOpen(false);
      navigate(`/room/${data.id}`);
    }
  };

  const joinRoom = async (roomId: string) => {
    if (!user) return;
    await supabase.from('room_participants').upsert({ room_id: roomId, user_id: user.id });
    navigate(`/room/${roomId}`);
  };

  const deleteRoom = async (roomId: string, ownerId: string) => {
    if (user?.id !== ownerId) return;
    await supabase.from('rooms').delete().eq('id', roomId);
    toast({ title: 'Silindi', description: 'Oda silindi.' });
  };

  const copyLink = (roomId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/room/${roomId}`);
    toast({ title: 'Kopyalandı', description: 'Oda linki panoya kopyalandı.' });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Play className="w-4 h-4 text-primary-foreground" fill="currentColor" />
            </div>
            <span className="font-bold text-foreground">Miber Film Köşesi</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Odalar</h1>
            <p className="text-muted-foreground">Bir odaya katılın veya yeni oda oluşturun</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Oda Oluştur
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Yeni Oda Oluştur</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="roomName">Oda Adı</Label>
                  <Input
                    id="roomName"
                    placeholder="Film Gecesi"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && createRoom()}
                  />
                </div>
                <Button onClick={createRoom} className="w-full" disabled={!newRoomName.trim()}>
                  Oluştur
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {rooms.length === 0 ? (
          <div className="text-center py-16 bg-card/50 rounded-2xl border border-border">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Henüz oda yok</h2>
            <p className="text-muted-foreground mb-4">İlk odayı oluşturun ve arkadaşlarınızı davet edin</p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Oda Oluştur
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <div key={room.id} className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">{room.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {room.profiles?.display_name || 'Anonim'}
                    </p>
                  </div>
                  {user?.id === room.owner_id && (
                    <Button variant="ghost" size="icon" onClick={() => deleteRoom(room.id, room.owner_id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => joinRoom(room.id)}>
                    <Play className="w-4 h-4 mr-2" />
                    Katıl
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => copyLink(room.id)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Rooms;
