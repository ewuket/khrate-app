
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ScheduledDelivery from "@/components/checkout/ScheduledDelivery";
import { useAuth } from "@/contexts/AuthContext";
import PaymentSection from "./PaymentSection";
import OrderSummary from "./OrderSummary";
import GuestUserPrompt from "./GuestUserPrompt";
import { useCheckoutForm } from "@/hooks/useCheckoutForm";

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
  
  const {
    paymentMethod,
    setPaymentMethod,
    phoneNumber,
    setPhoneNumber,
    processingPayment,
    deliverySchedule,
    setDeliverySchedule,
    handlePayment
  } = useCheckoutForm({
    onSuccess: saveOrder,
    onOpenChange
  });
  
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
              deliverySchedule={{
                date: deliverySchedule.date ? new Date(deliverySchedule.date) : undefined,
                timeSlot: deliverySchedule.timeSlot
              }}
            />

            {/* Mobile Money Payment Notice */}
            {(paymentMethod === "mtn" || paymentMethod === "airtel") && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-md text-blue-800">
                <p className="font-medium">Payment Instructions</p>
                <p className="text-sm mt-1">
                  Send payment to: <span className="font-bold">0795754391</span>
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Your order will be confirmed once payment is received.
                </p>
              </div>
            )}
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
