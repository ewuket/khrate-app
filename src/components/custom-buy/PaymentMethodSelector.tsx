
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger, 
  SelectValue
} from "@/components/ui/select";
import { InfoIcon, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="payment-method" className="text-sm font-medium mb-2 block">Payment Method</Label>
        <Select value={selectedMethod} onValueChange={onMethodChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mtn">MTN Mobile Money</SelectItem>
            <SelectItem value="card">Credit/Debit Card</SelectItem>
            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {selectedMethod === "mtn" && (
        <div className="space-y-4">
          <Card className="border-2 border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="font-bold text-green-900 text-lg mb-2">Pay via MTN MoMo to:</h3>
                <div className="flex items-center justify-center gap-3 mb-3">
                  <span className="text-2xl font-bold text-green-800">{paymentNumber}</span>
                  <Button
                    onClick={handleCopyNumber}
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 border-green-300 hover:bg-green-100"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-sm text-green-700">
                  After sending payment, enter your phone number below
                </p>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-2">
            <Label htmlFor="phone-number" className="text-sm font-medium">{phoneNumberLabel}</Label>
            <Input 
              id="phone-number"
              placeholder="0700 000 000"
              value={phoneNumber}
              onChange={(e) => onPhoneNumberChange(e.target.value)}
              className="text-base"
            />
          </div>
        </div>
      )}
      
      {selectedMethod === "card" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="card-number" className="text-sm font-medium">Card Number</Label>
            <Input id="card-number" placeholder="1234 5678 9012 3456" className="text-base" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry" className="text-sm font-medium">Expiry Date</Label>
              <Input id="expiry" placeholder="MM/YY" className="text-base" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvc" className="text-sm font-medium">CVC</Label>
              <Input id="cvc" placeholder="123" className="text-base" />
            </div>
          </div>
        </div>
      )}

      {selectedMethod === "bank_transfer" && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Bank Transfer Details</h3>
            <div className="space-y-1 text-sm text-blue-800">
              <p><strong>Bank:</strong> Bank of Kigali</p>
              <p><strong>Account Name:</strong> Khrate Ltd</p>
              <p><strong>Account Number:</strong> 00200112345678</p>
              <p><strong>Swift Code:</strong> BKRWRWRW</p>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              Please use your order ID as the reference when making the transfer.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PaymentMethodSelector;
