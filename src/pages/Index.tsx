import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import FeaturesGrid from "@/components/FeaturesGrid";
import DemoVideo from "@/components/DemoVideo";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import FooterNew from "@/components/FooterNew";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
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
