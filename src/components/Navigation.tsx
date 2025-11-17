import { ShoppingCart, Menu, X, User, Facebook, Instagram, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/hastilong-logo.png";
import { AuthDialog } from "./AuthDialog";
import { useCart } from "@/contexts/CartContext";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home Decor", href: "#home-decor" },
    { name: "Arts & Crafts", href: "#arts-crafts" },
    { name: "Toys", href: "#toys" },
    { name: "Furniture", href: "#furniture" },
    { name: "Puja", href: "#puja" },
  ];

  const handleNavClick = (href: string) => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(href);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logo} alt="HastiLong" className="h-12 w-auto" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                className="text-foreground hover:text-accent transition-colors duration-300 font-medium"
              >
                {link.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Social Media Icons */}
            <a 
              href="https://www.facebook.com/share/1F14XLCPWw/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden md:flex text-foreground hover:text-accent transition-colors"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a 
              href="https://www.instagram.com/hastilong_marketplace?igsh=NGdzbGkxa3FpNmpj" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden md:flex text-foreground hover:text-accent transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a 
              href="https://wa.me/917829279765?text=Hi%20I%20want%20to%20know%20more%20about%20HastiLong%20Marketplace!"
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden md:flex text-foreground hover:text-accent transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
            </a>

            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </Button>
            </Link>

            {/* Account Button */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowAuthDialog(true)}
            >
              <User className="h-5 w-5" />
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                className="block py-2 text-foreground hover:text-accent transition-colors duration-300 font-medium w-full text-left"
              >
                {link.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
    </nav>
  );
};

export default Navigation;
