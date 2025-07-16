
import { CreditCard, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PaymentMethodSelectorProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
  phoneNumber: string;
  onPhoneNumberChange: (phoneNumber: string) => void;
  onShowPaymentInstructions: () => void;
  phoneNumberLabel?: string;
}

const PaymentMethodSelector = ({
  selectedMethod,
  onMethodChange,
  phoneNumber,
  onPhoneNumberChange,
  onShowPaymentInstructions,
  phoneNumberLabel = "Phone Number"
}: PaymentMethodSelectorProps) => {
  const [copiedPayment, setCopiedPayment] = useState(false);
  const paymentNumber = "0795754391";

  const paymentMethods = [
    { value: "mtn", label: "MTN Mobile Money", icon: Phone },
    { value: "card", label: "Credit Card", icon: CreditCard },
    { value: "bank_transfer", label: "Bank Transfer", icon: CreditCard }
  ];

  const handleCopyPaymentNumber = async () => {
    try {
      await navigator.clipboard.writeText(paymentNumber);
      setCopiedPayment(true);
      toast.success("Payment number copied!");
      setTimeout(() => setCopiedPayment(false), 2000);
    } catch (error) {
      toast.error("Failed to copy number");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-medium">Payment Method *</Label>
        <div className="grid grid-cols-1 gap-3 mt-2">
          {paymentMethods.map(method => {
            const Icon = method.icon;
            return (
              <label
                key={method.value}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedMethod === method.value 
                    ? 'border-khrate-500 bg-khrate-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="radio"
                  value={method.value}
                  checked={selectedMethod === method.value}
                  onChange={(e) => onMethodChange(e.target.value)}
                  className="sr-only"
                />
                <Icon className="h-4 w-4 mr-3 text-khrate-600" />
                <span className="font-medium">{method.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* MTN Payment Instructions */}
      {selectedMethod === 'mtn' && (
        <Card className="border-2 border-khrate-200 bg-khrate-50">
          <CardContent className="p-4">
            <h4 className="font-semibold text-khrate-800 mb-2">Pay via MTN Mobile Money</h4>
            <div className="flex items-center justify-between bg-white p-3 rounded border">
              <div>
                <p className="text-sm text-gray-600">Send payment to:</p>
                <p className="text-lg font-bold text-khrate-800">{paymentNumber}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyPaymentNumber}
                className="border-khrate-300 hover:bg-khrate-100"
              >
                {copiedPayment ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div>
        <Label htmlFor="phone" className="text-base font-medium">
          {phoneNumberLabel} *
        </Label>
        <Input
          id="phone"
          type="tel"
          value={phoneNumber}
          onChange={(e) => onPhoneNumberChange(e.target.value)}
          placeholder="Enter phone number"
          className="mt-1"
        />
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
