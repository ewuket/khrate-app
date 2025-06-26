
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, CreditCard, Package, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import EnhancedOrderSuccessModal from "../checkout/EnhancedOrderSuccessModal";
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
    
    console.log('Custom buy checkout - checking auth state:', { isAuthenticated, user: user?.id });
    
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
        unit: item.unit,
        total: item.price * item.quantity
      }));

      const totalAmount = getCartTotal();
      const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      console.log('Creating order with user ID:', user.id);

      const { data: orderResult, error } = await supabase
        .from('orders')
        .insert([{
          user_id: user.id,
          items: orderItems,
          total_amount: totalAmount,
          original_amount: totalAmount,
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

      if (error) {
        console.error('Error creating order:', error);
        throw error;
      }

      console.log('Order created successfully:', orderResult);

      setOrderData({
        id: orderResult.id,
        transactionId: transactionId,
        items: orderItems,
        total_amount: totalAmount,
        delivery_address: deliveryAddress,
        delivery_date: deliveryDate,
        delivery_time_slot: timeSlot,
        payment_method: paymentMethod,
        phone_number: phoneNumber,
        created_at: orderResult.created_at
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
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-gray-50">
          <DialogHeader className="text-center border-b pb-6 mb-6">
            <div className="flex items-center justify-center mb-3">
              <div className="bg-khrate-100 p-3 rounded-full">
                <Package className="h-8 w-8 text-khrate-600" />
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold text-khrate-600 mb-2">
              Complete Your Order
            </DialogTitle>
            <p className="text-gray-600">Just a few details to get your fresh items delivered</p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Order Summary */}
            <Card className="border-2 border-khrate-200 shadow-lg">
              <CardHeader className="bg-khrate-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg text-khrate-700">
                  <Package className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="max-h-40 overflow-y-auto space-y-3 mb-4">
                  {cart.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg border">
                      <div>
                        <span className="font-medium text-gray-800">{item.name}</span>
                        <span className="text-khrate-600 ml-2 text-sm">x{item.quantity} {item.unit}</span>
                      </div>
                      <span className="font-bold text-khrate-600">
                        {(item.price * item.quantity).toLocaleString()} RWF
                      </span>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">Total Amount</span>
                  <span className="text-2xl font-bold text-khrate-600">
                    {getCartTotal().toLocaleString()} RWF
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card className="border-2 border-khrate-200 shadow-lg">
              <CardHeader className="bg-khrate-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg text-khrate-700">
                  <MapPin className="h-5 w-5" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label htmlFor="address" className="text-sm font-semibold text-gray-700">
                    Delivery Address *
                  </Label>
                  <Input
                    id="address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter your complete delivery address"
                    className="mt-2 h-12 border-khrate-200 focus:border-khrate-500"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date" className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Delivery Date *
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="mt-2 h-12 border-khrate-200 focus:border-khrate-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="timeSlot" className="text-sm font-semibold text-gray-700">
                      Preferred Time *
                    </Label>
                    <select
                      id="timeSlot"
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full mt-2 p-3 h-12 border border-khrate-200 rounded-md focus:border-khrate-500 focus:outline-none"
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
            <Card className="border-2 border-khrate-200 shadow-lg">
              <CardHeader className="bg-khrate-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg text-khrate-700">
                  <CreditCard className="h-5 w-5" />
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
                  phoneNumberLabel="Phone Number for Payment"
                />
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="pt-6">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-khrate-500 to-khrate-600 hover:from-khrate-600 hover:to-khrate-700 text-white py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200"
                size="lg"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing Order...
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5" />
                    Place Order - {getCartTotal().toLocaleString()} RWF
                  </div>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <EnhancedOrderSuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        orderData={orderData}
      />
    </>
  );
};

export default CustomBuyCheckoutDialog;
