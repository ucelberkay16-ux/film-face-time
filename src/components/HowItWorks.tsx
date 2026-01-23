import { Users, Video, Play, Link, ArrowRight } from "lucide-react";

const STEPS = [
  {
    step: 1,
    icon: Users,
    title: "Odanı Oluştur",
    description: "Birkaç tıkla kendi izleme odanı oluştur ve arkadaşlarını davet et.",
    color: "primary",
  },
  {
    step: 2,
    icon: Link,
    title: "Link Paylaş",
    description: "Oluşturduğun odanın linkini arkadaşlarınla paylaş.",
    color: "accent",
  },
  {
    step: 3,
    icon: Video,
    title: "Görüntülü Bağlan",
    description: "WebRTC ile anlık görüntülü sohbete bağlan, yüz yüze sohbet et.",
    color: "primary",
  },
  {
    step: 4,
    icon: Play,
    title: "Senkronize İzle",
    description: "Film veya diziyi aynı anda başlat, duraklat ve birlikte yaşa.",
    color: "accent",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[150px]" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[150px]" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
            <Play className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Nasıl Çalışır?</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            4 Kolay Adımda{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Birlikte İzle
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Arkadaşlarınla birlikte izlemeye başlamak hiç bu kadar kolay olmamıştı.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            {STEPS.map((step, index) => (
              <div
                key={step.step}
                className="relative group"
              >
                {/* Connector arrow - hidden on mobile and last item */}
                {index < STEPS.length - 1 && (
                  <div className="hidden md:flex absolute top-12 -right-3 z-10 text-border">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
                
                <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 text-center transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 h-full">
                  {/* Step number badge */}
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground ${
                    step.color === 'primary' 
                      ? 'bg-gradient-to-br from-primary to-primary/80' 
                      : 'bg-gradient-to-br from-accent to-accent/80'
                  } shadow-lg`}>
                    {step.step}
                  </div>
                  
                  {/* Icon */}
                  <div className={`w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
                    step.color === 'primary'
                      ? 'bg-gradient-to-br from-primary/20 to-primary/5'
                      : 'bg-gradient-to-br from-accent/20 to-accent/5'
                  }`}>
                    <step.icon className={`w-8 h-8 ${step.color === 'primary' ? 'text-primary' : 'text-accent'}`} />
                  </div>
                  
                  <h3 className="text-lg font-bold mb-2 text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
