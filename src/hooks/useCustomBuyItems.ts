
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
      
      // Test database connection first
      const { data: testConnection, error: connectionError } = await supabase
        .from('custom_buy_items')
        .select('count(*)')
        .limit(1);
      
      if (connectionError) {
        console.error('❌ Database connection error:', connectionError);
        throw new Error(`Database connection failed: ${connectionError.message}`);
      }
      
      console.log('✅ Database connection successful for custom items');
      
      const { data, error } = await supabase
        .from('custom_buy_items')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) {
        console.error('❌ Error fetching custom items:', error);
        throw new Error(`Failed to fetch custom items: ${error.message}`);
      }

      console.log('✅ Raw custom items data from Supabase:', data);
      console.log('📊 Number of active custom items fetched:', data?.length || 0);
      
      if (!data || data.length === 0) {
        console.warn('⚠️ No custom items found in database');
        setItems([]);
        setError(null);
        return;
      }
      
      if (data && data.length > 0) {
        console.log('🔍 Sample custom item:', data[0]);
        console.log('🏷️ Categories found:', [...new Set(data.map(item => item.category))]);
      }

      setItems(data);
      setError(null);
    } catch (err) {
      console.error('❌ Critical error in fetchItems:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch items';
      setError(errorMessage);
      toast.error(`Error loading custom items: ${errorMessage}`);
      setItems([]);
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
    console.log('🚀 useCustomBuyItems hook initialized - Starting initial custom items fetch...');
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
