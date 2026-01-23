import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">Gizlilik Politikası</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">Gizlilik Politikası</h1>
        
        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <p className="text-muted-foreground leading-relaxed">
              Son güncelleme: {new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Miber Film Köşesi ("biz", "bizim" veya "Şirket") olarak gizliliğinize saygı duyuyor ve kişisel verilerinizin korunmasını önemsiyoruz. Bu Gizlilik Politikası, hizmetlerimizi kullanırken hangi bilgileri topladığımızı, nasıl kullandığımızı ve koruduğumuzu açıklamaktadır.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Topladığımız Bilgiler</h2>
            <div className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">1.1 Hesap Bilgileri</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>E-posta adresi</li>
                  <li>Kullanıcı adı / görünen ad</li>
                  <li>Profil fotoğrafı (isteğe bağlı)</li>
                  <li>Şifrelenmiş parola</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">1.2 Kullanım Verileri</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Oluşturulan ve katılınan odalar</li>
                  <li>Oda içi mesajlar</li>
                  <li>Video izleme geçmişi</li>
                  <li>Oturum süreleri ve aktivite günlükleri</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">1.3 Teknik Veriler</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>IP adresi</li>
                  <li>Tarayıcı türü ve sürümü</li>
                  <li>Cihaz bilgileri</li>
                  <li>Çerezler ve benzer teknolojiler</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Bilgilerin Kullanımı</h2>
            <p className="text-muted-foreground mb-4">Topladığımız bilgileri aşağıdaki amaçlarla kullanıyoruz:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Hizmetlerimizi sağlamak ve iyileştirmek</li>
              <li>Hesabınızı yönetmek ve güvenliğini sağlamak</li>
              <li>Gerçek zamanlı senkronizasyon ve iletişim özelliklerini sunmak</li>
              <li>Teknik sorunları tespit etmek ve çözmek</li>
              <li>Yasal yükümlülüklerimizi yerine getirmek</li>
              <li>Kötüye kullanımı önlemek</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Bilgi Paylaşımı</h2>
            <p className="text-muted-foreground mb-4">
              Kişisel verilerinizi aşağıdaki durumlar dışında üçüncü taraflarla paylaşmıyoruz:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Açık onayınız olduğunda</li>
              <li>Yasal zorunluluk durumlarında</li>
              <li>Hizmet sağlayıcılarımızla (örn. altyapı, ödeme işlemleri)</li>
              <li>Şirket birleşmesi veya satışı durumunda</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Veri Güvenliği</h2>
            <p className="text-muted-foreground">
              Verilerinizi korumak için endüstri standardı güvenlik önlemleri uyguluyoruz:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
              <li>SSL/TLS şifreleme</li>
              <li>Güvenli sunucu altyapısı</li>
              <li>Düzenli güvenlik denetimleri</li>
              <li>Erişim kontrolü ve yetkilendirme</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. KVKK Kapsamındaki Haklarınız</h2>
            <p className="text-muted-foreground mb-4">
              6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aşağıdaki haklara sahipsiniz:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</li>
              <li>Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
              <li>Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme</li>
              <li>Kişisel verilerinizin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme</li>
              <li>Kişisel verilerinizin silinmesini veya yok edilmesini isteme</li>
              <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
              <li>Kişisel verilerinizin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Çerezler</h2>
            <p className="text-muted-foreground">
              Web sitemizde çerezler kullanıyoruz. Çerezler, tarayıcınız tarafından cihazınızda saklanan küçük metin dosyalarıdır. Çerez kullanımı hakkında daha fazla bilgi için Çerez Politikamızı inceleyebilirsiniz.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Veri Saklama</h2>
            <p className="text-muted-foreground">
              Kişisel verilerinizi, hizmetlerimizi sunmak için gerekli olduğu sürece veya yasal yükümlülüklerimizi yerine getirmek için gereken süre boyunca saklarız. Hesabınızı sildiğinizde, verileriniz makul bir süre içinde sistemlerimizden kaldırılır.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. İletişim</h2>
            <p className="text-muted-foreground">
              Gizlilik politikamız hakkında sorularınız veya KVKK kapsamındaki haklarınızı kullanmak için bizimle iletişime geçebilirsiniz:
            </p>
            <div className="mt-4 p-4 bg-card rounded-lg border border-border">
              <p className="text-foreground font-medium">Miber Film Köşesi</p>
              <p className="text-muted-foreground">E-posta: privacy@miberfilm.com</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Değişiklikler</h2>
            <p className="text-muted-foreground">
              Bu Gizlilik Politikası'nı zaman zaman güncelleyebiliriz. Önemli değişiklikler olduğunda sizi bilgilendireceğiz. Bu sayfayı düzenli olarak kontrol etmenizi öneririz.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Ana Sayfaya Dön
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
