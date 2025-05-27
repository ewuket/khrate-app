import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/layout/ModeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, ShoppingCart, Menu } from "lucide-react";
import CartButton from "@/components/layout/CartButton";

const NavLinks = () => {
  const location = useLocation();

  const links = [
    { to: "/", label: "Home" },
    { to: "/bundles", label: "Bundles" },
    { to: "/custom-buy", label: "Custom Buy" },
    { to: "/group-buy", label: "Group Buy" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
            location.pathname === link.to
              ? "bg-gray-100 dark:bg-gray-800 font-semibold"
              : ""
          }`}
        >
          {link.label}
        </NavLink>
      ))}
    </>
  );
};

const Navbar = () => {
  const { isAuthenticated, user, signOut, openAuthModal } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-xl font-semibold">
              <img src="/logo.svg" alt="Khrate Logo" className="mr-2 h-6" />
              Khrate
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <NavLinks />
          </div>

          <div className="flex items-center space-x-4">
            <ModeToggle />
            <CartButton />

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.user_metadata?.avatar_url} />
                      <AvatarFallback>
                        {user?.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      <span>Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" size="sm" onClick={openAuthModal}>
                Sign In
              </Button>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMobileMenu}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>
      
      {/* Secondary Navigation Tabs - Sticky */}
      <div className="bg-white border-b border-gray-200 sticky top-[64px] z-40">
        <div className="container mx-auto">
          <div className="flex items-center justify-center md:justify-start space-x-1 px-4 py-2 overflow-x-auto">
            <NavLinks />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
