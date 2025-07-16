
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAdminCustomItemUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemData: any) => {
      console.log('🔄 Updating custom item with data:', itemData);
      
      const { id, ...updateData } = itemData;
      
      if (!id || typeof id !== 'number') {
        throw new Error('Valid item ID is required for update');
      }

      try {
        // Use the new safe update function
        const { data, error } = await supabase.rpc('update_custom_item_safe', {
          item_id: id,
          item_data: updateData
        });

        if (error) {
          console.error('❌ Error updating custom item:', error);
          throw new Error(`Database error: ${error.message}`);
        }

        if (!data || data.length === 0) {
          throw new Error('Custom item not found or no changes were made');
        }

        const updatedItem = data[0];
        console.log('✅ Custom item updated successfully:', updatedItem);
        return updatedItem;
      } catch (error: any) {
        console.error('❌ Custom item update failed:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-custom-items'] });
      toast.success('Custom item updated successfully!');
    },
    onError: (error: any) => {
      console.error('❌ Error updating custom item:', error);
      toast.error(error.message || 'Failed to update custom item. Please check your data and try again.');
    }
  });
};
