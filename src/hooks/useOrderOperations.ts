
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

  return {
    submitOrder,
    isSubmitting
  };
};
