
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCartContext } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface DeliverySchedule {
  date: string;
  timeSlot: string;
}

interface UseCheckoutFormProps {
  onSuccess: () => void;
  onOpenChange: (open: boolean) => void;
}

export const useCheckoutForm = ({ onSuccess, onOpenChange }: UseCheckoutFormProps) => {
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [deliverySchedule, setDeliverySchedule] = useState<DeliverySchedule>({
    date: '',
    timeSlot: ''
  });

  const { user } = useAuth();
  const { cart, getCartTotal, clearCart } = useCartContext();

  const validateForm = () => {
    if (!deliverySchedule.date) {
      toast.error('Please select a delivery date');
      return false;
    }
    if (!deliverySchedule.timeSlot) {
      toast.error('Please select a delivery time slot');
      return false;
    }
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return false;
    }
    if ((paymentMethod === 'mtn' || paymentMethod === 'airtel') && !phoneNumber) {
      toast.error('Please enter your phone number');
      return false;
    }
    return true;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setProcessingPayment(true);

    try {
      const orderData = {
        user_id: user?.id || null,
        items: cart,
        original_amount: getCartTotal(),
        total_amount: getCartTotal(),
        delivery_date: deliverySchedule.date,
        delivery_time_slot: deliverySchedule.timeSlot,
        payment_method: paymentMethod,
        payment_status: 'pending',
        status: 'pending',
        delivery_address: 'Default Address', // This should be updated with actual address selection
        phone_number: phoneNumber || null
      };

      const { error } = await supabase
        .from('orders')
        .insert([orderData]);

      if (error) throw error;

      // Show success message
      toast.success('✅ Your order has been submitted. Khrate has been notified. You will receive delivery updates soon.');
      
      // Clear cart and close modal
      await clearCart();
      onOpenChange(false);
      onSuccess();

    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to place order. Please try again.');
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
    handlePayment
  };
};
