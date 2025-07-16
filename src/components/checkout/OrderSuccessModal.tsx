
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Copy, Check, Package, Calendar, MapPin, CreditCard, Heart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: {
    id: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    total_amount: number;
    delivery_address: string;
    delivery_date: string;
    delivery_time_slot: string;
    payment_method: string;
  } | null;
}

const OrderSuccessModal = ({ isOpen, onClose, orderData }: OrderSuccessModalProps) => {
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  if (!orderData) {
    return null;
  }

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} RWF`;
  };

  const copyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(orderData.id);
      setCopiedOrderId(true);
      toast.success("Order ID copied!");
      setTimeout(() => setCopiedOrderId(false), 2000);
    } catch (error) {
      toast.error("Failed to copy order ID");
    }
  };

  const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
      case 'mtn':
        return 'MTN Mobile Money';
      case 'card':
        return 'Credit/Debit Card';
      case 'bank_transfer':
        return 'Bank Transfer';
      default:
        return method;
    }
  };

  const formatTimeSlot = (slot: string) => {
    const timeSlots: { [key: string]: string } = {
      morning: "8AM–11AM",
      midday: "11AM–2PM", 
      afternoon: "2PM–5PM",
      evening: "5PM–8PM"
    };
    return timeSlots[slot] || slot;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <DialogTitle className="text-2xl font-bold text-green-800">
            Order Placed Successfully! 🎉
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Thank You Message */}
          <Card className="border-2 border-green-200 bg-green-50">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Heart className="h-5 w-5 text-green-600" />
                <h3 className="font-bold text-lg text-green-800">
                  Thank you for using CRED! 💚
                </h3>
                <Heart className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-green-700 text-sm">
                We're preparing your order and will notify you once it's on the way.
              </p>
            </CardContent>
          </Card>

          {/* Order Amount */}
          <Card className="border-2 border-khrate-200 bg-khrate-50">
            <CardContent className="p-4 text-center">
              <h3 className="font-semibold text-khrate-900 mb-2">Order Total</h3>
              <div className="text-3xl font-bold text-khrate-600">
                {formatPrice(orderData.total_amount)}
              </div>
            </CardContent>
          </Card>

          {/* Order ID */}
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 mb-2">Your Order ID</h3>
                <div className="flex items-center justify-center gap-2">
                  <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded border">
                    {orderData.id}
                  </code>
                  <Button
                    onClick={copyOrderId}
                    variant="outline"
                    size="sm"
                    className="h-7 px-2"
                  >
                    {copiedOrderId ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Keep this ID for tracking your order
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
                <Package className="h-4 w-4" />
                Order Items
              </h3>
              <div className="space-y-2">
                {orderData.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Delivery Info */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Address:</span>
              </div>
              <p className="text-sm text-gray-700 ml-6">{orderData.delivery_address}</p>
              
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>
                  {new Date(orderData.delivery_date).toLocaleDateString()} • {formatTimeSlot(orderData.delivery_time_slot)}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="h-4 w-4 text-gray-500" />
                <span>{getPaymentMethodDisplay(orderData.payment_method)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center pt-4">
          <Button 
            onClick={onClose}
            className="bg-khrate-500 hover:bg-khrate-600 px-8"
          >
            Continue Shopping
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderSuccessModal;
