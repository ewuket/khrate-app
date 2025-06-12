
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCartContext } from '@/contexts/CartContext';
import { useOrderOperations } from '@/hooks/useOrderOperations';
import { toast } from 'sonner';

export const useCheckoutForm = () => {
  const { user, isAuthenticated } = useAuth();
  const { cart, clearCart, getCartTotal } = useCartContext();
  const { saveOrder } = useOrderOperations();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    deliveryAddress: '',
    phoneNumber: '',
    deliveryDate: '',
    timeSlot: '',
    paymentMethod: 'cash'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.deliveryAddress.trim()) {
      toast.error('Please enter delivery address');
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      toast.error('Please enter phone number');
      return false;
    }
    if (!formData.deliveryDate) {
      toast.error('Please select delivery date');
      return false;
    }
    if (!formData.timeSlot) {
      toast.error('Please select time slot');
      return false;
    }
    return true;
  };

  const processOrder = async () => {
    if (!validateForm()) return false;
    
    setIsProcessing(true);
    try {
      const orderData = {
        user_id: user?.id,
        items: cart.map(item => ({
          id: item.product_id,
          name: item.product_name,
          price: item.product_price,
          quantity: item.quantity,
          unit: item.product_unit,
          type: item.product_type as 'bundle' | 'custom' | 'group',
          items: item.product_items
        })),
        total_amount: getCartTotal(),
        original_amount: getCartTotal(),
        status: 'pending' as const,
        delivery_address: formData.deliveryAddress,
        delivery_date: formData.deliveryDate,
        delivery_time_slot: formData.timeSlot,
        payment_method: formData.paymentMethod,
        payment_status: 'pending' as const,
        phone_number: formData.phoneNumber
      };

      const savedOrder = await saveOrder(orderData);
      if (savedOrder) {
        await clearCart();
        toast.success('Order placed successfully!');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error processing order:', error);
      toast.error('Failed to process order');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    formData,
    isProcessing,
    handleInputChange,
    processOrder,
    validateForm
  };
};
