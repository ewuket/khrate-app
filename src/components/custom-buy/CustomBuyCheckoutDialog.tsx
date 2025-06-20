
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
import { X, ShoppingBag, MapPin, Calendar, CreditCard } from "lucide-react";
import ScheduledDelivery from "@/components/checkout/ScheduledDelivery";
import { useAuth } from "@/contexts/AuthContext";
import PaymentSection from "@/components/checkout/PaymentSection";
import OrderSummary from "@/components/checkout/OrderSummary";
import GuestUserPrompt from "@/components/checkout/GuestUserPrompt";
import OrderSuccessModal from "@/components/checkout/OrderSuccessModal";
import DeliveryAddressInput from "@/components/checkout/DeliveryAddressInput";
import { useCheckoutForm } from "@/hooks/useCheckoutForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    checkoutForm.handleInputChange('deliveryDate', schedule.date ? schedule.date.toISOString().split('T')[0] : '');
    checkoutForm.handleInputChange('timeSlot', schedule.timeSlot);
  };

  const handleSubmit = (e: React.FormEvent) => {
    checkoutForm.handleFormSubmit(e, cart, getCartTotal);
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-bold">Complete Your Order</DialogTitle>
                <DialogDescription className="text-sm text-gray-600">
                  Review your items and provide delivery details
                </DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isAuthenticated && (
              <GuestUserPrompt 
                onSignInClick={() => {
                  onOpenChange(false);
                  openAuthModal();
                }} 
              />
            )}

            {/* Order Summary Section */}
            <Card className="border-2 border-khrate-100">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ShoppingBag className="h-5 w-5 text-khrate-500" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <span className="font-medium text-sm">{item.name}</span>
                        <span className="text-gray-500 text-xs ml-2">x{item.quantity}</span>
                      </div>
                      <span className="font-semibold text-sm">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-3 border-t-2 border-khrate-200">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-lg text-khrate-600">{formatPrice(getCartTotal())}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address Section */}
            <Card className="border-2 border-gray-100">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5 text-khrate-500" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DeliveryAddressInput
                  value={checkoutForm.formData.deliveryAddress}
                  onChange={(address) => checkoutForm.handleInputChange('deliveryAddress', address)}
                />
              </CardContent>
            </Card>

            {/* Scheduled Delivery Section */}
            <Card className="border-2 border-gray-100">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5 text-khrate-500" />
                  Delivery Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScheduledDelivery 
                  onDeliveryScheduleChange={handleDeliveryScheduleChange} 
                />
              </CardContent>
            </Card>

            {/* Payment Section */}
            <Card className="border-2 border-gray-100">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="h-5 w-5 text-khrate-500" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PaymentSection
                  paymentMethod={checkoutForm.formData.paymentMethod}
                  onPaymentMethodChange={(method) => checkoutForm.handleInputChange('paymentMethod', method)}
                  phoneNumber={checkoutForm.formData.phoneNumber}
                  onPhoneNumberChange={(phone) => checkoutForm.handleInputChange('phoneNumber', phone)}
                />
              </CardContent>
            </Card>
            
            <DialogFooter className="pt-6 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={checkoutForm.isProcessing || !checkoutForm.formData.deliveryDate || !checkoutForm.formData.deliveryAddress.trim()}
                className="bg-khrate-500 hover:bg-khrate-600 min-w-[120px]"
              >
                {checkoutForm.isProcessing ? "Processing..." : "Place Order"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {checkoutForm.orderDetails && (
        <OrderSuccessModal
          isOpen={checkoutForm.showSuccessModal}
          onClose={() => checkoutForm.setShowSuccessModal(false)}
          orderData={{
            id: checkoutForm.orderDetails.orderNumber,
            items: cart.map(item => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price
            })),
            total_amount: getCartTotal(),
            delivery_address: checkoutForm.formData.deliveryAddress,
            delivery_date: checkoutForm.formData.deliveryDate,
            delivery_time_slot: checkoutForm.formData.timeSlot,
            payment_method: checkoutForm.formData.paymentMethod
          }}
        />
      )}
    </>
  );
};

export default CustomBuyCheckoutDialog;
