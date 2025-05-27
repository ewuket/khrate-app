
import { supabase } from "@/integrations/supabase/client";
import { Order } from "@/types/order";

export const saveOrder = async (orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    // Insert the order into the database
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        user_id: orderData.user_id,
        items: orderData.items,
        total_amount: orderData.total_amount,
        original_amount: orderData.original_amount || orderData.total_amount,
        discount_applied: orderData.discount_applied || 0,
        discount_percentage: orderData.discount_percentage || 0,
        status: orderData.status || 'pending',
        delivery_address: orderData.delivery_address,
        delivery_date: orderData.delivery_date,
        delivery_time_slot: orderData.delivery_time_slot,
        payment_method: orderData.payment_method,
        payment_status: orderData.payment_status || 'pending',
        phone_number: orderData.phone_number
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving order:', error);
    throw error;
  }
};

export const applyUserDiscount = async (userId: string, orderTotal: number) => {
  try {
    const { data, error } = await supabase.rpc('apply_user_discount', {
      p_user_id: userId,
      p_order_total: orderTotal
    });

    if (error) throw error;
    return data[0]; // RPC returns array, get first result
  } catch (error) {
    console.error('Error applying discount:', error);
    throw error;
  }
};

export const getUserOrders = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};
