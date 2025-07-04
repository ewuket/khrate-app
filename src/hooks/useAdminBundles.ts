
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AdminBundle {
  id: number;
  title: string;
  description?: string;
  price: number;
  original_price?: number;
  image_url?: string;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  bundle_items?: AdminBundleItem[];
  items?: AdminBundleItem[];
}

export interface AdminBundleItem {
  id: number;
  bundle_id: number;
  item_name: string;
  quantity: number;
  unit?: string;
  created_at: string;
}

export interface BundleFormData {
  title: string;
  description?: string;
  price: number;
  original_price?: number;
  image_url?: string;
  is_featured?: boolean;
  is_active?: boolean;
  bundle_items?: Omit<AdminBundleItem, 'id' | 'bundle_id' | 'created_at'>[];
}

export const useAdminBundles = () => {
  const queryClient = useQueryClient();

  const {
    data: bundles = [],
    isLoading,
    error,
    refetch: fetchBundles
  } = useQuery({
    queryKey: ['admin-bundles'],
    queryFn: async (): Promise<AdminBundle[]> => {
      console.log('🔄 Fetching bundles for admin...');

      try {
        const { data: bundlesData, error: bundlesError } = await supabase
          .from('bundles')
          .select(`
            *,
            bundle_items (*)
          `)
          .order('created_at', { ascending: false });

        if (bundlesError) {
          console.error('❌ Error fetching bundles:', bundlesError);
          throw new Error(`Database error: ${bundlesError.message}`);
        }

        console.log('✅ Successfully fetched bundles:', bundlesData?.length || 0);
        
        if (!bundlesData || bundlesData.length === 0) {
          console.warn('⚠️ No bundles found in database');
          return [];
        }

        const transformedBundles = bundlesData.map(bundle => ({
          ...bundle,
          items: bundle.bundle_items || []
        }));

        return transformedBundles;
      } catch (error) {
        console.error('❌ Failed to fetch bundles:', error);
        throw error;
      }
    },
    retry: 1,
    retryDelay: 1000
  });

  const createBundleMutation = useMutation({
    mutationFn: async (bundleData: BundleFormData) => {
      console.log('🔄 Creating bundle:', bundleData);

      const { bundle_items, ...bundleInfo } = bundleData;

      const { data: newBundle, error: bundleError } = await supabase
        .from('bundles')
        .insert([bundleInfo])
        .select()
        .maybeSingle();

      if (bundleError) {
        console.error('❌ Error creating bundle:', bundleError);
        throw bundleError;
      }

      if (!newBundle) {
        throw new Error('Failed to create bundle - no data returned');
      }

      if (bundle_items && bundle_items.length > 0) {
        const itemsToInsert = bundle_items.map(item => ({
          ...item,
          bundle_id: newBundle.id
        }));

        const { error: itemsError } = await supabase
          .from('bundle_items')
          .insert(itemsToInsert);

        if (itemsError) {
          console.error('❌ Error creating bundle items:', itemsError);
          throw itemsError;
        }
      }

      return newBundle;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bundles'] });
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
      toast.success('Bundle created successfully!');
    },
    onError: (error: any) => {
      console.error('❌ Error creating bundle:', error);
      toast.error(`Failed to create bundle: ${error.message}`);
    }
  });

  const updateBundleMutation = useMutation({
    mutationFn: async ({ id, ...bundleData }: { id: number } & Partial<BundleFormData>) => {
      console.log('🔄 Updating bundle with ID:', id, 'Data:', bundleData);

      if (!id || typeof id !== 'number') {
        throw new Error('Valid bundle ID is required for update');
      }

      try {
        // Use the new safe update function
        const { data, error } = await supabase.rpc('update_bundle_safe', {
          bundle_id: id,
          bundle_data: bundleData
        });

        if (error) {
          console.error('❌ Error updating bundle:', error);
          throw new Error(`Database error: ${error.message}`);
        }

        if (!data || data.length === 0) {
          throw new Error('Bundle not found or no changes were made');
        }

        const updatedBundle = data[0];
        console.log('✅ Bundle updated successfully:', updatedBundle);

        // Handle bundle items update if provided
        const { bundle_items } = bundleData;
        if (bundle_items !== undefined) {
          console.log('🔄 Updating bundle items...');
          
          // Delete existing items
          const { error: deleteError } = await supabase
            .from('bundle_items')
            .delete()
            .eq('bundle_id', id);

          if (deleteError) {
            console.error('❌ Error deleting existing bundle items:', deleteError);
            throw new Error(`Failed to update bundle items: ${deleteError.message}`);
          }

          // Insert new items if any
          if (bundle_items.length > 0) {
            const itemsToInsert = bundle_items.map(item => ({
              ...item,
              bundle_id: id
            }));

            const { error: itemsError } = await supabase
              .from('bundle_items')
              .insert(itemsToInsert);

            if (itemsError) {
              console.error('❌ Error inserting new bundle items:', itemsError);
              throw new Error(`Failed to update bundle items: ${itemsError.message}`);
            }

            console.log('✅ Bundle items updated successfully');
          }
        }

        return updatedBundle;
      } catch (error: any) {
        console.error('❌ Bundle update failed:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bundles'] });
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
      toast.success('Bundle updated successfully!');
    },
    onError: (error: any) => {
      console.error('❌ Error updating bundle:', error);
      toast.error(`Failed to update bundle: ${error.message}`);
    }
  });

  const deleteBundleMutation = useMutation({
    mutationFn: async (bundleId: number) => {
      console.log('🔄 Deleting bundle:', bundleId);

      const { error } = await supabase
        .from('bundles')
        .delete()
        .eq('id', bundleId);

      if (error) {
        console.error('❌ Error deleting bundle:', error);
        throw error;
      }

      return bundleId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bundles'] });
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
      toast.success('Bundle deleted successfully!');
    },
    onError: (error: any) => {
      console.error('❌ Error deleting bundle:', error);
      toast.error(`Failed to delete bundle: ${error.message}`);
    }
  });

  return {
    bundles,
    isLoading,
    error,
    fetchBundles,
    createBundle: createBundleMutation.mutateAsync,
    updateBundle: updateBundleMutation.mutateAsync,
    deleteBundle: deleteBundleMutation.mutateAsync,
    isCreating: createBundleMutation.isPending,
    isUpdating: updateBundleMutation.isPending,
    isDeleting: deleteBundleMutation.isPending
  };
};
