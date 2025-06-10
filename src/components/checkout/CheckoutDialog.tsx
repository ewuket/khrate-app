
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
            paymentMethod={checkoutForm.paymentMethod}
            setPaymentMethod={checkoutForm.setPaymentMethod}
            phoneNumber={checkoutForm.phoneNumber}
            setPhoneNumber={checkoutForm.setPhoneNumber}
            processingPayment={checkoutForm.processingPayment}
            deliverySchedule={checkoutForm.deliverySchedule}
            setDeliverySchedule={checkoutForm.setDeliverySchedule}
            onSubmit={checkoutForm.handlePayment}
          />
        </DialogContent>
      </Dialog>

      {checkoutForm.orderDetails && (
        <OrderSuccessModal
          open={checkoutForm.showSuccessModal}
          onOpenChange={checkoutForm.setShowSuccessModal}
          orderDetails={{
            orderId: checkoutForm.orderDetails.orderNumber,
            totalAmount: checkoutForm.orderDetails.total,
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
