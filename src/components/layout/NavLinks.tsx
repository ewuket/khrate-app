
import React from "react";
import { Link, useLocation } from "react-router-dom";

interface NavLink {
  title: string;
  path: string;
}

interface NavLinksProps {
  links: NavLink[];
  onClick?: () => void;
  className?: string;
}

const NavLinks = ({ links, onClick, className = "" }: NavLinksProps) => {
  const location = useLocation();
  
  return (
    <>
      {links.map((link) => (
        <Link 
          key={link.path} 
          to={link.path}
          className={`text-gray-700 hover:text-khrate-500 transition-colors ${
            location.pathname === link.path ? "text-khrate-500 font-medium" : ""
          } ${className}`}
          onClick={onClick}
        >
          {link.title}
        </Link>
      ))}
    </>
  );
};

export default NavLinks;
