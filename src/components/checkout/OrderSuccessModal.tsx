
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Phone, DollarSign, ShoppingBag, Gift } from "lucide-react";

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
    // Navigate to bundles page
    window.location.href = '/bundles';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="text-center">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <DialogTitle className="text-2xl font-bold text-green-600 mb-2">
            Thank you for using Khrate!
          </DialogTitle>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-green-800 font-semibold text-lg">
              🎉 Order Placed Successfully!
            </p>
            <p className="text-green-700 text-sm mt-1">
              Your order has been confirmed and will be processed shortly.
            </p>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Order Summary Card */}
          <div className="bg-gradient-to-r from-khrate-50 to-orange-50 border border-khrate-200 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-khrate-600" />
              <h3 className="font-bold text-khrate-800 text-lg">Order Summary</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white rounded-md shadow-sm">
                <span className="text-gray-600 font-medium">Order ID:</span>
                <span className="font-bold text-khrate-800 bg-khrate-100 px-3 py-1 rounded-full text-sm">
                  {orderDetails.orderId}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-md shadow-sm">
                <span className="text-gray-600 font-medium">Total Amount:</span>
                <span className="font-bold text-2xl text-green-600">
                  {orderDetails.totalAmount.toLocaleString()} RWF
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-md shadow-sm">
                <span className="text-gray-600 font-medium">Contact Number:</span>
                <span className="font-medium text-gray-800">{orderDetails.phoneNumber}</span>
              </div>
            </div>
          </div>

          {/* Items Ordered */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-gray-600" />
              <h4 className="font-bold text-gray-800">Items Ordered:</h4>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">{item.name}</span>
                    <span className="text-sm text-gray-600">Quantity: {item.quantity}</span>
                  </div>
                  <span className="text-sm font-bold text-khrate-600">
                    {(item.price * item.quantity).toLocaleString()} RWF
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <h3 className="font-bold text-blue-800">Payment Instructions</h3>
            </div>
            <div className="text-sm text-blue-700 space-y-2">
              <p>📱 Send payment to: <span className="font-bold text-lg text-blue-800">0795754391</span></p>
              <p>💰 Amount: <span className="font-bold text-lg text-blue-800">{orderDetails.totalAmount.toLocaleString()} RWF</span></p>
              <div className="bg-blue-100 p-3 rounded-lg mt-3">
                <p className="text-xs font-medium text-blue-800">
                  ✅ Your order will be confirmed once payment is received
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  💡 Please include your Order ID ({orderDetails.orderId}) when making payment
                </p>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Phone className="h-5 w-5 text-yellow-600" />
              <h3 className="font-bold text-yellow-800">Need Help?</h3>
            </div>
            <p className="text-sm text-yellow-700">
              For any questions about your order, contact us at{" "}
              <span className="font-bold text-yellow-800">0795754391</span>
            </p>
            <p className="text-xs text-yellow-600 mt-1">
              Our team is available to assist you with your order and delivery.
            </p>
          </div>

          {/* Thank You Message */}
          <div className="bg-gradient-to-r from-green-50 to-khrate-50 border border-green-200 rounded-lg p-4 text-center">
            <Gift className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="font-bold text-green-800 text-lg">Thank You for Choosing Khrate!</p>
            <p className="text-sm text-green-700 mt-1">
              We appreciate your business and look forward to serving you again.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button 
              onClick={handleContinueShopping}
              className="w-full bg-khrate-500 hover:bg-khrate-600 text-white py-3 text-lg font-semibold shadow-lg"
            >
              Continue Shopping
            </Button>
            <Button 
              onClick={handleClose}
              variant="outline"
              className="w-full text-gray-600 hover:text-gray-800 border-gray-300"
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
