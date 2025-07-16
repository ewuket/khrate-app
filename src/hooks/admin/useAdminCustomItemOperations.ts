
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export const useAdminCustomItemOperations = () => {
  const [isToggling, setIsToggling] = useState<string | null>(null);
  const queryClient = useQueryClient();

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

  return {
    toggleCustomItemActive,
    isToggling
  };
};
