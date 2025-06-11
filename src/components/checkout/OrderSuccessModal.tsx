
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
    phoneNumber?: string;
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
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
            🎉 Order Placed Successfully!
          </DialogTitle>
          <p className="text-gray-600 text-lg">Thank you for shopping with KHRATE!</p>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-gray-700 mb-2 font-medium">Order ID</p>
            <p className="text-lg font-bold text-green-700">{orderDetails.orderId}</p>
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-2">Total Amount</p>
            <div className="text-3xl font-bold text-khrate-600">
              {formatPrice(orderDetails.totalAmount)}
            </div>
            {orderDetails.phoneNumber && (
              <p className="text-sm text-gray-600 mt-2">
                Payment Number: {orderDetails.phoneNumber}
              </p>
            )}
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-900 mb-3 text-center">Order Summary</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto bg-gray-50 p-3 rounded-lg">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-700">{item.name} x{item.quantity}</span>
                  <span className="text-gray-900 font-medium">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center text-sm bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <p className="font-semibold text-green-800">Order Confirmed!</p>
            </div>
            <p className="text-green-700 mb-1">✅ You will receive a confirmation email shortly</p>
            <p className="text-green-700">📦 Your order will be delivered as scheduled</p>
          </div>
          
          <Button
            onClick={handleClose}
            className="w-full bg-khrate-500 hover:bg-khrate-600 text-white py-3 text-lg font-medium"
            size="lg"
          >
            Continue Shopping
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderSuccessModal;
