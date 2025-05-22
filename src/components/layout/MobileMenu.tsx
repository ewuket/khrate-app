
import React from "react";
import MobileNavLinks from "./mobile/MobileNavLinks";
import MobileAuthSection from "./mobile/MobileAuthSection";
import MobileMenuContainer from "./mobile/MobileMenuContainer";

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
    <MobileMenuContainer>
      <MobileNavLinks 
        links={navLinks} 
        onCloseMenu={onCloseMenu} 
      />
      
      <MobileAuthSection 
        isLoggedIn={isLoggedIn} 
        onOpenAuthModal={onOpenAuthModal} 
        onCloseMenu={onCloseMenu} 
      />
    </MobileMenuContainer>
  );
};

export default MobileMenu;
