
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
    isSubmitting
  };
};
