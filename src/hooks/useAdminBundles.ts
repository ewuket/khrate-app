
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

const fetchAdminBundles = async (): Promise<AdminBundle[]> => {
  console.log('Fetching admin bundles...');
  
  try {
    // Fetch all bundles (including inactive ones for admin)
    const { data: bundles, error: bundlesError } = await supabase
      .from('bundles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (bundlesError) {
      console.error('Error fetching admin bundles:', bundlesError);
      throw new Error(`Failed to fetch bundles: ${bundlesError.message}`);
    }

    console.log('Admin bundles fetched:', bundles?.length || 0);
    
    if (!bundles || bundles.length === 0) {
      return [];
    }
    
    // Fetch all items for these bundles
    const bundleIds = bundles.map(bundle => bundle.id);
    const { data: items, error: itemsError } = await supabase
      .from('bundle_items')
      .select('*')
      .in('bundle_id', bundleIds)
      .order('id');
    
    if (itemsError) {
      console.error('Error fetching bundle items:', itemsError);
    }
    
    // Group items by bundle_id
    const itemsByBundle: Record<number, AdminBundleItem[]> = {};
    (items || []).forEach(item => {
      if (!itemsByBundle[item.bundle_id]) {
        itemsByBundle[item.bundle_id] = [];
      }
      itemsByBundle[item.bundle_id].push(item);
    });
    
    // Combine bundles with their items
    const bundlesWithItems = bundles.map(bundle => ({
      ...bundle,
      items: itemsByBundle[bundle.id] || []
    }));
    
    return bundlesWithItems;
  } catch (error) {
    console.error('Error in fetchAdminBundles:', error);
    throw error;
  }
};

export const useAdminBundles = () => {
  return useQuery({
    queryKey: ['admin-bundles'],
    queryFn: fetchAdminBundles,
    staleTime: 30 * 1000, // 30 seconds
    retry: 2,
  });
};

export const useCreateBundle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (bundleData: Omit<AdminBundle, 'id' | 'created_at' | 'updated_at' | 'items'>) => {
      const { data, error } = await supabase
        .from('bundles')
        .insert([bundleData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bundles'] });
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
      toast.success('Bundle created successfully');
    },
    onError: (error) => {
      console.error('Error creating bundle:', error);
      toast.error('Failed to create bundle');
    },
  });
};

export const useUpdateBundle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...bundleData }: Partial<AdminBundle> & { id: number }) => {
      const { data, error } = await supabase
        .from('bundles')
        .update(bundleData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bundles'] });
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
      toast.success('Bundle updated successfully');
    },
    onError: (error) => {
      console.error('Error updating bundle:', error);
      toast.error('Failed to update bundle');
    },
  });
};

export const useDeleteBundle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (bundleId: number) => {
      // First delete bundle items
      const { error: itemsError } = await supabase
        .from('bundle_items')
        .delete()
        .eq('bundle_id', bundleId);

      if (itemsError) throw itemsError;

      // Then delete bundle
      const { error: bundleError } = await supabase
        .from('bundles')
        .delete()
        .eq('id', bundleId);

      if (bundleError) throw bundleError;
      
      return bundleId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bundles'] });
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
      toast.success('Bundle deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting bundle:', error);
      toast.error('Failed to delete bundle');
    },
  });
};
