
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAdminCustomItemUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemData: any) => {
      console.log('Updating custom item with data:', itemData);
      
      const { id, ...updateData } = itemData;
      
      // Clean and validate the data before update
      const cleanUpdateData = {
        name: updateData.name?.trim(),
        description: updateData.description?.trim() || null,
        price: parseFloat(updateData.price),
        unit: updateData.unit?.trim(),
        category: updateData.category?.trim(),
        stock_quantity: parseInt(updateData.stock_quantity) || 0,
        image_url: updateData.image_url?.trim() || '/placeholder.svg',
        is_active: Boolean(updateData.is_active),
        updated_at: new Date().toISOString()
      };

      // Validate required fields
      if (!cleanUpdateData.name || !cleanUpdateData.unit || !cleanUpdateData.category) {
        throw new Error('Name, unit, and category are required fields');
      }

      if (isNaN(cleanUpdateData.price) || cleanUpdateData.price < 0) {
        throw new Error('Price must be a valid positive number');
      }

      const { data, error } = await supabase
        .from('custom_buy_items')
        .update(cleanUpdateData)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error updating custom item:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No item was updated. Item may not exist.');
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-custom-items'] });
      toast.success('Custom item updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating custom item:', error);
      toast.error(error.message || 'Failed to update custom item. Please check your data and try again.');
    }
  });
};
