
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useCartContext } from "@/contexts/CartContext";
import AuthButtons from "./AuthButtons";
import ProfileDropdown from "./ProfileDropdown";
import CartButton from "./CartButton";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import NavLinks from "./NavLinks";

const Navbar = () => {
  const { openAuthModal, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleAuthButtonClick = () => {
    console.log('Auth button clicked from navbar');
    openAuthModal();
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { title: "Home", path: "/" },
    { title: "Bundles", path: "/bundles" },
    { title: "Custom Buy", path: "/custom-buy" },
    { title: "Group Buy", path: "/group-buy" },
    { title: "Contact", path: "/contact" }
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/ea7e14fb-6084-4c08-94cf-b35bb353cd1c.png" 
              alt="KHRATE" 
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLinks links={navLinks} />
          </div>

          {/* Desktop Auth & Cart */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <ProfileDropdown />
            ) : (
              <AuthButtons onOpenAuthModal={handleAuthButtonClick} />
            )}
            
            <CartButton />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <CartButton />
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-6 mt-6">
                  <NavLinks 
                    links={navLinks} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-medium"
                  />
                  
                  <div className="border-t pt-4">
                    {isAuthenticated ? (
                      <div className="space-y-4">
                        <ProfileDropdown />
                      </div>
                    ) : (
                      <AuthButtons 
                        layout="mobile" 
                        onOpenAuthModal={handleAuthButtonClick}
                      />
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      
      <AuthModal />
    </nav>
  );
};

export default Navbar;
