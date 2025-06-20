
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface BundleItem {
  id: number;
  item_name: string;
  quantity: number;
  unit: string;
}

export interface Bundle {
  id: number;
  title: string;
  description: string;
  price: number;
  original_price: number;
  image_url: string;
  is_featured: boolean;
  is_active: boolean;
  items?: BundleItem[];
}

export const useBundles = () => {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBundles = async (featuredOnly = false) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading bundles...', { featuredOnly });

      let query = supabase
        .from('bundles')
        .select(`
          *,
          bundle_items(*)
        `)
        .eq('is_active', true)
        .order('id');

      if (featuredOnly) {
        query = query.eq('is_featured', true);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error loading bundles:', error);
        setError('Failed to load bundles');
        setBundles([]);
        return [];
      }

      console.log('Bundles loaded successfully:', data?.length || 0);
      const bundlesData = data || [];
      setBundles(bundlesData);
      return bundlesData;
    } catch (error) {
      console.error('Error loading bundles:', error);
      setError('Failed to load bundles');
      setBundles([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const updateBundle = async (id: number, updates: Partial<Bundle>) => {
    try {
      const { error } = await supabase
        .from('bundles')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast.success('Bundle updated successfully');
      await loadBundles();
      return true;
    } catch (error) {
      console.error('Error updating bundle:', error);
      toast.error('Failed to update bundle');
      return false;
    }
  };

  const updateBundleItems = async (bundleId: number, items: Omit<BundleItem, 'id'>[]) => {
    try {
      // Delete existing items
      await supabase
        .from('bundle_items')
        .delete()
        .eq('bundle_id', bundleId);

      // Insert new items
      const { error } = await supabase
        .from('bundle_items')
        .insert(items.map(item => ({ ...item, bundle_id: bundleId })));

      if (error) throw error;

      toast.success('Bundle items updated successfully');
      await loadBundles();
      return true;
    } catch (error) {
      console.error('Error updating bundle items:', error);
      toast.error('Failed to update bundle items');
      return false;
    }
  };

  const deleteBundle = async (id: number) => {
    try {
      const { error } = await supabase
        .from('bundles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Bundle deleted successfully');
      await loadBundles();
      return true;
    } catch (error) {
      console.error('Error deleting bundle:', error);
      toast.error('Failed to delete bundle');
      return false;
    }
  };

  useEffect(() => {
    loadBundles();
  }, []);

  return {
    bundles,
    loading,
    error,
    loadBundles,
    updateBundle,
    updateBundleItems,
    deleteBundle
  };
};
