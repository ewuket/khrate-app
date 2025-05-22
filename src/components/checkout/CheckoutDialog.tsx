
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
import { CalendarCheck, AlertTriangle, Phone } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";
import ScheduledDelivery from "@/components/checkout/ScheduledDelivery";
import { useAuth } from "@/contexts/AuthContext";

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
            
            {/* Scheduled Delivery Section */}
            <ScheduledDelivery 
              onDeliveryScheduleChange={setDeliverySchedule} 
            />
            
            <Separator />
            
            {/* MoMo Payment Alert */}
            <Alert variant="destructive" className="bg-amber-50 border-amber-200 text-amber-800">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Payment Instructions</AlertTitle>
              <AlertDescription>
                ⚠️ To complete your order, please pay using the following number: 0795754391.
              </AlertDescription>
            </Alert>
            
            {/* Payment Method Section */}
            <div className="space-y-4">
              <h3 className="font-semibold">Payment Method</h3>
              <RadioGroup 
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2 border p-3 rounded-md bg-yellow-50 border-yellow-200">
                  <RadioGroupItem value="mtn" id="mtn" />
                  <Label htmlFor="mtn" className="flex items-center">
                    <Phone className="h-5 w-5 text-yellow-500 mr-2" />
                    <span className="font-medium">Pay with MTN MoMo (0795754391)</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border p-3 rounded-md">
                  <RadioGroupItem value="equity" id="equity" />
                  <Label htmlFor="equity" className="flex items-center">
                    <span className="font-medium">Equity Bank</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border p-3 rounded-md">
                  <RadioGroupItem value="bk" id="bk" />
                  <Label htmlFor="bk" className="flex items-center">
                    <span className="font-medium">Bank of Kigali</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border p-3 rounded-md">
                  <RadioGroupItem value="im" id="im" />
                  <Label htmlFor="im" className="flex items-center">
                    <span className="font-medium">I&M Bank</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            {paymentMethod === "mtn" && (
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  placeholder="Your MTN number" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
                
                <Button 
                  type="button" 
                  onClick={() => alert("Pay using MoMo number: 0795754391")}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 mt-2"
                >
                  Pay with MoMo (0795754391)
                </Button>
              </div>
            )}
            
            <div className="space-y-2">
              <div className="flex justify-between font-semibold">
                <span>Total Amount:</span>
                <span>{formatPrice(getCartTotal())}</span>
              </div>
              
              {/* Delivery Schedule Summary */}
              {deliverySchedule.date && (
                <div className="bg-blue-50 p-3 rounded-md mt-2">
                  <div className="flex items-center gap-2">
                    <CalendarCheck className="h-4 w-4 text-khrate-500" />
                    <span className="text-sm font-medium">Delivery scheduled for:</span>
                  </div>
                  <p className="text-sm mt-1 pl-6">
                    {format(deliverySchedule.date, "PPP")} between {getTimeSlotText(deliverySchedule.timeSlot)}
                  </p>
                </div>
              )}
            </div>
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
