
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminBundle } from '@/types/admin';
import { toast } from 'sonner';

interface BundleFormData {
  title: string;
  description: string;
  price: number;
  original_price?: number;
  image_url?: string;
  is_active: boolean;
  is_featured: boolean;
  items: Array<{
    item_name: string;
    quantity: number;
    unit: string;
  }>;
}

export type { AdminBundle, BundleFormData };

export const useAdminBundles = () => {
  const [bundles, setBundles] = useState<AdminBundle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBundles = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching bundles...');

      const { data: bundlesData, error } = await supabase
        .from('bundles')
        .select(`
          *,
          bundle_items (
            id,
            item_name,
            quantity,
            unit
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bundles:', error);
        throw error;
      }

      console.log('Fetched bundles:', bundlesData);

      const transformedBundles = bundlesData?.map(bundle => ({
        ...bundle,
        items: bundle.bundle_items || [],
        items_count: bundle.bundle_items?.length || 0
      })) || [];

      setBundles(transformedBundles);
    } catch (error) {
      console.error('Error in fetchBundles:', error);
      toast.error('Failed to load bundles');
    } finally {
      setIsLoading(false);
    }
  };

  const createBundle = async (bundleData: BundleFormData) => {
    try {
      setIsCreating(true);
      console.log('Creating bundle:', bundleData);

      // Create bundle first
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
        console.error('Error creating bundle:', bundleError);
        throw bundleError;
      }

      console.log('Bundle created:', bundle);

      // Create bundle items
      if (bundleData.items && bundleData.items.length > 0) {
        const bundleItems = bundleData.items.map(item => ({
          bundle_id: bundle.id,
          item_name: item.item_name,
          quantity: item.quantity,
          unit: item.unit
        }));

        const { error: itemsError } = await supabase
          .from('bundle_items')
          .insert(bundleItems);

        if (itemsError) {
          console.error('Error creating bundle items:', itemsError);
          throw itemsError;
        }
      }

      toast.success('Bundle created successfully!');
      await fetchBundles();
    } catch (error) {
      console.error('Error creating bundle:', error);
      toast.error('Failed to create bundle. Please check your data and try again.');
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const updateBundle = async (id: number, bundleData: Partial<BundleFormData>) => {
    try {
      setIsUpdating(true);
      console.log('Updating bundle:', id, bundleData);

      // Update bundle
      const { error: bundleError } = await supabase
        .from('bundles')
        .update({
          title: bundleData.title,
          description: bundleData.description,
          price: bundleData.price,
          original_price: bundleData.original_price,
          image_url: bundleData.image_url,
          is_active: bundleData.is_active,
          is_featured: bundleData.is_featured,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (bundleError) {
        console.error('Error updating bundle:', bundleError);
        throw bundleError;
      }

      // Update bundle items if provided
      if (bundleData.items) {
        // Delete existing items
        const { error: deleteError } = await supabase
          .from('bundle_items')
          .delete()
          .eq('bundle_id', id);

        if (deleteError) {
          console.error('Error deleting old bundle items:', deleteError);
          throw deleteError;
        }

        // Insert new items
        if (bundleData.items.length > 0) {
          const bundleItems = bundleData.items.map(item => ({
            bundle_id: id,
            item_name: item.item_name,
            quantity: item.quantity,
            unit: item.unit
          }));

          const { error: itemsError } = await supabase
            .from('bundle_items')
            .insert(bundleItems);

          if (itemsError) {
            console.error('Error creating new bundle items:', itemsError);
            throw itemsError;
          }
        }
      }

      toast.success('Bundle updated successfully!');
      await fetchBundles();
    } catch (error) {
      console.error('Error updating bundle:', error);
      toast.error('Failed to update bundle. Please check your data and try again.');
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteBundle = async (id: number) => {
    try {
      setIsDeleting(true);
      console.log('Deleting bundle:', id);

      // Delete bundle items first
      const { error: itemsError } = await supabase
        .from('bundle_items')
        .delete()
        .eq('bundle_id', id);

      if (itemsError) {
        console.error('Error deleting bundle items:', itemsError);
        throw itemsError;
      }

      // Delete bundle
      const { error: bundleError } = await supabase
        .from('bundles')
        .delete()
        .eq('id', id);

      if (bundleError) {
        console.error('Error deleting bundle:', bundleError);
        throw bundleError;
      }

      toast.success('Bundle deleted successfully!');
      await fetchBundles();
    } catch (error) {
      console.error('Error deleting bundle:', error);
      toast.error('Failed to delete bundle');
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleBundleStatus = async (id: number, currentStatus: boolean) => {
    try {
      console.log('Toggling bundle status:', id, 'from', currentStatus, 'to', !currentStatus);

      const { error } = await supabase
        .from('bundles')
        .update({ 
          is_active: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Error toggling bundle status:', error);
        throw error;
      }

      toast.success(`Bundle ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
      await fetchBundles();
    } catch (error) {
      console.error('Error toggling bundle status:', error);
      toast.error('Failed to update bundle status');
      throw error;
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
    fetchBundles,
    createBundle,
    updateBundle,
    deleteBundle,
    toggleBundleStatus,
    refetch: fetchBundles
  };
};

// Export individual hooks for better compatibility
export const useCreateBundle = () => {
  const { createBundle, isCreating } = useAdminBundles();
  return { mutate: createBundle, isPending: isCreating };
};

export const useUpdateBundle = () => {
  const { updateBundle, isUpdating } = useAdminBundles();
  return { mutate: updateBundle, isPending: isUpdating };
};

export const useDeleteBundle = () => {
  const { deleteBundle, isDeleting } = useAdminBundles();
  return { mutate: deleteBundle, isPending: isDeleting };
};
