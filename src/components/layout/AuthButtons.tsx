
import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface AuthButtonsProps {
  onOpenAuthModal?: () => void;
  layout?: "desktop" | "mobile";
}

const AuthButtons = ({ onOpenAuthModal, layout = "desktop" }: AuthButtonsProps) => {
  const { isAuthenticated, signOut, openAuthModal } = useAuth();

  const handleOpenAuth = onOpenAuthModal || openAuthModal;

  if (isAuthenticated && layout === "mobile") {
    return (
      <Button
        onClick={signOut}
        variant="ghost"
        className="flex justify-start text-red-500"
      >
        <LogOut className="h-5 w-5 mr-2" />
        <span>Logout</span>
      </Button>
    );
  }
  
  if (layout === "mobile") {
    return (
      <div className="flex flex-col space-y-2 pt-4 border-t">
        <Button 
          variant="ghost" 
          onClick={handleOpenAuth}
        >
          Login
        </Button>
        <Button 
          onClick={handleOpenAuth}
          className="bg-khrate-500 hover:bg-khrate-600"
        >
          Sign Up & Save 10%
        </Button>
      </div>
    );
  }
  
  return (
    <>
      <Button 
        variant="ghost" 
        onClick={handleOpenAuth}
        className="text-gray-700 hover:text-khrate-500"
      >
        Login
      </Button>
      <Button 
        onClick={handleOpenAuth}
        className="bg-khrate-500 hover:bg-khrate-600"
      >
        Sign Up & Save 10%
      </Button>
    </>
  );
};

export default AuthButtons;
