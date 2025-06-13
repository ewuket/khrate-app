
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const handleContinue = () => {
    onOpenChange(false);
    navigate('/');
  };

  const handleViewOrders = () => {
    onOpenChange(false);
    navigate('/orders');
  };

  // Calculate the correct total from items
  const calculatedTotal = orderDetails.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <DialogTitle className="text-xl font-semibold text-green-600">
            Order Successfully Placed!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="text-center bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Order ID: #{orderDetails.orderId}</p>
            <p className="text-2xl font-bold text-green-700">
              {formatPrice(calculatedTotal)} RWF
            </p>
            <p className="text-sm text-gray-600 mt-1">Phone: {orderDetails.phoneNumber}</p>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3 text-center">Order Summary:</h4>
            <div className="space-y-2 text-sm">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-1">
                  <span className="text-gray-700">{item.name} × {item.quantity}</span>
                  <span className="font-medium">{formatPrice(item.price * item.quantity)} RWF</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-md text-center">
            <p className="text-sm text-blue-800 font-medium mb-1">
              🎉 Thank you for your order!
            </p>
            <p className="text-sm text-blue-700">
              We'll contact you shortly to confirm your delivery details and arrange payment.
            </p>
          </div>
        </div>
        
        <div className="flex gap-2 pt-4">
          <Button 
            onClick={handleViewOrders}
            variant="outline"
            className="flex-1"
          >
            View Orders
          </Button>
          <Button 
            onClick={handleContinue}
            className="bg-khrate-500 hover:bg-khrate-600 flex-1"
          >
            Continue Shopping
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderSuccessModal;
