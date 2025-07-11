
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export const useAdminBundleOperations = () => {
  const [isToggling, setIsToggling] = useState<string | null>(null);
  const queryClient = useQueryClient();

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

  return {
    toggleBundleActive,
    toggleBundleFeatured,
    isToggling
  };
};
