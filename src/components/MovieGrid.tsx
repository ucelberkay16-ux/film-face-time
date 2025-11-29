import MovieCard from "./MovieCard";

const MOVIES = [
  {
    id: 1,
    title: "Yıldızlararası",
    rating: 8.7,
    year: "2014",
    imageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=600&fit=crop",
    activeViewers: 234
  },
  {
    id: 2,
    title: "Matrix",
    rating: 8.9,
    year: "1999",
    imageUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop",
    activeViewers: 567
  },
  {
    id: 3,
    title: "Başlangıç",
    rating: 8.8,
    year: "2010",
    imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop",
    activeViewers: 189
  },
  {
    id: 4,
    title: "Blade Runner 2049",
    rating: 8.4,
    year: "2017",
    imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
    activeViewers: 423
  },
  {
    id: 5,
    title: "Dune",
    rating: 8.2,
    year: "2021",
    imageUrl: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=600&fit=crop",
    activeViewers: 891
  },
  {
    id: 6,
    title: "Avatar",
    rating: 8.1,
    year: "2009",
    imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop",
    activeViewers: 312
  },
];

const MovieGrid = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              Popüler İçerikler
            </h2>
            <p className="text-muted-foreground">
              Şu anda en çok izlenen filmler ve diziler
            </p>
          </div>
          
          <button className="text-primary font-medium hover:underline hidden md:block">
            Tümünü Gör →
          </button>
        </div>

        {/* Movie Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {MOVIES.map((movie) => (
            <MovieCard key={movie.id} {...movie} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MovieGrid;
