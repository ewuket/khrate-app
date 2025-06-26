
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AdminCustomItem {
  id: number;
  name: string;
  category: string;
  price: number;
  unit: string;
  image_url: string;
  description: string | null;
  is_active: boolean;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
}

export const useAdminCustomItems = () => {
  const queryClient = useQueryClient();

  const {
    data: customItems = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['admin-custom-items'],
    queryFn: async () => {
      console.log('Fetching admin custom items...');
      
      const { data, error } = await supabase
        .from('custom_buy_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching custom items:', error);
        throw error;
      }

      console.log('Admin custom items fetched:', data?.length || 0);
      return data || [];
    },
    staleTime: 30 * 1000,
    retry: 2,
  });

  const createCustomItemMutation = useMutation({
    mutationFn: async (itemData: any) => {
      console.log('Creating custom item with data:', itemData);
      
      const { data, error } = await supabase
        .from('custom_buy_items')
        .insert({
          name: itemData.name,
          description: itemData.description,
          price: parseFloat(itemData.price),
          unit: itemData.unit,
          category: itemData.category,
          stock_quantity: parseInt(itemData.stock_quantity) || 0,
          image_url: itemData.image_url || '/placeholder.svg',
          is_active: itemData.is_active !== false
        })
        .select()
        .single();

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

  const updateCustomItemMutation = useMutation({
    mutationFn: async (itemData: any) => {
      console.log('Updating custom item with data:', itemData);
      
      const { id, ...updateData } = itemData;
      
      const { data, error } = await supabase
        .from('custom_buy_items')
        .update({
          name: updateData.name,
          description: updateData.description,
          price: parseFloat(updateData.price),
          unit: updateData.unit,
          category: updateData.category,
          stock_quantity: parseInt(updateData.stock_quantity) || 0,
          image_url: updateData.image_url || '/placeholder.svg',
          is_active: updateData.is_active !== false,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating custom item:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-custom-items'] });
      toast.success('Custom item updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating custom item:', error);
      toast.error('Failed to update custom item. Please check your data and try again.');
    }
  });

  const deleteCustomItemMutation = useMutation({
    mutationFn: async (itemId: number) => {
      const { error } = await supabase
        .from('custom_buy_items')
        .delete()
        .eq('id', itemId);

      if (error) {
        console.error('Error deleting custom item:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-custom-items'] });
      toast.success('Custom item deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting custom item:', error);
      toast.error('Failed to delete custom item');
    }
  });

  return {
    customItems,
    isLoading,
    refetch,
    createCustomItem: createCustomItemMutation.mutate,
    updateCustomItem: updateCustomItemMutation.mutate,
    deleteCustomItem: deleteCustomItemMutation.mutate,
    isCreating: createCustomItemMutation.isPending,
    isUpdating: updateCustomItemMutation.isPending,
    isDeleting: deleteCustomItemMutation.isPending,
  };
};
