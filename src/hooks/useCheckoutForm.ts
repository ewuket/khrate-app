
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
    
    console.log('handlePayment called - starting payment process');
    
    if (!deliverySchedule.date) {
      toast.error('Please select a delivery date');
      return;
    }

    if (!deliverySchedule.timeSlot) {
      toast.error('Please select a delivery time slot');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setProcessingPayment(true);

    try {
      const total = getCartTotal();
      const orderNumber = generateOrderNumber();

      console.log('Processing order with total:', total, 'cart items:', cart.length);

      // Ensure total is not zero
      if (total <= 0) {
        toast.error('Invalid order total. Please check your cart.');
        setProcessingPayment(false);
        return;
      }

      // Create order in database
      const orderData = {
        user_id: user?.id || null,
        items: cart.map(item => ({
          name: item.product_name,
          price: item.product_price,
          quantity: item.quantity,
          unit: item.product_unit,
          type: item.product_type,
          items: item.product_items || []
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

      console.log('Creating order with data:', orderData);

      const { data, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (error) {
        console.error('Supabase order creation error:', error);
        throw error;
      }

      console.log('Order created successfully:', data);

      // Save to localStorage for guest users or as backup
      const existingOrders = JSON.parse(localStorage.getItem(`khrate_orders_${user?.id || 'guest'}`) || '[]');
      const newOrder = {
        id: orderNumber,
        ...orderData,
        created_at: new Date().toISOString()
      };
      existingOrders.unshift(newOrder);
      localStorage.setItem(`khrate_orders_${user?.id || 'guest'}`, JSON.stringify(existingOrders));

      console.log('Order saved to localStorage');

      toast.success('Order placed successfully!');
      
      // Call success callback first
      onSuccess();
      
      // Close the checkout dialog
      onOpenChange(false);
      
      // Show success modal
      console.log('Setting showSuccessModal to true');
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
