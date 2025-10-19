
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, CreditCard, Package } from "lucide-react";
import { toast } from "sonner";
import { useCartContext } from "@/contexts/CartContext";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";
import OrderSuccessModal from "./OrderSuccessModal";
import PaymentMethodSelector from "@/components/custom-buy/PaymentMethodSelector";
import DeliveryEstimator from "@/components/delivery/DeliveryEstimator";

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckoutDialog = ({ isOpen, onClose }: CheckoutDialogProps) => {
  const { cart, getCartTotal, clearCart } = useCartContext();
  const { user } = useSupabaseAuth();
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
      const orderItems = cart.map(item => ({
        name: item.product_name,
        quantity: item.quantity,
        price: item.product_price,
        total: item.product_price * item.quantity
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
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white via-khrate-50/30 to-white">
          <DialogHeader className="text-center border-b pb-6 mb-6">
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-khrate-600 to-khrate-800 bg-clip-text text-transparent">
              Complete Your Order
            </DialogTitle>
            <p className="text-gray-600 mt-2">Just a few more details to get your items delivered</p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Order Summary */}
            <Card className="border-2 border-khrate-100 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-khrate-500 to-khrate-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Package className="h-6 w-6" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="max-h-40 overflow-y-auto space-y-3">
                  {cart.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex-1">
                        <span className="font-medium text-gray-800">{item.product_name}</span>
                        <span className="text-sm text-gray-500 ml-2">x{item.quantity}</span>
                      </div>
                      <span className="font-bold text-khrate-600">
                        {(item.product_price * item.quantity).toLocaleString()} RWF
                      </span>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-800">Total</span>
                  <span className="text-2xl font-bold text-khrate-600">
                    {getCartTotal().toLocaleString()} RWF
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card className="border-2 border-khrate-100 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-khrate-500 to-khrate-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <MapPin className="h-6 w-6" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <DeliveryEstimator deliveryAddress={deliveryAddress} />
                
                <div>
                  <Label htmlFor="address" className="text-base font-semibold text-gray-700">
                    Delivery Address *
                  </Label>
                  <Input
                    id="address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter your full delivery address"
                    className="mt-2 h-12 border-2 border-gray-200 focus:border-khrate-500"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="date" className="text-base font-semibold text-gray-700">
                      Delivery Date *
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="mt-2 h-12 border-2 border-gray-200 focus:border-khrate-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="timeSlot" className="text-base font-semibold text-gray-700">
                      Time Slot *
                    </Label>
                    <select
                      id="timeSlot"
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full mt-2 p-3 h-12 border-2 border-gray-200 rounded-md focus:border-khrate-500 focus:outline-none"
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
            <Card className="border-2 border-khrate-100 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-khrate-500 to-khrate-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <CreditCard className="h-6 w-6" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <PaymentMethodSelector
                  selectedMethod={paymentMethod}
                  onMethodChange={setPaymentMethod}
                  phoneNumber={phoneNumber}
                  onPhoneNumberChange={setPhoneNumber}
                  onShowPaymentInstructions={() => {}}
                  phoneNumberLabel="Phone Number Used for Payment"
                />
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="sticky bottom-0 bg-white pt-6 border-t">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-khrate-500 to-khrate-600 hover:from-khrate-600 hover:to-khrate-700 text-white py-4 text-lg font-bold shadow-lg transform transition-all duration-200 hover:scale-[1.02]"
                size="lg"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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

export default CheckoutDialog;
