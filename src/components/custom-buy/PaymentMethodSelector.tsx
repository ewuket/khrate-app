
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
import { InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentMethodSelectorProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
  phoneNumber: string;
  onPhoneNumberChange: (phoneNumber: string) => void;
  onShowPaymentInstructions: () => void;
}

const PaymentMethodSelector = ({
  selectedMethod,
  onMethodChange,
  phoneNumber,
  onPhoneNumberChange,
  onShowPaymentInstructions,
}: PaymentMethodSelectorProps) => {
  
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="payment-method">Payment Method</Label>
        <Select value={selectedMethod} onValueChange={onMethodChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mtn">MTN Mobile Money</SelectItem>
            <SelectItem value="airtel">Airtel Money</SelectItem>
            <SelectItem value="card">Credit/Debit Card</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {(selectedMethod === "mtn" || selectedMethod === "airtel") && (
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="phone-number">Phone Number</Label>
            <Button 
              variant="link" 
              size="sm" 
              className="h-auto p-0 text-xs"
              onClick={onShowPaymentInstructions}
            >
              <InfoIcon className="h-4 w-4 mr-1" /> Payment Instructions
            </Button>
          </div>
          <Input 
            id="phone-number"
            placeholder="0700 000 000"
            value={phoneNumber}
            onChange={(e) => onPhoneNumberChange(e.target.value)}
          />
          <div className="text-sm text-muted-foreground bg-amber-50 border border-amber-200 rounded p-2 mt-1">
            For demo purposes, please send payment to: <span className="font-medium">0795754391</span>
          </div>
        </div>
      )}
      
      {selectedMethod === "card" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="card-number">Card Number</Label>
            <Input id="card-number" placeholder="1234 5678 9012 3456" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input id="expiry" placeholder="MM/YY" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input id="cvc" placeholder="123" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelector;
