
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCheckoutForm } from "@/hooks/useCheckoutForm";
import CheckoutPayment from "./CheckoutPayment";
import OrderSuccessModal from "./OrderSuccessModal";

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
  const checkoutForm = useCheckoutForm({
    onSuccess: () => {
      clearCart();
      saveOrder();
    },
    onOpenChange
  });

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
            totalAmount: getCartTotal(),
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
