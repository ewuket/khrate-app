
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAdminCustomItemToggle = () => {
  const [isToggling, setIsToggling] = useState<string | null>(null);

  const toggleActiveCustomItem = async ({ id, is_active }: { id: number; is_active: boolean }) => {
    if (!id) {
      throw new Error('Item ID is required');
    }

    setIsToggling(id.toString());
    
    try {
      const newActiveStatus = !is_active;
      console.log('🔄 Toggling custom item active status:', id, 'from', is_active, 'to', newActiveStatus);
      
      // Use the safe update function for consistency
      const { data, error } = await supabase.rpc('update_custom_item_safe', {
        item_id: id,
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
      setIsToggling(null);
    }
  };

  return {
    toggleActiveCustomItem,
    isToggling
  };
};
