
import React from "react";

interface MobileMenuContainerProps {
  children: React.ReactNode;
}

const MobileMenuContainer = ({ children }: MobileMenuContainerProps) => {
  return (
    <div className="md:hidden border-t">
      <div className="container mx-auto py-4">
        <nav className="flex flex-col space-y-4">
          {children}
        </nav>
      </div>
    </div>
  );
};

export default MobileMenuContainer;
