
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { User } from "lucide-react";

interface AuthButtonsProps {
  isLoggedIn: boolean;
  onOpenAuthModal: () => void;
  layout?: "desktop" | "mobile";
}

const AuthButtons = ({ isLoggedIn, onOpenAuthModal, layout = "desktop" }: AuthButtonsProps) => {
  if (isLoggedIn) {
    return (
      <>
        <Link to="/orders" className="text-gray-700 hover:text-khrate-500">
          <span className="font-medium">My Orders</span>
        </Link>
        <Link 
          to="/profile" 
          className="text-gray-700 hover:text-khrate-500"
        >
          <User className="h-5 w-5" />
        </Link>
      </>
    );
  }
  
  if (layout === "mobile") {
    return (
      <div className="flex flex-col space-y-2 pt-4 border-t">
        <Button 
          variant="ghost" 
          onClick={onOpenAuthModal}
        >
          Login
        </Button>
        <Button 
          onClick={onOpenAuthModal}
          className="bg-khrate-500 hover:bg-khrate-600"
        >
          Sign Up
        </Button>
      </div>
    );
  }
  
  return (
    <>
      <Button 
        variant="ghost" 
        onClick={onOpenAuthModal}
        className="text-gray-700 hover:text-khrate-500"
      >
        Login
      </Button>
      <Button 
        onClick={onOpenAuthModal}
        className="bg-khrate-500 hover:bg-khrate-600"
      >
        Sign Up
      </Button>
    </>
  );
};

export default AuthButtons;
