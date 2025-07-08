
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export const useAdminOrderOperations = () => {
  const queryClient = useQueryClient();

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      console.log('🔄 Updating order status:', orderId, 'to', newStatus);
      
      const { data, error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating order status:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      console.log('✅ Order status updated successfully:', data);
      toast.success(`Order status updated to ${newStatus}`);
      
      // Invalidate relevant queries to refresh stats
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin-order-source-stats'] });
      
      // Trigger a refresh of admin data
      window.dispatchEvent(new CustomEvent('refresh-admin-stats'));
      
      return true;
    } catch (error: any) {
      console.error('❌ Failed to update order status:', error);
      toast.error(error.message || 'Failed to update order status');
      return false;
    }
  };

  const updatePaymentStatus = async (orderId: string, newPaymentStatus: string) => {
    try {
      console.log('🔄 Updating payment status:', orderId, 'to', newPaymentStatus);
      
      const { data, error } = await supabase
        .from('orders')
        .update({ 
          payment_status: newPaymentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating payment status:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      console.log('✅ Payment status updated successfully:', data);
      toast.success(`Payment status updated to ${newPaymentStatus}`);
      
      // Invalidate relevant queries to refresh stats and revenue
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin-order-source-stats'] });
      
      // Trigger a refresh of admin data to update revenue calculations
      window.dispatchEvent(new CustomEvent('refresh-admin-stats'));
      
      return true;
    } catch (error: any) {
      console.error('❌ Failed to update payment status:', error);
      toast.error(error.message || 'Failed to update payment status');
      return false;
    }
  };

  return {
    updateOrderStatus,
    updatePaymentStatus
  };
};
