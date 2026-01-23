import { Button } from "@/components/ui/button";
import { Play, Users, Video, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        
        {/* Animated orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[200px]" />
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>
      
      <div className="relative z-10 container mx-auto px-6 text-center py-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-sm border border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Yeni Nesil Sosyal İzleme Platformu
          </span>
        </div>
        
        {/* Main Heading */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '0.1s' }}>
          <span className="bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
            Birlikte İzle,
          </span>
          <br />
          <span className="relative">
            <span className="bg-gradient-to-r from-primary via-pink-500 to-accent bg-clip-text text-transparent">
              Birlikte Yaşa
            </span>
            {/* Underline decoration */}
            <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary/30" viewBox="0 0 200 12" preserveAspectRatio="none">
              <path d="M0,8 Q50,0 100,8 T200,8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: '0.2s' }}>
          Sevdiğin filmleri ve dizileri arkadaşlarınla{' '}
          <span className="text-foreground font-medium">gerçek zamanlı senkronize</span>{' '}
          izle, aynı anda{' '}
          <span className="text-foreground font-medium">görüntülü sohbet</span>{' '}
          et. Mesafe artık önemli değil.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-in fade-in slide-in-from-bottom-10 duration-700" style={{ animationDelay: '0.3s' }}>
          <Link to="/auth">
            <Button 
              size="lg" 
              className="group relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-lg px-8 py-7 h-auto rounded-2xl shadow-xl shadow-primary/25 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/30 hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Ücretsiz Başla
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              {/* Shine effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-7 h-auto rounded-2xl border-border/50 hover:bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300"
            >
              <Users className="w-5 h-5 mr-2" />
              Nasıl Çalışır?
            </Button>
          </a>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-700" style={{ animationDelay: '0.4s' }}>
          <StatCard value="10K+" label="Aktif Kullanıcı" color="primary" />
          <StatCard value="5K+" label="Film & Dizi" color="accent" />
          <StatCard value="50K+" label="İzleme Oturumu" color="primary" />
        </div>

        {/* Floating elements - decorative */}
        <div className="absolute bottom-10 left-10 hidden lg:block animate-float">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center backdrop-blur-sm">
            <Video className="w-8 h-8 text-primary" />
          </div>
        </div>
        <div className="absolute bottom-20 right-16 hidden lg:block animate-float" style={{ animationDelay: '1s' }}>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 flex items-center justify-center backdrop-blur-sm">
            <Users className="w-6 h-6 text-accent" />
          </div>
        </div>
      </div>
    </section>
  );
};

const StatCard = ({ value, label, color }: { value: string; label: string; color: 'primary' | 'accent' }) => (
  <div className="group relative p-4 sm:p-6 rounded-2xl bg-gradient-to-b from-card/80 to-card/40 border border-border/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
    <div className={`text-3xl sm:text-4xl font-bold mb-1 bg-gradient-to-r ${
      color === 'primary' ? 'from-primary to-pink-500' : 'from-accent to-cyan-400'
    } bg-clip-text text-transparent`}>
      {value}
    </div>
    <div className="text-xs sm:text-sm text-muted-foreground">{label}</div>
  </div>
);

export default Hero;
