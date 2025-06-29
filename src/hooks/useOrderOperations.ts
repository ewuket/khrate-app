
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export interface OrderData {
  user_id?: string;
  items: any[];
  total_amount: number;
  original_amount: number;
  discount_applied?: number;
  discount_percentage?: number;
  delivery_address: string;
  delivery_date?: string;
  delivery_time_slot?: string;
  payment_method: string;
  phone_number?: string;
}

export interface OrderResult {
  success: boolean;
  order?: any;
  error?: string;
}

export const useOrderOperations = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const fetchOrders = async () => {
    if (!user) {
      console.log('No user authenticated, checking localStorage for guest orders');
      const guestOrders = JSON.parse(localStorage.getItem(`khrate_orders_guest`) || '[]');
      setOrders(guestOrders);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      console.log('Fetching orders for user:', user.id);
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }

      console.log('Fetched orders from Supabase:', data);
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      
      // Fallback to localStorage
      const localOrders = JSON.parse(localStorage.getItem(`khrate_orders_${user.id}`) || '[]');
      console.log('Fallback to localStorage orders:', localOrders);
      setOrders(localOrders);
      
      if (localOrders.length === 0) {
        toast.error('Failed to load orders');
      }
    } finally {
      setLoading(false);
    }
  };

  const submitOrder = async (orderData: OrderData): Promise<OrderResult> => {
    console.log('Starting order submission...', { isAuthenticated, userId: user?.id });
    
    if (!isAuthenticated || !user) {
      console.error('User not authenticated');
      toast.error('Please log in to place an order');
      return { success: false, error: 'User not authenticated' };
    }

    setIsSubmitting(true);
    try {
      console.log('Submitting order with data:', orderData);

      // Ensure items is properly formatted
      const formattedItems = orderData.items.map(item => ({
        id: item.id || item.product_id,
        name: item.name || item.product_name,
        price: Number(item.price || item.product_price),
        quantity: Number(item.quantity),
        unit: item.unit || item.product_unit || 'item',
        type: item.type || item.product_type || 'bundle'
      }));

      const orderPayload = {
        user_id: user.id,
        items: formattedItems,
        total_amount: Number(orderData.total_amount),
        original_amount: Number(orderData.original_amount || orderData.total_amount),
        discount_applied: Number(orderData.discount_applied || 0),
        discount_percentage: Number(orderData.discount_percentage || 0),
        delivery_address: orderData.delivery_address,
        delivery_date: orderData.delivery_date,
        delivery_time_slot: orderData.delivery_time_slot,
        payment_method: orderData.payment_method,
        phone_number: orderData.phone_number,
        status: 'pending',
        payment_status: 'pending'
      };

      console.log('Final order payload:', orderPayload);

      const { data, error } = await supabase
        .from('orders')
        .insert([orderPayload])
        .select()
        .single();

      if (error) {
        console.error('Order submission error:', error);
        throw error;
      }

      console.log('Order submitted successfully:', data);
      
      // Show success message with amount
      toast.success(
        `Order placed successfully! 🎉`, 
        {
          description: `Total amount: ${data.total_amount.toLocaleString()} RWF. Thank you for your order!`,
          duration: 5000
        }
      );
      
      // Refresh orders after successful submission
      await fetchOrders();
      
      return {
        success: true,
        order: data
      };
    } catch (error: any) {
      console.error('Error submitting order:', error);
      const errorMessage = error.message || 'Failed to place order';
      toast.error(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (user && isAuthenticated) {
      fetchOrders();
    }
  }, [user, isAuthenticated]);

  return {
    submitOrder,
    isSubmitting,
    orders,
    loading,
    fetchOrders
  };
};
