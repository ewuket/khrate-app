
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useOrderOperations } from '@/hooks/useOrderOperations';
import { toast } from 'sonner';

interface CheckoutFormData {
  phoneNumber: string;
  paymentMethod: 'momo' | 'mtn' | 'card' | 'bank_transfer';
  deliveryDate: string;
  timeSlot: string;
  deliveryAddress: string;
}

interface OrderDetails {
  id: string;
  total_amount: number;
  items: any[];
  delivery_address: string;
  delivery_date: string;
  delivery_time_slot: string;
  payment_method: string;
}

interface UseCheckoutFormProps {
  onSuccess: () => void;
  onOpenChange: (open: boolean) => void;
}

export const useCheckoutForm = ({ onSuccess, onOpenChange }: UseCheckoutFormProps) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { submitOrder, isSubmitting } = useOrderOperations();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    phoneNumber: '',
    paymentMethod: 'momo',
    deliveryDate: '',
    timeSlot: 'afternoon',
    deliveryAddress: ''
  });

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.phoneNumber.trim()) {
      toast.error('Phone number is required');
      return false;
    }
    if (!formData.deliveryDate) {
      toast.error('Delivery date is required');
      return false;
    }
    if (!formData.timeSlot) {
      toast.error('Time slot is required');
      return false;
    }
    if (!formData.deliveryAddress.trim()) {
      toast.error('Delivery address is required');
      return false;
    }
    return true;
  };

  const handlePayment = async (cartItems: any[], getCartTotal: () => number) => {
    console.log('Checkout form - checking auth state:', { isAuthenticated, userId: user?.id });
    
    // Check authentication first
    if (!isAuthenticated || !user) {
      console.log('User not authenticated, opening auth modal');
      toast.error('Please log in to place your order');
      openAuthModal();
      return;
    }

    if (!validateForm()) {
      return;
    }
    
    try {
      const total = getCartTotal();
      
      // Validate total amount
      if (!total || total <= 0) {
        throw new Error('Invalid cart total. Please check your items.');
      }

      // Validate cart items
      if (!cartItems || cartItems.length === 0) {
        throw new Error('No items in cart');
      }

      console.log('Processing checkout with:', {
        user: user.id,
        total,
        itemCount: cartItems.length,
        formData
      });
      
      const orderData = {
        user_id: user.id,
        items: cartItems,
        total_amount: total,
        original_amount: total,
        delivery_date: formData.deliveryDate,
        delivery_time_slot: formData.timeSlot,
        delivery_address: formData.deliveryAddress,
        payment_method: formData.paymentMethod,
        phone_number: formData.phoneNumber
      };

      console.log('Submitting order:', orderData);

      const result = await submitOrder(orderData);
      
      if (result.success && result.order) {
        console.log('Order placed successfully:', result.order);

        setOrderDetails({
          id: result.order.id,
          total_amount: result.order.total_amount,
          items: result.order.items,
          delivery_address: result.order.delivery_address,
          delivery_date: result.order.delivery_date,
          delivery_time_slot: result.order.delivery_time_slot,
          payment_method: result.order.payment_method
        });

        onSuccess();
        onOpenChange(false);
        setShowSuccessModal(true);
      } else {
        throw new Error(result.error || 'Failed to place order');
      }
      
    } catch (error: any) {
      console.error('Error processing payment:', error);
      toast.error(error.message || 'Failed to place order. Please try again.');
    }
  };

  const handleFormSubmit = (e: React.FormEvent, cartItems: any[], getCartTotal: () => number) => {
    e.preventDefault();
    handlePayment(cartItems, getCartTotal);
  };

  return {
    formData,
    isProcessing: isSubmitting,
    showSuccessModal,
    orderDetails,
    setShowSuccessModal,
    handleInputChange,
    handlePayment,
    handleFormSubmit
  };
};
