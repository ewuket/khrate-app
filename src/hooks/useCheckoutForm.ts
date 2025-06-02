
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCartContext } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface DeliverySchedule {
  date: Date | undefined;
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
    date: undefined,
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
        delivery_date: deliverySchedule.date?.toISOString().split('T')[0],
        delivery_time_slot: deliverySchedule.timeSlot,
        payment_method: paymentMethod,
        payment_status: 'pending',
        status: 'pending',
        delivery_address: 'Default Address',
        phone_number: phoneNumber || null
      };

      const { error } = await supabase
        .from('orders')
        .insert([orderData]);

      if (error) throw error;

      toast.success('🎉 Your order has been successfully submitted to Khrate for confirmation. You will receive delivery updates soon!', {
        duration: 5000,
        style: {
          background: '#f0fdf4',
          border: '1px solid #22c55e',
          color: '#15803d'
        }
      });
      
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

  const handleDeliveryScheduleChange = (schedule: { date: Date | undefined; timeSlot: string }) => {
    setDeliverySchedule(schedule);
  };

  return {
    paymentMethod,
    setPaymentMethod,
    phoneNumber,
    setPhoneNumber,
    processingPayment,
    deliverySchedule,
    setDeliverySchedule: handleDeliveryScheduleChange,
    handlePayment
  };
};
