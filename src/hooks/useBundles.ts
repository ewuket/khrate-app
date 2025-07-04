
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Bundle {
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
  bundle_items?: BundleItem[];
}

export interface BundleItem {
  id: number;
  bundle_id: number;
  item_name: string;
  quantity: number;
  unit?: string;
  created_at: string;
}

export const useBundles = () => {
  return useQuery({
    queryKey: ['bundles'],
    queryFn: async (): Promise<Bundle[]> => {
      console.log('🔄 Fetching ACTIVE bundles for users...');
      
      const { data, error } = await supabase
        .from('bundles')
        .select(`
          *,
          bundle_items (*)
        `)
        .eq('is_active', true) // Only show active bundles to users
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching user bundles:', error);
        throw error;
      }

      console.log('✅ Fetched active bundles for users:', data?.length || 0);
      return data || [];
    },
    retry: 1,
    retryDelay: 1000
  });
};

export const useFeaturedBundles = () => {
  return useQuery({
    queryKey: ['featured-bundles'],
    queryFn: async (): Promise<Bundle[]> => {
      console.log('🔄 Fetching featured bundles for users...');
      
      const { data, error } = await supabase
        .from('bundles')
        .select(`
          *,
          bundle_items (*)
        `)
        .eq('is_active', true) // Only active bundles
        .eq('is_featured', true) // Only featured bundles
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) {
        console.error('❌ Error fetching featured bundles:', error);
        throw error;
      }

      console.log('✅ Fetched featured bundles for users:', data?.length || 0);
      return data || [];
    },
    retry: 1,
    retryDelay: 1000
  });
};
