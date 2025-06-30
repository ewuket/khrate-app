
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAdminOperations = () => {
  const updateOrderStatus = async (orderId: string, newStatus: string): Promise<boolean> => {
    try {
      console.log('Updating order status:', orderId, 'to:', newStatus);
      
      const { data, error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', orderId)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error updating order status:', error);
        throw error;
      }

      if (!data) {
        throw new Error('Order not found or no changes made');
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
      
      const { data, error } = await supabase
        .from('orders')
        .update({ 
          payment_status: newPaymentStatus, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', orderId)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error updating payment status:', error);
        throw error;
      }

      if (!data) {
        throw new Error('Order not found or no changes made');
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
      
      const { data, error } = await supabase
        .from('bundles')
        .update({ 
          is_featured: !isFeatured,
          updated_at: new Date().toISOString()
        })
        .eq('id', bundleId)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error toggling bundle featured status:', error);
        throw error;
      }

      if (!data) {
        throw new Error('Bundle not found or no changes made');
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
      
      const { data, error } = await supabase
        .from('bundles')
        .update({ 
          is_active: !isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', bundleId)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error toggling bundle active status:', error);
        throw error;
      }

      if (!data) {
        throw new Error('Bundle not found or no changes made');
      }

      console.log('Bundle status updated successfully:', data);
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
      
      const { data, error } = await supabase
        .from('group_sessions')
        .update({ 
          is_featured: !isFeatured,
          updated_at: new Date().toISOString()
        })
        .eq('id', groupId)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error toggling group featured status:', error);
        throw error;
      }

      if (!data) {
        throw new Error('Group not found or no changes made');
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
