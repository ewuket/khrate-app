
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAdminOperations = () => {
  const updateOrderStatus = async (orderId: string, newStatus: string): Promise<boolean> => {
    try {
      console.log('Updating order status:', orderId, 'to:', newStatus);
      
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', orderId);

      if (error) {
        console.error('Error updating order status:', error);
        throw error;
      }

      toast.success(`Order status updated to ${newStatus}`);
      return true;
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast.error(`Failed to update order status: ${error.message}`);
      return false;
    }
  };

  const updatePaymentStatus = async (orderId: string, newPaymentStatus: string): Promise<boolean> => {
    try {
      console.log('Updating payment status:', orderId, 'to:', newPaymentStatus);
      
      const { error } = await supabase
        .from('orders')
        .update({ 
          payment_status: newPaymentStatus, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', orderId);

      if (error) {
        console.error('Error updating payment status:', error);
        throw error;
      }

      toast.success(`Payment status updated to ${newPaymentStatus}`);
      return true;
    } catch (error: any) {
      console.error('Error updating payment status:', error);
      toast.error(`Failed to update payment status: ${error.message}`);
      return false;
    }
  };

  const toggleBundleFeatured = async (bundleId: number, isFeatured: boolean): Promise<boolean> => {
    try {
      console.log('Toggling bundle featured status:', bundleId, 'to:', !isFeatured);
      
      const { error } = await supabase
        .from('bundles')
        .update({ 
          is_featured: !isFeatured,
          updated_at: new Date().toISOString()
        })
        .eq('id', bundleId);

      if (error) {
        console.error('Error toggling bundle featured status:', error);
        throw error;
      }

      toast.success(`Bundle ${!isFeatured ? 'featured' : 'unfeatured'} successfully`);
      return true;
    } catch (error: any) {
      console.error('Error toggling bundle featured status:', error);
      toast.error(`Failed to update bundle: ${error.message}`);
      return false;
    }
  };

  const toggleBundleActive = async (bundleId: number, isActive: boolean): Promise<boolean> => {
    try {
      console.log('Toggling bundle active status:', bundleId, 'to:', !isActive);
      
      const { error } = await supabase
        .from('bundles')
        .update({ 
          is_active: !isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', bundleId);

      if (error) {
        console.error('Error toggling bundle active status:', error);
        throw error;
      }

      toast.success(`Bundle ${!isActive ? 'activated' : 'deactivated'} successfully`);
      return true;
    } catch (error: any) {
      console.error('Error toggling bundle active status:', error);
      toast.error(`Failed to update bundle: ${error.message}`);
      return false;
    }
  };

  const toggleGroupFeatured = async (groupId: string, isFeatured: boolean): Promise<boolean> => {
    try {
      console.log('Toggling group featured status:', groupId, 'to:', !isFeatured);
      
      const { error } = await supabase
        .from('group_sessions')
        .update({ 
          is_featured: !isFeatured,
          updated_at: new Date().toISOString()
        })
        .eq('id', groupId);

      if (error) {
        console.error('Error toggling group featured status:', error);
        throw error;
      }

      toast.success(`Group ${!isFeatured ? 'featured' : 'unfeatured'} successfully`);
      return true;
    } catch (error: any) {
      console.error('Error toggling group featured status:', error);
      toast.error(`Failed to update group: ${error.message}`);
      return false;
    }
  };

  return {
    updateOrderStatus,
    updatePaymentStatus,
    toggleBundleFeatured,
    toggleBundleActive,
    toggleGroupFeatured
  };
};
