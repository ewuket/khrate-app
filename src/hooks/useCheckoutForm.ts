
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { orderService } from "@/services/orderService";

interface UseCheckoutFormProps {
  onOpenChange: (open: boolean) => void;
  cartItems: any[];
  cartTotal: number;
  clearCart: () => void;
}

export const useCheckoutForm = ({
  onOpenChange,
  cartItems,
  cartTotal,
  clearCart,
}: UseCheckoutFormProps) => {
  const { isAuthenticated, user, profile } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState("mtn");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
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

  const calculateDiscount = () => {
    if (isAuthenticated && profile && profile.discount_orders_remaining > 0) {
      return Math.round(cartTotal * 0.1); // 10% discount
    }
    return 0;
  };

  const getTotalWithDiscount = () => {
    const discount = calculateDiscount();
    return cartTotal - discount;
  };
  
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!deliverySchedule.date) {
      toast.error("Please select a delivery date");
      return;
    }

    if (!deliveryAddress) {
      toast.error("Please enter your delivery address");
      return;
    }

    if (!isAuthenticated && !guestEmail) {
      toast.error("Please enter your email address");
      return;
    }
    
    setProcessingPayment(true);
    
    try {
      const discount = calculateDiscount();
      const finalTotal = getTotalWithDiscount();
      
      const orderData = {
        user_id: isAuthenticated ? user?.id : undefined,
        guest_email: !isAuthenticated ? guestEmail : undefined,
        items: cartItems,
        total_amount: finalTotal,
        discount_applied: discount,
        status: 'pending' as const,
        delivery_address: deliveryAddress,
        delivery_date: deliverySchedule.date ? format(deliverySchedule.date, "yyyy-MM-dd") : undefined,
        delivery_time_slot: deliverySchedule.timeSlot,
        payment_method: paymentMethod,
        payment_status: 'pending' as const
      };

      const { data, error } = await orderService.createOrder(orderData);
      
      if (error) {
        throw new Error('Failed to create order');
      }

      // Simulate payment processing
      setTimeout(() => {
        setProcessingPayment(false);
        onOpenChange(false);
        
        // Show payment instructions
        toast("Complete Your Payment", {
          description: `Send ${finalTotal.toLocaleString()} RWF to 0795754391 via ${paymentMethod.toUpperCase()} Mobile Money`,
          duration: 10000,
          action: {
            label: "Got it",
            onClick: () => console.log("Payment instructions acknowledged"),
          },
        });
        
        clearCart();
        
        // Show order confirmation
        const deliveryTimeText = getTimeSlotText(deliverySchedule.timeSlot);
        const deliveryDateText = deliverySchedule.date ? format(deliverySchedule.date, "PPP") : "";
        
        toast.success("Order placed successfully!", {
          description: `Delivery scheduled for ${deliveryDateText} between ${deliveryTimeText}.${discount > 0 ? ` You saved ${discount.toLocaleString()} RWF!` : ''}`,
          duration: 5000,
        });

        // Promote account creation for guest users
        if (!isAuthenticated) {
          setTimeout(() => {
            toast("Create an Account", {
              description: "Create an account to track orders and get 10% off your first 3 orders!",
              duration: 8000,
              action: {
                label: "Sign Up",
                onClick: () => {
                  console.log("User clicked sign up from toast");
                }
              }
            });
          }, 1000);
        }
      }, 2000);
      
    } catch (error) {
      setProcessingPayment(false);
      toast.error("Failed to place order. Please try again.");
      console.error('Order placement error:', error);
    }
  };

  return {
    paymentMethod,
    setPaymentMethod,
    phoneNumber,
    setPhoneNumber,
    guestEmail,
    setGuestEmail,
    deliveryAddress,
    setDeliveryAddress,
    processingPayment,
    deliverySchedule,
    setDeliverySchedule,
    handlePayment,
    getTimeSlotText,
    calculateDiscount,
    getTotalWithDiscount,
  };
};
