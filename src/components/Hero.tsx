import { Button } from "@/components/ui/button";
import { Play, Users, Video } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      
      {/* Animated Glow Effects */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse delay-1000" />
      
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border">
          <Video className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">Yeni Nesil İzleme Deneyimi</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent leading-tight">
          Birlikte İzle,
          <br />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Birlikte Yaşa
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
          Sevdiğin filmleri ve dizileri arkadaşlarınla birlikte izle, 
          aynı anda görüntülü sohbet et. Mesafe artık önemli değil.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/auth">
            <Button 
              size="lg" 
              className="group bg-primary hover:shadow-glow transition-all duration-300 text-lg px-8 py-6 h-auto"
            >
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Hemen Başla
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 h-auto border-border hover:bg-card/50 backdrop-blur-sm"
            >
              <Users className="w-5 h-5 mr-2" />
              Nasıl Çalışır?
            </Button>
          </a>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">10K+</div>
            <div className="text-sm text-muted-foreground">Aktif Kullanıcı</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-accent mb-2">5K+</div>
            <div className="text-sm text-muted-foreground">Film & Dizi</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">50K+</div>
            <div className="text-sm text-muted-foreground">İzleme Oturumu</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
