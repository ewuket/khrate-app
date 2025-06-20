
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Copy, Check, Package, Calendar, MapPin, CreditCard } from "lucide-react";
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
  };
}

const OrderSuccessModal = ({ isOpen, onClose, orderData }: OrderSuccessModalProps) => {
  const [copiedOrderId, setCopiedOrderId] = useState(false);

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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <DialogTitle className="text-2xl font-bold text-green-800">
            Order Placed Successfully! 🎉
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Order ID Section */}
          <Card className="border-2 border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="font-semibold text-green-900 mb-2">Your Order ID</h3>
                <div className="flex items-center justify-center gap-2">
                  <code className="text-lg font-mono bg-white px-3 py-1 rounded border">
                    {orderData.id}
                  </code>
                  <Button
                    onClick={copyOrderId}
                    variant="outline"
                    size="sm"
                    className="h-8 px-2 border-green-300 hover:bg-green-100"
                  >
                    {copiedOrderId ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-sm text-green-700 mt-2">
                  Keep this ID for tracking your order
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Order Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Package className="h-5 w-5 text-khrate-500" />
              Order Details
            </h3>
            
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {orderData.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{item.name} x{item.quantity}</span>
                      <span className="font-medium text-sm">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total Amount</span>
                    <span className="text-khrate-600">{formatPrice(orderData.total_amount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Delivery Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-khrate-500" />
              Delivery Information
            </h3>
            
            <Card>
              <CardContent className="p-4 space-y-3">
                <div>
                  <span className="font-medium text-sm text-gray-600">Address:</span>
                  <p className="text-sm mt-1">{orderData.delivery_address}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    {new Date(orderData.delivery_date).toLocaleDateString()} • {formatTimeSlot(orderData.delivery_time_slot)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Method */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-khrate-500" />
              Payment Method
            </h3>
            
            <Card>
              <CardContent className="p-4">
                <span className="text-sm font-medium">{getPaymentMethodDisplay(orderData.payment_method)}</span>
              </CardContent>
            </Card>
          </div>

          {/* Thank You Message */}
          <Card className="border-2 border-khrate-200 bg-khrate-50">
            <CardContent className="p-6 text-center">
              <h3 className="font-bold text-xl text-khrate-800 mb-2">
                Thank you for using Khrate! 💚
              </h3>
              <p className="text-khrate-700">
                We're preparing your order and will notify you once it's on the way.
              </p>
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
