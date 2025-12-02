import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const PLANS = [
  {
    name: "Ücretsiz",
    price: "₺0",
    period: "/ay",
    description: "Başlamak için ideal",
    features: [
      "2 kişilik odalar",
      "720p video kalitesi",
      "Temel senkronizasyon",
      "Metin sohbet",
      "Günde 2 saat kullanım",
    ],
    cta: "Ücretsiz Başla",
    highlighted: false,
  },
  {
    name: "Standart",
    price: "₺49",
    period: "/ay",
    description: "Arkadaş grupları için",
    features: [
      "6 kişilik odalar",
      "1080p video kalitesi",
      "Gelişmiş senkronizasyon",
      "Sesli & görüntülü sohbet",
      "Sınırsız kullanım",
      "Emoji tepkileri",
    ],
    cta: "Standart'ı Seç",
    highlighted: false,
  },
  {
    name: "Premium",
    price: "₺99",
    period: "/ay",
    description: "En iyi deneyim",
    features: [
      "12 kişilik odalar",
      "4K video kalitesi",
      "Ultra senkronizasyon",
      "Sesli & görüntülü sohbet",
      "Sınırsız kullanım",
      "Özel oda temaları",
      "Öncelikli destek",
      "Reklamsız deneyim",
    ],
    cta: "Premium'a Geç",
    highlighted: true,
  },
];

const Pricing = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Fiyatlandırma
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              Sana Uygun Planı Seç
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Her bütçeye uygun seçenekler. İstediğin zaman iptal et.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
          {PLANS.map((plan, index) => (
            <Card
              key={index}
              className={`relative overflow-hidden transition-all duration-300 ${
                plan.highlighted
                  ? 'bg-gradient-to-b from-primary/10 to-card border-primary shadow-glow scale-105'
                  : 'bg-card/50 backdrop-blur-sm border-border hover:border-primary/50'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
              )}
              
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    <Sparkles className="w-3 h-3" />
                    En Popüler
                  </span>
                </div>
              )}

              <CardHeader className="text-center pt-8 pb-4">
                <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="pb-8">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        plan.highlighted ? 'bg-primary/20' : 'bg-accent/20'
                      }`}>
                        <Check className={`w-3 h-3 ${plan.highlighted ? 'text-primary' : 'text-accent'}`} />
                      </div>
                      <span className="text-sm text-foreground/90">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    plan.highlighted
                      ? 'bg-primary hover:bg-primary/90 shadow-glow'
                      : 'bg-card border border-border hover:border-primary hover:bg-card/80'
                  }`}
                  variant={plan.highlighted ? 'default' : 'outline'}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
