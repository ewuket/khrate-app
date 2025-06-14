
import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import PaymentSection from './PaymentSection';
import OrderSummary from './OrderSummary';
import ScheduledDelivery from './ScheduledDelivery';
import DeliveryAddressInput from './DeliveryAddressInput';

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
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  processingPayment: boolean;
  deliverySchedule: { date: string; timeSlot: string };
  setDeliverySchedule: (schedule: { date: string; timeSlot: string }) => void;
  deliveryAddress: string;
  setDeliveryAddress: (address: string) => void;
  onSubmit: (e: React.FormEvent, cartItems: any[], getCartTotal: () => number) => void;
}

const CheckoutPayment: React.FC<CheckoutPaymentProps> = ({
  cartItems,
  getCartTotal,
  formatPrice,
  paymentMethod,
  setPaymentMethod,
  phoneNumber,
  setPhoneNumber,
  processingPayment,
  deliverySchedule,
  setDeliverySchedule,
  deliveryAddress,
  setDeliveryAddress,
  onSubmit
}) => {
  const handleDeliveryScheduleChange = (schedule: { date: Date | undefined; timeSlot: string }) => {
    setDeliverySchedule({
      date: schedule.date ? schedule.date.toISOString().split('T')[0] : '',
      timeSlot: schedule.timeSlot
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    onSubmit(e, cartItems, getCartTotal);
  };

  return (
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
        value={deliveryAddress}
        onChange={setDeliveryAddress}
      />

      <Separator />

      <ScheduledDelivery onDeliveryScheduleChange={handleDeliveryScheduleChange} />

      <Separator />

      <PaymentSection
        paymentMethod={paymentMethod}
        onPaymentMethodChange={setPaymentMethod}
        phoneNumber={phoneNumber}
        onPhoneNumberChange={setPhoneNumber}
      />

      {(paymentMethod === "momo") && (
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
        disabled={processingPayment || !deliverySchedule.date || !deliveryAddress.trim()}
        className="w-full bg-khrate-500 hover:bg-khrate-600"
      >
        {processingPayment ? "Processing..." : "Place Order"}
      </Button>
    </form>
  );
};

export default CheckoutPayment;
