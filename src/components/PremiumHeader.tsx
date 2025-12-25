import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const PremiumHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Sectors", path: "/sectors" },
    { name: "Exhibitors", path: "/exhibitors" },
    { name: "Sponsors", path: "/sponsors" },
    { name: "Visitors", path: "/visitors" },
    { name: "Content & Talks", path: "/content" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md"
          : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="container-premium">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/images/green_life_expo_logo_variations_20251225134629_1.webp"
              alt="Green Life Expo"
              className="h-14 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors relative group ${
                  isActive(item.path)
                    ? "text-primary"
                    : "text-foreground/70 hover:text-primary"
                }`}
              >
                {item.name}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                    isActive(item.path) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Button variant="outline" asChild className="border-primary text-primary hover:bg-primary hover:text-white">
              <Link to="/exhibitors">Exhibit With Us</Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link to="/sponsors">Become a Sponsor</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 hover:bg-accent/10 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden py-6 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-base font-medium transition-colors px-4 py-2 rounded-lg ${
                    isActive(item.path)
                      ? "text-primary bg-primary/5"
                      : "text-foreground/70 hover:text-primary hover:bg-accent/5"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-border px-4">
                <Button variant="outline" asChild className="w-full border-primary text-primary">
                  <Link to="/exhibitors" onClick={() => setIsMenuOpen(false)}>
                    Exhibit With Us
                  </Link>
                </Button>
                <Button asChild className="w-full bg-primary hover:bg-primary/90">
                  <Link to="/sponsors" onClick={() => setIsMenuOpen(false)}>
                    Become a Sponsor
                  </Link>
                </Button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default PremiumHeader;
