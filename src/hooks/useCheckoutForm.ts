
import { useState } from "react";
import { toast } from "sonner";
import { useSupabaseCart } from "@/contexts/SupabaseCartContext";
import { useAuth } from "@/contexts/AuthContext";
import { createOrder } from "@/services/orderService";

export interface UseCheckoutFormProps {
  onSuccess: () => void;
  onOpenChange?: (open: boolean) => void;
}

export const useCheckoutForm = ({ onSuccess, onOpenChange }: UseCheckoutFormProps) => {
  const { cart, clearCart } = useSupabaseCart();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"mtn" | "airtel" | "bank">("mtn");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deliverySchedule, setDeliverySchedule] = useState({
    date: "",
    timeSlot: ""
  });
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
    paymentMethod: "mtn" as "mtn" | "bank",
    scheduledDate: "",
    timeSlot: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDeliveryScheduleChange = (schedule: { date: Date | undefined, timeSlot: string }) => {
    const dateString = schedule.date ? schedule.date.toISOString().split('T')[0] : "";
    setDeliverySchedule({
      date: dateString,
      timeSlot: schedule.timeSlot
    });
  };

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method as "mtn" | "airtel" | "bank");
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.product_price * item.quantity), 0);
    const discount = profile?.discount_orders_remaining > 0 ? subtotal * 0.1 : 0;
    return subtotal - discount;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    await processOrder();
  };

  const processOrder = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!deliverySchedule.date) {
      toast.error("Please select a delivery date");
      return;
    }

    if (!phoneNumber && (paymentMethod === "mtn" || paymentMethod === "airtel")) {
      toast.error("Please enter the number you used to make the payment");
      return;
    }

    setLoading(true);
    setProcessingPayment(true);
    
    try {
      const total = calculateTotal();
      const discount = profile?.discount_orders_remaining > 0 ? total * 0.1 : 0;

      const orderData = {
        user_id: user?.id,
        guest_email: !user ? formData.email : undefined,
        items: cart,
        total_amount: total,
        original_amount: total + discount,
        discount_applied: discount,
        status: 'pending' as const,
        delivery_address: formData.address,
        delivery_date: deliverySchedule.date,
        delivery_time_slot: deliverySchedule.timeSlot,
        payment_method: paymentMethod,
        payment_status: 'pending' as const,
        phone_number: phoneNumber || formData.phone
      };

      const result = await createOrder(orderData);
      
      if (result.error) {
        throw new Error(result.error.message || 'Failed to create order');
      }
      
      // Clear cart and show success
      clearCart();
      toast.success("Thank you! Your payment has been noted. Our team will confirm and deliver your order shortly.");
      onOpenChange?.(false);
      onSuccess();
      
      return result.data?.id;
    } catch (error) {
      console.error("Order processing error:", error);
      toast.error("Failed to process order. Please try again.");
    } finally {
      setLoading(false);
      setProcessingPayment(false);
    }
  };

  return {
    formData,
    loading,
    processingPayment,
    paymentMethod,
    setPaymentMethod: handlePaymentMethodChange,
    phoneNumber,
    setPhoneNumber,
    deliverySchedule,
    setDeliverySchedule: handleDeliveryScheduleChange,
    handleInputChange,
    processOrder,
    calculateTotal,
    handlePayment
  };
};
