
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAdminOperations = () => {
  const updateOrderStatus = async (orderId: string, status: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;

      toast.success('Order status updated');
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
      return false;
    }
  };

  const updatePaymentStatus = async (orderId: string, paymentStatus: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: paymentStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;

      toast.success('Payment status updated');
      return true;
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Failed to update payment status');
      return false;
    }
  };

  return {
    updateOrderStatus,
    updatePaymentStatus
  };
};
