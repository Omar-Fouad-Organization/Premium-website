import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Languages } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const PremiumHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoUrl, setLogoUrl] = useState("/images/green_life_expo_logo_variations_20251225134629_1.webp");
  const location = useLocation();
  const { language, setLanguage, t, isRTL } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    loadLogo();
  }, []);

  const loadLogo = async () => {
    const { data } = await supabase
      .from("site_settings_premium_20251225")
      .select("logo_url")
      .limit(1)
      .single();

    if (data?.logo_url) {
      setLogoUrl(data.logo_url);
    }
  };

  const navItems = [
    { name: t("nav_home", "Home"), path: "/" },
    { name: t("nav_about", "About"), path: "/about" },
    { name: t("nav_sectors", "Sectors"), path: "/sectors" },
    { name: t("nav_exhibitors", "Exhibitors"), path: "/exhibitors" },
    { name: t("nav_sponsors", "Sponsors"), path: "/sponsors" },
    { name: t("nav_visitors", "Visitors"), path: "/visitors" },
    { name: t("nav_blog", "Blog"), path: "/blog" },
    { name: t("nav_contact", "Contact"), path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const toggleLanguage = () => {
    const newLang = language === "en" ? "ar" : "en";
    setLanguage(newLang);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md"
          : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="container-premium">
        <div className={`flex items-center justify-between h-24 md:h-28 py-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={logoUrl}
              alt="Green Life Expo"
              className="h-20 md:h-24 w-auto max-w-[250px] md:max-w-[350px] object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className={`hidden lg:flex items-center gap-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.path)
                    ? "text-primary"
                    : "text-gray-700"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Language Switcher & Mobile Menu Button */}
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Language Switcher Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center gap-2 hover:bg-primary hover:text-white transition-colors"
            >
              <Languages className="h-4 w-4" />
              <span className="font-semibold">
                {language === "en" ? "العربية" : "English"}
              </span>
            </Button>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden py-6 border-t border-gray-200">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-base font-medium transition-colors hover:text-primary px-4 py-2 rounded-lg ${
                    isActive(item.path)
                      ? "text-primary bg-primary/5"
                      : "text-gray-700"
                  } ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default PremiumHeader;
