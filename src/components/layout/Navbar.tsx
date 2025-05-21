
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBasket, User, Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navItems = [
    { name: "Bundles", path: "/bundles", icon: <ShoppingBasket className="h-5 w-5" /> },
    { name: "Custom Buy", path: "/custom-buy", icon: <ShoppingBasket className="h-5 w-5" /> },
    { name: "Group Buy", path: "/group-buy", icon: <ShoppingBasket className="h-5 w-5" /> },
    { name: "My Orders", path: "/orders", icon: <ShoppingBasket className="h-5 w-5" /> },
  ];

  return (
    <header className="sticky top-0 bg-white shadow-sm z-50">
      <div className="container mx-auto py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/6394ed03-1023-4873-bb46-921839e56f26.png" 
              alt="KHRATE Logo" 
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <NavLink 
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) => 
                    isActive ? "nav-link active flex items-center gap-1.5" : "nav-link flex items-center gap-1.5"
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4">
            <Link to="/profile">
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            {isMobile && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMenu} 
                className="md:hidden rounded-full"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            )}
            {!isMobile && (
              <Button className="btn-khrate">Login / Sign up</Button>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobile && isMenuOpen && (
          <div className="mt-4 bg-white rounded-lg py-2 shadow-lg animate-fade-in">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-3 ${isActive ? "text-khrate-500 bg-khrate-50" : "text-foreground"}`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
            <div className="px-4 pt-2 pb-2 border-t mt-2">
              <Button className="btn-khrate w-full">Login / Sign up</Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
