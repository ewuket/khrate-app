
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

interface PaymentMethodSelectorProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
  phoneNumber: string;
  onPhoneNumberChange: (phoneNumber: string) => void;
}

const PaymentMethodSelector = ({
  selectedMethod,
  onMethodChange,
  phoneNumber,
  onPhoneNumberChange,
}: PaymentMethodSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="payment-method">Payment Method</Label>
      <RadioGroup 
        id="payment-method" 
        value={selectedMethod}
        onValueChange={onMethodChange}
        className="flex flex-col space-y-1"
      >
        <div className="flex items-center space-x-2 border p-3 rounded-md bg-yellow-50 border-yellow-200">
          <RadioGroupItem value="mtn" id="mtn" />
          <Label htmlFor="mtn" className="flex items-center">
            <Phone className="h-5 w-5 text-yellow-500 mr-2" />
            <span className="font-medium">Pay with MTN MoMo (0795754391)</span>
          </Label>
        </div>
        <div className="flex items-center space-x-2 border p-3 rounded-md">
          <RadioGroupItem value="equity" id="equity" />
          <Label htmlFor="equity" className="flex items-center">
            <span className="font-medium">Equity Bank</span>
          </Label>
        </div>
        <div className="flex items-center space-x-2 border p-3 rounded-md">
          <RadioGroupItem value="bk" id="bk" />
          <Label htmlFor="bk" className="flex items-center">
            <span className="font-medium">Bank of Kigali</span>
          </Label>
        </div>
        <div className="flex items-center space-x-2 border p-3 rounded-md">
          <RadioGroupItem value="im" id="im" />
          <Label htmlFor="im" className="flex items-center">
            <span className="font-medium">I&M Bank</span>
          </Label>
        </div>
      </RadioGroup>
      
      {selectedMethod === "mtn" && (
        <div className="space-y-2">
          <Label htmlFor="phone">Your Phone Number</Label>
          <Input 
            id="phone" 
            placeholder="Your MTN number" 
            value={phoneNumber}
            onChange={(e) => onPhoneNumberChange(e.target.value)}
            required
          />
          
          <Button 
            type="button" 
            onClick={() => alert("Pay using MoMo number: 0795754391")}
            className="w-full bg-yellow-500 hover:bg-yellow-600 mt-2"
          >
            Pay with MoMo (0795754391)
          </Button>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelector;
