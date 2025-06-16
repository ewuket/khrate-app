
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCheckoutForm } from "@/hooks/useCheckoutForm";
import { useAuth } from "@/contexts/AuthContext";
import CheckoutPayment from "./CheckoutPayment";
import OrderSuccessModal from "./OrderSuccessModal";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  getCartTotal: () => number;
  formatPrice: (price: number) => string;
  cartItems: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    unit: string;
  }>;
  clearCart: () => void;
  saveOrder: () => void;
}

const CheckoutDialog: React.FC<CheckoutDialogProps> = ({
  open,
  onOpenChange,
  getCartTotal,
  formatPrice,
  cartItems,
  clearCart,
  saveOrder
}) => {
  const { isAuthenticated, openAuthModal } = useAuth();
  
  const checkoutForm = useCheckoutForm({
    onSuccess: () => {
      clearCart();
      saveOrder();
    },
    onOpenChange
  });

  // If user is not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4 text-center">
            <div className="mx-auto w-16 h-16 bg-khrate-100 rounded-full flex items-center justify-center">
              <UserPlus className="h-8 w-8 text-khrate-600" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Please log in to place your order
              </h3>
              <p className="text-gray-600">
                You must be signed in to complete checkout and track your orders.
              </p>
            </div>
            
            <div className="space-y-2">
              <Button 
                onClick={() => {
                  onOpenChange(false);
                  openAuthModal();
                }}
                className="w-full bg-khrate-500 hover:bg-khrate-600"
              >
                Login / Sign Up
              </Button>
              
              <Button 
                onClick={() => onOpenChange(false)}
                variant="outline"
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
          </DialogHeader>
          
          <CheckoutPayment
            cartItems={cartItems}
            getCartTotal={getCartTotal}
            formatPrice={formatPrice}
            paymentMethod={checkoutForm.formData.paymentMethod}
            setPaymentMethod={(method) => checkoutForm.handleInputChange('paymentMethod', method)}
            phoneNumber={checkoutForm.formData.phoneNumber}
            setPhoneNumber={(phone) => checkoutForm.handleInputChange('phoneNumber', phone)}
            processingPayment={checkoutForm.isProcessing}
            deliverySchedule={{
              date: checkoutForm.formData.deliveryDate,
              timeSlot: checkoutForm.formData.timeSlot
            }}
            setDeliverySchedule={(schedule) => {
              checkoutForm.handleInputChange('deliveryDate', schedule.date);
              checkoutForm.handleInputChange('timeSlot', schedule.timeSlot);
            }}
            deliveryAddress={checkoutForm.formData.deliveryAddress}
            setDeliveryAddress={(address) => checkoutForm.handleInputChange('deliveryAddress', address)}
            onSubmit={checkoutForm.handleFormSubmit}
          />
        </DialogContent>
      </Dialog>

      {checkoutForm.orderDetails && (
        <OrderSuccessModal
          open={checkoutForm.showSuccessModal}
          onOpenChange={checkoutForm.setShowSuccessModal}
          orderDetails={{
            orderId: checkoutForm.orderDetails.orderNumber,
            totalAmount: checkoutForm.orderDetails.totalAmount,
            phoneNumber: checkoutForm.orderDetails.phoneNumber,
            items: cartItems.map(item => ({
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

export default CheckoutDialog;
