
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Phone, CreditCard, CheckCircle } from "lucide-react";
import ScheduledDelivery from "./ScheduledDelivery";
import { Button } from "@/components/ui/button";

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
  setDeliverySchedule: (schedule: { date: Date | undefined; timeSlot: string }) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

const CheckoutPayment = ({ 
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
  onSubmit
}: CheckoutPaymentProps) => {
  const handlePaymentChange = (value: string) => {
    setPaymentMethod(value);
  };

  const handleDeliveryScheduleChange = (schedule: { date: Date | undefined, timeSlot: string }) => {
    setDeliverySchedule(schedule);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Order Summary */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Order Summary</h3>
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>{item.name} x {item.quantity}</span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="border-t pt-2 font-semibold flex justify-between">
            <span>Total:</span>
            <span>{formatPrice(getCartTotal())}</span>
          </div>
        </div>
      </div>

      {/* Scheduled Delivery Section */}
      <ScheduledDelivery onDeliveryScheduleChange={handleDeliveryScheduleChange} />
      
      {/* Payment Method Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Payment Method</h3>

        <RadioGroup 
          value={paymentMethod} 
          onValueChange={handlePaymentChange}
          className="space-y-4"
        >
          <div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mtn" id="mtn" />
              <Label 
                htmlFor="mtn" 
                className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-gray-50"
              >
                <Phone className="h-5 w-5 text-yellow-500 mr-2" />
                <span>MTN Mobile Money</span>
                {paymentMethod === "mtn" && (
                  <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                )}
              </Label>
            </div>
            
            {paymentMethod === "mtn" && (
              <div className="mt-2 ml-8 space-y-3">
                <div className="p-3 bg-yellow-50 rounded-md border border-yellow-200">
                  <p className="text-sm mb-1">Send payment to this MTN MoMo number:</p>
                  <p className="text-lg font-bold">0795754391</p>
                  <p className="text-xs text-gray-500 mt-1">Payment will be verified automatically</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone-number">Enter the phone number you used to pay</Label>
                  <Input
                    id="phone-number"
                    type="tel"
                    placeholder="07XX XXX XXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="card" id="card" />
              <Label 
                htmlFor="card" 
                className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-gray-50"
              >
                <CreditCard className="h-5 w-5 text-blue-500 mr-2" />
                <span>Credit/Debit Card</span>
                {paymentMethod === "card" && (
                  <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                )}
              </Label>
            </div>
            
            {paymentMethod === "card" && (
              <div className="mt-2 ml-8">
                <p className="text-sm text-gray-600">Card payment option coming soon</p>
              </div>
            )}
          </div>
        </RadioGroup>
      </div>

      <div className="flex gap-4">
        <Button 
          type="submit" 
          disabled={processingPayment || !deliverySchedule.date}
          className="flex-1 bg-khrate-500 hover:bg-khrate-600"
        >
          {processingPayment ? "Processing..." : "Place Order"}
        </Button>
      </div>
    </form>
  );
};

export default CheckoutPayment;
