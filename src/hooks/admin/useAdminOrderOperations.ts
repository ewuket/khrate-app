
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAdminOrderOperations = () => {
  const [loading, setLoading] = useState(false);

  const updateOrderStatus = async (orderId: string, newStatus: string): Promise<boolean> => {
    try {
      setLoading(true);
      console.log('🔄 Updating order status:', orderId, 'to', newStatus);

      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) {
        console.error('❌ Order status update error:', error);
        throw error;
      }

      console.log('✅ Order status updated successfully');
      toast.success(`Order status updated to ${newStatus}`);
      
      // Dispatch custom event to refresh admin stats
      window.dispatchEvent(new CustomEvent('refresh-admin-stats'));
      
      return true;

    } catch (error: any) {
      console.error('❌ Order status update failed:', error);
      toast.error(error.message || 'Failed to update order status');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (orderId: string, newPaymentStatus: string): Promise<boolean> => {
    try {
      setLoading(true);
      console.log('🔄 Updating payment status:', orderId, 'to', newPaymentStatus);

      const { error } = await supabase
        .from('orders')
        .update({ 
          payment_status: newPaymentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) {
        console.error('❌ Payment status update error:', error);
        throw error;
      }

      console.log('✅ Payment status updated successfully');
      toast.success(`Payment status updated to ${newPaymentStatus}`);
      
      // Dispatch custom event to refresh admin stats
      window.dispatchEvent(new CustomEvent('refresh-admin-stats'));
      
      return true;

    } catch (error: any) {
      console.error('❌ Payment status update failed:', error);
      toast.error(error.message || 'Failed to update payment status');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (orderId: string): Promise<boolean> => {
    try {
      setLoading(true);
      console.log('🔄 Deleting order:', orderId);

      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) {
        console.error('❌ Order deletion error:', error);
        throw error;
      }

      console.log('✅ Order deleted successfully');
      toast.success('Order deleted successfully');
      
      // Dispatch custom event to refresh admin stats
      window.dispatchEvent(new CustomEvent('refresh-admin-stats'));
      
      return true;

    } catch (error: any) {
      console.error('❌ Order deletion failed:', error);
      toast.error(error.message || 'Failed to delete order');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateOrderStatus,
    updatePaymentStatus,
    deleteOrder,
    loading
  };
};
