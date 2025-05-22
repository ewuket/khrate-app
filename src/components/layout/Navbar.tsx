
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import AuthModal from "@/components/auth/AuthModal";
import NavLinks from "./NavLinks";
import CartButton from "./CartButton";
import AuthButtons from "./AuthButtons";
import MobileMenu from "./MobileMenu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Simulated auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const navLinks = [
    { title: "Home", path: "/" },
    { title: "Bundles", path: "/bundles" },
    { title: "Custom Buy", path: "/custom-buy" },
    { title: "Group Buy", path: "/group-buy" },
    { title: "My Orders", path: "/orders" }
  ];
  
  return (
    <>
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/206fd2ee-0377-47a0-8083-70118088988f.png" 
                alt="KHRATE Logo" 
                className="h-10 w-auto" 
              />
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <NavLinks links={navLinks} />
            </nav>
            
            {/* Right-side items (desktop) */}
            <div className="hidden md:flex items-center space-x-4">
              <AuthButtons 
                isLoggedIn={isLoggedIn}
                onOpenAuthModal={() => setIsAuthModalOpen(true)}
              />
              <CartButton />
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              <CartButton />
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <MobileMenu 
          isOpen={isMenuOpen}
          navLinks={navLinks}
          isLoggedIn={isLoggedIn}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onCloseMenu={() => setIsMenuOpen(false)}
        />
      </header>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
};

export default Navbar;
