
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserX, ShoppingCart } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface GuestCheckoutOptionProps {
  open: boolean;
  onClose: () => void;
  onSignIn: () => void;
  onGuestCheckout: () => void;
}

const GuestCheckoutOption = ({ open, onClose, onSignIn, onGuestCheckout }: GuestCheckoutOptionProps) => {
  console.log('GuestCheckoutOption rendered');
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose checkout option</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserX className="h-5 w-5" />
                Continue as Guest
              </CardTitle>
              <CardDescription>
                Checkout without creating an account. You can still track your order via email.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => {
                  console.log('Continue as guest clicked');
                  onGuestCheckout();
                }}
                className="w-full bg-khrate-500 hover:bg-khrate-600"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Continue as Guest
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Create Account for More Benefits</CardTitle>
              <CardDescription>
                Get exclusive discounts, order history, group buying access, and faster checkout.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground mb-4 space-y-1">
                <li>• 10% discount on your first 3 orders</li>
                <li>• Join group buying sessions for bulk discounts</li>
                <li>• Track all your orders in one place</li>
                <li>• Save delivery addresses</li>
              </ul>
              <Button 
                onClick={() => {
                  console.log('Create account clicked');
                  onSignIn();
                }}
                variant="outline"
                className="w-full"
              >
                Create Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GuestCheckoutOption;
