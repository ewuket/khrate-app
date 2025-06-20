
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface CheckoutFormData {
  phoneNumber: string;
  paymentMethod: 'mtn' | 'airtel' | 'card';
  deliveryDate: string;
  timeSlot: string;
  deliveryAddress: string;
}

interface OrderDetails {
  orderNumber: string;
  phoneNumber: string;
  totalAmount: number;
}

interface UseCheckoutFormProps {
  onSuccess: () => void;
  onOpenChange: (open: boolean) => void;
}

export const useCheckoutForm = ({ onSuccess, onOpenChange }: UseCheckoutFormProps) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    phoneNumber: '',
    paymentMethod: 'mtn',
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

  const saveOrderToDatabase = async (orderData: any) => {
    try {
      console.log('Saving order to database:', orderData);
      
      const orderPayload = {
        user_id: user?.id || null,
        items: JSON.stringify(orderData.items),
        total_amount: Number(orderData.total_amount),
        original_amount: Number(orderData.original_amount || orderData.total_amount),
        discount_applied: Number(orderData.discount_applied || 0),
        discount_percentage: Number(orderData.discount_percentage || 0),
        delivery_date: orderData.delivery_date,
        delivery_time_slot: orderData.delivery_time_slot,
        delivery_address: orderData.delivery_address,
        payment_method: orderData.payment_method,
        payment_status: 'pending',
        phone_number: orderData.phone_number,
        status: 'pending'
      };

      console.log('Order payload being sent:', orderPayload);

      const { data, error } = await supabase
        .from('orders')
        .insert(orderPayload)
        .select()
        .single();

      if (error) {
        console.error('Database error details:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      if (!data) {
        throw new Error('No data returned from database insert');
      }

      console.log('Order successfully saved to database:', data);
      
      // Show success immediately
      toast.success('Order placed successfully! 🎉');
      
      return data;
    } catch (error) {
      console.error('Failed to save order to database:', error);
      throw error;
    }
  };

  const handlePayment = async (cartItems: any[], getCartTotal: () => number) => {
    // Check authentication first
    if (!isAuthenticated || !user) {
      toast.error('Please log in to place your order');
      openAuthModal();
      return;
    }

    if (!validateForm()) return;

    setIsProcessing(true);
    
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
        items: cartItems.map(item => ({
          id: item.id,
          name: item.product_name || item.name,
          price: Number(item.product_price || item.price),
          quantity: Number(item.quantity),
          unit: item.product_unit || item.unit || 'item',
          type: item.product_type || item.type || 'bundle'
        })),
        total_amount: total,
        original_amount: total,
        delivery_date: formData.deliveryDate,
        delivery_time_slot: formData.timeSlot,
        delivery_address: formData.deliveryAddress,
        payment_method: formData.paymentMethod,
        phone_number: formData.phoneNumber
      };

      console.log('Attempting to save order:', orderData);

      const savedOrder = await saveOrderToDatabase(orderData);
      
      if (!savedOrder || !savedOrder.id) {
        throw new Error('Failed to save order - no ID returned');
      }

      console.log('Order saved successfully with ID:', savedOrder.id);

      setOrderDetails({
        orderNumber: savedOrder.id,
        phoneNumber: formData.phoneNumber,
        totalAmount: total
      });

      // Save to localStorage as backup
      const localOrderData = {
        id: savedOrder.id,
        ...orderData,
        status: 'pending',
        payment_status: 'pending',
        created_at: new Date().toISOString()
      };

      if (isAuthenticated && user) {
        const existingOrders = JSON.parse(localStorage.getItem(`khrate_orders_${user.id}`) || '[]');
        existingOrders.unshift(localOrderData);
        localStorage.setItem(`khrate_orders_${user.id}`, JSON.stringify(existingOrders));
      }

      onSuccess();
      onOpenChange(false);
      setShowSuccessModal(true);
      
    } catch (error: any) {
      console.error('Error processing payment:', error);
      toast.error(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent, cartItems: any[], getCartTotal: () => number) => {
    e.preventDefault();
    handlePayment(cartItems, getCartTotal);
  };

  return {
    formData,
    isProcessing,
    showSuccessModal,
    orderDetails,
    setShowSuccessModal,
    handleInputChange,
    handlePayment,
    handleFormSubmit
  };
};
