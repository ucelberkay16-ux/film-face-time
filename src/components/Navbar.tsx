import { Button } from "@/components/ui/button";
import { Film, Menu, Search, User } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Film className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              WatchTogether
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Keşfet
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Filmler
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Diziler
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Odalar
            </a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="outline" className="hidden md:flex">
              <User className="w-4 h-4 mr-2" />
              Giriş Yap
            </Button>
            <Button className="hidden md:flex bg-gradient-primary hover:shadow-glow transition-all">
              Ücretsiz Başla
            </Button>
            
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
            <a href="#" className="block text-sm font-medium text-foreground hover:text-primary transition-colors">
              Keşfet
            </a>
            <a href="#" className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Filmler
            </a>
            <a href="#" className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Diziler
            </a>
            <a href="#" className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Odalar
            </a>
            <div className="flex flex-col gap-2 pt-4">
              <Button variant="outline" className="w-full">
                <User className="w-4 h-4 mr-2" />
                Giriş Yap
              </Button>
              <Button className="w-full bg-gradient-primary">
                Ücretsiz Başla
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
