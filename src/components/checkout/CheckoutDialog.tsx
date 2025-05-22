
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import ScheduledDelivery from "@/components/checkout/ScheduledDelivery";
import { useAuth } from "@/contexts/AuthContext";
import PaymentSection from "./PaymentSection";
import OrderSummary from "./OrderSummary";
import GuestUserPrompt from "./GuestUserPrompt";

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  getCartTotal: () => number;
  formatPrice: (price: number) => string;
  cartItems: any[];
  clearCart: () => void;
  saveOrder: () => void;
}

const CheckoutDialog = ({
  open,
  onOpenChange,
  getCartTotal,
  formatPrice,
  cartItems,
  clearCart,
  saveOrder
}: CheckoutDialogProps) => {
  const { isAuthenticated, openAuthModal } = useAuth();
  
  const [paymentMethod, setPaymentMethod] = useState("mtn");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [deliverySchedule, setDeliverySchedule] = useState<{
    date: Date | undefined;
    timeSlot: string;
  }>({ date: undefined, timeSlot: "afternoon" });
  
  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate delivery date
    if (!deliverySchedule.date) {
      toast.error("Please select a delivery date");
      return;
    }
    
    setProcessingPayment(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessingPayment(false);
      onOpenChange(false);
      
      // Show the MoMo payment alert
      alert("⚠️ To complete your order, please pay using the following number: 0795754391.");
      
      // Save the order before clearing the cart
      saveOrder();
      clearCart();
      
      // Send confirmation with delivery details
      const deliveryTimeText = getTimeSlotText(deliverySchedule.timeSlot);
      const deliveryDateText = deliverySchedule.date ? format(deliverySchedule.date, "PPP") : "";
      
      toast.success("Your order has been placed!", {
        description: `Scheduled for delivery on ${deliveryDateText} between ${deliveryTimeText}.`,
        duration: 5000,
      });
    }, 2000);
  };
  
  const getTimeSlotText = (slot: string) => {
    switch(slot) {
      case "morning": return "8AM–11AM";
      case "midday": return "11AM–2PM";
      case "afternoon": return "2PM–5PM";
      case "evening": return "5PM–8PM";
      default: return "2PM–5PM";
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Your Order</DialogTitle>
          <DialogDescription>
            Schedule your delivery and choose a payment method.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handlePayment}>
          <div className="grid gap-6 py-4">
            {/* Login/Register prompt for guest users */}
            {!isAuthenticated && (
              <div className="mb-4">
                <GuestUserPrompt 
                  onSignInClick={() => {
                    onOpenChange(false);
                    openAuthModal();
                  }} 
                />
              </div>
            )}
            
            {/* Scheduled Delivery Section */}
            <ScheduledDelivery 
              onDeliveryScheduleChange={setDeliverySchedule} 
            />
            
            <Separator />
            
            {/* Payment Section */}
            <PaymentSection
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              phoneNumber={phoneNumber}
              onPhoneNumberChange={setPhoneNumber}
            />
            
            {/* Order Summary */}
            <OrderSummary
              total={getCartTotal()}
              formatPrice={formatPrice}
              deliverySchedule={deliverySchedule}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button 
              type="submit" 
              disabled={processingPayment || !deliverySchedule.date}
              className="bg-khrate-500 hover:bg-khrate-600"
            >
              {processingPayment ? "Processing..." : "Place Order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;
