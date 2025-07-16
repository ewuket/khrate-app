
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface OrderSourceStats {
  bundle_orders: number;
  custom_orders: number;
  group_orders: number;
  bundle_revenue: number;
  custom_revenue: number;
  group_revenue: number;
}

export const useAdminOrderSourceStats = () => {
  return useQuery({
    queryKey: ['admin-order-source-stats'],
    queryFn: async (): Promise<OrderSourceStats> => {
      console.log('📊 Fetching order source statistics...');
      
      try {
        const { data, error } = await supabase.rpc('get_admin_order_stats_by_source');
        
        if (error) {
          console.error('❌ Error fetching order source stats:', error);
          throw new Error(`Failed to fetch order source stats: ${error.message}`);
        }

        const stats = data?.[0] || {
          bundle_orders: 0,
          custom_orders: 0,
          group_orders: 0,
          bundle_revenue: 0,
          custom_revenue: 0,
          group_revenue: 0
        };

        console.log('✅ Order source statistics loaded:', stats);
        return {
          bundle_orders: Number(stats.bundle_orders || 0),
          custom_orders: Number(stats.custom_orders || 0),
          group_orders: Number(stats.group_orders || 0),
          bundle_revenue: Number(stats.bundle_revenue || 0),
          custom_revenue: Number(stats.custom_revenue || 0),
          group_revenue: Number(stats.group_revenue || 0)
        };
      } catch (error: any) {
        console.error('❌ Failed to fetch order source stats:', error);
        throw error;
      }
    },
    staleTime: 30 * 1000, // 30 seconds
    retry: 2,
  });
};
