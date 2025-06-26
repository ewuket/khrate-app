
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AdminBundle {
  id: number;
  title: string;
  description: string | null;
  price: number;
  original_price: number | null;
  image_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  items: AdminBundleItem[];
}

export interface AdminBundleItem {
  id: number;
  bundle_id: number;
  item_name: string;
  quantity: number;
  unit: string;
  created_at: string;
}

export const useAdminBundles = () => {
  return useQuery({
    queryKey: ['admin-bundles'],
    queryFn: async () => {
      console.log('Fetching admin bundles...');
      
      const { data: bundlesData, error: bundlesError } = await supabase
        .from('bundles')
        .select('*')
        .order('created_at', { ascending: false });

      if (bundlesError) {
        console.error('Error fetching bundles:', bundlesError);
        throw bundlesError;
      }

      const bundlesWithItems = await Promise.all(
        bundlesData.map(async (bundle) => {
          const { data: items, error: itemsError } = await supabase
            .from('bundle_items')
            .select('*')
            .eq('bundle_id', bundle.id);

          if (itemsError) {
            console.error('Error fetching bundle items:', itemsError);
            return { ...bundle, items: [] };
          }

          return { ...bundle, items: items || [] };
        })
      );

      console.log('Admin bundles fetched:', bundlesWithItems.length);
      return bundlesWithItems;
    },
    staleTime: 30 * 1000,
    retry: 2,
  });
};

export const useCreateBundle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bundleData: any) => {
      console.log('Creating bundle with data:', bundleData);
      
      const { items, ...bundle } = bundleData;
      
      const { data: newBundle, error: bundleError } = await supabase
        .from('bundles')
        .insert(bundle)
        .select()
        .single();

      if (bundleError) {
        console.error('Error creating bundle:', bundleError);
        throw bundleError;
      }

      if (items && items.length > 0) {
        const bundleItems = items.map((item: any) => ({
          bundle_id: newBundle.id,
          item_name: item.item_name || item.name,
          quantity: item.quantity || 1,
          unit: item.unit || 'pieces'
        }));

        const { error: itemsError } = await supabase
          .from('bundle_items')
          .insert(bundleItems);

        if (itemsError) {
          console.error('Error creating bundle items:', itemsError);
          throw itemsError;
        }
      }

      return newBundle;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bundles'] });
      toast.success('Bundle created successfully!');
    },
    onError: (error) => {
      console.error('Error creating bundle:', error);
      toast.error('Failed to create bundle');
    }
  });
};

export const useUpdateBundle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bundleData: any) => {
      console.log('Updating bundle with data:', bundleData);
      
      const { id, items, ...bundleUpdate } = bundleData;
      
      // Update bundle
      const { data: updatedBundle, error: bundleError } = await supabase
        .from('bundles')
        .update(bundleUpdate)
        .eq('id', id)
        .select()
        .single();

      if (bundleError) {
        console.error('Error updating bundle:', bundleError);
        throw bundleError;
      }

      // Update bundle items if provided
      if (items && Array.isArray(items)) {
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
        if (items.length > 0) {
          const bundleItems = items.map((item: any) => ({
            bundle_id: id,
            item_name: item.item_name || item.name,
            quantity: parseFloat(item.quantity) || 1,
            unit: item.unit || 'pieces'
          }));

          const { error: itemsError } = await supabase
            .from('bundle_items')
            .insert(bundleItems);

          if (itemsError) {
            console.error('Error inserting new bundle items:', itemsError);
            throw itemsError;
          }
        }
      }

      return updatedBundle;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bundles'] });
      toast.success('Bundle updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating bundle:', error);
      toast.error('Failed to update bundle. Please check your data and try again.');
    }
  });
};

export const useDeleteBundle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bundleId: number) => {
      // Delete bundle items first
      const { error: itemsError } = await supabase
        .from('bundle_items')
        .delete()
        .eq('bundle_id', bundleId);

      if (itemsError) {
        console.error('Error deleting bundle items:', itemsError);
        throw itemsError;
      }

      // Delete bundle
      const { error: bundleError } = await supabase
        .from('bundles')
        .delete()
        .eq('id', bundleId);

      if (bundleError) {
        console.error('Error deleting bundle:', bundleError);
        throw bundleError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bundles'] });
      toast.success('Bundle deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting bundle:', error);
      toast.error('Failed to delete bundle');
    }
  });
};
