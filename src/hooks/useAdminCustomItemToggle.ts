
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAdminCustomItemToggle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_active }: { id: number; is_active: boolean }) => {
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
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-custom-items'] });
      toast.success(`Custom item ${data.is_active ? 'activated' : 'deactivated'} successfully!`);
    },
    onError: (error: any) => {
      console.error('❌ Error toggling custom item status:', error);
      toast.error(error.message || 'Failed to update item status');
    }
  });
};
