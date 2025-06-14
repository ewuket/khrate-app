
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface CheckoutFormData {
  phoneNumber: string;
  paymentMethod: 'momo' | 'bank_transfer' | 'cash_on_delivery';
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
  const { user, isAuthenticated } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    phoneNumber: '',
    paymentMethod: 'momo',
    deliveryDate: '',
    timeSlot: '',
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
      
      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id || null,
          items: JSON.stringify(orderData.items),
          total_amount: orderData.total_amount,
          original_amount: orderData.original_amount || orderData.total_amount,
          discount_applied: orderData.discount_applied || 0,
          discount_percentage: orderData.discount_percentage || 0,
          delivery_date: orderData.delivery_date,
          delivery_time_slot: orderData.delivery_time_slot,
          delivery_address: orderData.delivery_address,
          payment_method: orderData.payment_method,
          payment_status: 'pending',
          phone_number: orderData.phone_number,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving order to database:', error);
        throw error;
      }

      console.log('Order successfully saved to database:', data);
      return data;
    } catch (error) {
      console.error('Failed to save order to database:', error);
      throw error;
    }
  };

  const handlePayment = async (cartItems: any[], getCartTotal: () => number) => {
    if (!validateForm()) return;

    setIsProcessing(true);
    
    try {
      const orderNumber = `ORD-${Date.now()}`;
      const total = getCartTotal();
      
      // Prepare order data
      const orderData = {
        items: cartItems.map(item => ({
          id: item.id,
          name: item.product_name || item.name,
          price: item.product_price || item.price,
          quantity: item.quantity,
          unit: item.product_unit || item.unit || 'item'
        })),
        total_amount: total,
        original_amount: total,
        delivery_date: formData.deliveryDate,
        delivery_time_slot: formData.timeSlot,
        delivery_address: formData.deliveryAddress,
        payment_method: formData.paymentMethod,
        phone_number: formData.phoneNumber
      };

      // Save to database (this will make it visible to admin immediately)
      const savedOrder = await saveOrderToDatabase(orderData);

      // Save to localStorage as backup for user's order history
      const localOrderData = {
        id: savedOrder?.id || orderNumber,
        ...orderData,
        status: 'pending',
        payment_status: 'pending',
        created_at: new Date().toISOString()
      };

      if (isAuthenticated && user) {
        const existingOrders = JSON.parse(localStorage.getItem(`khrate_orders_${user.id}`) || '[]');
        existingOrders.unshift(localOrderData);
        localStorage.setItem(`khrate_orders_${user.id}`, JSON.stringify(existingOrders));
      } else {
        const existingOrders = JSON.parse(localStorage.getItem('khrate_orders_guest') || '[]');
        existingOrders.unshift(localOrderData);
        localStorage.setItem('khrate_orders_guest', JSON.stringify(existingOrders));
      }

      // Set order details for success modal
      setOrderDetails({
        orderNumber,
        phoneNumber: formData.phoneNumber,
        totalAmount: total
      });

      // Call success callback and close checkout
      onSuccess();
      onOpenChange(false);
      
      // Show success modal immediately with proper RWF formatting
      setShowSuccessModal(true);

      toast.success(`Order placed successfully! Total: ${total.toLocaleString()} RWF`);
      
      console.log('Order processed successfully and will appear in admin dashboard');
      
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Payment processing failed. Please try again.');
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
