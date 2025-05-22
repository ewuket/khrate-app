
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import AuthModal from "@/components/auth/AuthModal";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Simulated auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const navLinks = [
    { title: "Home", path: "/" },
    { title: "Bundles", path: "/bundles" },
    { title: "Custom Buy", path: "/custom-buy" },
    { title: "Group Buy", path: "/group-buy" }
  ];
  
  return (
    <>
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/87618cc5-dec8-4826-9426-51ad24b6362a.png" 
                alt="KHRATE Logo" 
                className="h-10 w-auto" 
              />
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path}
                  className="text-gray-700 hover:text-khrate-500 transition-colors"
                >
                  {link.title}
                </Link>
              ))}
            </nav>
            
            {/* Right-side items (desktop) */}
            <div className="hidden md:flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  <Link to="/orders" className="text-gray-700 hover:text-khrate-500">
                    <span className="font-medium">My Orders</span>
                  </Link>
                  <Link 
                    to="/profile" 
                    className="text-gray-700 hover:text-khrate-500"
                  >
                    <User className="h-5 w-5" />
                  </Link>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    onClick={() => setIsAuthModalOpen(true)}
                    className="text-gray-700 hover:text-khrate-500"
                  >
                    Login
                  </Button>
                  <Button 
                    onClick={() => {
                      setIsAuthModalOpen(true);
                    }}
                    className="bg-khrate-500 hover:bg-khrate-600"
                  >
                    Sign Up
                  </Button>
                </>
              )}
              <Link to="/custom-buy" className="text-gray-700 hover:text-khrate-500">
                <ShoppingCart className="h-5 w-5" />
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
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
        {isMenuOpen && (
          <div className="md:hidden border-t">
            <div className="container mx-auto py-4">
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link 
                    key={link.path} 
                    to={link.path}
                    className="text-gray-700 hover:text-khrate-500 transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.title}
                  </Link>
                ))}
                
                {isLoggedIn ? (
                  <>
                    <Link 
                      to="/orders" 
                      className="text-gray-700 hover:text-khrate-500 py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <Link 
                      to="/profile" 
                      className="text-gray-700 hover:text-khrate-500 py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2 pt-4 border-t">
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsAuthModalOpen(true);
                      }}
                    >
                      Login
                    </Button>
                    <Button 
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsAuthModalOpen(true);
                      }}
                      className="bg-khrate-500 hover:bg-khrate-600"
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </nav>
            </div>
          </div>
        )}
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
