
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCartContext } from "@/contexts/CartContext";
import AuthButtons from "./AuthButtons";
import NavLinks from "./NavLinks";
import MobileMenu from "./MobileMenu";
import CartButton from "./CartButton";
import { Menu } from "lucide-react";

const Navbar = () => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const { cart } = useCartContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { title: "Home", path: "/" },
    { title: "Bundles", path: "/bundles" },
    { title: "Custom Buy", path: "/custom-buy" },
    { title: "Group Buy", path: "/group-buy" },
    { title: "About", path: "/about" },
    { title: "Contact", path: "/contact" }
  ];

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/99149a9c-234b-46ab-bd67-67d22129abb2.png" 
              alt="Khrate" 
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLinks links={navLinks} />
          </div>

          {/* Desktop Auth & Cart */}
          <div className="hidden md:flex items-center space-x-4">
            <CartButton />
            <AuthButtons onOpenAuthModal={openAuthModal} />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <CartButton />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        navLinks={navLinks}
        isLoggedIn={isAuthenticated}
        onOpenAuthModal={openAuthModal}
        onCloseMenu={() => setIsMobileMenuOpen(false)} 
      />
    </nav>
  );
};

export default Navbar;
