import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminBundle } from '@/types/admin';
import { toast } from 'sonner';

export interface BundleFormData {
  title: string;
  description: string;
  price: number;
  original_price: number;
  image_url: string;
  is_active: boolean;
  is_featured: boolean;
  bundle_items: Array<{
    item_name: string;
    quantity: number;
    unit: string;
  }>;
}

export type { AdminBundle };

export const useAdminBundles = () => {
  const [bundles, setBundles] = useState<AdminBundle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBundles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('📦 Fetching bundles for admin...');

      const { data, error } = await supabase
        .from('bundles')
        .select(`
          *,
          bundle_items(item_name, quantity, unit)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching bundles:', error);
        throw error;
      }

      const formattedBundles = data?.map(bundle => ({
        ...bundle,
        items: bundle.bundle_items || [],
        items_count: bundle.bundle_items?.length || 0
      })) || [];

      console.log('✅ Bundles loaded successfully:', formattedBundles.length);
      setBundles(formattedBundles);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch bundles';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const createBundle = async (bundleData: BundleFormData) => {
    try {
      setIsCreating(true);
      console.log('🔄 Creating bundle:', bundleData.title);

      // Check admin status first
      const { data: adminCheck } = await supabase.rpc('is_admin_user');
      if (!adminCheck) {
        throw new Error('Admin access required to create bundles');
      }

      // Create the bundle
      const { data: bundle, error: bundleError } = await supabase
        .from('bundles')
        .insert({
          title: bundleData.title,
          description: bundleData.description,
          price: bundleData.price,
          original_price: bundleData.original_price,
          image_url: bundleData.image_url || '/placeholder.svg',
          is_active: bundleData.is_active,
          is_featured: bundleData.is_featured
        })
        .select()
        .single();

      if (bundleError) {
        console.error('❌ Bundle creation error:', bundleError);
        throw bundleError;
      }

      // Create bundle items if provided
      if (bundleData.bundle_items && bundleData.bundle_items.length > 0) {
        const bundleItems = bundleData.bundle_items
          .filter(item => item.item_name.trim() !== '')
          .map(item => ({
            bundle_id: bundle.id,
            item_name: item.item_name.trim(),
            quantity: item.quantity,
            unit: item.unit || 'pieces'
          }));

        if (bundleItems.length > 0) {
          const { error: itemsError } = await supabase
            .from('bundle_items')
            .insert(bundleItems);

          if (itemsError) {
            console.error('❌ Bundle items creation error:', itemsError);
            // Don't throw here, the bundle was created successfully
            toast.error('Bundle created but some items failed to save');
          }
        }
      }

      console.log('✅ Bundle created successfully:', bundle.title);
      toast.success('Bundle created successfully!');
      await fetchBundles(); // Refresh the list
    } catch (err: any) {
      console.error('❌ Failed to create bundle:', err);
      toast.error(err.message || 'Failed to create bundle');
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  const updateBundle = async (bundleData: Partial<BundleFormData> & { id: number }) => {
    try {
      setIsUpdating(true);
      console.log('🔄 Updating bundle:', bundleData.id);

      const { data, error } = await supabase.rpc('update_bundle_safe', {
        bundle_id: bundleData.id,
        bundle_data: {
          title: bundleData.title,
          description: bundleData.description,
          price: bundleData.price,
          original_price: bundleData.original_price,
          image_url: bundleData.image_url,
          is_active: bundleData.is_active,
          is_featured: bundleData.is_featured
        }
      });

      if (error) {
        console.error('❌ Bundle update error:', error);
        throw error;
      }

      console.log('✅ Bundle updated successfully');
      toast.success('Bundle updated successfully!');
      await fetchBundles(); // Refresh the list
    } catch (err: any) {
      console.error('❌ Failed to update bundle:', err);
      toast.error(err.message || 'Failed to update bundle');
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteBundle = async (bundleId: number) => {
    try {
      setIsDeleting(true);
      console.log('🔄 Deleting bundle:', bundleId);

      // Delete bundle items first
      const { error: itemsError } = await supabase
        .from('bundle_items')
        .delete()
        .eq('bundle_id', bundleId);

      if (itemsError) {
        console.error('❌ Error deleting bundle items:', itemsError);
        throw itemsError;
      }

      // Delete the bundle
      const { error: bundleError } = await supabase
        .from('bundles')
        .delete()
        .eq('id', bundleId);

      if (bundleError) {
        console.error('❌ Error deleting bundle:', bundleError);
        throw bundleError;
      }

      console.log('✅ Bundle deleted successfully');
      toast.success('Bundle deleted successfully!');
      await fetchBundles(); // Refresh the list
    } catch (err: any) {
      console.error('❌ Failed to delete bundle:', err);
      toast.error(err.message || 'Failed to delete bundle');
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchBundles();
  }, []);

  return {
    bundles,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    fetchBundles,
    createBundle,
    updateBundle,
    deleteBundle
  };
};
