
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAdminOperations = () => {
  const updateOrderStatus = async (orderId: string, newStatus: string): Promise<boolean> => {
    try {
      console.log('🔄 Updating order status:', orderId, 'to:', newStatus);
      
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
        console.error('❌ Error updating order status:', error);
        throw new Error(`Failed to update order: ${error.message}`);
      }

      if (!data) {
        throw new Error('Order not found or no changes made');
      }

      console.log('✅ Order status updated successfully:', data);
      toast.success(`Order status updated to ${newStatus}`);
      return true;
    } catch (error: any) {
      console.error('❌ Critical error updating order status:', error);
      toast.error(error.message || 'Failed to update order status');
      return false;
    }
  };

  const updatePaymentStatus = async (orderId: string, newPaymentStatus: string): Promise<boolean> => {
    try {
      console.log('🔄 Updating payment status:', orderId, 'to:', newPaymentStatus);
      
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
        console.error('❌ Error updating payment status:', error);
        throw new Error(`Failed to update payment: ${error.message}`);
      }

      if (!data) {
        throw new Error('Order not found or no changes made');
      }

      console.log('✅ Payment status updated successfully:', data);
      toast.success(`Payment status updated to ${newPaymentStatus}`);
      return true;
    } catch (error: any) {
      console.error('❌ Critical error updating payment status:', error);
      toast.error(error.message || 'Failed to update payment status');
      return false;
    }
  };

  const toggleBundleFeatured = async (bundleId: number, isFeatured: boolean): Promise<boolean> => {
    try {
      console.log('🔄 Toggling bundle featured status:', bundleId, 'from', isFeatured, 'to', !isFeatured);
      
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
        console.error('❌ Error toggling bundle featured status:', error);
        throw new Error(`Failed to update bundle: ${error.message}`);
      }

      if (!data) {
        throw new Error('Bundle not found or no changes made');
      }

      console.log('✅ Bundle featured status updated successfully:', data);
      toast.success(`Bundle ${!isFeatured ? 'featured' : 'unfeatured'} successfully`);
      return true;
    } catch (error: any) {
      console.error('❌ Critical error toggling bundle featured status:', error);
      toast.error(error.message || 'Failed to update bundle featured status');
      return false;
    }
  };

  const toggleBundleActive = async (bundleId: number, isActive: boolean): Promise<boolean> => {
    try {
      console.log('🔄 Toggling bundle active status:', bundleId, 'from', isActive, 'to', !isActive);
      
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
        console.error('❌ Error toggling bundle active status:', error);
        throw new Error(`Failed to update bundle: ${error.message}`);
      }

      if (!data) {
        throw new Error('Bundle not found or no changes made');
      }

      console.log('✅ Bundle active status updated successfully:', data);
      toast.success(`Bundle ${!isActive ? 'activated' : 'deactivated'} successfully`);
      return true;
    } catch (error: any) {
      console.error('❌ Critical error toggling bundle active status:', error);
      toast.error(error.message || 'Failed to update bundle active status');
      return false;
    }
  };

  const toggleGroupFeatured = async (groupId: string, isFeatured: boolean): Promise<boolean> => {
    try {
      console.log('🔄 Toggling group featured status:', groupId, 'from', isFeatured, 'to', !isFeatured);
      
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
        console.error('❌ Error toggling group featured status:', error);
        throw new Error(`Failed to update group: ${error.message}`);
      }

      if (!data) {
        throw new Error('Group not found or no changes made');
      }

      console.log('✅ Group featured status updated successfully:', data);
      toast.success(`Group ${!isFeatured ? 'featured' : 'unfeatured'} successfully`);
      return true;
    } catch (error: any) {
      console.error('❌ Critical error toggling group featured status:', error);
      toast.error(error.message || 'Failed to update group featured status');
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
