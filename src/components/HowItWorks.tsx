import { Users, Video, Play } from "lucide-react";

const STEPS = [
  {
    step: 1,
    icon: Users,
    title: "Odanı Oluştur",
    description: "Birkaç tıkla kendi izleme odanı oluştur ve arkadaşlarını davet et.",
  },
  {
    step: 2,
    icon: Video,
    title: "Görüntülü Bağlan",
    description: "WebRTC ile anlık görüntülü sohbete bağlan, yüz yüze sohbet et.",
  },
  {
    step: 3,
    icon: Play,
    title: "Senkronize İzle",
    description: "Film veya diziyi aynı anda başlat, duraklat ve birlikte yaşa.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Nasıl Çalışır?
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              3 Basit Adımda Başla
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Arkadaşlarınla birlikte izlemeye başlamak hiç bu kadar kolay olmamıştı.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {STEPS.map((step, index) => (
            <div
              key={step.step}
              className="relative group"
            >
              {/* Connector line */}
              {index < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary/50 to-accent/50" />
              )}
              
              <div className="relative bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 text-center transition-all duration-300 hover:border-primary/50 hover:shadow-glow">
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-sm font-bold text-primary-foreground">
                  {step.step}
                </div>
                
                {/* Icon */}
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="w-10 h-10 text-primary" />
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-foreground">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
