
import React from "react";
import AuthButtons from "../AuthButtons";

interface MobileAuthSectionProps {
  isLoggedIn: boolean;
  onOpenAuthModal: () => void;
  onCloseMenu: () => void;
}

const MobileAuthSection = ({ 
  isLoggedIn, 
  onOpenAuthModal, 
  onCloseMenu 
}: MobileAuthSectionProps) => {
  return (
    <AuthButtons 
      isLoggedIn={isLoggedIn} 
      onOpenAuthModal={() => {
        onCloseMenu();
        onOpenAuthModal();
      }}
      layout="mobile"
    />
  );
};

export default MobileAuthSection;
