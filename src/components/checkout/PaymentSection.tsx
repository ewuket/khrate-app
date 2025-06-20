
import { useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, Copy, Check } from "lucide-react";
import PaymentMethodSelector from "@/components/custom-buy/PaymentMethodSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
  const [copied, setCopied] = useState(false);
  
  const paymentNumber = "0795754391";

  const handleCopyNumber = async () => {
    try {
      await navigator.clipboard.writeText(paymentNumber);
      setCopied(true);
      toast.success("Payment number copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy number");
    }
  };

  const handleShowPaymentInstructions = () => {
    toast("Payment Instructions", {
      description: `Send payment to: ${paymentNumber}. Your order will be confirmed once payment is received.`,
      duration: 8000,
      icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
    });
  };

  return (
    <div className="space-y-4">
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Payment Information</h3>
        <p className="text-sm text-gray-600">Choose your preferred payment method</p>
      </div>
      
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
