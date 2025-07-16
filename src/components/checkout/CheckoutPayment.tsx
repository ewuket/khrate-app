
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Phone, CreditCard, CheckCircle } from "lucide-react";
import ScheduledDelivery from "./ScheduledDelivery";

interface CheckoutPaymentProps {
  onPaymentMethodChange: (method: string) => void;
  onDeliveryScheduleChange?: (schedule: { date: Date | undefined, timeSlot: string }) => void;
}

const CheckoutPayment = ({ onPaymentMethodChange, onDeliveryScheduleChange }: CheckoutPaymentProps) => {
  const [paymentMethod, setPaymentMethod] = useState("momo");

  const handlePaymentChange = (value: string) => {
    setPaymentMethod(value);
    onPaymentMethodChange(value);
  };

  const handleDeliveryScheduleChange = (schedule: { date: Date | undefined, timeSlot: string }) => {
    if (onDeliveryScheduleChange) {
      onDeliveryScheduleChange(schedule);
    }
  };

  return (
    <div className="space-y-8">
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
              <RadioGroupItem value="momo" id="momo" />
              <Label 
                htmlFor="momo" 
                className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-gray-50"
              >
                <Phone className="h-5 w-5 text-yellow-500 mr-2" />
                <span>MTN Mobile Money</span>
                {paymentMethod === "momo" && (
                  <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                )}
              </Label>
            </div>
            
            {paymentMethod === "momo" && (
              <div className="mt-2 ml-8 p-3 bg-yellow-50 rounded-md border border-yellow-200">
                <p className="text-sm mb-1">Send payment to this MTN MoMo number:</p>
                <p className="text-lg font-bold">0795754391</p>
                <p className="text-xs text-gray-500 mt-1">Payment will be verified automatically</p>
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
    </div>
  );
};

export default CheckoutPayment;
