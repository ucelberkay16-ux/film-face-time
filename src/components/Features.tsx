import { Video, Users, Sparkles, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";

const FEATURES = [
  {
    icon: Video,
    title: "Senkronize İzleme",
    description: "Arkadaşlarınla tam senkronize şekilde film izle, her an aynı sahnedesiniz.",
    gradient: "from-primary to-primary/50"
  },
  {
    icon: Users,
    title: "Görüntülü Sohbet",
    description: "HD kalitesinde görüntülü sohbet ile filmi izlerken arkadaşlarınızı görün.",
    gradient: "from-accent to-accent/50"
  },
  {
    icon: Sparkles,
    title: "Akıllı Öneriler",
    description: "Yapay zeka destekli öneriler ile en sevdiğin içerikleri keşfet.",
    gradient: "from-primary to-accent"
  },
  {
    icon: Shield,
    title: "Güvenli ve Özel",
    description: "Şifreli odalar, sadece davet ettiğin kişiler katılabilir.",
    gradient: "from-accent to-primary"
  }
];

const Features = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-muted-foreground">Özellikler</span>
          </div>
          
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            Neden WatchTogether?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Film izleme deneyiminizi bir üst seviyeye taşıyan benzersiz özellikler
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, index) => (
            <Card 
              key={index}
              className="group relative overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow p-6"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                
                {/* Content */}
                <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
