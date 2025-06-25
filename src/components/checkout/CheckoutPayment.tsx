
import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import PaymentSection from './PaymentSection';
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
      <div className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Compact Order Summary */}
          <div className="bg-khrate-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Order Summary</h3>
            <div className="space-y-1 text-sm">
              {cartItems.slice(0, 3).map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.name} x {item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              {cartItems.length > 3 && (
                <div className="text-gray-500 text-xs">
                  +{cartItems.length - 3} more items
                </div>
              )}
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-khrate-600">{formatPrice(getCartTotal())}</span>
            </div>
          </div>

          {/* Compact Delivery Address */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Delivery Address</h3>
            <DeliveryAddressInput
              value={formData.deliveryAddress}
              onChange={(value) => handleInputChange('deliveryAddress', value)}
            />
          </div>

          {/* Compact Delivery Schedule */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Delivery Schedule</h3>
            <ScheduledDelivery onDeliveryScheduleChange={handleDeliveryScheduleChange} />
          </div>

          {/* Compact Payment Section */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Payment Method</h3>
            <PaymentSection
              paymentMethod={formData.paymentMethod}
              onPaymentMethodChange={(method) => handleInputChange('paymentMethod', method)}
              phoneNumber={formData.phoneNumber}
              onPhoneNumberChange={(phone) => handleInputChange('phoneNumber', phone)}
            />
          </div>

          {formData.paymentMethod === "momo" && (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-md text-blue-800 text-sm">
              <p className="font-medium">Payment Instructions</p>
              <p className="text-xs mt-1">
                Send payment to: <span className="font-bold">0795754391</span>
              </p>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={isProcessing || !formData.deliveryDate || !formData.deliveryAddress.trim()}
            className="w-full bg-khrate-500 hover:bg-khrate-600 py-3"
          >
            {isProcessing ? "Processing..." : `Place Order - ${formatPrice(getCartTotal())}`}
          </Button>
        </form>
      </div>

      <EnhancedOrderSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        orderData={orderDetails}
      />
    </>
  );
};

export default CheckoutPayment;
