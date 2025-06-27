
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface CustomBuyItem {
  id: number;
  name: string;
  category: string;
  price: number;
  unit: string;
  image_url: string;
  description: string | null;
  is_active: boolean;
  stock_quantity: number;
}

export const useCustomBuyItems = () => {
  const [items, setItems] = useState<CustomBuyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching active custom buy items for user side...');
      
      const { data, error } = await supabase
        .from('custom_buy_items')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) {
        console.error('❌ Error fetching custom items:', error);
        throw error;
      }

      console.log('✅ Raw custom items data from Supabase:', data);
      console.log('📊 Number of active custom items fetched:', data?.length || 0);
      
      if (data && data.length > 0) {
        console.log('🔍 Sample custom item:', data[0]);
      }

      setItems(data || []);
      setError(null);
    } catch (err) {
      console.error('❌ Error in fetchItems:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch items';
      setError(errorMessage);
      toast.error(`Error loading custom items: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Group items by category for better organization
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, CustomBuyItem[]>);

  useEffect(() => {
    console.log('🚀 Starting initial custom items fetch...');
    fetchItems();
  }, []);

  return {
    items,
    groupedItems,
    loading,
    error,
    fetchItems,
    refetch: fetchItems
  };
};
