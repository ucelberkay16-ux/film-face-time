import { Button } from "@/components/ui/button";
import { Film, Menu, X, User, LogIn, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-background/20' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="relative">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow">
                <Film className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
              </div>
              <div className="absolute -inset-1 bg-primary/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Miber
              </span>
              <span className="text-[10px] sm:text-xs text-muted-foreground -mt-1 hidden sm:block">Film Köşesi</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <NavItem to="/" label="Keşfet" isActive={isActive('/')} />
            <NavItem to="/rooms" label="Odalar" isActive={isActive('/rooms')} />
            <NavItem to="/#pricing" label="Fiyatlar" isActive={false} />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <Link to="/rooms">
                <Button className="hidden sm:flex gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all rounded-xl">
                  <Sparkles className="w-4 h-4" />
                  Odalara Git
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth" className="hidden sm:block">
                  <Button variant="ghost" className="gap-2 hover:bg-card/50 rounded-xl">
                    <LogIn className="w-4 h-4" />
                    Giriş Yap
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="hidden sm:flex gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all rounded-xl">
                    <Sparkles className="w-4 h-4" />
                    Ücretsiz Başla
                  </Button>
                </Link>
              </>
            )}
            
            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden hover:bg-card/50 rounded-xl"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
          isMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}>
          <div className="pb-4 space-y-2">
            <MobileNavItem to="/" label="Keşfet" onClick={() => setIsMenuOpen(false)} />
            <MobileNavItem to="/rooms" label="Odalar" onClick={() => setIsMenuOpen(false)} />
            <MobileNavItem to="/#pricing" label="Fiyatlar" onClick={() => setIsMenuOpen(false)} />
            
            <div className="pt-4 space-y-2 border-t border-border/50">
              {user ? (
                <Link to="/rooms" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full gap-2 bg-gradient-to-r from-primary to-primary/80 rounded-xl">
                    <Sparkles className="w-4 h-4" />
                    Odalara Git
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full gap-2 rounded-xl">
                      <LogIn className="w-4 h-4" />
                      Giriş Yap
                    </Button>
                  </Link>
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full gap-2 bg-gradient-to-r from-primary to-primary/80 rounded-xl">
                      <Sparkles className="w-4 h-4" />
                      Ücretsiz Başla
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavItem = ({ to, label, isActive }: { to: string; label: string; isActive: boolean }) => (
  <Link 
    to={to}
    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive 
        ? 'text-primary bg-primary/10' 
        : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
    }`}
  >
    {label}
  </Link>
);

const MobileNavItem = ({ to, label, onClick }: { to: string; label: string; onClick: () => void }) => (
  <Link 
    to={to}
    onClick={onClick}
    className="block px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-card/50 transition-colors"
  >
    {label}
  </Link>
);

export default Navbar;
