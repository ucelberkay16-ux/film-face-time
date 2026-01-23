import { Video, RefreshCw, DoorOpen, Smartphone, Shield, MessageCircle, Lock, Users, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const FEATURES = [
  {
    icon: Video,
    title: "HD Görüntülü Sohbet",
    description: "WebRTC ile kristal netliğinde görüntülü görüşme. Arkadaşlarınla yüz yüze konuşarak film izle.",
    gradient: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
  },
  {
    icon: RefreshCw,
    title: "Gerçek Zamanlı Senkronizasyon",
    description: "Milisaniye hassasiyetinde senkronize izleme. Aynı anda başlat, duraklat, ileri sar.",
    gradient: "from-accent/20 to-accent/5",
    iconColor: "text-accent",
  },
  {
    icon: DoorOpen,
    title: "Kolay Oda Oluşturma",
    description: "Tek tıkla oda oluştur, link paylaş. Arkadaşların saniyeler içinde katılsın.",
    gradient: "from-primary/20 to-accent/10",
    iconColor: "text-primary",
  },
  {
    icon: Lock,
    title: "Şifreli Özel Odalar",
    description: "Odanı şifreyle koru. Sadece davet ettiklerin katılabilsin.",
    gradient: "from-pink-500/20 to-primary/10",
    iconColor: "text-pink-500",
  },
  {
    icon: Users,
    title: "Moderasyon Araçları",
    description: "Oda sahibi olarak katılımcıları yönet, sessize al veya çıkar.",
    gradient: "from-accent/20 to-cyan-500/10",
    iconColor: "text-accent",
  },
  {
    icon: Smartphone,
    title: "Mobil Uyumlu",
    description: "Telefon, tablet veya bilgisayar - her cihazdan sorunsuz erişim.",
    gradient: "from-cyan-500/20 to-accent/10",
    iconColor: "text-cyan-500",
  },
  {
    icon: Shield,
    title: "Güvenli Bağlantı",
    description: "Uçtan uca şifreli iletişim. Gizliliğin bizim için öncelik.",
    gradient: "from-green-500/20 to-green-500/5",
    iconColor: "text-green-500",
  },
  {
    icon: MessageCircle,
    title: "Anlık Sohbet",
    description: "Yazılı mesajlaşma ile anı paylaş. Video izlerken yorum yap.",
    gradient: "from-primary/15 to-primary/5",
    iconColor: "text-primary",
  },
  {
    icon: Zap,
    title: "Ultra Hızlı",
    description: "Optimize edilmiş altyapı ile düşük gecikme, yüksek performans.",
    gradient: "from-yellow-500/20 to-yellow-500/5",
    iconColor: "text-yellow-500",
  },
];

const FeaturesGrid = () => {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-card/20 via-background to-background" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Özellikler</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Tüm İhtiyacın{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Tek Yerde
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Birlikte izleme deneyimini mükemmelleştiren güçlü özellikler.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {FEATURES.map((feature, index) => (
            <Card
              key={index}
              className="group bg-card/30 backdrop-blur-sm border-border/50 hover:border-primary/40 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 overflow-hidden"
            >
              <CardContent className="p-6 relative">
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
