
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
      console.log('Fetching bundles...');
      
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
        console.error('Error fetching bundles:', bundlesError);
        throw bundlesError;
      }

      console.log('Bundles fetched:', bundlesData?.length || 0);
      
      // Transform the data to match our interface
      const transformedBundles = bundlesData?.map(bundle => ({
        ...bundle,
        items: bundle.bundle_items || []
      })) || [];

      setBundles(transformedBundles);
      
      // Set featured bundles
      const featured = transformedBundles.filter(bundle => bundle.is_featured);
      setFeaturedBundles(featured);
      
      setError(null);
    } catch (err) {
      console.error('Error in fetchBundles:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch bundles';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedBundles = async () => {
    try {
      console.log('Fetching featured bundles...');
      
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
        console.error('Error fetching featured bundles:', featuredError);
        throw featuredError;
      }

      console.log('Featured bundles fetched:', featuredData?.length || 0);
      
      const transformedFeatured = featuredData?.map(bundle => ({
        ...bundle,
        items: bundle.bundle_items || []
      })) || [];

      setFeaturedBundles(transformedFeatured);
    } catch (err) {
      console.error('Error fetching featured bundles:', err);
    }
  };

  useEffect(() => {
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
