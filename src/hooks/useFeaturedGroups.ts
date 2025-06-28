
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface FeaturedGroup {
  id: string;
  name: string;
  location: string | null;
  region: string | null;
  member_count: number;
  max_participants: number;
  discount_percentage: number;
  status: string;
  join_code: string;
  created_at: string;
  items: any;
  is_public: boolean;
}

export const useFeaturedGroups = () => {
  const [featuredGroups, setFeaturedGroups] = useState<FeaturedGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeaturedGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching featured groups from database...');
      
      // Use the existing database function
      const { data: featuredData, error: featuredError } = await supabase
        .rpc('get_featured_groups');

      if (featuredError) {
        console.error('❌ Error fetching featured groups:', featuredError);
        throw new Error(`Failed to fetch featured groups: ${featuredError.message}`);
      }

      console.log('✅ Featured groups data from Supabase:', featuredData);
      console.log('📊 Number of featured groups fetched:', featuredData?.length || 0);
      
      if (!featuredData || featuredData.length === 0) {
        console.warn('⚠️ No featured groups found');
        setFeaturedGroups([]);
        setError(null);
        return;
      }
      
      const transformedGroups: FeaturedGroup[] = featuredData.map(group => ({
        id: group.id,
        name: group.name || 'Unnamed Group',
        location: group.location,
        region: group.region,
        member_count: Number(group.member_count) || 0,
        max_participants: group.max_participants,
        discount_percentage: group.discount_percentage,
        status: group.status,
        join_code: group.join_code,
        created_at: group.created_at,
        items: group.items,
        is_public: true // Featured groups are public by definition
      }));

      console.log('✅ Transformed featured groups:', transformedGroups);
      setFeaturedGroups(transformedGroups);
      setError(null);
    } catch (err) {
      console.error('❌ Critical error in fetchFeaturedGroups:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch featured groups';
      setError(errorMessage);
      toast.error(`Error loading featured groups: ${errorMessage}`);
      setFeaturedGroups([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🚀 useFeaturedGroups hook initialized - Starting initial featured groups fetch...');
    fetchFeaturedGroups();
  }, []);

  return {
    featuredGroups,
    loading,
    error,
    refetch: fetchFeaturedGroups
  };
};
