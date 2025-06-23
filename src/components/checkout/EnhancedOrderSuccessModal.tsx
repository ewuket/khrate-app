
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Package, MapPin, Calendar, CreditCard } from "lucide-react";

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: {
    id: string;
    total_amount: number;
    items: any[];
    delivery_address: string;
    delivery_date: string;
    delivery_time_slot: string;
    payment_method: string;
  } | null;
}

const EnhancedOrderSuccessModal = ({ isOpen, onClose, orderData }: OrderSuccessModalProps) => {
  if (!orderData) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatTimeSlot = (slot: string) => {
    const timeSlots: Record<string, string> = {
      'morning': '8:00 AM - 11:00 AM',
      'midday': '11:00 AM - 2:00 PM',
      'afternoon': '2:00 PM - 5:00 PM',
      'evening': '5:00 PM - 8:00 PM'
    };
    return timeSlots[slot] || slot;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <div className="text-center space-y-6 py-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-green-600">Order Placed Successfully!</h2>
            <p className="text-gray-600">Thank you for your order. We'll prepare it with care.</p>
          </div>

          {/* Order Details Card */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6 space-y-4">
              {/* Order ID */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Order ID:</span>
                <span className="text-sm font-bold text-green-600">#{orderData.id.slice(0, 8).toUpperCase()}</span>
              </div>

              {/* Total Amount */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Total Paid:</span>
                <span className="text-lg font-bold text-green-600">{formatCurrency(orderData.total_amount)}</span>
              </div>

              {/* Items Count */}
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Package className="w-4 h-4" />
                <span>{orderData.items.length} item{orderData.items.length !== 1 ? 's' : ''} ordered</span>
              </div>

              {/* Delivery Address */}
              <div className="flex items-start gap-2 text-sm text-gray-700">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="break-words">{orderData.delivery_address}</span>
              </div>

              {/* Delivery Schedule */}
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Calendar className="w-4 h-4" />
                <span>{new Date(orderData.delivery_date).toLocaleDateString()} at {formatTimeSlot(orderData.delivery_time_slot)}</span>
              </div>

              {/* Payment Method */}
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CreditCard className="w-4 h-4" />
                <span className="capitalize">{orderData.payment_method.replace('_', ' ')}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Instructions */}
          {orderData.payment_method === 'momo' && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Payment Instructions</h3>
                <p className="text-sm text-blue-700">
                  Please send <span className="font-bold">{formatCurrency(orderData.total_amount)}</span> to: <span className="font-bold">0795754391</span>
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Your order will be confirmed once we receive your payment.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            <Button 
              onClick={onClose}
              className="bg-khrate-500 hover:bg-khrate-600 text-white px-8"
            >
              Continue Shopping
            </Button>
          </div>

          {/* Footer Message */}
          <p className="text-xs text-gray-500">
            You will receive updates about your order via phone and email.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedOrderSuccessModal;
