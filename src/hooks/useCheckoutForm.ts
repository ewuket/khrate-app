
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { OrderService } from "@/services/orderService";

export interface UseCheckoutFormProps {
  onSuccess: () => void;
  onOpenChange?: (open: boolean) => void;
}

export const useCheckoutForm = ({ onSuccess, onOpenChange }: UseCheckoutFormProps) => {
  const { cart, clearCart } = useCart();
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

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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

    setLoading(true);
    setProcessingPayment(true);
    
    try {
      const orderData = {
        items: cart,
        customerInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          notes: formData.notes
        },
        paymentMethod: paymentMethod,
        scheduledDate: deliverySchedule.date,
        timeSlot: deliverySchedule.timeSlot,
        total: calculateTotal(),
        userId: user?.id
      };

      const orderId = await OrderService.createOrder(orderData);
      
      // Clear cart and show success
      clearCart();
      toast.success("Order placed successfully!");
      onOpenChange?.(false);
      onSuccess();
      
      return orderId;
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
    setPaymentMethod,
    phoneNumber,
    setPhoneNumber,
    deliverySchedule,
    setDeliverySchedule,
    handleInputChange,
    processOrder,
    calculateTotal,
    handlePayment
  };
};
