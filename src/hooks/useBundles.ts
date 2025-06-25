
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Bundle {
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
  items: BundleItem[];
}

export interface BundleItem {
  id: number;
  bundle_id: number;
  item_name: string;
  quantity: number;
  unit: string;
  created_at: string;
}

const fetchBundles = async (featuredOnly = false): Promise<Bundle[]> => {
  console.log(`Fetching ${featuredOnly ? 'featured' : 'all'} bundles...`);
  
  try {
    // Build the query for bundles
    let bundlesQuery = supabase
      .from('bundles')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (featuredOnly) {
      bundlesQuery = bundlesQuery.eq('is_featured', true);
    }
    
    const { data: bundles, error: bundlesError } = await bundlesQuery;
    
    if (bundlesError) {
      console.error('Error fetching bundles:', bundlesError);
      
      // If there's an RLS issue, try to handle it gracefully
      if (bundlesError.code === 'PGRST301' || bundlesError.message?.includes('policy')) {
        console.log('RLS blocking bundles, trying alternative approach...');
        
        // Try to get current user and check if admin
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          console.log('User authenticated, retrying bundle fetch...');
          const { data: retryBundles, error: retryError } = await bundlesQuery;
          if (retryError) {
            console.error('Retry failed:', retryError);
            return [];
          }
          return processBundles(retryBundles || []);
        } else {
          console.log('No authenticated user, returning empty array');
          return [];
        }
      }
      
      throw new Error(`Failed to fetch bundles: ${bundlesError.message}`);
    }
    
    return processBundles(bundles || []);
  } catch (error) {
    console.error('Error in fetchBundles:', error);
    throw error;
  }
};

const processBundles = async (bundles: any[]): Promise<Bundle[]> => {
  console.log('Processing bundles:', bundles.length);
  
  if (bundles.length === 0) {
    console.log('No bundles found');
    return [];
  }
  
  // Fetch all items for these bundles
  const bundleIds = bundles.map(bundle => bundle.id);
  console.log('Fetching items for bundles:', bundleIds);
  
  const { data: items, error: itemsError } = await supabase
    .from('bundle_items')
    .select('*')
    .in('bundle_id', bundleIds)
    .order('id');
  
  if (itemsError) {
    console.error('Error fetching bundle items:', itemsError);
    // Continue without items rather than failing completely
  }
  
  console.log('Bundle items fetched:', items?.length || 0);
  
  // Group items by bundle_id
  const itemsByBundle: Record<number, BundleItem[]> = {};
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
  
  console.log(`Successfully processed ${bundlesWithItems.length} bundles with items`);
  
  return bundlesWithItems;
};

export const useBundles = () => {
  return useQuery({
    queryKey: ['bundles'],
    queryFn: () => fetchBundles(false),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useFeaturedBundles = () => {
  return useQuery({
    queryKey: ['bundles', 'featured'],
    queryFn: () => fetchBundles(true),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};
