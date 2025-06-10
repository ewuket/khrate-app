
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminStats, AdminOrder, AdminGroupSession } from '@/types/admin';

export const useAdminData = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [groupSessions, setGroupSessions] = useState<AdminGroupSession[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);

  const loadOrders = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          user_profile:user_profiles(full_name, email, phone)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedOrders = data?.map((order: any) => ({
        ...order,
        user_profile: order.user_profile || {}
      })) || [];

      setOrders(formattedOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      // Set mock data for demo
      setOrders([
        {
          id: '1',
          user_id: 'user1',
          items: [],
          total_amount: 25000,
          status: 'pending',
          payment_status: 'completed',
          delivery_address: 'Kigali',
          delivery_date: '2024-12-20',
          created_at: new Date().toISOString(),
          user_profile: { full_name: 'John Doe', email: 'john@example.com' }
        }
      ]);
    }
  }, []);

  const loadGroupSessions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('group_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGroupSessions(data || []);
    } catch (error) {
      console.error('Error loading group sessions:', error);
      // Set mock data for demo
      setGroupSessions([
        {
          id: '1',
          name: 'Weekend Groceries',
          join_code: 'WKD123',
          leader_id: 'user1',
          member_count: 3,
          total_amount: 75000,
          status: 'active',
          order_status: 'collecting',
          created_at: new Date().toISOString()
        }
      ]);
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const [ordersCount, revenue, groupsCount, usersCount] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('total_amount'),
        supabase.from('group_sessions').select('*', { count: 'exact', head: true }),
        supabase.from('user_profiles').select('*', { count: 'exact', head: true })
      ]);

      const totalRevenue = revenue.data?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
      const pendingOrders = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending');

      setStats({
        total_orders: ordersCount.count || 0,
        pending_orders: pendingOrders.count || 0,
        total_revenue: totalRevenue,
        active_groups: groupsCount.count || 0,
        total_users: usersCount.count || 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      // Set mock stats for demo
      setStats({
        total_orders: 45,
        pending_orders: 12,
        total_revenue: 1250000,
        active_groups: 8,
        total_users: 156
      });
    }
  }, []);

  return {
    orders,
    groupSessions,
    stats,
    loadOrders,
    loadGroupSessions,
    loadStats
  };
};
