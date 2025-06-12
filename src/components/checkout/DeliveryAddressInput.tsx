
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DeliveryAddressInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const DeliveryAddressInput: React.FC<DeliveryAddressInputProps> = ({
  value,
  onChange,
  error
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="deliveryAddress" className="text-sm font-medium">
        Delivery Address *
      </Label>
      <Input
        id="deliveryAddress"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your full delivery address"
        className={`w-full ${error ? 'border-red-500' : ''}`}
        required
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      <p className="text-xs text-gray-500">
        Please include street, district, and any landmarks for easier delivery
      </p>
    </div>
  );
};

export default DeliveryAddressInput;
