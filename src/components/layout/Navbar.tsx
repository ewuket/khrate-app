
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
    { href: "/orders", label: "Orders" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/7bd74977-70dd-4c12-8ccd-42b15a0320c1.png" 
                alt="Khrate Logo" 
                className="h-8 w-auto"
              />
              <span className="text-2xl font-bold text-khrate-500">Khrate</span>
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
                <Button onClick={openAuthModal} variant="outline" className="hidden md:flex">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
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
                  <button
                    onClick={() => {
                      openAuthModal();
                      setIsMobileMenuOpen(false);
                    }}
                    className="mx-4 mt-2 px-4 py-2 bg-khrate-500 text-white rounded-md hover:bg-khrate-600 transition-colors"
                  >
                    Sign In
                  </button>
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
