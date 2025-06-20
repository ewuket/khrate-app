
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
      {/* Payment Method Section */}
      <PaymentMethodSelector
        selectedMethod={paymentMethod}
        onMethodChange={onPaymentMethodChange}
        phoneNumber={phoneNumber}
        onPhoneNumberChange={onPhoneNumberChange}
        onShowPaymentInstructions={handleShowPaymentInstructions}
        phoneNumberLabel="Enter the number you used to make the payment"
      />
      
      {/* Enhanced Payment Number Display */}
      {(paymentMethod === "mtn" || paymentMethod === "airtel") && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900 text-sm">Send Payment To:</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xl font-bold text-blue-800">{paymentNumber}</span>
                  <Button
                    onClick={handleCopyNumber}
                    variant="outline"
                    size="sm"
                    className="h-8 px-2 border-blue-300 hover:bg-blue-100"
                  >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
              </div>
            </div>
            <p className="text-xs text-blue-700 mt-2">
              After sending payment, enter the phone number you used above. Your order will be confirmed once payment is received.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PaymentSection;
