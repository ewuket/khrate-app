
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface FeaturedGroup {
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
  items: any[];
  total_amount?: number;
}

export const useFeaturedGroups = () => {
  return useQuery({
    queryKey: ['featured-groups'],
    queryFn: async (): Promise<FeaturedGroup[]> => {
      console.log('Fetching featured groups...');
      
      try {
        const { data, error } = await supabase
          .rpc('get_featured_groups');

        if (error) {
          console.error('Error fetching featured groups:', error);
          throw error;
        }

        console.log('Fetched featured groups:', data?.length || 0);
        
        // Transform the data to match our interface
        const transformedData: FeaturedGroup[] = (data || []).map(group => ({
          ...group,
          items: Array.isArray(group.items) ? group.items : []
        }));

        return transformedData;
      } catch (error) {
        console.error('Failed to fetch featured groups:', error);
        return [];
      }
    },
    retry: 2,
    retryDelay: 1000
  });
};
