
import React from "react";
import NavLinks from "../NavLinks";

interface MobileNavLinksProps {
  links: Array<{ title: string; path: string }>;
  onCloseMenu: () => void;
}

const MobileNavLinks = ({ links, onCloseMenu }: MobileNavLinksProps) => {
  return (
    <NavLinks 
      links={links} 
      onClick={onCloseMenu} 
      className="py-2" 
    />
  );
};

export default MobileNavLinks;
