
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

interface PaymentInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentMethod: string;
}

const PaymentInstructionsModal: React.FC<PaymentInstructionsModalProps> = ({
  isOpen,
  onClose,
  paymentMethod
}) => {
  const provider = paymentMethod === "mtn" ? "MTN Mobile Money" : 
                  paymentMethod === "airtel" ? "Airtel Money" : "Mobile Money";
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{provider} Payment Instructions</DialogTitle>
        </DialogHeader>
        
        <div className="py-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-2 rounded-full">
              <Phone className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="font-medium">Send payment to:</p>
              <p className="text-xl font-bold">0795754391</p>
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            <p>Follow these steps to complete your payment:</p>
            <ol className="list-decimal ml-4 space-y-1">
              <li>Dial *165# on your phone (for MTN) or *185# (for Airtel)</li>
              <li>Select "Send Money"</li>
              <li>Enter the number: 0795754391</li>
              <li>Enter the amount shown in your order</li>
              <li>Confirm with your PIN</li>
              <li>You will receive an SMS confirmation once payment is successful</li>
            </ol>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-md text-blue-700 text-sm">
            <p className="font-medium">Note:</p>
            <p>For demonstration purposes, you can simply close this dialog and we will simulate a successful payment.</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose} className="bg-khrate-500 hover:bg-khrate-600">
            I Understand
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentInstructionsModal;
