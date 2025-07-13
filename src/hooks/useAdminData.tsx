
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
      
      // Use the optimized admin dashboard stats function
      const { data: dashboardStats, error: statsError } = await supabase.rpc('get_admin_dashboard_stats');
      
      if (statsError) {
        console.error('Stats RPC error:', statsError);
        throw statsError;
      }

      if (dashboardStats && dashboardStats.length > 0) {
        const stats = dashboardStats[0];
        console.log('✅ Dashboard stats loaded:', stats);
        
        setStats({
          total_orders: Number(stats.total_orders || 0),
          pending_orders: Number(stats.pending_orders || 0),
          total_revenue: Number(stats.total_revenue || 0),
          active_groups: Number(stats.active_groups || 0),
          total_users: Number(stats.total_users || 0)
        });
      }
    } catch (error: any) {
      console.error('❌ Error fetching admin stats:', error);
      setError(error.message || 'Failed to load statistics');
      toast.error('Failed to load admin statistics');
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      console.log('📋 Fetching admin orders...');
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          user_profiles(full_name, email, phone)
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
        user_profile: order.user_profiles || {
          full_name: order.phone_number ? 'Guest User' : 'Unknown User',
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

    // Set up real-time listeners
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
      .subscribe();

    const bundlesChannel = supabase
      .channel('admin-bundles-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'bundles' },
        (payload) => {
          console.log('🔄 Bundle changed:', payload);
          fetchStats();
          fetchBundles();
        }
      )
      .subscribe();

    const customItemsChannel = supabase
      .channel('admin-custom-items-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'custom_buy_items' },
        (payload) => {
          console.log('🔄 Custom item changed:', payload);
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(bundlesChannel);
      supabase.removeChannel(customItemsChannel);
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
