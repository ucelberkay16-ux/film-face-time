import { Button } from "@/components/ui/button";
import { Film, Menu, Search, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Film className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              Miber Film Köşesi
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Keşfet
            </Link>
            <Link to="/rooms" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Odalar
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="outline" className="hidden md:flex">
                <User className="w-4 h-4 mr-2" />
                Giriş Yap
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="hidden md:flex bg-primary hover:shadow-glow transition-all">
                Ücretsiz Başla
              </Button>
            </Link>
            
            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <Link to="/" className="block text-sm font-medium text-foreground hover:text-primary transition-colors">
              Keşfet
            </Link>
            <Link to="/rooms" className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Odalar
            </Link>
            <div className="flex flex-col gap-2 pt-4">
              <Link to="/auth">
                <Button variant="outline" className="w-full">
                  <User className="w-4 h-4 mr-2" />
                  Giriş Yap
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="w-full bg-primary">
                  Ücretsiz Başla
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
