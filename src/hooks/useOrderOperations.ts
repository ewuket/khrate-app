
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Order } from '@/types/order';

interface OrderData {
  user_id: string;
  items: any[];
  total_amount: number;
  original_amount: number;
  delivery_date: string;
  delivery_time_slot: string;
  delivery_address: string;
  payment_method: string;
  phone_number: string;
}

interface OrderResult {
  success: boolean;
  order?: any;
  error?: string;
}

export const useOrderOperations = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchOrders = async () => {
    if (!user?.id) {
      console.log('No user ID, checking localStorage for guest orders');
      const guestOrders = JSON.parse(localStorage.getItem(`khrate_orders_guest`) || '[]');
      setOrders(guestOrders);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching orders for user:', user.id);

      const { data: supabaseOrders, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }

      console.log('Supabase orders:', supabaseOrders);

      const localOrders = JSON.parse(localStorage.getItem(`khrate_orders_${user.id}`) || '[]');
      console.log('Local storage orders:', localOrders);

      const allOrders = [...(supabaseOrders || []), ...localOrders];
      const uniqueOrders = allOrders.reduce((acc, current) => {
        const existingOrder = acc.find(order => order.id === current.id);
        if (!existingOrder) {
          acc.push(current);
        }
        return acc;
      }, [] as Order[]);

      console.log('Combined unique orders:', uniqueOrders);

      uniqueOrders.sort((a, b) => 
        new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
      );

      setOrders(uniqueOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      
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
    if (isSubmitting) {
      return { success: false, error: 'Order already being processed' };
    }

    setIsSubmitting(true);
    
    try {
      console.log('Submitting order with data:', orderData);

      // Validate required fields
      if (!orderData.user_id) {
        throw new Error('User ID is required');
      }
      
      if (!orderData.items || orderData.items.length === 0) {
        throw new Error('Order items are required');
      }
      
      if (!orderData.total_amount || orderData.total_amount <= 0) {
        throw new Error('Invalid order total');
      }

      if (!orderData.delivery_address?.trim()) {
        throw new Error('Delivery address is required');
      }

      if (!orderData.delivery_date) {
        throw new Error('Delivery date is required');
      }

      if (!orderData.payment_method) {
        throw new Error('Payment method is required');
      }

      if (!orderData.phone_number?.trim()) {
        throw new Error('Phone number is required');
      }

      // Prepare order data for insertion
      const insertData = {
        user_id: orderData.user_id,
        items: JSON.stringify(orderData.items),
        total_amount: orderData.total_amount,
        original_amount: orderData.original_amount,
        delivery_date: orderData.delivery_date,
        delivery_time_slot: orderData.delivery_time_slot,
        delivery_address: orderData.delivery_address.trim(),
        payment_method: orderData.payment_method,
        phone_number: orderData.phone_number.trim(),
        status: 'pending',
        payment_status: 'pending',
        discount_applied: 0,
        discount_percentage: 0
      };

      console.log('Inserting order with prepared data:', insertData);

      const { data: order, error } = await supabase
        .from('orders')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('Supabase order insertion error:', error);
        throw new Error(`Failed to create order: ${error.message}`);
      }

      if (!order) {
        throw new Error('Order was not created successfully');
      }

      console.log('Order created successfully:', order);
      
      // Refresh orders list after successful submission
      await fetchOrders();
      
      return {
        success: true,
        order: {
          ...order,
          items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items
        }
      };

    } catch (error: any) {
      console.error('Order submission error:', error);
      const errorMessage = error.message || 'Failed to place order. Please try again.';
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitOrder,
    isSubmitting,
    orders,
    loading,
    fetchOrders
  };
};
