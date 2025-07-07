
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export const useAdminGroupOperations = () => {
  const [isToggling, setIsToggling] = useState<string | null>(null);
  const queryClient = useQueryClient();

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
    toggleGroupActive,
    toggleGroupFeatured,
    isToggling
  };
};
