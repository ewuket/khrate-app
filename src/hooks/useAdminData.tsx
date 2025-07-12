
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

  const fetchStats = useCallback(async () => {
    try {
      console.log('📊 Fetching admin statistics...');
      
      // Get basic order stats
      const { data: orderStats, error: orderError } = await supabase.rpc('get_admin_order_stats');
      if (orderError) {
        console.error('Error fetching order stats:', orderError);
        throw orderError;
      }

      // Get group stats
      const { data: groupStats, error: groupError } = await supabase.rpc('get_admin_group_stats');
      if (groupError) {
        console.error('Error fetching group stats:', groupError);
        throw groupError;
      }

      // Get user count
      const { count: userCount, error: userError } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });
      if (userError) {
        console.error('Error fetching user count:', userError);
        throw userError;
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
      // Don't show toast for stats loading errors to avoid spam
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      console.log('📋 Fetching admin orders...');
      
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
    }
  }, []);

  const fetchBundles = useCallback(async () => {
    try {
      console.log('📦 Fetching admin bundles...');
      
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
    }
  }, []);

  const refreshAllData = useCallback(async () => {
    console.log('🔄 Refreshing all admin data...');
    setLoading(true);
    try {
      await Promise.all([
        fetchStats(),
        fetchOrders(),
        fetchBundles()
      ]);
    } finally {
      setLoading(false);
    }
  }, [fetchStats, fetchOrders, fetchBundles]);

  useEffect(() => {
    refreshAllData();

    // Listen for real-time updates
    const ordersChannel = supabase
      .channel('admin-orders-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          console.log('🔄 Order changed, refreshing data...');
          fetchStats();
          fetchOrders();
        }
      )
      .subscribe();

    const bundlesChannel = supabase
      .channel('admin-bundles-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'bundles' },
        () => {
          console.log('🔄 Bundle changed, refreshing data...');
          fetchBundles();
        }
      )
      .subscribe();

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
    refreshAllData,
    fetchStats,
    fetchOrders,
    fetchBundles
  };
};
