
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAdminCustomItemCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemData: any) => {
      console.log('Creating custom item with data:', itemData);
      
      const { data, error } = await supabase
        .from('custom_buy_items')
        .insert({
          name: itemData.name,
          description: itemData.description || null,
          price: parseFloat(itemData.price),
          unit: itemData.unit,
          category: itemData.category,
          stock_quantity: parseInt(itemData.stock_quantity) || 0,
          image_url: itemData.image_url || '/placeholder.svg',
          is_active: itemData.is_active !== false
        })
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error creating custom item:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-custom-items'] });
      toast.success('Custom item created successfully!');
    },
    onError: (error) => {
      console.error('Error creating custom item:', error);
      toast.error('Failed to create custom item');
    }
  });
};
