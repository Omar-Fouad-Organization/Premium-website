import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PremiumFooter = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container-premium py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-6">
            <img
              src="/images/green_life_expo_logo_variations_20251225134629_1.webp"
              alt="Green Life Expo"
              className="h-14 w-auto brightness-0 invert"
            />
            <p className="text-primary-foreground/80 leading-relaxed max-w-sm">
              Egypt's leading platform for sustainable living, organic products, and green innovation.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-lg mb-6">Participate</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/exhibitors" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                  Exhibit With Us
                </Link>
              </li>
              <li>
                <Link to="/sponsors" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                  Become a Sponsor
                </Link>
              </li>
              <li>
                <Link to="/visitors" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                  Visit the Expo
                </Link>
              </li>
              <li>
                <Link to="/content" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                  Content & Talks
                </Link>
              </li>
            </ul>
          </div>

          {/* Explore */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-lg mb-6">Explore</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/sectors" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                  Sectors
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h3 className="font-semibold text-lg mb-6">Get in Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary-foreground/60" />
                <span className="text-primary-foreground/80">
                  Cairo International Convention Center<br />
                  El Nasr Road, Nasr City, Cairo, Egypt
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="h-5 w-5 flex-shrink-0 text-primary-foreground/60" />
                <a href="tel:+201234567890" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  +20 123 456 7890
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="h-5 w-5 flex-shrink-0 text-primary-foreground/60" />
                <a href="mailto:info@greenlifeexpo.com" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  info@greenlifeexpo.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container-premium py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/60">
            <p>&copy; {new Date().getFullYear()} Green Life Expo. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-primary-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-primary-foreground transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PremiumFooter;
