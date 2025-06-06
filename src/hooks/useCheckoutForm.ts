
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCartContext } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface UseCheckoutFormProps {
  onSuccess: () => void;
  onOpenChange: (open: boolean) => void;
}

export const useCheckoutForm = ({ onSuccess, onOpenChange }: UseCheckoutFormProps) => {
  const { user } = useAuth();
  const { cart, getCartTotal } = useCartContext();
  
  const [paymentMethod, setPaymentMethod] = useState('mtn');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [deliverySchedule, setDeliverySchedule] = useState<{
    date: string;
    timeSlot: string;
  }>({ date: '', timeSlot: '' });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const generateOrderNumber = () => {
    return `KH${Date.now().toString().slice(-6)}`;
  };

  const handleDeliveryScheduleChange = (schedule: { date: Date | undefined; timeSlot: string }) => {
    setDeliverySchedule({
      date: schedule.date ? schedule.date.toISOString().split('T')[0] : '',
      timeSlot: schedule.timeSlot
    });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!deliverySchedule.date) {
      toast.error('Please select a delivery date');
      return;
    }

    if (!deliverySchedule.timeSlot) {
      toast.error('Please select a delivery time slot');
      return;
    }

    setProcessingPayment(true);

    try {
      const total = getCartTotal();
      const orderNumber = generateOrderNumber();

      // Create order in database
      const orderData = {
        user_id: user?.id || null,
        items: cart.map(item => ({
          name: item.product_name,
          price: item.product_price,
          quantity: item.quantity,
          unit: item.product_unit
        })),
        total_amount: total,
        original_amount: total,
        discount_applied: 0,
        delivery_address: 'Default Address', // This should come from user profile
        delivery_date: deliverySchedule.date,
        delivery_time_slot: deliverySchedule.timeSlot,
        payment_method: paymentMethod,
        payment_status: 'completed', // Simulate successful payment
        status: 'confirmed',
        phone_number: phoneNumber
      };

      const { data, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (error) throw error;

      // Save to localStorage for guest users or as backup
      const existingOrders = JSON.parse(localStorage.getItem(`khrate_orders_${user?.id || 'guest'}`) || '[]');
      const newOrder = {
        id: orderNumber,
        ...orderData,
        created_at: new Date().toISOString()
      };
      existingOrders.unshift(newOrder);
      localStorage.setItem(`khrate_orders_${user?.id || 'guest'}`, JSON.stringify(existingOrders));

      toast.success('Order placed successfully!');
      onSuccess();
      onOpenChange(false);
      setShowSuccessModal(true);

    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to process payment. Please try again.');
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
    setDeliverySchedule: handleDeliveryScheduleChange,
    showSuccessModal,
    setShowSuccessModal,
    handlePayment
  };
};
