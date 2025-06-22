
import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface AuthButtonsProps {
  onOpenAuthModal?: () => void;
  layout?: "desktop" | "mobile";
}

const AuthButtons = ({ onOpenAuthModal, layout = "desktop" }: AuthButtonsProps) => {
  const { isAuthenticated, logout, openAuthModal } = useAuth();

  const handleOpenAuth = () => {
    console.log('Auth button clicked, opening modal');
    if (onOpenAuthModal) {
      onOpenAuthModal();
    } else {
      openAuthModal();
    }
  };

  const handleLogout = async () => {
    try {
      console.log('Logging out user...');
      await logout();
      toast.success('Successfully logged out');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };

  if (isAuthenticated && layout === "mobile") {
    return (
      <Button
        onClick={handleLogout}
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

  if (isAuthenticated) {
    return (
      <Button
        onClick={handleLogout}
        variant="ghost"
        className="text-gray-700 hover:text-khrate-500"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
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
