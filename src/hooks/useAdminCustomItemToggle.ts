
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
      
      const { data, error } = await supabase
        .from('custom_buy_items')
        .update({ 
          is_active: newActiveStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) {
        console.error('❌ Error toggling custom item status:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      if (!data) {
        throw new Error('Item not found or no changes were made');
      }

      console.log('✅ Custom item status updated successfully:', data);
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
