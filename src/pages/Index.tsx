import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MovieGrid from "@/components/MovieGrid";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <Hero />
        <MovieGrid />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
