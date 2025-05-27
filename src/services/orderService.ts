import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Order {
  id?: string;
  user_id?: string;
  guest_email?: string;
  items: any[];
  total_amount: number;
  discount_applied?: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  delivery_address: string;
  delivery_date?: string;
  delivery_time_slot?: string;
  payment_method: string;
  payment_status: 'pending' | 'completed' | 'failed';
  created_at?: string;
}

export const OrderService = {
  async createOrder(orderData: Order) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (error) throw error;

      // If user has discount orders remaining, update the count
      if (orderData.user_id && orderData.discount_applied && orderData.discount_applied > 0) {
        await this.updateUserDiscountCount(orderData.user_id);
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Order creation error:', error);
      return { data: null, error };
    }
  },

  async updateUserDiscountCount(userId: string) {
    try {
      // Decrement the discount orders remaining
      const { error } = await supabase.rpc('decrement_discount_orders', {
        user_id: userId
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating discount count:', error);
    }
  },

  async getUserOrders(userId: string) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  },

  async calculateDiscount(userId?: string, total: number = 0) {
    if (!userId) return 0;

    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('discount_orders_remaining')
        .eq('id', userId)
        .single();

      if (profile && profile.discount_orders_remaining > 0) {
        return Math.round(total * 0.1); // 10% discount
      }

      return 0;
    } catch (error) {
      console.error('Error calculating discount:', error);
      return 0;
    }
  }
};

// Keep backward compatibility
export const orderService = OrderService;
