import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, User, Film, ArrowLeft, Sparkles, Eye, EyeOff, Check, X } from 'lucide-react';
import { lovable } from '@/integrations/lovable/index';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) navigate('/rooms');
  }, [user, navigate]);

  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) return 'Şifre en az 8 karakter olmalıdır.';
    if (!/[A-Z]/.test(pwd)) return 'Şifre en az bir büyük harf içermelidir.';
    if (!/[a-z]/.test(pwd)) return 'Şifre en az bir küçük harf içermelidir.';
    if (!/[0-9]/.test(pwd)) return 'Şifre en az bir rakam içermelidir.';
    return null;
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth('google', {
        redirect_uri: window.location.origin,
      });
      if (result?.error) throw result.error;
    } catch (error: any) {
      toast({ title: 'Hata', description: error.message || 'Google ile giriş başarısız.', variant: 'destructive' });
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast({ title: 'Hoş geldiniz!', description: 'Başarıyla giriş yaptınız.' });
        navigate('/rooms');
      } else {
        const passwordError = validatePassword(password);
        if (passwordError) throw new Error(passwordError);
        if (displayName && displayName.length > 50) {
          throw new Error('Ad Soyad en fazla 50 karakter olabilir.');
        }
        const { error } = await signUp(email, password, displayName);
        if (error) throw error;
        toast({ title: 'Hesap oluşturuldu!', description: 'Başarıyla kayıt oldunuz.' });
        navigate('/rooms');
      }
    } catch (error: any) {
      let message = error.message;
      if (message.includes('User already registered')) {
        message = 'Bu e-posta adresi zaten kayıtlı.';
      } else if (message.includes('Invalid login credentials')) {
        message = 'E-posta veya şifre hatalı.';
      }
      toast({ title: 'Hata', description: message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/15 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Back Button */}
      <Link to="/" className="absolute top-4 left-4 z-10">
        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-card/50">
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </Link>

      <div className="relative w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-2xl shadow-primary/10">
          {/* Logo */}
          <Link to="/" className="flex items-center justify-center gap-3 mb-8 group">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow">
              <Film className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground">Miber</span>
              <span className="text-xs text-muted-foreground -mt-0.5">Film Köşesi</span>
            </div>
          </Link>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {isLogin ? 'Tekrar Hoş Geldin!' : 'Aramıza Katıl'}
            </h1>
            <p className="text-muted-foreground">
              {isLogin ? 'Hesabınıza giriş yapın' : 'Ücretsiz hesap oluşturun'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <Label htmlFor="displayName">Ad Soyad</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="Adınızı girin"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="pl-11 h-12 rounded-xl border-border/50 focus:border-primary/50"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="ornek@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12 rounded-xl border-border/50 focus:border-primary/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 pr-11 h-12 rounded-xl border-border/50 focus:border-primary/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {/* Password Requirements */}
              {!isLogin && password.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-3 animate-in fade-in">
                  <PasswordCheck label="8+ karakter" valid={passwordChecks.length} />
                  <PasswordCheck label="Büyük harf" valid={passwordChecks.uppercase} />
                  <PasswordCheck label="Küçük harf" valid={passwordChecks.lowercase} />
                  <PasswordCheck label="Rakam" valid={passwordChecks.number} />
                </div>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 font-semibold" 
              disabled={loading || (!isLogin && !isPasswordValid)}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Yükleniyor...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
                </div>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin ? (
                <>Hesabınız yok mu? <span className="text-primary font-medium">Kayıt olun</span></>
              ) : (
                <>Zaten hesabınız var mı? <span className="text-primary font-medium">Giriş yapın</span></>
              )}
            </button>
          </div>

          {/* Terms */}
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Devam ederek{' '}
            <Link to="/terms" className="text-primary hover:underline">Kullanım Koşulları</Link>
            {' '}ve{' '}
            <Link to="/privacy" className="text-primary hover:underline">Gizlilik Politikası</Link>
            'nı kabul etmiş olursunuz.
          </p>
        </div>
      </div>
    </div>
  );
};

const PasswordCheck = ({ label, valid }: { label: string; valid: boolean }) => (
  <div className={`flex items-center gap-1.5 text-xs ${valid ? 'text-green-500' : 'text-muted-foreground'}`}>
    {valid ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
    {label}
  </div>
);

export default Auth;
