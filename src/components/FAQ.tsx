import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_ITEMS = [
  {
    question: "Miber Film Köşesi nasıl çalışıyor?",
    answer: "Bir oda oluşturup arkadaşlarınızı davet ediyorsunuz. Herkes aynı video linkini izlerken, görüntülü sohbet ile birbirinizi görüyor ve senkronize şekilde izliyorsunuz. Oynat, duraklat gibi tüm kontroller herkeste aynı anda çalışır.",
  },
  {
    question: "Hangi cihazlarda kullanabilirim?",
    answer: "Web tarayıcısı olan her cihazda kullanabilirsiniz. Masaüstü, laptop, tablet ve mobil cihazlarda sorunsuz çalışır. Chrome, Firefox, Safari ve Edge tarayıcılarını destekliyoruz.",
  },
  {
    question: "Kaç kişiyle aynı anda izleyebilirim?",
    answer: "Ücretsiz planda 2 kişi, Standart planda 6 kişi, Premium planda ise 12 kişiye kadar aynı anda izleyebilirsiniz. Tüm katılımcılar görüntülü sohbete katılabilir.",
  },
  {
    question: "Video kalitesi nasıl?",
    answer: "Video kalitesi planınıza göre değişir. Ücretsiz planda 720p, Standart planda 1080p, Premium planda ise 4K kalitesinde izleme deneyimi sunuyoruz.",
  },
  {
    question: "Aboneliğimi istediğim zaman iptal edebilir miyim?",
    answer: "Evet, aboneliğinizi istediğiniz zaman iptal edebilirsiniz. İptal ettiğinizde, mevcut dönem sonuna kadar premium özelliklerden yararlanmaya devam edersiniz.",
  },
  {
    question: "Verilerim güvende mi?",
    answer: "Evet, tüm görüntülü görüşmeler uçtan uca şifreleme ile korunur. Kişisel verileriniz KVKK ve GDPR uyumlu şekilde işlenir ve üçüncü taraflarla paylaşılmaz.",
  },
];

const FAQ = () => {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            SSS
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              Sıkça Sorulan Sorular
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Merak ettiğin her şeyin cevabı burada.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {FAQ_ITEMS.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-xl px-6 data-[state=open]:border-primary/50 transition-colors"
              >
                <AccordionTrigger className="text-left text-foreground hover:text-primary hover:no-underline py-5">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
