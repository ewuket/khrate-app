
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarCheck, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";
import ScheduledDelivery from "@/components/checkout/ScheduledDelivery";
import { useAuth } from "@/contexts/AuthContext";
import PaymentMethodSelector from "./PaymentMethodSelector";

interface CustomBuyCheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  calculateTotal: () => string;
  saveOrder: () => void;
}

const CustomBuyCheckoutDialog = ({
  open,
  onOpenChange,
  calculateTotal,
  saveOrder
}: CustomBuyCheckoutDialogProps) => {
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
    
    const paymentInstructions = "⚠️ To complete your order, please pay using the following number: 0795754391.";
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessingPayment(false);
      onOpenChange(false);
      
      // Show the payment alert
      alert(paymentInstructions);
      
      toast.success("Your order has been placed!", {
        description: "Check your email for order confirmation."
      });
      
      // Save the order to localStorage
      saveOrder();
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription>
            Complete your order by choosing a payment method.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handlePayment}>
          <div className="grid gap-4 py-4">
            {/* Login/Register prompt for guest users */}
            {!isAuthenticated && (
              <div className="mb-4">
                <Alert variant="default" className="bg-blue-50 border-blue-200">
                  <AlertTitle className="flex items-center">
                    Continue as guest or create an account
                  </AlertTitle>
                  <AlertDescription>
                    Create an account to track your orders and get exclusive discounts.
                  </AlertDescription>
                  <Button
                    variant="outline"
                    className="mt-2 border-blue-300 text-blue-700 hover:bg-blue-100"
                    onClick={() => {
                      onOpenChange(false);
                      openAuthModal();
                    }}
                  >
                    Sign up / Login
                  </Button>
                </Alert>
              </div>
            )}

            {/* MoMo Payment Alert */}
            <Alert variant="destructive" className="bg-amber-50 border-amber-200 text-amber-800">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Payment Instructions</AlertTitle>
              <AlertDescription>
                To complete your order, please pay using the following number: 0795754391
              </AlertDescription>
            </Alert>
            
            {/* Payment Method Selector */}
            <PaymentMethodSelector
              selectedMethod={paymentMethod}
              onMethodChange={setPaymentMethod}
              phoneNumber={phoneNumber}
              onPhoneNumberChange={setPhoneNumber}
            />
            
            <div className="space-y-2">
              <div className="flex justify-between font-semibold">
                <span>Total Amount:</span>
                <span className="text-orange-500">{calculateTotal()} RWF</span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button 
              type="submit" 
              disabled={processingPayment}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {processingPayment ? "Processing..." : "Place Order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomBuyCheckoutDialog;
