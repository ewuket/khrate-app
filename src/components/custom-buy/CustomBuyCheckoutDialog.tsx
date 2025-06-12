
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
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import ScheduledDelivery from "@/components/checkout/ScheduledDelivery";
import { useAuth } from "@/contexts/AuthContext";
import PaymentSection from "@/components/checkout/PaymentSection";
import OrderSummary from "@/components/checkout/OrderSummary";
import GuestUserPrompt from "@/components/checkout/GuestUserPrompt";
import OrderSuccessModal from "@/components/checkout/OrderSuccessModal";
import { useCheckoutForm } from "@/hooks/useCheckoutForm";

interface CartItem {
  id: number;
  name: string;
  price: number;
  unit: string;
  quantity: number;
  image: string;
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
  const { isAuthenticated, openAuthModal } = useAuth();
  
  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} RWF`;
  };

  const saveOrder = () => {
    clearCart();
  };

  const checkoutForm = useCheckoutForm({
    onSuccess: saveOrder,
    onOpenChange
  });

  const handleDeliveryScheduleChange = (schedule: { date: Date | undefined; timeSlot: string }) => {
    checkoutForm.setDeliverySchedule({
      date: schedule.date ? schedule.date.toISOString().split('T')[0] : '',
      timeSlot: schedule.timeSlot
    });
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
          
          <form onSubmit={checkoutForm.handlePayment}>
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
                onDeliveryScheduleChange={handleDeliveryScheduleChange} 
              />
              
              <Separator />
              
              <PaymentSection
                paymentMethod={checkoutForm.paymentMethod}
                onPaymentMethodChange={checkoutForm.setPaymentMethod}
                phoneNumber={checkoutForm.phoneNumber}
                onPhoneNumberChange={checkoutForm.setPhoneNumber}
              />
              
              <OrderSummary
                total={getCartTotal()}
                formatPrice={formatPrice}
                deliverySchedule={checkoutForm.deliverySchedule}
              />

              {(checkoutForm.paymentMethod === "mtn" || checkoutForm.paymentMethod === "airtel") && (
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
                disabled={checkoutForm.processingPayment || !checkoutForm.deliverySchedule.date}
                className="bg-khrate-500 hover:bg-khrate-600"
              >
                {checkoutForm.processingPayment ? "Processing..." : "Place Order"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {checkoutForm.orderDetails && (
        <OrderSuccessModal
          open={checkoutForm.showSuccessModal}
          onOpenChange={checkoutForm.setShowSuccessModal}
          orderDetails={{
            orderId: checkoutForm.orderDetails.orderNumber,
            totalAmount: getCartTotal(),
            phoneNumber: checkoutForm.orderDetails.phoneNumber,
            items: cart.map(item => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price
            }))
          }}
          formatPrice={formatPrice}
        />
      )}
    </>
  );
};

export default CustomBuyCheckoutDialog;
