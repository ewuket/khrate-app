
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
import { X } from "lucide-react";
import ScheduledDelivery from "@/components/checkout/ScheduledDelivery";
import { useAuth } from "@/contexts/AuthContext";
import PaymentSection from "./PaymentSection";
import OrderSummary from "./OrderSummary";
import GuestUserPrompt from "./GuestUserPrompt";
import OrderSuccessModal from "./OrderSuccessModal";
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
    showSuccessModal,
    setShowSuccessModal,
    handlePayment
  } = useCheckoutForm({
    onSuccess: () => {
      saveOrder();
      clearCart();
    },
    onOpenChange
  });

  const generateOrderNumber = () => {
    return `KH${Date.now().toString().slice(-6)}`;
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Complete Your Order</DialogTitle>
                <DialogDescription>
                  Schedule your delivery and choose a payment method.
                </DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="h-6 w-6 p-0 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <form onSubmit={handlePayment}>
            <div className="grid gap-6 py-4">
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
              
              <ScheduledDelivery 
                onDeliveryScheduleChange={setDeliverySchedule} 
              />
              
              <Separator />
              
              <PaymentSection
                paymentMethod={paymentMethod}
                onPaymentMethodChange={setPaymentMethod}
                phoneNumber={phoneNumber}
                onPhoneNumberChange={setPhoneNumber}
              />
              
              <OrderSummary
                total={getCartTotal()}
                formatPrice={formatPrice}
                deliverySchedule={deliverySchedule}
              />

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

      <OrderSuccessModal
        open={showSuccessModal}
        onOpenChange={setShowSuccessModal}
        orderDetails={{
          orderNumber: generateOrderNumber(),
          total: getCartTotal(),
          deliveryDate: deliverySchedule.date,
          deliveryTimeSlot: deliverySchedule.timeSlot
        }}
        formatPrice={formatPrice}
      />
    </>
  );
};

export default CheckoutDialog;
