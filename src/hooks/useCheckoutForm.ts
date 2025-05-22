
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";

interface UseCheckoutFormProps {
  onOpenChange: (open: boolean) => void;
  saveOrder: () => void;
  clearCart: () => void;
}

export const useCheckoutForm = ({
  onOpenChange,
  saveOrder,
  clearCart,
}: UseCheckoutFormProps) => {
  const [paymentMethod, setPaymentMethod] = useState("mtn");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [deliverySchedule, setDeliverySchedule] = useState<{
    date: Date | undefined;
    timeSlot: string;
  }>({ date: undefined, timeSlot: "afternoon" });
  
  const getTimeSlotText = (slot: string) => {
    switch(slot) {
      case "morning": return "8AM–11AM";
      case "midday": return "11AM–2PM";
      case "afternoon": return "2PM–5PM";
      case "evening": return "5PM–8PM";
      default: return "2PM–5PM";
    }
  };
  
  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate delivery date
    if (!deliverySchedule.date) {
      toast.error("Please select a delivery date");
      return;
    }
    
    setProcessingPayment(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessingPayment(false);
      onOpenChange(false);
      
      // Show the MoMo payment toast notification instead of an alert
      toast("Payment Required", {
        description: "To complete your order, please pay using the following number: 0795754391.",
        duration: 10000,
        action: {
          label: "Got it",
          onClick: () => console.log("Payment notice acknowledged"),
        },
      });
      
      // Save the order before clearing the cart
      saveOrder();
      clearCart();
      
      // Send confirmation with delivery details
      const deliveryTimeText = getTimeSlotText(deliverySchedule.timeSlot);
      const deliveryDateText = deliverySchedule.date ? format(deliverySchedule.date, "PPP") : "";
      
      toast.success("Your order has been placed!", {
        description: `Scheduled for delivery on ${deliveryDateText} between ${deliveryTimeText}.`,
        duration: 5000,
      });
    }, 2000);
  };

  return {
    paymentMethod,
    setPaymentMethod,
    phoneNumber,
    setPhoneNumber,
    processingPayment,
    deliverySchedule,
    setDeliverySchedule,
    handlePayment,
    getTimeSlotText,
  };
};
