import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const DemoVideo = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      
      {/* Glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Demo
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              Nasıl Göründüğünü Gör
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Birlikte izleme deneyiminin tadını çıkar.
          </p>
        </div>

        {/* Video placeholder */}
        <div className="max-w-5xl mx-auto">
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-border bg-card/80 backdrop-blur-sm group cursor-pointer">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
            
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full" style={{
                backgroundImage: 'linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }} />
            </div>
            
            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                size="lg"
                className="w-20 h-20 rounded-full bg-primary/90 hover:bg-primary hover:scale-110 transition-all duration-300 shadow-glow"
              >
                <Play className="w-8 h-8 ml-1" />
              </Button>
            </div>
            
            {/* Corner decorations */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            
            {/* Demo label */}
            <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-card/80 backdrop-blur-sm border border-border">
              <span className="text-xs text-muted-foreground">Demo Video</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoVideo;
