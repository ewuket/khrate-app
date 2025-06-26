
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Package, Calendar, MapPin, CreditCard, Phone, Copy } from "lucide-react";
import { toast } from "sonner";

interface EnhancedOrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: any;
}

const EnhancedOrderSuccessModal: React.FC<EnhancedOrderSuccessModalProps> = ({
  isOpen,
  onClose,
  orderData
}) => {
  if (!orderData) return null;

  const copyTransactionId = () => {
    navigator.clipboard.writeText(orderData.transactionId);
    toast.success("Transaction ID copied to clipboard!");
  };

  const formatTimeSlot = (slot: string) => {
    const slots = {
      'morning': '8AM–11AM',
      'midday': '11AM–2PM', 
      'afternoon': '2PM–5PM',
      'evening': '5PM–8PM'
    };
    return slots[slot] || slot;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-green-50 to-white border-2 border-green-200">
        <div className="text-center space-y-6 p-6">
          {/* Success Header */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-green-800 mb-2">
                Order Placed Successfully!
              </h2>
              <p className="text-green-700">
                Thank you for your order. We'll prepare your fresh items for delivery.
              </p>
            </div>
          </div>

          {/* Order Details Card */}
          <Card className="border-2 border-green-200 bg-white/80">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <span className="font-semibold text-gray-700">Order ID:</span>
                <span className="font-mono text-sm bg-gray-100 px-3 py-1 rounded">
                  #{orderData.id?.slice(0, 8)}
                </span>
              </div>

              <div className="flex items-center justify-between border-b pb-4">
                <span className="font-semibold text-gray-700">Transaction ID:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm bg-khrate-100 px-3 py-1 rounded text-khrate-700">
                    {orderData.transactionId}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyTransactionId}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between border-b pb-4">
                <span className="font-semibold text-gray-700 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Total Amount:
                </span>
                <span className="text-2xl font-bold text-khrate-600">
                  {orderData.total_amount?.toLocaleString()} RWF
                </span>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                  <div>
                    <span className="font-semibold text-gray-700">Delivery Address:</span>
                    <p className="text-gray-600 text-sm">{orderData.delivery_address}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="font-semibold text-gray-700">Delivery Schedule:</span>
                    <p className="text-gray-600 text-sm">
                      {new Date(orderData.delivery_date).toLocaleDateString()} at {formatTimeSlot(orderData.delivery_time_slot)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="font-semibold text-gray-700">Payment Method:</span>
                    <p className="text-gray-600 text-sm capitalize">{orderData.payment_method}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="font-semibold text-gray-700">Contact Number:</span>
                    <p className="text-gray-600 text-sm">{orderData.phone_number}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items Summary */}
          <Card className="border-2 border-green-200 bg-white/80">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Package className="h-4 w-4" />
                Items Ordered ({orderData.items?.length || 0})
              </h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {orderData.items?.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                      {item.name} x{item.quantity} {item.unit}
                    </span>
                    <span className="font-medium text-khrate-600">
                      {item.total?.toLocaleString()} RWF
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">What happens next?</h3>
            <ul className="text-sm text-blue-700 space-y-1 text-left">
              <li>• We'll confirm your order and prepare your items</li>
              <li>• You'll receive updates about your delivery status</li>
              <li>• Our delivery team will contact you before delivery</li>
              <li>• Keep your transaction ID for reference</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={onClose}
              className="flex-1 bg-khrate-500 hover:bg-khrate-600 text-white"
            >
              Continue Shopping
            </Button>
            <Button
              onClick={() => window.location.href = '/orders'}
              variant="outline"
              className="flex-1 border-khrate-300 text-khrate-700 hover:bg-khrate-50"
            >
              View My Orders
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedOrderSuccessModal;
