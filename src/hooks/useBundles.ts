
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Bundle {
  id: number;
  title: string;
  description: string;
  price: number;
  original_price?: number;
  image_url: string;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  items?: BundleItem[];
}

export interface BundleItem {
  id: number;
  item_name: string;
  quantity: number;
  unit: string;
}

export const useBundles = () => {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [featuredBundles, setFeaturedBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBundles = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching all bundles from database...');
      
      // First, let's check if we can connect to Supabase
      const { data: testConnection, error: connectionError } = await supabase
        .from('bundles')
        .select('count(*)')
        .limit(1);
      
      if (connectionError) {
        console.error('❌ Database connection error:', connectionError);
        throw new Error(`Database connection failed: ${connectionError.message}`);
      }
      
      console.log('✅ Database connection successful');
      
      // Fetch bundles with their items
      const { data: bundlesData, error: bundlesError } = await supabase
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
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (bundlesError) {
        console.error('❌ Error fetching bundles:', bundlesError);
        throw new Error(`Failed to fetch bundles: ${bundlesError.message}`);
      }

      console.log('✅ Raw bundles data from Supabase:', bundlesData);
      console.log('📊 Number of bundles fetched:', bundlesData?.length || 0);
      
      if (!bundlesData || bundlesData.length === 0) {
        console.warn('⚠️ No bundles found in database');
        setBundles([]);
        setFeaturedBundles([]);
        setError(null);
        return;
      }
      
      // Transform the data to match our interface
      const transformedBundles = bundlesData.map(bundle => {
        console.log('🔧 Transforming bundle:', bundle.id, bundle.title);
        return {
          ...bundle,
          items: bundle.bundle_items || []
        };
      });

      console.log('✅ Transformed bundles:', transformedBundles);
      setBundles(transformedBundles);
      
      // Set featured bundles
      const featured = transformedBundles.filter(bundle => bundle.is_featured);
      console.log('⭐ Featured bundles found:', featured.length, featured);
      setFeaturedBundles(featured);
      
      setError(null);
    } catch (err) {
      console.error('❌ Critical error in fetchBundles:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch bundles';
      setError(errorMessage);
      toast.error(`Error loading bundles: ${errorMessage}`);
      setBundles([]);
      setFeaturedBundles([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedBundles = async () => {
    try {
      console.log('🔄 Fetching featured bundles only...');
      
      const { data: featuredData, error: featuredError } = await supabase
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
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (featuredError) {
        console.error('❌ Error fetching featured bundles:', featuredError);
        throw new Error(`Failed to fetch featured bundles: ${featuredError.message}`);
      }

      console.log('✅ Featured bundles data from Supabase:', featuredData);
      console.log('📊 Number of featured bundles fetched:', featuredData?.length || 0);
      
      if (!featuredData || featuredData.length === 0) {
        console.warn('⚠️ No featured bundles found');
        setFeaturedBundles([]);
        return;
      }
      
      const transformedFeatured = featuredData.map(bundle => ({
        ...bundle,
        items: bundle.bundle_items || []
      }));

      console.log('✅ Transformed featured bundles:', transformedFeatured);
      setFeaturedBundles(transformedFeatured);
    } catch (err) {
      console.error('❌ Error fetching featured bundles:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch featured bundles';
      toast.error(`Error loading featured bundles: ${errorMessage}`);
    }
  };

  useEffect(() => {
    console.log('🚀 useBundles hook initialized - Starting initial bundle fetch...');
    fetchBundles();
  }, []);

  return {
    bundles,
    featuredBundles,
    loading,
    error,
    refetch: fetchBundles,
    fetchFeaturedBundles
  };
};
