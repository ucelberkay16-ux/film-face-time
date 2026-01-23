import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";

const TermsOfService = () => {
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
            <FileText className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">Kullanım Koşulları</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">Kullanım Koşulları</h1>
        
        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <p className="text-muted-foreground leading-relaxed">
              Son güncelleme: {new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Miber Film Köşesi'ni ("Hizmet") kullanarak bu Kullanım Koşulları'nı kabul etmiş olursunuz. Lütfen bu koşulları dikkatlice okuyunuz.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Hizmet Tanımı</h2>
            <p className="text-muted-foreground">
              Miber Film Köşesi, kullanıcıların YouTube videolarını birlikte izleyebildiği, görüntülü görüşme yapabildiği ve sohbet edebildiği gerçek zamanlı bir sosyal platformdur. Hizmetimiz aracılığıyla:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
              <li>Özel veya genel izleme odaları oluşturabilirsiniz</li>
              <li>YouTube videolarını senkronize şekilde izleyebilirsiniz</li>
              <li>WebRTC tabanlı görüntülü görüşme yapabilirsiniz</li>
              <li>Oda içi metin sohbeti kullanabilirsiniz</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Hesap Oluşturma ve Sorumluluklar</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">2.1</strong> Hizmetimizi kullanmak için geçerli bir e-posta adresiyle hesap oluşturmanız gerekmektedir.
              </p>
              <p>
                <strong className="text-foreground">2.2</strong> Hesabınızın güvenliğinden siz sorumlusunuz. Şifrenizi başkalarıyla paylaşmayınız.
              </p>
              <p>
                <strong className="text-foreground">2.3</strong> Hesabınız üzerinden gerçekleştirilen tüm işlemlerden sorumlu tutulursunuz.
              </p>
              <p>
                <strong className="text-foreground">2.4</strong> 13 yaşından küçükseniz hizmetimizi kullanamazsınız.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Kabul Edilebilir Kullanım</h2>
            <p className="text-muted-foreground mb-4">Hizmetimizi kullanırken aşağıdaki kurallara uymanız gerekmektedir:</p>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">3.1 Yapmanız Gerekenler:</h3>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Diğer kullanıcılara saygılı davranın</li>
                  <li>Doğru ve güncel bilgiler sağlayın</li>
                  <li>Oda kurallarına uyun</li>
                  <li>Telif hakkı yasalarına saygı gösterin</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">3.2 Yapmamanız Gerekenler:</h3>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Yasadışı içerik paylaşmak</li>
                  <li>Taciz, nefret söylemi veya tehdit içeren davranışlarda bulunmak</li>
                  <li>Spam veya kötü amaçlı yazılım yaymak</li>
                  <li>Başkalarının kişisel bilgilerini izinsiz paylaşmak</li>
                  <li>Hizmeti manipüle etmeye veya istismar etmeye çalışmak</li>
                  <li>Telif hakkı ihlali yapan içerikler paylaşmak</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. YouTube İçerik Kullanımı</h2>
            <p className="text-muted-foreground mb-4">
              Hizmetimiz, YouTube videolarının izlenmesi için YouTube IFrame API'sini kullanmaktadır.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Platformumuz üzerinden yalnızca YouTube'da halka açık olarak paylaşılan videolar izlenebilir</li>
              <li>Videoların telif haklarına saygı göstermeniz gerekmektedir</li>
              <li>YouTube'un Hizmet Şartları'na uymakla yükümlüsünüz</li>
              <li>Platformumuz video içeriklerini barındırmaz veya dağıtmaz</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Oda Sahipliği ve Moderasyon</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">5.1</strong> Oda oluşturan kullanıcı "oda sahibi" olarak tanımlanır ve oda üzerinde tam yetkiye sahiptir.
              </p>
              <p>
                <strong className="text-foreground">5.2</strong> Oda sahipleri, katılımcıları sessize alabilir veya odadan çıkarabilir.
              </p>
              <p>
                <strong className="text-foreground">5.3</strong> Oda sahipleri, odalarına şifre koyabilir veya özel yapabilir.
              </p>
              <p>
                <strong className="text-foreground">5.4</strong> Moderasyon yetkilerinin kötüye kullanılması hesap askıya alınmasına neden olabilir.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Abonelikler ve Ödemeler</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">6.1</strong> Bazı özellikler ücretli abonelik gerektirebilir.
              </p>
              <p>
                <strong className="text-foreground">6.2</strong> Abonelik ücretleri önceden belirtilen periyotlarda tahsil edilir.
              </p>
              <p>
                <strong className="text-foreground">6.3</strong> İptal işlemleri, mevcut faturalandırma döneminin sonunda yürürlüğe girer.
              </p>
              <p>
                <strong className="text-foreground">6.4</strong> Kullanılmayan süre için iade yapılmaz.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Fikri Mülkiyet</h2>
            <p className="text-muted-foreground">
              Miber Film Köşesi platformu, tasarımı, logoları ve orijinal içeriği Şirket'in fikri mülkiyetidir. İzinsiz kullanım, kopyalama veya dağıtım yasaktır.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Sorumluluk Sınırlaması</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">8.1</strong> Hizmetimiz "olduğu gibi" sunulmaktadır. Kesintisiz veya hatasız çalışacağını garanti etmiyoruz.
              </p>
              <p>
                <strong className="text-foreground">8.2</strong> Kullanıcılar arasındaki etkileşimlerden sorumlu değiliz.
              </p>
              <p>
                <strong className="text-foreground">8.3</strong> Üçüncü taraf içeriklerinden (YouTube videoları dahil) sorumlu değiliz.
              </p>
              <p>
                <strong className="text-foreground">8.4</strong> Hizmetin kullanımından doğabilecek doğrudan veya dolaylı zararlardan sorumlu tutulmayız.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Hesap Askıya Alma ve Sonlandırma</h2>
            <p className="text-muted-foreground">
              Bu koşulların ihlali durumunda, önceden haber vermeksizin hesabınızı askıya alabilir veya sonlandırabiliriz. Hesabınızı istediğiniz zaman silebilirsiniz.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Değişiklikler</h2>
            <p className="text-muted-foreground">
              Bu Kullanım Koşulları'nı istediğimiz zaman değiştirebiliriz. Önemli değişiklikler olduğunda sizi bilgilendireceğiz. Değişiklikler yayınlandıktan sonra hizmeti kullanmaya devam etmeniz, yeni koşulları kabul ettiğiniz anlamına gelir.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">11. Uygulanacak Hukuk</h2>
            <p className="text-muted-foreground">
              Bu koşullar Türkiye Cumhuriyeti yasalarına tabidir. Uyuşmazlıklar Türkiye mahkemelerinde çözümlenecektir.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">12. İletişim</h2>
            <p className="text-muted-foreground">
              Bu koşullar hakkında sorularınız için bizimle iletişime geçebilirsiniz:
            </p>
            <div className="mt-4 p-4 bg-card rounded-lg border border-border">
              <p className="text-foreground font-medium">Miber Film Köşesi</p>
              <p className="text-muted-foreground">E-posta: legal@miberfilm.com</p>
            </div>
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

export default TermsOfService;
