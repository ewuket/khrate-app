
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Bundle {
  id: number;
  title: string;
  description: string | null;
  price: number;
  original_price: number | null;
  image_url: string | null;
  is_featured: boolean | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface BundleItem {
  id: number;
  bundle_id: number | null;
  item_name: string;
  quantity: number;
  unit: string | null;
  created_at: string | null;
}

export const useBundles = () => {
  return useQuery({
    queryKey: ['bundles'],
    queryFn: async () => {
      console.log('Fetching bundles...');
      
      const { data: bundles, error: bundlesError } = await supabase
        .from('bundles')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      console.log('Raw bundles data:', bundles);
      console.log('Bundles error:', bundlesError);

      if (bundlesError) {
        console.error('Error fetching bundles:', bundlesError);
        throw new Error(`Failed to fetch bundles: ${bundlesError.message}`);
      }

      if (!bundles || bundles.length === 0) {
        console.log('No bundles found, returning empty array');
        return [];
      }

      // Fetch bundle items for all bundles
      const bundleIds = bundles.map(bundle => bundle.id);
      console.log('Fetching items for bundle IDs:', bundleIds);
      
      const { data: bundleItems, error: itemsError } = await supabase
        .from('bundle_items')
        .select('*')
        .in('bundle_id', bundleIds)
        .order('id');

      console.log('Raw bundle items data:', bundleItems);
      console.log('Bundle items error:', itemsError);

      if (itemsError) {
        console.error('Error fetching bundle items:', itemsError);
        // Continue without items rather than failing
      }

      // Group items by bundle_id
      const itemsByBundle = (bundleItems || []).reduce((acc: Record<number, BundleItem[]>, item) => {
        if (item.bundle_id) {
          if (!acc[item.bundle_id]) {
            acc[item.bundle_id] = [];
          }
          acc[item.bundle_id].push(item);
        }
        return acc;
      }, {});

      // Combine bundles with their items
      const bundlesWithItems = bundles.map(bundle => ({
        ...bundle,
        items: itemsByBundle[bundle.id] || []
      }));

      console.log('Final bundles with items:', bundlesWithItems);
      return bundlesWithItems;
    },
    retry: 1,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFeaturedBundles = () => {
  return useQuery({
    queryKey: ['bundles', 'featured'],
    queryFn: async () => {
      console.log('Fetching featured bundles...');
      
      const { data: bundles, error: bundlesError } = await supabase
        .from('bundles')
        .select('*')
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false });

      console.log('Raw featured bundles data:', bundles);
      console.log('Featured bundles error:', bundlesError);

      if (bundlesError) {
        console.error('Error fetching featured bundles:', bundlesError);
        throw new Error(`Failed to fetch featured bundles: ${bundlesError.message}`);
      }

      if (!bundles || bundles.length === 0) {
        console.log('No featured bundles found, returning empty array');
        return [];
      }

      // Fetch bundle items for featured bundles
      const bundleIds = bundles.map(bundle => bundle.id);
      console.log('Fetching items for featured bundle IDs:', bundleIds);
      
      const { data: bundleItems, error: itemsError } = await supabase
        .from('bundle_items')
        .select('*')
        .in('bundle_id', bundleIds)
        .order('id');

      console.log('Raw featured bundle items data:', bundleItems);
      console.log('Featured bundle items error:', itemsError);

      if (itemsError) {
        console.error('Error fetching featured bundle items:', itemsError);
        // Continue without items rather than failing
      }

      // Group items by bundle_id
      const itemsByBundle = (bundleItems || []).reduce((acc: Record<number, BundleItem[]>, item) => {
        if (item.bundle_id) {
          if (!acc[item.bundle_id]) {
            acc[item.bundle_id] = [];
          }
          acc[item.bundle_id].push(item);
        }
        return acc;
      }, {});

      // Combine bundles with their items
      const bundlesWithItems = bundles.map(bundle => ({
        ...bundle,
        items: itemsByBundle[bundle.id] || []
      }));

      console.log('Final featured bundles with items:', bundlesWithItems);
      return bundlesWithItems;
    },
    retry: 1,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
