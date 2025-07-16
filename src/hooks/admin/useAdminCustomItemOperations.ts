
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AdminCustomItem {
  id: number;
  name: string;
  description: string | null;
  price: number;
  unit: string;
  category: string;
  stock_quantity: number | null;
  image_url: string | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export const useAdminCustomItemOperations = () => {
  const [loading, setLoading] = useState(false);

  const createCustomItem = async (itemData: {
    name: string;
    description?: string;
    price: number;
    unit: string;
    category: string;
    stock_quantity?: number;
    image_url?: string;
    is_active?: boolean;
  }): Promise<AdminCustomItem | null> => {
    try {
      setLoading(true);
      console.log('🔄 Creating custom item:', itemData.name);

      const { data, error } = await supabase
        .from('custom_buy_items')
        .insert({
          name: itemData.name,
          description: itemData.description || '',
          price: itemData.price,
          unit: itemData.unit,
          category: itemData.category,
          stock_quantity: itemData.stock_quantity || 0,
          image_url: itemData.image_url || '/placeholder.svg',
          is_active: itemData.is_active !== false
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Custom item creation error:', error);
        throw error;
      }

      if (!data) {
        throw new Error('Custom item creation failed - no data returned');
      }

      console.log('✅ Custom item created successfully:', data.id);
      toast.success('Custom item created successfully!');
      return data;

    } catch (error: any) {
      console.error('❌ Custom item creation failed:', error);
      toast.error(error.message || 'Failed to create custom item');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateCustomItem = async (itemId: number, itemData: Partial<AdminCustomItem>): Promise<boolean> => {
    try {
      setLoading(true);
      console.log('🔄 Updating custom item:', itemId);

      const { error } = await supabase
        .from('custom_buy_items')
        .update({
          name: itemData.name,
          description: itemData.description,
          price: itemData.price,
          unit: itemData.unit,
          category: itemData.category,
          stock_quantity: itemData.stock_quantity,
          image_url: itemData.image_url,
          is_active: itemData.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', itemId);

      if (error) {
        console.error('❌ Custom item update error:', error);
        throw error;
      }

      console.log('✅ Custom item updated successfully');
      toast.success('Custom item updated successfully!');
      return true;

    } catch (error: any) {
      console.error('❌ Custom item update failed:', error);
      toast.error(error.message || 'Failed to update custom item');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomItem = async (itemId: number): Promise<boolean> => {
    try {
      setLoading(true);
      console.log('🔄 Deleting custom item:', itemId);

      const { error } = await supabase
        .from('custom_buy_items')
        .delete()
        .eq('id', itemId);

      if (error) {
        console.error('❌ Custom item deletion error:', error);
        throw error;
      }

      console.log('✅ Custom item deleted successfully');
      toast.success('Custom item deleted successfully!');
      return true;

    } catch (error: any) {
      console.error('❌ Custom item deletion failed:', error);
      toast.error(error.message || 'Failed to delete custom item');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleCustomItemStatus = async (itemId: number, isActive: boolean): Promise<boolean> => {
    try {
      console.log('🔄 Toggling custom item status:', itemId, isActive);

      const { error } = await supabase
        .from('custom_buy_items')
        .update({ 
          is_active: isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', itemId);

      if (error) {
        console.error('❌ Custom item status toggle error:', error);
        throw error;
      }

      console.log('✅ Custom item status updated successfully');
      toast.success(`Custom item ${isActive ? 'activated' : 'deactivated'} successfully!`);
      return true;

    } catch (error: any) {
      console.error('❌ Custom item status toggle failed:', error);
      toast.error(error.message || 'Failed to update custom item status');
      return false;
    }
  };

  return {
    createCustomItem,
    updateCustomItem,
    deleteCustomItem,
    toggleCustomItemStatus,
    loading
  };
};
