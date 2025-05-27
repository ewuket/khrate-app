
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { OrderService } from "@/services/orderService";

export interface UseCheckoutFormProps {
  onSuccess: () => void;
}

export const useCheckoutForm = ({ onSuccess }: UseCheckoutFormProps) => {
  const { cart, clearCart } = useCart();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  
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

  const processOrder = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);
    
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
        paymentMethod: formData.paymentMethod,
        scheduledDate: formData.scheduledDate,
        timeSlot: formData.timeSlot,
        total: calculateTotal(),
        userId: user?.id
      };

      const orderId = await OrderService.createOrder(orderData);
      
      // Clear cart and show success
      clearCart();
      toast.success("Order placed successfully!");
      onSuccess();
      
      return orderId;
    } catch (error) {
      console.error("Order processing error:", error);
      toast.error("Failed to process order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    handleInputChange,
    processOrder,
    calculateTotal
  };
};
