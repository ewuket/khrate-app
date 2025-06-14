
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminStats, AdminOrder, AdminGroupSession } from '@/types/admin';
import { toast } from 'sonner';

export const useAdminData = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [groupSessions, setGroupSessions] = useState<AdminGroupSession[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Loading orders from database...');
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          user_profile:user_profiles(full_name, email, phone)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Error loading orders from database:', error);
        // Return empty array instead of mock data to show real state
        setOrders([]);
        return;
      }

      const formattedOrders = data?.map((order: any) => ({
        ...order,
        items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items,
        user_profile: order.user_profile || {}
      })) || [];

      setOrders(formattedOrders);
      console.log('Orders loaded successfully:', formattedOrders.length);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadGroupSessions = useCallback(async () => {
    try {
      console.log('Loading group sessions...');
      
      const { data, error } = await supabase
        .from('group_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Error loading group sessions from database:', error);
        setGroupSessions([]);
        return;
      }
      
      const formattedGroupSessions: AdminGroupSession[] = (data || []).map(session => ({
        id: session.id,
        name: session.name || 'Unnamed Group',
        join_code: session.join_code,
        leader_id: session.leader_id,
        member_count: 0,
        total_amount: 0,
        status: session.status as 'active' | 'inactive',
        order_status: session.order_status || 'collecting',
        created_at: session.created_at
      }));

      setGroupSessions(formattedGroupSessions);
      console.log('Group sessions loaded successfully:', formattedGroupSessions.length);
    } catch (error) {
      console.error('Error loading group sessions:', error);
      toast.error('Failed to load group sessions');
      setGroupSessions([]);
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      console.log('Loading admin stats...');
      
      const [ordersCount, revenue, groupsCount, usersCount] = await Promise.allSettled([
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('total_amount'),
        supabase.from('group_sessions').select('*', { count: 'exact', head: true }),
        supabase.from('user_profiles').select('*', { count: 'exact', head: true })
      ]);

      const totalRevenue = revenue.status === 'fulfilled' && revenue.value.data 
        ? revenue.value.data.reduce((sum, order) => sum + Number(order.total_amount), 0) 
        : 0;

      const pendingOrders = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      setStats({
        total_orders: ordersCount.status === 'fulfilled' ? ordersCount.value.count || 0 : 0,
        pending_orders: pendingOrders.count || 0,
        total_revenue: totalRevenue,
        active_groups: groupsCount.status === 'fulfilled' ? groupsCount.value.count || 0 : 0,
        total_users: usersCount.status === 'fulfilled' ? usersCount.value.count || 0 : 0
      });

      console.log('Stats loaded successfully');
    } catch (error) {
      console.warn('Error loading stats from database:', error);
      // Set fallback stats to 0 to show real state
      setStats({
        total_orders: 0,
        pending_orders: 0,
        total_revenue: 0,
        active_groups: 0,
        total_users: 0
      });
    }
  }, []);

  return {
    orders,
    groupSessions,
    stats,
    loading,
    loadOrders,
    loadGroupSessions,
    loadStats
  };
};
