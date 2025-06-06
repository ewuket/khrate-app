
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Clock, MapPin } from "lucide-react";

interface OrderSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderDetails: {
    orderNumber: string;
    total: number;
    deliveryDate?: string;
    deliveryTimeSlot?: string;
  };
  formatPrice: (price: number) => string;
}

const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  open,
  onOpenChange,
  orderDetails,
  formatPrice
}) => {
  const handleContinueShopping = () => {
    onOpenChange(false);
    window.location.href = '/';
  };

  const handleViewOrders = () => {
    onOpenChange(false);
    window.location.href = '/orders';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle className="text-xl font-semibold">Order Confirmed!</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Thank you for your order! We've received your payment and will process your delivery soon.
            </p>
          </div>

          <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium">Order Number:</span>
              <span className="text-khrate-600 font-mono">{orderDetails.orderNumber}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-medium">Total Amount:</span>
              <span className="text-lg font-bold text-khrate-600">
                {formatPrice(orderDetails.total)}
              </span>
            </div>

            {orderDetails.deliveryDate && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  Delivery: {new Date(orderDetails.deliveryDate).toLocaleDateString()}
                  {orderDetails.deliveryTimeSlot && ` at ${orderDetails.deliveryTimeSlot}`}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                We'll deliver to your specified address
              </span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800">What's Next?</span>
            </div>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• You'll receive SMS confirmation shortly</li>
              <li>• Track your order in the Orders section</li>
              <li>• Our team will contact you before delivery</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-4">
          <Button 
            onClick={handleViewOrders}
            className="w-full bg-khrate-500 hover:bg-khrate-600"
          >
            View My Orders
          </Button>
          <Button 
            variant="outline" 
            onClick={handleContinueShopping}
            className="w-full"
          >
            Continue Shopping
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderSuccessModal;
