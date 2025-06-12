
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface OrderSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderDetails: {
    orderId: string;
    totalAmount: number;
    phoneNumber: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
  };
  formatPrice: (price: number) => string;
}

const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  open,
  onOpenChange,
  orderDetails,
  formatPrice
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <DialogTitle className="text-xl font-semibold text-green-600">
            Order Placed Successfully!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Order ID: #{orderDetails.orderId}</p>
            <p className="text-sm text-gray-600">Phone: {orderDetails.phoneNumber}</p>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Order Summary:</h4>
            <div className="space-y-1 text-sm">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.name} x {item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t mt-2 pt-2 flex justify-between font-semibold">
              <span>Total:</span>
              <span>{formatPrice(orderDetails.totalAmount)}</span>
            </div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-md text-center">
            <p className="text-sm text-blue-800">
              We'll contact you shortly to confirm your delivery details.
            </p>
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button 
            onClick={() => onOpenChange(false)}
            className="bg-khrate-500 hover:bg-khrate-600"
          >
            Continue Shopping
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderSuccessModal;
