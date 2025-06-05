
import { useState } from "react";
import { toast } from "sonner";

interface DeliverySchedule {
  date: string;
  timeSlot: string;
}

interface UseCheckoutFormProps {
  onSuccess: () => void;
  onOpenChange: (open: boolean) => void;
}

export const useCheckoutForm = ({ onSuccess, onOpenChange }: UseCheckoutFormProps) => {
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [deliverySchedule, setDeliverySchedule] = useState<DeliverySchedule>({
    date: "",
    timeSlot: ""
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handlePayment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!deliverySchedule.date) {
      toast.error("Please select a delivery date");
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    if ((paymentMethod === "mtn" || paymentMethod === "airtel") && !phoneNumber) {
      toast.error("Please enter your phone number");
      return;
    }

    setProcessingPayment(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Close the checkout dialog
      onOpenChange(false);
      
      // Show success modal
      setShowSuccessModal(true);
      
      // Call the success callback (clear cart, etc.)
      onSuccess();
      
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  return {
    paymentMethod,
    setPaymentMethod,
    phoneNumber,
    setPhoneNumber,
    processingPayment,
    deliverySchedule,
    setDeliverySchedule,
    showSuccessModal,
    setShowSuccessModal,
    handlePayment
  };
};
