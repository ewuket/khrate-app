
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface AuthButtonsProps {
  isLoggedIn?: boolean;
  onOpenAuthModal: () => void;
  layout?: "desktop" | "mobile";
}

const AuthButtons = ({ onOpenAuthModal, layout = "desktop" }: AuthButtonsProps) => {
  const { isAuthenticated, user, logout } = useAuth();

  if (isAuthenticated && user) {
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
        {layout === "mobile" && (
          <Button
            onClick={logout}
            variant="ghost"
            className="flex justify-start text-red-500"
          >
            <LogOut className="h-5 w-5 mr-2" />
            <span>Logout</span>
          </Button>
        )}
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
