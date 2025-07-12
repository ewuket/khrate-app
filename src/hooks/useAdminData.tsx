
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminStats, AdminOrder, AdminBundle } from '@/types/admin';
import { toast } from 'sonner';

export const useAdminData = () => {
  const [stats, setStats] = useState<AdminStats>({
    total_orders: 0,
    pending_orders: 0,
    total_revenue: 0,
    active_groups: 0,
    total_users: 0
  });
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [bundles, setBundles] = useState<AdminBundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      console.log('📊 Fetching admin statistics...');
      setError(null);
      
      // Get basic order stats with fallback
      let orderStats, groupStats, userCount;
      
      try {
        const { data: orderStatsData, error: orderError } = await supabase.rpc('get_admin_order_stats');
        if (orderError) {
          console.warn('Order stats RPC failed, using fallback:', orderError);
          // Fallback: count orders directly
          const { count } = await supabase.from('orders').select('*', { count: 'exact', head: true });
          orderStats = [{ total_orders: count || 0, pending_orders: 0, total_revenue: 0 }];
        } else {
          orderStats = orderStatsData;
        }
      } catch (error) {
        console.warn('Order stats fallback:', error);
        orderStats = [{ total_orders: 0, pending_orders: 0, total_revenue: 0 }];
      }

      try {
        const { data: groupStatsData, error: groupError } = await supabase.rpc('get_admin_group_stats');
        if (groupError) {
          console.warn('Group stats RPC failed, using fallback:', groupError);
          // Fallback: count groups directly
          const { count } = await supabase.from('group_sessions').select('*', { count: 'exact', head: true });
          groupStats = [{ active_groups: count || 0 }];
        } else {
          groupStats = groupStatsData;
        }
      } catch (error) {
        console.warn('Group stats fallback:', error);
        groupStats = [{ active_groups: 0 }];
      }

      try {
        const { count: userCountData, error: userError } = await supabase
          .from('user_profiles')
          .select('*', { count: 'exact', head: true });
        if (userError) {
          console.warn('User count failed:', userError);
          userCount = 0;
        } else {
          userCount = userCountData;
        }
      } catch (error) {
        console.warn('User count fallback:', error);
        userCount = 0;
      }

      const updatedStats = {
        total_orders: Number(orderStats?.[0]?.total_orders || 0),
        pending_orders: Number(orderStats?.[0]?.pending_orders || 0),
        total_revenue: Number(orderStats?.[0]?.total_revenue || 0),
        active_groups: Number(groupStats?.[0]?.active_groups || 0),
        total_users: Number(userCount || 0)
      };

      console.log('✅ Admin statistics loaded:', updatedStats);
      setStats(updatedStats);
    } catch (error: any) {
      console.error('❌ Error fetching admin stats:', error);
      setError(error.message || 'Failed to load statistics');
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      console.log('📋 Fetching admin orders...');
      setError(null);
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          user_profile:user_profiles(full_name, email, phone)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }

      const formattedOrders: AdminOrder[] = data?.map(order => ({
        ...order,
        items: Array.isArray(order.items) ? order.items : [],
        user_profile: order.user_profile || {
          full_name: 'Guest User',
          email: 'N/A',
          phone: order.phone_number || null
        }
      })) || [];

      console.log('✅ Admin orders loaded:', formattedOrders.length);
      setOrders(formattedOrders);
    } catch (error: any) {
      console.error('❌ Error fetching admin orders:', error);
      setError(error.message || 'Failed to load orders');
      setOrders([]);
    }
  }, []);

  const fetchBundles = useCallback(async () => {
    try {
      console.log('📦 Fetching admin bundles...');
      setError(null);
      
      const { data, error } = await supabase
        .from('bundles')
        .select(`
          *,
          bundle_items(item_name, quantity, unit)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bundles:', error);
        throw error;
      }

      const formattedBundles = data?.map(bundle => ({
        ...bundle,
        items: bundle.bundle_items || [],
        items_count: bundle.bundle_items?.length || 0,
        bundle_items: bundle.bundle_items || []
      })) || [];

      console.log('✅ Admin bundles loaded:', formattedBundles.length);
      setBundles(formattedBundles);
    } catch (error: any) {
      console.error('❌ Error fetching admin bundles:', error);
      setError(error.message || 'Failed to load bundles');
      setBundles([]);
    }
  }, []);

  const refreshAllData = useCallback(async () => {
    console.log('🔄 Refreshing all admin data...');
    setLoading(true);
    setError(null);
    
    try {
      await Promise.allSettled([
        fetchStats(),
        fetchOrders(),
        fetchBundles()
      ]);
    } catch (error: any) {
      console.error('Error refreshing data:', error);
      setError(error.message || 'Failed to refresh data');
    } finally {
      setLoading(false);
    }
  }, [fetchStats, fetchOrders, fetchBundles]);

  useEffect(() => {
    refreshAllData();

    // Set up real-time listeners with error handling
    const ordersChannel = supabase
      .channel('admin-orders-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          console.log('🔄 Order changed:', payload);
          fetchStats();
          fetchOrders();
        }
      )
      .subscribe((status) => {
        console.log('Orders channel status:', status);
      });

    const bundlesChannel = supabase
      .channel('admin-bundles-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'bundles' },
        (payload) => {
          console.log('🔄 Bundle changed:', payload);
          fetchBundles();
        }
      )
      .subscribe((status) => {
        console.log('Bundles channel status:', status);
      });

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(bundlesChannel);
    };
  }, [refreshAllData, fetchStats, fetchOrders, fetchBundles]);

  return {
    stats,
    orders,
    bundles,
    loading,
    error,
    refreshAllData,
    fetchStats,
    fetchOrders,
    fetchBundles
  };
};
