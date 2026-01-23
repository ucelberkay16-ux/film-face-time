import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Plus, Users, Play, LogOut, Copy, Trash2, Lock, Unlock, Eye, EyeOff, Film, Sparkles, ArrowLeft } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface Room {
  id: string;
  name: string;
  owner_id: string;
  video_url: string | null;
  created_at: string;
  is_private: boolean;
  password: string | null;
  max_participants: number;
  profiles?: { display_name: string | null };
}

const Rooms = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRoomName, setNewRoomName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [roomPassword, setRoomPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [enteredPassword, setEnteredPassword] = useState('');

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
    const trimmedName = newRoomName.trim();
    if (!trimmedName || !user) return;

    if (trimmedName.length > 100) {
      toast({ title: 'Hata', description: 'Oda adı en fazla 100 karakter olabilir.', variant: 'destructive' });
      return;
    }

    if (!/^[\w\s\-_.!?'"\u00C0-\u024F\u0400-\u04FF\u0600-\u06FF\u011E\u011F\u0130\u0131\u015E\u015F\u00DC\u00FC\u00D6\u00F6\u00C7\u00E7]+$/u.test(trimmedName)) {
      toast({ title: 'Hata', description: 'Oda adı geçersiz karakterler içeriyor.', variant: 'destructive' });
      return;
    }

    if (isPrivate && roomPassword.length < 4) {
      toast({ title: 'Hata', description: 'Şifre en az 4 karakter olmalıdır.', variant: 'destructive' });
      return;
    }

    const { data, error } = await supabase
      .from('rooms')
      .insert({ 
        name: trimmedName, 
        owner_id: user.id,
        is_private: isPrivate,
        password: isPrivate ? roomPassword : null
      })
      .select()
      .single();

    if (error) {
      toast({ title: 'Hata', description: 'Oda oluşturulamadı.', variant: 'destructive' });
    } else if (data) {
      await supabase.from('room_participants').insert({ room_id: data.id, user_id: user.id });
      toast({ title: 'Başarılı', description: 'Oda oluşturuldu!' });
      setNewRoomName('');
      setIsPrivate(false);
      setRoomPassword('');
      setDialogOpen(false);
      navigate(`/room/${data.id}`);
    }
  };

  const handleJoinRoom = async (room: Room) => {
    if (!user) return;
    
    // If room has password and user is not owner
    if (room.password && room.owner_id !== user.id) {
      setSelectedRoom(room);
      setJoinDialogOpen(true);
      return;
    }
    
    await joinRoom(room.id);
  };

  const joinRoom = async (roomId: string) => {
    if (!user) return;
    await supabase.from('room_participants').upsert({ room_id: roomId, user_id: user.id });
    navigate(`/room/${roomId}`);
  };

  const confirmJoinWithPassword = async () => {
    if (!selectedRoom) return;
    
    if (enteredPassword !== selectedRoom.password) {
      toast({ title: 'Hata', description: 'Yanlış şifre.', variant: 'destructive' });
      return;
    }
    
    await joinRoom(selectedRoom.id);
    setJoinDialogOpen(false);
    setEnteredPassword('');
    setSelectedRoom(null);
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
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin w-10 h-10 border-3 border-primary border-t-transparent rounded-full" />
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-xl sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon" className="rounded-xl">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-primary/30 transition-shadow">
                <Film className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground hidden sm:block">Miber Film Köşesi</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={signOut} className="rounded-xl hover:bg-destructive/10 hover:text-destructive">
              <LogOut className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Çıkış</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-1">Odalar</h1>
            <p className="text-muted-foreground">Bir odaya katılın veya yeni oda oluşturun</p>
          </div>
          
          {/* Create Room Dialog */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/20 rounded-xl">
                <Plus className="w-4 h-4" />
                Oda Oluştur
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Yeni Oda Oluştur
                </DialogTitle>
                <DialogDescription>
                  Arkadaşlarınızla birlikte izlemek için bir oda oluşturun.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-5 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="roomName">Oda Adı</Label>
                  <Input
                    id="roomName"
                    placeholder="Örn: Film Gecesi, Marvel Maratonu"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !isPrivate && createRoom()}
                    className="rounded-xl"
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Şifreli Oda</p>
                      <p className="text-xs text-muted-foreground">Sadece şifreyi bilenler katılabilir</p>
                    </div>
                  </div>
                  <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
                </div>
                
                {isPrivate && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <Label htmlFor="roomPassword">Oda Şifresi</Label>
                    <div className="relative">
                      <Input
                        id="roomPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="En az 4 karakter"
                        value={roomPassword}
                        onChange={(e) => setRoomPassword(e.target.value)}
                        className="rounded-xl pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}
                
                <Button 
                  onClick={createRoom} 
                  className="w-full rounded-xl h-11 bg-gradient-to-r from-primary to-primary/80" 
                  disabled={!newRoomName.trim() || (isPrivate && roomPassword.length < 4)}
                >
                  Oda Oluştur
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Rooms Grid */}
        {rooms.length === 0 ? (
          <div className="text-center py-20 bg-card/30 rounded-3xl border border-border/50 backdrop-blur-sm">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Users className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Henüz oda yok</h2>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              İlk odayı oluşturun ve arkadaşlarınızı davet edin
            </p>
            <Button onClick={() => setDialogOpen(true)} className="gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/80">
              <Plus className="w-4 h-4" />
              İlk Odanı Oluştur
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <div 
                key={room.id} 
                className="group bg-card/50 border border-border/50 rounded-2xl p-5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground text-lg truncate">{room.name}</h3>
                      {room.password && (
                        <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0" title="Şifreli oda">
                          <Lock className="w-3 h-3 text-primary" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {room.profiles?.display_name || 'Anonim'}
                    </p>
                  </div>
                  {user?.id === room.owner_id && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteRoom(room.id, room.owner_id)}
                      className="rounded-xl hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary" 
                    onClick={() => handleJoinRoom(room)}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Katıl
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => copyLink(room.id)} className="rounded-xl">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Password Dialog */}
      <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Şifreli Oda
            </DialogTitle>
            <DialogDescription>
              Bu oda şifre korumalı. Katılmak için şifreyi girin.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="enterPassword">Oda Şifresi</Label>
              <Input
                id="enterPassword"
                type="password"
                placeholder="Şifreyi girin"
                value={enteredPassword}
                onChange={(e) => setEnteredPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && confirmJoinWithPassword()}
                className="rounded-xl"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setJoinDialogOpen(false)} className="flex-1 rounded-xl">
                İptal
              </Button>
              <Button onClick={confirmJoinWithPassword} className="flex-1 rounded-xl bg-gradient-to-r from-primary to-primary/80">
                Katıl
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Rooms;
