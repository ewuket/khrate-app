
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GroupStats } from '@/types/admin';

export const useAdminGroupStatsQuery = () => {
  return useQuery({
    queryKey: ['admin-group-stats'],
    queryFn: async (): Promise<GroupStats> => {
      const { data, error } = await supabase.rpc('get_admin_group_stats');
      
      if (error) {
        console.error('Error fetching group stats:', error);
        throw error;
      }

      return data[0] || {
        total_groups: 0,
        active_groups: 0,
        featured_groups: 0,
        completed_groups: 0,
        total_members: 0,
        avg_group_size: 0
      };
    }
  });
};
