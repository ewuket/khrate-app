
import React from "react";
import NavLinks from "./NavLinks";
import AuthButtons from "./AuthButtons";

interface MobileMenuProps {
  isOpen: boolean;
  navLinks: Array<{ title: string; path: string }>;
  isLoggedIn: boolean;
  onOpenAuthModal: () => void;
  onCloseMenu: () => void;
}

const MobileMenu = ({ 
  isOpen, 
  navLinks, 
  isLoggedIn, 
  onOpenAuthModal, 
  onCloseMenu 
}: MobileMenuProps) => {
  if (!isOpen) return null;
  
  return (
    <div className="md:hidden border-t">
      <div className="container mx-auto py-4">
        <nav className="flex flex-col space-y-4">
          <NavLinks 
            links={navLinks} 
            onClick={onCloseMenu} 
            className="py-2" 
          />
          
          <AuthButtons 
            isLoggedIn={isLoggedIn} 
            onOpenAuthModal={() => {
              onCloseMenu();
              onOpenAuthModal();
            }}
            layout="mobile"
          />
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
