
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
  const [items, setItems] = useState<AdminCustomItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      console.log('Fetching custom buy items...');
      
      const { data, error } = await supabase
        .from('custom_buy_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching custom items:', error);
        throw error;
      }

      console.log('Custom items fetched:', data?.length || 0);
      setItems(data || []);
      setError(null);
    } catch (err) {
      console.error('Error in fetchItems:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch custom items';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (itemData: Omit<AdminCustomItem, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Creating custom item:', itemData);
      
      const { data, error } = await supabase
        .from('custom_buy_items')
        .insert([itemData])
        .select()
        .single();

      if (error) {
        console.error('Error creating custom item:', error);
        throw error;
      }

      console.log('Custom item created:', data);
      toast.success('Item created successfully');
      await fetchItems();
      return data;
    } catch (err) {
      console.error('Error in createItem:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create item';
      toast.error(errorMessage);
      throw err;
    }
  };

  const updateItem = async (id: number, updates: Partial<AdminCustomItem>) => {
    try {
      console.log('Updating custom item:', id, updates);
      
      const { data, error } = await supabase
        .from('custom_buy_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating custom item:', error);
        throw error;
      }

      console.log('Custom item updated:', data);
      toast.success('Item updated successfully');
      await fetchItems();
      return data;
    } catch (err) {
      console.error('Error in updateItem:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update item';
      toast.error(errorMessage);
      throw err;
    }
  };

  const deleteItem = async (id: number) => {
    try {
      console.log('Deleting custom item:', id);
      
      const { error } = await supabase
        .from('custom_buy_items')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting custom item:', error);
        throw error;
      }

      console.log('Custom item deleted:', id);
      toast.success('Item deleted successfully');
      await fetchItems();
    } catch (err) {
      console.error('Error in deleteItem:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete item';
      toast.error(errorMessage);
      throw err;
    }
  };

  const toggleActive = async (id: number, isActive: boolean) => {
    await updateItem(id, { is_active: isActive });
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    toggleActive
  };
};
