
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, ShoppingBag, FileText } from "lucide-react";
import { Link } from "react-router-dom";

interface OrderSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderDetails?: {
    orderNumber?: string;
    total: number;
    deliveryDate?: string;
    deliveryTimeSlot?: string;
  };
  formatPrice: (price: number) => string;
}

const OrderSuccessModal = ({ 
  open, 
  onOpenChange, 
  orderDetails,
  formatPrice 
}: OrderSuccessModalProps) => {
  const handleContinueShopping = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center text-center space-y-6 py-4">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          {/* Success Message */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Order Placed Successfully!
            </h2>
            <p className="text-gray-600">
              Thank you for your order. We've received your request and will process it soon.
            </p>
          </div>

          {/* Order Details */}
          {orderDetails && (
            <div className="w-full bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Order Total:</span>
                <span className="font-bold text-lg text-khrate-600">
                  {formatPrice(orderDetails.total)}
                </span>
              </div>
              
              {orderDetails.orderNumber && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-mono text-sm font-medium">
                    #{orderDetails.orderNumber}
                  </span>
                </div>
              )}

              {orderDetails.deliveryDate && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Delivery Date:</span>
                  <span className="font-medium">
                    {orderDetails.deliveryDate}
                    {orderDetails.deliveryTimeSlot && ` (${orderDetails.deliveryTimeSlot})`}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Next Steps */}
          <div className="w-full bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">What's Next?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• You'll receive a confirmation email shortly</li>
              <li>• We'll notify you when your order is being prepared</li>
              <li>• Track your delivery status in your profile</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
            <Button
              variant="outline"
              onClick={handleContinueShopping}
              className="flex-1 flex items-center justify-center"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
            
            <Button
              asChild
              className="flex-1 bg-khrate-500 hover:bg-khrate-600"
            >
              <Link to="/profile" className="flex items-center justify-center">
                <FileText className="w-4 h-4 mr-2" />
                View Orders
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderSuccessModal;
