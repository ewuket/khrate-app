
import { useState } from 'react';
import { toast } from 'sonner';

interface CheckoutFormProps {
  onSuccess: () => void;
  onOpenChange: (open: boolean) => void;
}

export const useCheckoutForm = ({ onSuccess, onOpenChange }: CheckoutFormProps) => {
  const [paymentMethod, setPaymentMethod] = useState('mtn');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [deliverySchedule, setDeliverySchedule] = useState({ date: '', timeSlot: '' });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!deliverySchedule.date || !deliverySchedule.timeSlot) {
      toast.error('Please select a delivery date and time slot');
      return;
    }

    if (paymentMethod === 'mtn' && !phoneNumber) {
      toast.error('Please enter your phone number for MTN Mobile Money');
      return;
    }

    setProcessingPayment(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate order details
      const orderNumber = `KH${Date.now().toString().slice(-6)}`;
      const orderData = {
        orderNumber,
        total: Math.floor(Math.random() * 100000) + 10000, // Mock total
        deliveryDate: deliverySchedule.date,
        deliveryTimeSlot: deliverySchedule.timeSlot
      };

      setOrderDetails(orderData);
      setShowSuccessModal(true);
      onOpenChange(false);
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
    showSuccessModal,
    setShowSuccessModal,
    orderDetails,
    handlePayment
  };
};
