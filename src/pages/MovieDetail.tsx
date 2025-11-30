import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, Users, Play, Share2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Örnek film verileri - YouTube video ID'leri ile
const MOVIES_DATA: Record<string, {
  id: number;
  title: string;
  rating: number;
  year: string;
  imageUrl: string;
  activeViewers: number;
  youtubeId: string;
  description: string;
  genre: string[];
  duration: string;
  director: string;
  cast: string[];
}> = {
  "1": {
    id: 1,
    title: "Yıldızlararası",
    rating: 8.7,
    year: "2014",
    imageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=600&fit=crop",
    activeViewers: 234,
    youtubeId: "zSWdZVtXT7E", // Interstellar Trailer
    description: "Dünya'nın geleceği tehlike altındayken, bir grup kaşif insanlığın hayatta kalmasını sağlamak için galaksiler arası bir yolculuğa çıkar.",
    genre: ["Bilim Kurgu", "Drama", "Macera"],
    duration: "169 dakika",
    director: "Christopher Nolan",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"]
  },
  "2": {
    id: 2,
    title: "Matrix",
    rating: 8.9,
    year: "1999",
    imageUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop",
    activeViewers: 567,
    youtubeId: "vKQi3bBA1y8", // Matrix Trailer
    description: "Bir bilgisayar programcısı, gerçekliğin aslında bir simülasyon olduğunu keşfeder ve insanlığı kurtarmak için savaşa katılır.",
    genre: ["Bilim Kurgu", "Aksiyon"],
    duration: "136 dakika",
    director: "Wachowski Kardeşler",
    cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"]
  },
  "3": {
    id: 3,
    title: "Başlangıç",
    rating: 8.8,
    year: "2010",
    imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop",
    activeViewers: 189,
    youtubeId: "YoHD9XEInc0", // Inception Trailer
    description: "Bir hırsız, insanların rüyalarına girerek sırlarını çalan yetenekli bir profesyoneldir. Ancak son bir iş için bir fikir yerleştirmesi gerekir.",
    genre: ["Bilim Kurgu", "Aksiyon", "Gerilim"],
    duration: "148 dakika",
    director: "Christopher Nolan",
    cast: ["Leonardo DiCaprio", "Marion Cotillard", "Tom Hardy"]
  },
  "4": {
    id: 4,
    title: "Blade Runner 2049",
    rating: 8.4,
    year: "2017",
    imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
    activeViewers: 423,
    youtubeId: "gCcx85zbxz4", // Blade Runner 2049 Trailer
    description: "Genç bir polis, toplumu kaosa sürükleyebilecek uzun süredir saklı kalmış bir sırrı ortaya çıkarır.",
    genre: ["Bilim Kurgu", "Dram"],
    duration: "164 dakika",
    director: "Denis Villeneuve",
    cast: ["Ryan Gosling", "Harrison Ford", "Ana de Armas"]
  },
  "5": {
    id: 5,
    title: "Dune",
    rating: 8.2,
    year: "2021",
    imageUrl: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=600&fit=crop",
    activeViewers: 891,
    youtubeId: "8g18jFHCLXk", // Dune Trailer
    description: "Evrenin en değerli kaynağını ve ailesinin geleceğini korumak için tehlikeli bir gezegene seyahat eden genç bir adamın hikayesi.",
    genre: ["Bilim Kurgu", "Macera"],
    duration: "155 dakika",
    director: "Denis Villeneuve",
    cast: ["Timothée Chalamet", "Zendaya", "Oscar Isaac"]
  },
  "6": {
    id: 6,
    title: "Avatar",
    rating: 8.1,
    year: "2009",
    imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop",
    activeViewers: 312,
    youtubeId: "5PSNL1qE6VY", // Avatar Trailer
    description: "Uzak bir gezegende bir Marine, yerli halk ile işgalci güçler arasında sıkışıp kalır.",
    genre: ["Bilim Kurgu", "Aksiyon", "Macera"],
    duration: "162 dakika",
    director: "James Cameron",
    cast: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver"]
  }
};

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const movie = id ? MOVIES_DATA[id] : null;

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-6 pt-32 text-center">
          <h1 className="text-4xl font-bold mb-4">Film Bulunamadı</h1>
          <Button onClick={() => navigate("/")}>Ana Sayfaya Dön</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <div className="relative h-[60vh] overflow-hidden">
          <img 
            src={movie.imageUrl} 
            alt={movie.title}
            className="absolute inset-0 w-full h-full object-cover blur-sm scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
          
          <div className="relative container mx-auto px-6 h-full flex items-end pb-12">
            <div className="space-y-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/")}
                className="mb-4 hover:bg-card/50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Geri Dön
              </Button>
              
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                {movie.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-primary text-primary" />
                  <span className="text-xl font-bold">{movie.rating}</span>
                </div>
                <span className="text-muted-foreground">•</span>
                <span className="text-foreground">{movie.year}</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-foreground">{movie.duration}</span>
                <span className="text-muted-foreground">•</span>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-accent" />
                  <span className="text-foreground">{movie.activeViewers} kişi izliyor</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {movie.genre.map((g) => (
                  <Badge key={g} variant="secondary" className="bg-card/50 backdrop-blur-sm">
                    {g}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Video Player */}
        <div className="container mx-auto px-6 py-12">
          <Card className="overflow-hidden bg-card border-border">
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${movie.youtubeId}?autoplay=0&rel=0`}
                title={movie.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-6">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <Play className="w-5 h-5 mr-2" />
              Arkadaşlarınla İzle
            </Button>
            <Button size="lg" variant="outline">
              <Share2 className="w-5 h-5 mr-2" />
              Paylaş
            </Button>
          </div>
        </div>

        {/* Movie Info */}
        <div className="container mx-auto px-6 pb-20">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Description */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">Hikaye</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {movie.description}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">Oyuncular</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.cast.map((actor) => (
                    <Badge key={actor} variant="outline" className="text-base py-2 px-4">
                      {actor}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Info */}
            <div>
              <Card className="p-6 bg-card border-border space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Yönetmen</h3>
                  <p className="text-foreground font-semibold">{movie.director}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Yıl</h3>
                  <p className="text-foreground font-semibold">{movie.year}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Süre</h3>
                  <p className="text-foreground font-semibold">{movie.duration}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Puan</h3>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-primary text-primary" />
                    <p className="text-foreground font-semibold text-xl">{movie.rating}/10</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MovieDetail;
