
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAdminCustomItemCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemData: any) => {
      console.log('🔄 Creating custom item with data:', itemData);
      
      // Verify admin authentication first
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Authentication required. Please log in again.');
      }
      
      console.log('✅ Admin session verified, user ID:', session.user.id);
      
      // Clean and validate the data before insertion
      const cleanItemData = {
        name: itemData.name?.trim(),
        description: itemData.description?.trim() || null,
        price: parseFloat(itemData.price),
        unit: itemData.unit?.trim(),
        category: itemData.category?.trim(),
        stock_quantity: parseInt(itemData.stock_quantity) || 0,
        image_url: itemData.image_url?.trim() || '/placeholder.svg',
        is_active: Boolean(itemData.is_active ?? true)
      };

      // Validate required fields
      if (!cleanItemData.name || !cleanItemData.unit || !cleanItemData.category) {
        throw new Error('Name, unit, and category are required fields');
      }

      if (isNaN(cleanItemData.price) || cleanItemData.price < 0) {
        throw new Error('Price must be a valid positive number');
      }

      const { data, error } = await supabase
        .from('custom_buy_items')
        .insert([cleanItemData])
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error creating custom item:', error);
        throw new Error(`Failed to create item: ${error.message}`);
      }

      if (!data) {
        throw new Error('No item was created');
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-custom-items'] });
      toast.success('Custom item created successfully!');
    },
    onError: (error) => {
      console.error('Error creating custom item:', error);
      toast.error(error.message || 'Failed to create custom item. Please check your data and try again.');
    }
  });
};
