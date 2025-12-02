import { Video, RefreshCw, DoorOpen, Smartphone, Shield, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const FEATURES = [
  {
    icon: Video,
    title: "Görüntülü Sohbet",
    description: "Arkadaşlarınla yüz yüze konuşarak film izle.",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    icon: RefreshCw,
    title: "Senkronize İzleme",
    description: "Aynı anda başlat, duraklat, birlikte ilerle.",
    gradient: "from-accent/20 to-accent/5",
  },
  {
    icon: DoorOpen,
    title: "Kolay Oda Oluşturma",
    description: "Tek tıkla oda oluştur, link paylaş.",
    gradient: "from-primary/20 to-accent/10",
  },
  {
    icon: Smartphone,
    title: "Mobil & Web Desteği",
    description: "Her cihazdan sorunsuz erişim sağla.",
    gradient: "from-accent/20 to-primary/10",
  },
  {
    icon: Shield,
    title: "Güvenli Bağlantı",
    description: "Uçtan uca şifreli, güvenli görüşmeler.",
    gradient: "from-primary/15 to-primary/5",
  },
  {
    icon: MessageCircle,
    title: "Anlık Chat & Emoji",
    description: "Yazılı sohbet ve emoji tepkileri.",
    gradient: "from-accent/15 to-accent/5",
  },
];

const FeaturesGrid = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Özellikler
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              Tüm İhtiyacın Tek Yerde
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Birlikte izleme deneyimini mükemmelleştiren özellikler.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {FEATURES.map((feature, index) => (
            <Card
              key={index}
              className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 group overflow-hidden"
            >
              <CardContent className="p-6">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-foreground" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
