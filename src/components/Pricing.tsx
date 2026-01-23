import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Sparkles, Crown, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const PLANS = [
  {
    name: "Ücretsiz",
    icon: Zap,
    price: "₺0",
    period: "/ay",
    description: "Başlamak için ideal",
    features: [
      "5 kişiye kadar izleme odası",
      "Temel senkronizasyon",
      "Metin sohbeti",
      "YouTube video desteği",
      "Sınırsız oda oluşturma",
    ],
    cta: "Ücretsiz Başla",
    highlighted: false,
    gradient: "from-muted/50 to-muted/30",
  },
  {
    name: "Premium",
    icon: Crown,
    price: "₺49",
    period: "/ay",
    description: "En popüler seçenek",
    features: [
      "20 kişiye kadar izleme odası",
      "HD görüntülü sohbet",
      "Öncelikli senkronizasyon",
      "Şifreli özel odalar",
      "Moderasyon araçları",
      "Özel oda temaları",
      "Reklamsız deneyim",
    ],
    cta: "Premium'a Geç",
    highlighted: true,
    gradient: "from-primary/20 to-accent/20",
  },
  {
    name: "İş",
    icon: Sparkles,
    price: "₺149",
    period: "/ay",
    description: "Takımlar ve etkinlikler için",
    features: [
      "Sınırsız katılımcı",
      "4K görüntülü sohbet",
      "API erişimi",
      "Özel branding",
      "Analitik dashboard",
      "7/24 öncelikli destek",
      "SLA garantisi",
      "Özel entegrasyonlar",
    ],
    cta: "İletişime Geç",
    highlighted: false,
    gradient: "from-accent/20 to-cyan-500/20",
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[200px]" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Crown className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Fiyatlandırma</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Senin İçin{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Doğru Plan
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            İhtiyaçlarına uygun planı seç, hemen izlemeye başla. 
            Her plan 14 günlük ücretsiz deneme içerir.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {PLANS.map((plan, index) => (
            <Card
              key={plan.name}
              className={`relative p-6 lg:p-8 border transition-all duration-500 hover:scale-[1.02] ${
                plan.highlighted
                  ? 'border-primary/50 bg-gradient-to-b from-primary/10 to-transparent shadow-2xl shadow-primary/20'
                  : 'border-border/50 bg-card/50 hover:border-primary/30'
              }`}
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {/* Popular badge */}
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="px-4 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-semibold shadow-lg shadow-primary/30">
                    En Popüler
                  </div>
                </div>
              )}

              {/* Plan header */}
              <div className="mb-6">
                <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-br ${plan.gradient}`}>
                  <plan.icon className={`w-6 h-6 ${plan.highlighted ? 'text-primary' : 'text-foreground'}`} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-bold ${
                    plan.highlighted 
                      ? 'bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent' 
                      : 'text-foreground'
                  }`}>
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 ${
                      plan.highlighted 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link to="/auth">
                <Button
                  className={`w-full h-12 rounded-xl font-semibold transition-all ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 hover:shadow-primary/40'
                      : 'bg-card hover:bg-muted border border-border'
                  }`}
                  variant={plan.highlighted ? 'default' : 'outline'}
                >
                  {plan.cta}
                </Button>
              </Link>
            </Card>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-sm text-muted-foreground mt-12">
          Tüm planlar 14 günlük ücretsiz deneme içerir. Kredi kartı gerekmez.
        </p>
      </div>
    </section>
  );
};

export default Pricing;
