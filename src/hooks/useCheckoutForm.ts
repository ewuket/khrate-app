
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCartContext } from '@/contexts/CartContext';
import { useOrderOperations } from '@/hooks/useOrderOperations';
import { toast } from 'sonner';

interface UseCheckoutFormProps {
  onSuccess?: () => void;
  onOpenChange?: (open: boolean) => void;
}

export const useCheckoutForm = (props?: UseCheckoutFormProps) => {
  const { user, isAuthenticated } = useAuth();
  const { cart, clearCart, getCartTotal } = useCartContext();
  const { saveOrder } = useOrderOperations();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  
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

  const handlePayment = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
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

      console.log('Submitting order:', orderData);
      const savedOrder = await saveOrder(orderData);
      
      if (savedOrder) {
        console.log('Order saved successfully:', savedOrder);
        
        setOrderDetails({
          orderId: savedOrder.id,
          phoneNumber: formData.phoneNumber,
          totalAmount: getCartTotal(),
          items: cart.map(item => ({
            name: item.product_name,
            quantity: item.quantity,
            price: item.product_price
          }))
        });
        
        // Clear the cart after successful order
        await clearCart();
        
        // Close checkout dialog
        if (props?.onOpenChange) {
          props.onOpenChange(false);
        }
        
        // Show success modal
        setShowSuccessModal(true);
        
        toast.success('Order placed successfully!');
        
        if (props?.onSuccess) {
          props.onSuccess();
        }
        
        return true;
      } else {
        throw new Error('Failed to save order');
      }
    } catch (error) {
      console.error('Error processing order:', error);
      toast.error('Failed to process order. Please try again.');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper getters for backward compatibility
  const paymentMethod = formData.paymentMethod;
  const setPaymentMethod = (method: string) => handleInputChange('paymentMethod', method);
  const phoneNumber = formData.phoneNumber;
  const setPhoneNumber = (phone: string) => handleInputChange('phoneNumber', phone);
  const deliverySchedule = {
    date: formData.deliveryDate,
    timeSlot: formData.timeSlot
  };
  const setDeliverySchedule = (schedule: { date: string; timeSlot: string }) => {
    handleInputChange('deliveryDate', schedule.date);
    handleInputChange('timeSlot', schedule.timeSlot);
  };
  const deliveryAddress = formData.deliveryAddress;
  const setDeliveryAddress = (address: string) => handleInputChange('deliveryAddress', address);
  const processingPayment = isProcessing;

  return {
    formData,
    isProcessing,
    processingPayment,
    handleInputChange,
    processOrder: handlePayment,
    validateForm,
    paymentMethod,
    setPaymentMethod,
    phoneNumber,
    setPhoneNumber,
    deliverySchedule,
    setDeliverySchedule,
    deliveryAddress,
    setDeliveryAddress,
    handlePayment,
    showSuccessModal,
    setShowSuccessModal,
    orderDetails
  };
};
