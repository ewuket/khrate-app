
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminStats, AdminOrder, AdminGroupSession } from '@/types/admin';

export const useAdminData = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [groupSessions, setGroupSessions] = useState<AdminGroupSession[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          user_profile:user_profiles(full_name, email, phone)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Error loading orders from database:', error);
        // Use mock data for demo
        setOrders([
          {
            id: '1',
            user_id: 'user1',
            items: [
              { name: 'Single Bundle', quantity: 1, price: 32700 }
            ],
            total_amount: 32700,
            status: 'pending',
            payment_status: 'completed',
            delivery_address: 'Kigali, Rwanda',
            delivery_date: '2024-12-20',
            created_at: new Date().toISOString(),
            user_profile: { full_name: 'John Doe', email: 'john@example.com', phone: '+250789123456' }
          },
          {
            id: '2',
            user_id: 'user2',
            items: [
              { name: 'Medium Bundle', quantity: 1, price: 69240 }
            ],
            total_amount: 69240,
            status: 'confirmed',
            payment_status: 'completed',
            delivery_address: 'Butare, Rwanda',
            delivery_date: '2024-12-21',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            user_profile: { full_name: 'Jane Smith', email: 'jane@example.com', phone: '+250788987654' }
          }
        ]);
        return;
      }

      const formattedOrders = data?.map((order: any) => ({
        ...order,
        user_profile: order.user_profile || {}
      })) || [];

      setOrders(formattedOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadGroupSessions = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('group_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Error loading group sessions from database:', error);
        // Use mock data for demo
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
          },
          {
            id: '2',
            name: 'Family Essentials',
            join_code: 'FAM456',
            leader_id: 'user2',
            member_count: 5,
            total_amount: 150000,
            status: 'active',
            order_status: 'collecting',
            created_at: new Date(Date.now() - 3600000).toISOString()
          }
        ]);
        return;
      }
      
      // Format the data to match AdminGroupSession interface
      const formattedGroupSessions: AdminGroupSession[] = (data || []).map(session => ({
        id: session.id,
        name: session.name || 'Unnamed Group',
        join_code: session.join_code,
        leader_id: session.leader_id,
        member_count: 0, // This would typically come from a separate query or join
        total_amount: 0, // This would typically come from calculating cart items
        status: session.status,
        order_status: session.order_status || 'collecting',
        created_at: session.created_at
      }));

      setGroupSessions(formattedGroupSessions);
    } catch (error) {
      console.error('Error loading group sessions:', error);
      setGroupSessions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadStats = useCallback(async () => {
    setLoading(true);
    try {
      const [ordersCount, revenue, groupsCount, usersCount] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('total_amount'),
        supabase.from('group_sessions').select('*', { count: 'exact', head: true }),
        supabase.from('user_profiles').select('*', { count: 'exact', head: true })
      ]);

      const totalRevenue = revenue.data?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 125000;
      const pendingOrders = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending');

      setStats({
        total_orders: ordersCount.count || 12,
        pending_orders: pendingOrders.count || 3,
        total_revenue: totalRevenue,
        active_groups: groupsCount.count || 5,
        total_users: usersCount.count || 28
      });
    } catch (error) {
      console.warn('Error loading stats from database:', error);
      // Set mock stats for demo
      setStats({
        total_orders: 12,
        pending_orders: 3,
        total_revenue: 125000,
        active_groups: 5,
        total_users: 28
      });
    } finally {
      setLoading(false);
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
