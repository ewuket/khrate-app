
import { useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import PaymentMethodSelector from "@/components/custom-buy/PaymentMethodSelector";

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
  return (
    <div className="space-y-4">
      {/* MoMo Payment Alert */}
      <Alert variant="destructive" className="bg-amber-50 border-amber-200 text-amber-800">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Payment Instructions</AlertTitle>
        <AlertDescription>
          ⚠️ To complete your order, please pay using the following number: 0795754391.
        </AlertDescription>
      </Alert>
      
      {/* Payment Method Section */}
      <PaymentMethodSelector
        selectedMethod={paymentMethod}
        onMethodChange={onPaymentMethodChange}
        phoneNumber={phoneNumber}
        onPhoneNumberChange={onPhoneNumberChange}
      />
    </div>
  );
};

export default PaymentSection;
