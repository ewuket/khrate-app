
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAdminCustomItemToggle = () => {
  const [isToggling, setIsToggling] = useState<string | null>(null);

  const toggleActiveCustomItem = async ({ id, is_active }: { id: number; is_active: boolean }) => {
    setIsToggling(id.toString());
    
    try {
      console.log('🔄 Toggling custom item active status:', id, 'from', is_active, 'to', !is_active);
      
      const { data, error } = await supabase
        .from('custom_buy_items')
        .update({ 
          is_active: !is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) {
        console.error('❌ Error toggling custom item status:', error);
        throw new Error(`Failed to update item: ${error.message}`);
      }

      if (!data) {
        throw new Error('Item not found or no changes made');
      }

      console.log('✅ Custom item status updated successfully:', data);
      toast.success(`Item ${!is_active ? 'activated' : 'deactivated'} successfully`);
      
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
