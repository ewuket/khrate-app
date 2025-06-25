
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminStats, AdminOrder } from "@/types/admin";

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async (): Promise<AdminStats> => {
      console.log('Fetching admin stats...');
      
      try {
        // Get total orders
        const { count: totalOrders } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true });

        // Get pending orders
        const { count: pendingOrders } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        // Get total revenue
        const { data: revenueData } = await supabase
          .from('orders')
          .select('total_amount')
          .eq('payment_status', 'completed');

        const totalRevenue = revenueData?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

        // Get active groups
        const { count: activeGroups } = await supabase
          .from('group_sessions')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');

        // Get total users
        const { count: totalUsers } = await supabase
          .from('user_profiles')
          .select('*', { count: 'exact', head: true });

        console.log('Admin stats fetched successfully');

        return {
          total_orders: totalOrders || 0,
          pending_orders: pendingOrders || 0,
          total_revenue: totalRevenue,
          active_groups: activeGroups || 0,
          total_users: totalUsers || 0,
        };
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        throw error;
      }
    },
    staleTime: 30 * 1000, // 30 seconds
    retry: 2,
  });
};

export const useAdminOrders = () => {
  return useQuery({
    queryKey: ['admin-orders'],
    queryFn: async (): Promise<AdminOrder[]> => {
      console.log('Fetching admin orders...');
      
      try {
        const { data: orders, error } = await supabase
          .from('orders')
          .select(`
            *,
            user_profiles!inner(
              full_name,
              email,
              phone
            )
          `)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) {
          console.error('Error fetching orders:', error);
          throw error;
        }

        console.log('Admin orders fetched:', orders?.length || 0);

        return orders?.map(order => ({
          id: order.id,
          user_id: order.user_id,
          items: order.items,
          total_amount: order.total_amount,
          status: order.status,
          payment_status: order.payment_status,
          delivery_address: order.delivery_address,
          delivery_date: order.delivery_date,
          created_at: order.created_at,
          user_profile: {
            full_name: order.user_profiles?.full_name || 'Unknown',
            email: order.user_profiles?.email || 'Unknown',
            phone: order.user_profiles?.phone
          }
        })) || [];
      } catch (error) {
        console.error('Error fetching admin orders:', error);
        throw error;
      }
    },
    staleTime: 30 * 1000, // 30 seconds
    retry: 2,
  });
};
