
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AdminOrder, AdminGroupSession, AdminStats } from "@/types/admin";

export const useAdminData = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [groupSessions, setGroupSessions] = useState<AdminGroupSession[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          user_profiles (
            full_name,
            email,
            phone
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match AdminOrder interface
      const transformedOrders: AdminOrder[] = (data || []).map(order => ({
        id: order.id,
        user_id: order.user_id,
        items: Array.isArray(order.items) ? order.items : 
               typeof order.items === 'string' ? JSON.parse(order.items) : 
               order.items ? [order.items] : [],
        total_amount: order.total_amount,
        status: order.status,
        payment_status: order.payment_status,
        delivery_address: order.delivery_address,
        delivery_date: order.delivery_date,
        created_at: order.created_at,
        user_profile: order.user_profiles ? {
          full_name: order.user_profiles.full_name,
          email: order.user_profiles.email,
          phone: order.user_profiles.phone
        } : undefined
      }));

      setOrders(transformedOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
    }
  };

  const loadGroupSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('group_sessions')
        .select(`
          *,
          group_members (count),
          group_cart_items (
            product_price,
            quantity
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const sessionsWithStats = data.map(session => {
        const memberCount = session.group_members?.[0]?.count || 0;
        const totalAmount = session.group_cart_items?.reduce(
          (sum: number, item: any) => sum + (item.product_price * item.quantity), 0
        ) || 0;

        return {
          id: session.id,
          name: session.name,
          join_code: session.join_code,
          leader_id: session.leader_id,
          member_count: memberCount,
          total_amount: totalAmount,
          status: session.status,
          order_status: session.order_status,
          created_at: session.created_at
        };
      });

      setGroupSessions(sessionsWithStats);
    } catch (error) {
      console.error('Error loading group sessions:', error);
      toast.error('Failed to load group sessions');
    }
  };

  const loadStats = async () => {
    try {
      // Load basic stats
      const [ordersCount, revenueData, usersCount, activeGroupsCount] = await Promise.all([
        supabase.from('orders').select('id, status, total_amount'),
        supabase.from('orders').select('total_amount').eq('status', 'delivered'),
        supabase.from('user_profiles').select('id', { count: 'exact' }),
        supabase.from('group_sessions').select('id', { count: 'exact' }).eq('status', 'active')
      ]);

      const totalOrders = ordersCount.data?.length || 0;
      const pendingOrders = ordersCount.data?.filter(o => o.status === 'pending').length || 0;
      const totalRevenue = revenueData.data?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
      const totalUsers = usersCount.count || 0;
      const activeGroups = activeGroupsCount.count || 0;

      setStats({
        total_orders: totalOrders,
        pending_orders: pendingOrders,
        total_revenue: totalRevenue,
        active_groups: activeGroups,
        total_users: totalUsers
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  return {
    orders,
    groupSessions,
    stats,
    loadOrders,
    loadGroupSessions,
    loadStats
  };
};
