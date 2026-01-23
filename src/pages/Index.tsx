import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import FeaturesGrid from "@/components/FeaturesGrid";
import DemoVideo from "@/components/DemoVideo";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import FooterNew from "@/components/FooterNew";
import SEOHead from "@/components/SEOHead";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Miber Film Köşesi - Birlikte İzle, Birlikte Yaşa"
        description="Arkadaşlarınızla birlikte film ve dizi izleyin, görüntülü sohbet edin. YouTube videolarını gerçek zamanlı senkronize izleme deneyimi."
        keywords="birlikte film izle, watch party, görüntülü sohbet, YouTube birlikte izle, sosyal izleme, film izleme platformu"
      />
      <Navbar />
      <main className="pt-16">
        <Hero />
        <HowItWorks />
        <FeaturesGrid />
        <DemoVideo />
        <Testimonials />
        <Pricing />
        <FAQ />
      </main>
      <FooterNew />
    </div>
  );
};

export default Index;
