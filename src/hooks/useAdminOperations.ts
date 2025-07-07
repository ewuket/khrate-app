
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export const useAdminOperations = () => {
  const [isToggling, setIsToggling] = useState<string | null>(null);
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
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      
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
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      
      return true;
    } catch (error: any) {
      console.error('❌ Failed to update payment status:', error);
      toast.error(error.message || 'Failed to update payment status');
      return false;
    }
  };

  const toggleCustomItemActive = async (itemId: number, currentActiveStatus: boolean) => {
    if (!itemId) {
      throw new Error('Item ID is required');
    }

    setIsToggling(`custom-item-${itemId}`);
    
    try {
      const newActiveStatus = !currentActiveStatus;
      console.log('🔄 Toggling custom item active status:', itemId, 'from', currentActiveStatus, 'to', newActiveStatus);
      
      const { data, error } = await supabase.rpc('update_custom_item_safe', {
        item_id: itemId,
        item_data: { 
          is_active: newActiveStatus
        }
      });

      if (error) {
        console.error('❌ Error toggling custom item status:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error('Item not found or no changes were made');
      }

      console.log('✅ Custom item status updated successfully:', data[0]);
      toast.success(`Item ${newActiveStatus ? 'activated' : 'deactivated'} successfully`);
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['admin-custom-items'] });
      queryClient.invalidateQueries({ queryKey: ['custom-buy-items'] });
      
      return true;
    } catch (error: any) {
      console.error('❌ Failed to toggle custom item status:', error);
      toast.error(error.message || 'Failed to update item status');
      return false;
    } finally {
      setIsToggling(null);
    }
  };

  const toggleBundleActive = async (bundleId: number, currentActiveStatus: boolean) => {
    if (!bundleId) {
      throw new Error('Bundle ID is required');
    }

    setIsToggling(`bundle-${bundleId}`);
    
    try {
      const newActiveStatus = !currentActiveStatus;
      console.log('🔄 Toggling bundle active status:', bundleId, 'from', currentActiveStatus, 'to', newActiveStatus);
      
      const { data, error } = await supabase.rpc('update_bundle_safe', {
        bundle_id: bundleId,
        bundle_data: { 
          is_active: newActiveStatus
        }
      });

      if (error) {
        console.error('❌ Error toggling bundle status:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error('Bundle not found or no changes were made');
      }

      console.log('✅ Bundle status updated successfully:', data[0]);
      toast.success(`Bundle ${newActiveStatus ? 'activated' : 'deactivated'} successfully`);
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['admin-bundles'] });
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
      
      return true;
    } catch (error: any) {
      console.error('❌ Failed to toggle bundle status:', error);
      toast.error(error.message || 'Failed to update bundle status');
      return false;
    } finally {
      setIsToggling(null);
    }
  };

  const toggleBundleFeatured = async (bundleId: number, currentFeaturedStatus: boolean) => {
    if (!bundleId) {
      throw new Error('Bundle ID is required');
    }

    setIsToggling(`bundle-featured-${bundleId}`);
    
    try {
      const newFeaturedStatus = !currentFeaturedStatus;
      console.log('🔄 Toggling bundle featured status:', bundleId, 'from', currentFeaturedStatus, 'to', newFeaturedStatus);
      
      const { data, error } = await supabase.rpc('update_bundle_safe', {
        bundle_id: bundleId,
        bundle_data: { 
          is_featured: newFeaturedStatus
        }
      });

      if (error) {
        console.error('❌ Error toggling bundle featured status:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error('Bundle not found or no changes were made');
      }

      console.log('✅ Bundle featured status updated successfully:', data[0]);
      toast.success(`Bundle ${newFeaturedStatus ? 'featured' : 'unfeatured'} successfully`);
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['admin-bundles'] });
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
      queryClient.invalidateQueries({ queryKey: ['featured-bundles'] });
      
      return true;
    } catch (error: any) {
      console.error('❌ Failed to toggle bundle featured status:', error);
      toast.error(error.message || 'Failed to update bundle featured status');
      return false;
    } finally {
      setIsToggling(null);
    }
  };

  const toggleGroupActive = async (groupId: string, currentActiveStatus: string) => {
    if (!groupId) {
      throw new Error('Group ID is required');
    }

    setIsToggling(`group-${groupId}`);
    
    try {
      const newStatus = currentActiveStatus === 'active' ? 'inactive' : 'active';
      console.log('🔄 Toggling group status:', groupId, 'from', currentActiveStatus, 'to', newStatus);
      
      const { data, error } = await supabase
        .from('group_sessions')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', groupId)
        .select()
        .maybeSingle();

      if (error) {
        console.error('❌ Error toggling group status:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      if (!data) {
        throw new Error('Group not found or no changes were made');
      }

      console.log('✅ Group status updated successfully:', data);
      toast.success(`Group ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['admin-groups'] });
      queryClient.invalidateQueries({ queryKey: ['featured-groups'] });
      
      return true;
    } catch (error: any) {
      console.error('❌ Failed to toggle group status:', error);
      toast.error(error.message || 'Failed to update group status');
      return false;
    } finally {
      setIsToggling(null);
    }
  };

  const toggleGroupFeatured = async (groupId: string, currentFeaturedStatus: boolean) => {
    if (!groupId) {
      throw new Error('Group ID is required');
    }

    setIsToggling(`group-featured-${groupId}`);
    
    try {
      const newFeaturedStatus = !currentFeaturedStatus;
      console.log('🔄 Toggling group featured status:', groupId, 'from', currentFeaturedStatus, 'to', newFeaturedStatus);
      
      const { data, error } = await supabase
        .from('group_sessions')
        .update({ 
          is_featured: newFeaturedStatus,
          featured_at: newFeaturedStatus ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', groupId)
        .select()
        .maybeSingle();

      if (error) {
        console.error('❌ Error toggling group featured status:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      if (!data) {
        throw new Error('Group not found or no changes were made');
      }

      console.log('✅ Group featured status updated successfully:', data);
      toast.success(`Group ${newFeaturedStatus ? 'featured' : 'unfeatured'} successfully`);
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['admin-groups'] });
      queryClient.invalidateQueries({ queryKey: ['featured-groups'] });
      
      return true;
    } catch (error: any) {
      console.error('❌ Failed to toggle group featured status:', error);
      toast.error(error.message || 'Failed to update group featured status');
      return false;
    } finally {
      setIsToggling(null);
    }
  };

  return {
    updateOrderStatus,
    updatePaymentStatus,
    toggleBundleActive,
    toggleBundleFeatured,
    toggleGroupActive,
    toggleGroupFeatured,
    toggleCustomItemActive,
    isToggling
  };
};
