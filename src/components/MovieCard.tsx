import { Play, Star, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface MovieCardProps {
  id: number;
  title: string;
  rating: number;
  year: string;
  imageUrl: string;
  activeViewers?: number;
}

const MovieCard = ({ id, title, rating, year, imageUrl, activeViewers }: MovieCardProps) => {
  return (
    <Link to={`/movie/${id}`}>
      <Card className="group relative overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow cursor-pointer">
      {/* Poster Image */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
          </div>
        </div>

        {/* Active Viewers Badge */}
        {activeViewers && (
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs font-medium text-foreground">{activeViewers}</span>
          </div>
        )}
      </div>

      {/* Movie Info */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span className="font-medium text-foreground">{rating}</span>
          </div>
          <span className="text-muted-foreground">{year}</span>
        </div>
      </div>
    </Card>
    </Link>
  );
};

export default MovieCard;
