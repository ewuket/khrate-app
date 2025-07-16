
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DailyOrderStats {
  date_created: string;
  bundle_orders: number;
  custom_orders: number;
  group_orders: number;
  total_orders: number;
  total_revenue: number;
}

export const useAdminDailyStats = () => {
  return useQuery({
    queryKey: ['admin-daily-stats'],
    queryFn: async (): Promise<DailyOrderStats[]> => {
      console.log('📊 Fetching daily order statistics...');
      
      const { data, error } = await supabase.rpc('get_daily_order_stats');
      
      if (error) {
        console.error('❌ Error fetching daily stats:', error);
        throw error;
      }

      console.log('✅ Daily stats loaded:', data?.length || 0, 'days');
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};
