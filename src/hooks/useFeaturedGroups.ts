
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface FeaturedGroup {
  id: string;
  name: string;
  location: string;
  region: string;
  member_count: number;
  max_participants: number;
  discount_percentage: number;
  status: string;
  join_code: string;
  created_at: string;
  items: any;
}

export const useFeaturedGroups = () => {
  return useQuery({
    queryKey: ['featured-groups'],
    queryFn: async (): Promise<FeaturedGroup[]> => {
      console.log('Fetching featured groups...');
      
      const { data, error } = await supabase
        .rpc('get_featured_groups');

      if (error) {
        console.error('Error fetching featured groups:', error);
        throw error;
      }

      console.log('Featured groups fetched:', data?.length || 0);
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};
