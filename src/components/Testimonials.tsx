import { useState } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const TESTIMONIALS = [
  {
    name: "Elif Yılmaz",
    role: "Öğrenci",
    avatar: "EY",
    rating: 5,
    text: "Uzak mesafe ilişkimde en büyük yardımcımız oldu. Sevgilimle her hafta film gecesi yapıyoruz!",
  },
  {
    name: "Ahmet Kaya",
    role: "Yazılımcı",
    avatar: "AK",
    rating: 5,
    text: "Arkadaşlarla dizi izlerken aynı odadaymışız gibi hissediyoruz. Görüntülü sohbet özelliği muhteşem.",
  },
  {
    name: "Zeynep Demir",
    role: "Grafik Tasarımcı",
    avatar: "ZD",
    rating: 5,
    text: "Senkronizasyon mükemmel çalışıyor. Artık 'Sen neredesin?' diye sormak yok!",
  },
  {
    name: "Murat Özkan",
    role: "Üniversite Öğrencisi",
    avatar: "MÖ",
    rating: 5,
    text: "Yurt arkadaşlarımla farklı şehirlerdeyken bile birlikte izliyoruz. Harika bir platform!",
  },
  {
    name: "Selin Arslan",
    role: "İçerik Üreticisi",
    avatar: "SA",
    rating: 5,
    text: "Takipçilerimle watch party düzenliyorum. Herkes çok seviyor!",
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const getVisibleTestimonials = () => {
    const items = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % TESTIMONIALS.length;
      items.push({ ...TESTIMONIALS[index], index });
    }
    return items;
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Kullanıcı Yorumları
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              Kullanıcılarımız Ne Diyor?
            </span>
          </h2>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Navigation buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-card/80 backdrop-blur-sm border-border hover:border-primary hidden md:flex"
            onClick={prevSlide}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-card/80 backdrop-blur-sm border-border hover:border-primary hidden md:flex"
            onClick={nextSlide}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>

          {/* Testimonials grid */}
          <div className="grid md:grid-cols-3 gap-6 px-4">
            {getVisibleTestimonials().map((testimonial, idx) => (
              <Card
                key={`${testimonial.name}-${idx}`}
                className={`bg-card/50 backdrop-blur-sm border-border transition-all duration-500 ${
                  idx === 1 ? 'md:scale-105 md:shadow-glow border-primary/30' : 'opacity-80'
                }`}
              >
                <CardContent className="p-6">
                  <Quote className="w-8 h-8 text-primary/30 mb-4" />
                  
                  <p className="text-foreground/90 mb-6 leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 mt-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Mobile navigation */}
          <div className="flex justify-center gap-4 mt-8 md:hidden">
            <Button variant="outline" size="icon" onClick={prevSlide}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextSlide}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-8 bg-primary' : 'bg-border hover:bg-muted-foreground'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
