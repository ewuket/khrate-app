
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
    try {
      console.log('Loading orders...');
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading orders:', error);
        toast.error('Failed to load orders');
        setOrders([]);
        return [];
      }

      const formattedOrders: AdminOrder[] = (data || []).map((order: any) => ({
        id: order.id,
        user_id: order.user_id,
        items: typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || []),
        total_amount: Number(order.total_amount || 0),
        original_amount: Number(order.original_amount || 0),
        discount_applied: Number(order.discount_applied || 0),
        discount_percentage: order.discount_percentage || 0,
        delivery_address: order.delivery_address || '',
        delivery_date: order.delivery_date,
        delivery_time_slot: order.delivery_time_slot,
        phone_number: order.phone_number,
        payment_method: order.payment_method || '',
        status: order.status || 'pending',
        payment_status: order.payment_status || 'pending',
        created_at: order.created_at,
        updated_at: order.updated_at,
        user_profile: {
          full_name: '',
          email: '',
          phone: ''
        }
      }));

      console.log('Orders loaded successfully:', formattedOrders.length);
      setOrders(formattedOrders);
      return formattedOrders;
      
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
      setOrders([]);
      return [];
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
        console.error('Error loading group sessions:', error);
        toast.error('Failed to load group sessions');
        setGroupSessions([]);
        return [];
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

      console.log('Group sessions loaded successfully:', formattedGroupSessions.length);
      setGroupSessions(formattedGroupSessions);
      return formattedGroupSessions;
    } catch (error) {
      console.error('Error loading group sessions:', error);
      toast.error('Failed to load group sessions');
      setGroupSessions([]);
      return [];
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      console.log('Loading stats...');
      
      // Get orders data with fallback
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('total_amount, status, payment_status');

      if (ordersError) {
        console.error('Error loading orders for stats:', ordersError);
      }

      // Get users count with fallback
      const { count: usersCount, error: usersError } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      if (usersError) {
        console.error('Error loading users count:', usersError);
      }

      // Get groups count with fallback
      const { count: groupsCount, error: groupsError } = await supabase
        .from('group_sessions')
        .select('*', { count: 'exact', head: true });

      if (groupsError) {
        console.error('Error loading groups count:', groupsError);
      }

      const totalOrders = ordersData?.length || 0;
      const pendingOrders = ordersData?.filter(order => 
        order.status === 'pending' || order.payment_status === 'pending'
      ).length || 0;
      const totalRevenue = ordersData?.reduce((sum, order) => 
        sum + Number(order.total_amount || 0), 0
      ) || 0;

      const calculatedStats: AdminStats = {
        total_orders: totalOrders,
        pending_orders: pendingOrders,
        total_revenue: totalRevenue,
        active_groups: groupsCount || 0,
        total_users: usersCount || 0
      };

      console.log('Stats calculated:', calculatedStats);
      setStats(calculatedStats);
      return calculatedStats;
    } catch (error) {
      console.error('Error loading stats:', error);
      const fallbackStats: AdminStats = {
        total_orders: 0,
        pending_orders: 0,
        total_revenue: 0,
        active_groups: 0,
        total_users: 0
      };
      setStats(fallbackStats);
      return fallbackStats;
    }
  }, []);

  const subscribeToOrders = useCallback(() => {
    console.log('Setting up real-time subscription...');
    
    const channel = supabase
      .channel('orders-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'orders' 
        }, 
        (payload) => {
          console.log('Real-time update received:', payload);
          loadOrders();
          loadStats();
        })
      .subscribe();

    return () => {
      console.log('Cleaning up subscription');
      supabase.removeChannel(channel);
    };
  }, [loadOrders, loadStats]);

  const refreshAllData = useCallback(async () => {
    console.log('Refreshing all data...');
    setLoading(true);
    try {
      const [ordersData, groupsData, statsData] = await Promise.all([
        loadOrders(),
        loadGroupSessions(),
        loadStats()
      ]);
      console.log('All data refreshed successfully');
      return { orders: ordersData, groups: groupsData, stats: statsData };
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error('Failed to refresh some data');
      console.log('Continuing with available data');
    } finally {
      setLoading(false);
    }
  }, [loadOrders, loadGroupSessions, loadStats]);

  return {
    orders,
    groupSessions,
    stats,
    loading,
    loadOrders,
    loadGroupSessions,
    loadStats,
    subscribeToOrders,
    refreshAllData
  };
};
