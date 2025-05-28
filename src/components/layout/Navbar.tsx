
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useSupabaseCart } from "@/contexts/SupabaseCartContext";
import AuthModal from "@/components/auth/AuthModal";
import ProfileDropdown from "./ProfileDropdown";
import CartBadge from "@/components/cart/CartBadge";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, openAuthModal } = useAuth();
  const { openCart, cart } = useSupabaseCart();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/bundles", label: "Bundles" },
    { href: "/custom-buy", label: "Custom Buy" },
    { href: "/group-buy", label: "Group Buy" },
    { href: "/orders", label: "My Orders" },
  ];

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo - Only Image */}
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/32e88e9a-d13e-4797-bc20-1ea08858de5e.png" 
                alt="KHRATE Logo" 
                className="h-10 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-gray-600 hover:text-khrate-500 font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Cart Button */}
              <button
                onClick={openCart}
                className="relative p-2 text-gray-600 hover:text-khrate-500 transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
                <CartBadge itemCount={cart.length} />
              </button>

              {/* Auth Section */}
              {isAuthenticated ? (
                <ProfileDropdown />
              ) : (
                <div className="hidden md:flex items-center space-x-3">
                  <Button 
                    variant="ghost" 
                    onClick={openAuthModal}
                    className="text-gray-700 hover:text-khrate-500"
                  >
                    Login
                  </Button>
                  <Button 
                    onClick={openAuthModal}
                    className="bg-khrate-500 hover:bg-khrate-600 text-white"
                  >
                    Sign Up & Save 10%
                  </Button>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-khrate-500"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="px-4 py-2 text-gray-600 hover:text-khrate-500 hover:bg-gray-50 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                {!isAuthenticated && (
                  <div className="px-4 pt-4 space-y-2 border-t">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        openAuthModal();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full justify-start"
                    >
                      Login
                    </Button>
                    <Button
                      onClick={() => {
                        openAuthModal();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full bg-khrate-500 hover:bg-khrate-600 text-white"
                    >
                      Sign Up & Save 10%
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <AuthModal />
    </>
  );
};

export default Navbar;
