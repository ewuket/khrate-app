
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAdminOperations = () => {
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    if (!orderId || !newStatus) {
      toast.error('Order ID and status are required');
      return false;
    }

    setIsUpdating(`order-${orderId}`);
    
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
        .maybeSingle();

      if (error) {
        console.error('❌ Error updating order status:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      if (!data) {
        throw new Error('Order not found or no changes were made');
      }

      console.log('✅ Order status updated successfully:', data);
      toast.success(`Order status updated to ${newStatus}`);
      return true;
    } catch (error: any) {
      console.error('❌ Failed to update order status:', error);
      toast.error(error.message || 'Failed to update order status');
      return false;
    } finally {
      setIsUpdating(null);
    }
  };

  const updatePaymentStatus = async (orderId: string, newPaymentStatus: string) => {
    if (!orderId || !newPaymentStatus) {
      toast.error('Order ID and payment status are required');
      return false;
    }

    setIsUpdating(`payment-${orderId}`);
    
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
        .maybeSingle();

      if (error) {
        console.error('❌ Error updating payment status:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      if (!data) {
        throw new Error('Order not found or no changes were made');
      }

      console.log('✅ Payment status updated successfully:', data);
      toast.success(`Payment status updated to ${newPaymentStatus}`);
      return true;
    } catch (error: any) {
      console.error('❌ Failed to update payment status:', error);
      toast.error(error.message || 'Failed to update payment status');
      return false;
    } finally {
      setIsUpdating(null);
    }
  };

  const toggleBundleFeatured = async (bundleId: number, isFeatured: boolean) => {
    if (!bundleId) {
      toast.error('Bundle ID is required');
      return false;
    }

    setIsUpdating(`bundle-featured-${bundleId}`);
    
    try {
      const newFeaturedStatus = !isFeatured;
      console.log('🔄 Toggling bundle featured status:', bundleId, 'to', newFeaturedStatus);
      
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
      return true;
    } catch (error: any) {
      console.error('❌ Failed to toggle bundle featured status:', error);
      toast.error(error.message || 'Failed to update bundle featured status');
      return false;
    } finally {
      setIsUpdating(null);
    }
  };

  const toggleBundleActive = async (bundleId: number, isActive: boolean) => {
    if (!bundleId) {
      toast.error('Bundle ID is required');
      return false;
    }

    setIsUpdating(`bundle-active-${bundleId}`);
    
    try {
      const newActiveStatus = !isActive;
      console.log('🔄 Toggling bundle active status:', bundleId, 'to', newActiveStatus);
      
      const { data, error } = await supabase.rpc('update_bundle_safe', {
        bundle_id: bundleId,
        bundle_data: { 
          is_active: newActiveStatus
        }
      });

      if (error) {
        console.error('❌ Error toggling bundle active status:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error('Bundle not found or no changes were made');
      }

      console.log('✅ Bundle active status updated successfully:', data[0]);
      toast.success(`Bundle ${newActiveStatus ? 'activated' : 'deactivated'} successfully`);
      return true;
    } catch (error: any) {
      console.error('❌ Failed to toggle bundle active status:', error);
      toast.error(error.message || 'Failed to update bundle active status');
      return false;
    } finally {
      setIsUpdating(null);
    }
  };

  const toggleGroupFeatured = async (groupId: string, isFeatured: boolean) => {
    if (!groupId) {
      toast.error('Group ID is required');
      return false;
    }

    setIsUpdating(`group-featured-${groupId}`);
    
    try {
      const newFeaturedStatus = !isFeatured;
      console.log('🔄 Toggling group featured status:', groupId, 'to', newFeaturedStatus);
      
      const { data, error } = await supabase
        .from('group_sessions')
        .update({ 
          is_featured: newFeaturedStatus,
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
      return true;
    } catch (error: any) {
      console.error('❌ Failed to toggle group featured status:', error);
      toast.error(error.message || 'Failed to update group featured status');
      return false;
    } finally {
      setIsUpdating(null);
    }
  };

  const toggleCustomItemActive = async (itemId: number, isActive: boolean) => {
    if (!itemId) {
      toast.error('Item ID is required');
      return false;
    }

    setIsUpdating(`item-active-${itemId}`);
    
    try {
      const newActiveStatus = !isActive;
      console.log('🔄 Toggling custom item active status:', itemId, 'to', newActiveStatus);
      
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
      return true;
    } catch (error: any) {
      console.error('❌ Failed to toggle custom item status:', error);
      toast.error(error.message || 'Failed to update item status');
      return false;
    } finally {
      setIsUpdating(null);
    }
  };

  return {
    updateOrderStatus,
    updatePaymentStatus,
    toggleBundleFeatured,
    toggleBundleActive,
    toggleGroupFeatured,
    toggleCustomItemActive,
    isUpdating: !!isUpdating
  };
};
