
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus, ShoppingCart } from "lucide-react";

interface GuestCheckoutOptionProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: () => void;
  onGuestCheckout: () => void;
}

const GuestCheckoutOption: React.FC<GuestCheckoutOptionProps> = ({
  isOpen,
  onClose,
  onSignIn,
  onGuestCheckout
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose Checkout Option</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <div className="text-center text-gray-600 mb-6">
            You can either sign in for a personalized experience or continue as a guest.
          </div>
          
          <Button 
            onClick={onSignIn}
            className="w-full bg-khrate-500 hover:bg-khrate-600 text-white"
            size="lg"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            Sign In & Checkout
          </Button>
          
          <Button 
            onClick={onGuestCheckout}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Continue as Guest
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GuestCheckoutOption;
