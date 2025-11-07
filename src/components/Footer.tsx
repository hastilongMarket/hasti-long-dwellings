import { Facebook, Instagram, Twitter, Mail } from "lucide-react";
import logo from "@/assets/hastilong-logo.png";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <img src={logo} alt="HastiLong" className="h-16 w-auto brightness-0 invert" />
            <p className="text-sm opacity-80">
              Handcrafted treasures that bring beauty and warmth to your space.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#home-decor" className="opacity-80 hover:opacity-100 transition-opacity">Home Decor</a></li>
              <li><a href="#arts-crafts" className="opacity-80 hover:opacity-100 transition-opacity">Arts & Crafts</a></li>
              <li><a href="#toys" className="opacity-80 hover:opacity-100 transition-opacity">Toys</a></li>
              <li><a href="#furniture" className="opacity-80 hover:opacity-100 transition-opacity">Furniture</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Customer Care</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Contact Us</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Shipping Info</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Returns</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Connect</h4>
            <div className="flex gap-4 mb-4">
              <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">
                <Mail className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm opacity-80">
              Subscribe to our newsletter for updates and special offers.
            </p>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm opacity-80">
          <p>&copy; 2024 HastiLong. All rights reserved. Dreaming together.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
