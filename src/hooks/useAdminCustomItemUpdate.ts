
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAdminCustomItemUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemData: any) => {
      console.log('Updating custom item with data:', itemData);
      
      const { id, ...updateData } = itemData;
      
      if (!id) {
        throw new Error('Item ID is required for update');
      }

      // Clean and validate the data before update
      const cleanUpdateData = {
        name: updateData.name?.trim(),
        description: updateData.description?.trim() || null,
        price: parseFloat(updateData.price) || 0,
        unit: updateData.unit?.trim() || 'kg',
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

      console.log('Updating item with clean data:', cleanUpdateData);

      const { data, error } = await supabase
        .from('custom_buy_items')
        .update(cleanUpdateData)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error updating custom item:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      if (!data) {
        throw new Error('Item not found or no changes were made');
      }

      console.log('Custom item updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-custom-items'] });
      toast.success('Custom item updated successfully!');
    },
    onError: (error: any) => {
      console.error('Error updating custom item:', error);
      toast.error(error.message || 'Failed to update custom item. Please check your data and try again.');
    }
  });
};
