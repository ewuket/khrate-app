
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { OrderService } from '@/services/orderService';

interface DeliverySchedule {
  date: string;
  timeSlot: string;
}

interface OrderDetails {
  orderNumber: string;
  phoneNumber: string;
}

interface UseCheckoutFormProps {
  onSuccess: () => void;
  onOpenChange: (open: boolean) => void;
}

export const useCheckoutForm = ({ onSuccess, onOpenChange }: UseCheckoutFormProps) => {
  const { user, isAuthenticated } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [deliverySchedule, setDeliverySchedule] = useState<DeliverySchedule>({
    date: '',
    timeSlot: ''
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!deliverySchedule.date || !deliverySchedule.timeSlot) {
      toast.error('Please select a delivery date and time slot');
      return;
    }

    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    if ((paymentMethod === 'mtn' || paymentMethod === 'airtel') && !phoneNumber) {
      toast.error('Please enter your phone number');
      return;
    }

    setProcessingPayment(true);

    try {
      // Generate order number
      const orderNumber = `ORD-${Date.now()}`;
      
      // Create order details
      const newOrderDetails: OrderDetails = {
        orderNumber,
        phoneNumber: phoneNumber || 'N/A'
      };

      setOrderDetails(newOrderDetails);

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Close checkout dialog and show success modal
      onOpenChange(false);
      setShowSuccessModal(true);
      
      // Call success callback (clears cart, etc.)
      onSuccess();
      
      toast.success('Order placed successfully!');
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
    handlePayment,
    showSuccessModal,
    setShowSuccessModal,
    orderDetails
  };
};
