
import { useState } from "react";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import PaymentMethodSelector from "@/components/custom-buy/PaymentMethodSelector";
import { Button } from "@/components/ui/button";

interface PaymentSectionProps {
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
  phoneNumber: string;
  onPhoneNumberChange: (phoneNumber: string) => void;
}

const PaymentSection = ({
  paymentMethod,
  onPaymentMethodChange,
  phoneNumber,
  onPhoneNumberChange,
}: PaymentSectionProps) => {
  const handleShowPaymentInstructions = () => {
    toast("Payment Instructions", {
      description: "To complete your order, please pay using the following number: 0795754391.",
      duration: 8000,
      icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
    });
  };

  return (
    <div className="space-y-4">
      {/* Payment Method Section */}
      <PaymentMethodSelector
        selectedMethod={paymentMethod}
        onMethodChange={onPaymentMethodChange}
        phoneNumber={phoneNumber}
        onPhoneNumberChange={onPhoneNumberChange}
        onShowPaymentInstructions={handleShowPaymentInstructions}
        phoneNumberLabel="Enter the number you used to make the payment"
      />
    </div>
  );
};

export default PaymentSection;
