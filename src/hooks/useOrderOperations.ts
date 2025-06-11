
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Order } from '@/types/order';
import { toast } from 'sonner';

export const useOrderOperations = () => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    if (!user?.id) {
      console.log('No user ID, checking localStorage for guest orders');
      const guestOrders = JSON.parse(localStorage.getItem(`khrate_orders_guest`) || '[]');
      setOrders(guestOrders);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching orders for user:', user.id);

      // Fetch from Supabase first
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

      // Also check localStorage as backup
      const localOrders = JSON.parse(localStorage.getItem(`khrate_orders_${user.id}`) || '[]');
      console.log('Local storage orders:', localOrders);

      // Combine and deduplicate orders
      const allOrders = [...(supabaseOrders || []), ...localOrders];
      const uniqueOrders = allOrders.reduce((acc, current) => {
        const existingOrder = acc.find(order => order.id === current.id);
        if (!existingOrder) {
          acc.push(current);
        }
        return acc;
      }, [] as Order[]);

      console.log('Combined unique orders:', uniqueOrders);

      // Sort by creation date
      uniqueOrders.sort((a, b) => 
        new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
      );

      setOrders(uniqueOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      
      // Fallback to localStorage only
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

  const saveOrder = async (orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newOrder: Order = {
        ...orderData,
        id: `order-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (isAuthenticated && user) {
        // Save to Supabase
        const { error } = await supabase
          .from('orders')
          .insert(newOrder);

        if (error) throw error;
        
        console.log('Order saved to Supabase');
      } else {
        // Save to localStorage for guest users
        const existingOrders = JSON.parse(localStorage.getItem('khrate_orders_guest') || '[]');
        existingOrders.unshift(newOrder);
        localStorage.setItem('khrate_orders_guest', JSON.stringify(existingOrders));
        console.log('Order saved to localStorage');
      }

      // Update local state
      setOrders(prevOrders => [newOrder, ...prevOrders]);
      
      return newOrder;
    } catch (error) {
      console.error('Error saving order:', error);
      toast.error('Failed to save order');
      return null;
    }
  };

  return {
    orders,
    loading,
    fetchOrders,
    saveOrder
  };
};
