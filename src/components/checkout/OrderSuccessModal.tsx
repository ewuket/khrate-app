
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Phone, DollarSign, ShoppingBag } from "lucide-react";

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
  const handleClose = () => {
    onOpenChange(false);
  };

  const handleContinueShopping = () => {
    onOpenChange(false);
    // Navigate to home or bundles page
    window.location.href = '/bundles';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <DialogTitle className="text-2xl font-bold text-green-600">
            Order Placed Successfully!
          </DialogTitle>
          <p className="text-gray-600 mt-2">
            Thank you for your order. We'll process it shortly.
          </p>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Order Summary */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Package className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-green-800">Order Summary</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-bold text-green-800 bg-green-100 px-2 py-1 rounded">
                  {orderDetails.orderId}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-bold text-2xl text-green-600">
                  {orderDetails.totalAmount.toLocaleString()} RWF
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Contact Number:</span>
                <span className="font-medium text-gray-800">{orderDetails.phoneNumber}</span>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-gray-600" />
              <h4 className="font-medium text-gray-800">Items Ordered:</h4>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">{item.name}</span>
                    <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                  </div>
                  <span className="text-sm font-bold text-khrate-600">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-800">Payment Instructions</h3>
            </div>
            <div className="text-sm text-blue-700 space-y-2">
              <p>Send payment to: <span className="font-bold text-lg">0795754391</span></p>
              <p>Amount: <span className="font-bold text-lg">{orderDetails.totalAmount.toLocaleString()} RWF</span></p>
              <div className="bg-blue-100 p-2 rounded mt-2">
                <p className="text-xs font-medium">
                  ✅ Your order will be confirmed once payment is received
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Phone className="h-5 w-5 text-yellow-600" />
              <h3 className="font-semibold text-yellow-800">Need Help?</h3>
            </div>
            <p className="text-sm text-yellow-700">
              For any questions about your order, contact us at{" "}
              <span className="font-bold">0795754391</span>
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-4">
            <Button 
              onClick={handleContinueShopping}
              className="w-full bg-khrate-500 hover:bg-khrate-600 text-white py-3 text-lg font-semibold"
            >
              Continue Shopping
            </Button>
            <Button 
              onClick={handleClose}
              variant="outline"
              className="w-full text-gray-600 hover:text-gray-800"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderSuccessModal;
