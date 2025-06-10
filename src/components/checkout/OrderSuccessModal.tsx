
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
  const handleClose = () => {
    onOpenChange(false);
    // Redirect to home or order history
    window.location.href = '/';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900">
            🎉 Order placed successfully!
          </DialogTitle>
          <p className="text-gray-600 mt-2">Thank you for shopping with Khrate.</p>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-gray-600 mb-2">Order ID: {orderDetails.orderId}</p>
            <div className="text-2xl font-bold text-khrate-600">
              Total: {formatPrice(orderDetails.totalAmount)}
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-2">Order Summary:</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-700">{item.name} x{item.quantity}</span>
                  <span className="text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
            <p className="font-medium text-green-800">✅ Order Confirmed</p>
            <p>You will receive a confirmation email shortly.</p>
            <p>Your order will be delivered as scheduled.</p>
          </div>
          
          <Button
            onClick={handleClose}
            className="w-full bg-khrate-500 hover:bg-khrate-600 text-white"
          >
            Continue Shopping
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderSuccessModal;
