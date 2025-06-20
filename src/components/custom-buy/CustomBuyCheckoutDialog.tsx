
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, CreditCard, Package, Copy, Check, Phone } from "lucide-react";
import { toast } from "sonner";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";
import OrderSuccessModal from "../checkout/OrderSuccessModal";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  category: string;
}

interface CustomBuyCheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onOrderComplete: () => void;
}

const CustomBuyCheckoutDialog = ({ isOpen, onClose, items, total, onOrderComplete }: CustomBuyCheckoutDialogProps) => {
  const { user } = useSupabaseAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [copiedPayment, setCopiedPayment] = useState(false);

  // Form state
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const paymentNumber = "0795754391";

  const timeSlots = [
    { value: "morning", label: "8AM–11AM" },
    { value: "midday", label: "11AM–2PM" },
    { value: "afternoon", label: "2PM–5PM" },
    { value: "evening", label: "5PM–8PM" }
  ];

  const paymentMethods = [
    { value: "mtn", label: "MTN Mobile Money", icon: Phone },
    { value: "card", label: "Credit Card", icon: CreditCard },
    { value: "bank_transfer", label: "Bank Transfer", icon: CreditCard }
  ];

  const handleCopyPaymentNumber = async () => {
    try {
      await navigator.clipboard.writeText(paymentNumber);
      setCopiedPayment(true);
      toast.success("Payment number copied!");
      setTimeout(() => setCopiedPayment(false), 2000);
    } catch (error) {
      toast.error("Failed to copy number");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to place an order");
      return;
    }

    if (!deliveryAddress || !deliveryDate || !timeSlot || !paymentMethod || !phoneNumber) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const orderItems = items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity
      }));

      const { data: orderResult, error } = await supabase
        .from('orders')
        .insert([{
          user_id: user.id,
          items: orderItems,
          total_amount: total,
          original_amount: total,
          delivery_address: deliveryAddress,
          delivery_date: deliveryDate,
          delivery_time_slot: timeSlot,
          payment_method: paymentMethod,
          phone_number: phoneNumber,
          status: 'pending',
          payment_status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      setOrderData({
        id: orderResult.id,
        items: orderItems,
        total_amount: total,
        delivery_address: deliveryAddress,
        delivery_date: deliveryDate,
        delivery_time_slot: timeSlot,
        payment_method: paymentMethod
      });

      onOrderComplete();
      setShowSuccess(true);
      onClose();
      toast.success("Order placed successfully!");
    } catch (error) {
      console.error("Order submission error:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-khrate-800">
              Complete Your Custom Order
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-khrate-500" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{item.name} x{item.quantity} {item.unit}</span>
                    <span className="font-medium text-sm">{(item.price * item.quantity).toLocaleString()} RWF</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total</span>
                  <span className="text-khrate-600">{total.toLocaleString()} RWF</span>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-khrate-500" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">Delivery Address *</Label>
                  <Input
                    id="address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter your full delivery address"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Delivery Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="timeSlot">Time Slot *</Label>
                    <select
                      id="timeSlot"
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select time slot</option>
                      {timeSlots.map(slot => (
                        <option key={slot.value} value={slot.value}>
                          {slot.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-khrate-500" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Payment Method *</Label>
                  <div className="grid grid-cols-1 gap-3 mt-2">
                    {paymentMethods.map(method => {
                      const Icon = method.icon;
                      return (
                        <label
                          key={method.value}
                          className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                            paymentMethod === method.value 
                              ? 'border-khrate-500 bg-khrate-50' 
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <input
                            type="radio"
                            value={method.value}
                            checked={paymentMethod === method.value}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="sr-only"
                          />
                          <Icon className="h-4 w-4 mr-3 text-khrate-600" />
                          <span className="font-medium">{method.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* MTN Payment Instructions */}
                {paymentMethod === 'mtn' && (
                  <Card className="border-2 border-khrate-200 bg-khrate-50">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-khrate-800 mb-2">Pay via MTN Mobile Money</h4>
                      <div className="flex items-center justify-between bg-white p-3 rounded border">
                        <div>
                          <p className="text-sm text-gray-600">Send payment to:</p>
                          <p className="text-lg font-bold text-khrate-800">{paymentNumber}</p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleCopyPaymentNumber}
                          className="border-khrate-300 hover:bg-khrate-100"
                        >
                          {copiedPayment ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div>
                  <Label htmlFor="phone">Phone Number Used for Payment *</Label>
                  <Input
                    id="phone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter phone number used for payment"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-khrate-500 hover:bg-khrate-600 text-white py-3 text-lg font-semibold"
            >
              {isLoading ? "Placing Order..." : "Place Order"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <OrderSuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        orderData={orderData}
      />
    </>
  );
};

export default CustomBuyCheckoutDialog;
