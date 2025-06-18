
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

export const useOrderOperations = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchOrders = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const submitOrder = async (orderData: OrderData) => {
    setIsSubmitting(true);
    try {
      console.log('Submitting order:', orderData);

      const { data, error } = await supabase
        .from('orders')
        .insert([{
          ...orderData,
          status: 'pending',
          payment_status: 'pending'
        }])
        .select()
        .single();

      if (error) {
        console.error('Order submission error:', error);
        throw error;
      }

      console.log('Order submitted successfully:', data);
      toast.success('Order placed successfully!');
      
      // Refresh orders after successful submission
      fetchOrders();
      
      return {
        success: true,
        order: data
      };
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Failed to place order. Please try again.');
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  return {
    submitOrder,
    isSubmitting,
    orders,
    loading,
    fetchOrders
  };
};
