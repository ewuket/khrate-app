
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, CreditCard, Package } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import OrderSuccessModal from "../checkout/OrderSuccessModal";
import PaymentMethodSelector from "./PaymentMethodSelector";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  unit: string;
}

interface CustomBuyCheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartItem[];
  getCartTotal: () => number;
  clearCart: () => void;
}

const CustomBuyCheckoutDialog = ({ 
  open, 
  onOpenChange, 
  cart, 
  getCartTotal, 
  clearCart 
}: CustomBuyCheckoutDialogProps) => {
  const { isAuthenticated, user, openAuthModal } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderData, setOrderData] = useState(null);

  // Form state
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const timeSlots = [
    { value: "morning", label: "8AM–11AM" },
    { value: "midday", label: "11AM–2PM" },
    { value: "afternoon", label: "2PM–5PM" },
    { value: "evening", label: "5PM–8PM" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      console.log('User not authenticated, opening auth modal');
      openAuthModal();
      toast.error("Please log in to place an order");
      return;
    }

    if (!deliveryAddress || !deliveryDate || !timeSlot || !paymentMethod || !phoneNumber) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const orderItems = cart.map(item => ({
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
          total_amount: getCartTotal(),
          original_amount: getCartTotal(),
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
        total_amount: getCartTotal(),
        delivery_address: deliveryAddress,
        delivery_date: deliveryDate,
        delivery_time_slot: timeSlot,
        payment_method: paymentMethod
      });

      clearCart();
      setShowSuccess(true);
      onOpenChange(false);
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
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto bg-white">
          <DialogHeader className="text-center border-b pb-4 mb-4">
            <DialogTitle className="text-2xl font-bold text-khrate-600">
              Complete Your Custom Order
            </DialogTitle>
            <p className="text-gray-600 text-sm">Just a few details to get your items delivered</p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Order Summary - Compact */}
            <Card className="border border-khrate-200">
              <CardHeader className="bg-khrate-50 py-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="max-h-32 overflow-y-auto space-y-2">
                  {cart.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm py-1">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-500 ml-2">x{item.quantity} {item.unit}</span>
                      </div>
                      <span className="font-semibold text-khrate-600">
                        {(item.price * item.quantity).toLocaleString()} RWF
                      </span>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex justify-between items-center font-bold">
                  <span>Total</span>
                  <span className="text-lg text-khrate-600">
                    {getCartTotal().toLocaleString()} RWF
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information - Compact */}
            <Card className="border border-khrate-200">
              <CardHeader className="bg-khrate-50 py-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div>
                  <Label htmlFor="address" className="text-sm font-medium">
                    Delivery Address *
                  </Label>
                  <Input
                    id="address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter your full delivery address"
                    className="mt-1 h-10"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="date" className="text-sm font-medium">
                      Delivery Date *
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="mt-1 h-10"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="timeSlot" className="text-sm font-medium">
                      Time Slot *
                    </Label>
                    <select
                      id="timeSlot"
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full mt-1 p-2 h-10 border border-gray-300 rounded-md focus:border-khrate-500 focus:outline-none text-sm"
                      required
                    >
                      <option value="">Select time</option>
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

            {/* Payment Information - Compact */}
            <Card className="border border-khrate-200">
              <CardHeader className="bg-khrate-50 py-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <PaymentMethodSelector
                  selectedMethod={paymentMethod}
                  onMethodChange={setPaymentMethod}
                  phoneNumber={phoneNumber}
                  onPhoneNumberChange={setPhoneNumber}
                  onShowPaymentInstructions={() => {}}
                  phoneNumberLabel="Phone Number for Payment"
                />
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-khrate-500 hover:bg-khrate-600 text-white py-3 text-base font-semibold"
                size="lg"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Placing Order...
                  </div>
                ) : (
                  `Place Order - ${getCartTotal().toLocaleString()} RWF`
                )}
              </Button>
            </div>
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
