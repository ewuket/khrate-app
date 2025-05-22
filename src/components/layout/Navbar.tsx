
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import AuthModal from "@/components/auth/AuthModal";
import { useCart } from "@/contexts/CartContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { cart, openCart } = useCart();
  const location = useLocation();
  
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
                src="/lovable-uploads/6394ed03-1023-4873-bb46-921839e56f26.png" 
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
                  className={`text-gray-700 hover:text-khrate-500 transition-colors ${
                    location.pathname === link.path ? "text-khrate-500 font-medium" : ""
                  }`}
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
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative text-gray-700 hover:text-khrate-500"
                onClick={openCart}
              >
                <ShoppingCart className="h-5 w-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-khrate-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Button>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                className="relative text-gray-700 hover:text-khrate-500"
                onClick={openCart}
              >
                <ShoppingCart className="h-5 w-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-khrate-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Button>
              
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
                    className={`text-gray-700 hover:text-khrate-500 transition-colors py-2 ${
                      location.pathname === link.path ? "text-khrate-500 font-medium" : ""
                    }`}
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
