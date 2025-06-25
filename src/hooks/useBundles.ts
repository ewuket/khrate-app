
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
      throw new Error(`Failed to fetch bundles: ${bundlesError.message}`);
    }

    console.log('Bundles fetched successfully:', bundles?.length || 0);
    
    if (!bundles || bundles.length === 0) {
      console.log('No bundles found, returning empty array');
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
    
    // Combine bundles with their items and add proper images
    const bundlesWithItems = bundles.map(bundle => {
      let imageUrl = bundle.image_url;
      
      // Add appropriate images for each bundle based on title
      if (!imageUrl || imageUrl === '/placeholder.svg') {
        const title = bundle.title.toLowerCase();
        if (title.includes('essential breakfast')) {
          imageUrl = '/lovable-uploads/280f9459-3e15-4683-85fb-0295c65c6045.png';
        } else if (title.includes('family essential')) {
          imageUrl = '/lovable-uploads/4730e151-0c90-4bde-a3cf-7eb370e2cac1.png';
        } else if (title.includes('premium household')) {
          imageUrl = '/lovable-uploads/616885e4-604b-4999-8a22-90a738d3c1e0.png';
        } else if (title.includes('fresh vegetable')) {
          imageUrl = '/lovable-uploads/ea7e14fb-6084-4c08-94cf-b35bb353cd1c.png';
        } else if (title.includes('tropical fruit')) {
          imageUrl = '/lovable-uploads/99149a9c-234b-46ab-bd67-67d22129abb2.png';
        } else if (title.includes('protein power')) {
          imageUrl = '/lovable-uploads/87618cc5-dec8-4826-9426-51ad24b6362a.png';
        } else if (title.includes('healthy snack')) {
          imageUrl = '/lovable-uploads/7bd74977-70dd-4c12-8ccd-42b15a0320c1.png';
        } else if (title.includes('dairy delight')) {
          imageUrl = '/lovable-uploads/b2a772dc-4abb-463a-88e9-370f4fdd2684.png';
        } else {
          imageUrl = '/lovable-uploads/44536f37-66fe-4604-a318-5afc62c7fcdf.png';
        }
      }
      
      return {
        ...bundle,
        image_url: imageUrl,
        items: itemsByBundle[bundle.id] || []
      };
    });
    
    console.log(`Successfully processed ${bundlesWithItems.length} bundles with items`);
    
    return bundlesWithItems;
  } catch (error) {
    console.error('Error in fetchBundles:', error);
    throw error;
  }
};

export const useBundles = () => {
  return useQuery({
    queryKey: ['bundles'],
    queryFn: () => fetchBundles(false),
    staleTime: 30 * 1000, // 30 seconds instead of 5 minutes for better debugging
    retry: 2, // Reduced retry attempts
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
};

export const useFeaturedBundles = () => {
  return useQuery({
    queryKey: ['bundles', 'featured'],
    queryFn: () => fetchBundles(true),
    staleTime: 30 * 1000, // 30 seconds instead of 5 minutes for better debugging
    retry: 2, // Reduced retry attempts
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
};
