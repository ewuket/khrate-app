
import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import PaymentSection from './PaymentSection';
import OrderSummary from './OrderSummary';
import ScheduledDelivery from './ScheduledDelivery';
import DeliveryAddressInput from './DeliveryAddressInput';
import EnhancedOrderSuccessModal from './EnhancedOrderSuccessModal';
import { useCheckoutForm } from '@/hooks/useCheckoutForm';

interface CheckoutPaymentProps {
  cartItems: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    unit: string;
  }>;
  getCartTotal: () => number;
  formatPrice: (price: number) => string;
  onSuccess: () => void;
  onOpenChange: (open: boolean) => void;
}

const CheckoutPayment: React.FC<CheckoutPaymentProps> = ({
  cartItems,
  getCartTotal,
  formatPrice,
  onSuccess,
  onOpenChange
}) => {
  const {
    formData,
    isProcessing,
    showSuccessModal,
    orderDetails,
    setShowSuccessModal,
    handleInputChange,
    handleFormSubmit
  } = useCheckoutForm({ onSuccess, onOpenChange });

  const handleDeliveryScheduleChange = (schedule: { date: Date | undefined; timeSlot: string }) => {
    handleInputChange('deliveryDate', schedule.date ? schedule.date.toISOString().split('T')[0] : '');
    handleInputChange('timeSlot', schedule.timeSlot);
  };

  const handleSubmit = (e: React.FormEvent) => {
    handleFormSubmit(e, cartItems, getCartTotal);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Order Summary</h3>
          <div className="space-y-2">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.name} x {item.quantity}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatPrice(getCartTotal())}</span>
          </div>
        </div>

        <Separator />

        <DeliveryAddressInput
          value={formData.deliveryAddress}
          onChange={(value) => handleInputChange('deliveryAddress', value)}
        />

        <Separator />

        <ScheduledDelivery onDeliveryScheduleChange={handleDeliveryScheduleChange} />

        <Separator />

        <PaymentSection
          paymentMethod={formData.paymentMethod}
          onPaymentMethodChange={(method) => handleInputChange('paymentMethod', method)}
          phoneNumber={formData.phoneNumber}
          onPhoneNumberChange={(phone) => handleInputChange('phoneNumber', phone)}
        />

        {formData.paymentMethod === "momo" && (
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

        <Button 
          type="submit" 
          disabled={isProcessing || !formData.deliveryDate || !formData.deliveryAddress.trim()}
          className="w-full bg-khrate-500 hover:bg-khrate-600"
        >
          {isProcessing ? "Processing..." : "Place Order"}
        </Button>
      </form>

      <EnhancedOrderSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        orderData={orderDetails}
      />
    </>
  );
};

export default CheckoutPayment;
