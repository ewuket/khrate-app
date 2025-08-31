
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
      
      const { data: orderStats, error: orderStatsError } = await supabase
        .rpc('get_admin_order_stats');
        
      if (orderStatsError) {
        throw new Error(`Order stats fetch failed: ${orderStatsError.message}`);
      }

      const { count: usersCount, error: usersError } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });
        
      if (usersError) {
        throw new Error(`Users fetch failed: ${usersError.message}`);
      }

      const { count: groupsCount, error: groupsError } = await supabase
        .from('group_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');
        
      if (groupsError) {
        throw new Error(`Groups fetch failed: ${groupsError.message}`);
      }

      const statsFromFunction = orderStats?.[0];
      
      const calculatedStats = {
        total_orders: Number(statsFromFunction?.total_orders || 0),
        pending_orders: Number(statsFromFunction?.pending_orders || 0),
        total_revenue: Number(statsFromFunction?.total_revenue || 0),
        active_groups: groupsCount || 0,
        total_users: usersCount || 0
      };

      console.log('✅ Admin statistics loaded:', calculatedStats);
      setStats(calculatedStats);
    } catch (error: any) {
      console.error('❌ Failed to load admin statistics:', error);
      setError(error.message);
      toast.error(`Failed to load admin statistics: ${error.message}`);
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
          user_profiles!left (
            full_name,
            email,
            phone
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        throw new Error(`Orders fetch failed: ${error.message}`);
      }

      const formattedOrders: AdminOrder[] = (data || []).map(order => ({
        ...order,
        items: Array.isArray(order.items) ? order.items : [],
        user_profile: order.user_profiles || {
          full_name: 'Guest User',
          email: 'guest@example.com',
          phone: null
        }
      }));

      console.log('✅ Orders loaded:', formattedOrders.length);
      setOrders(formattedOrders);
    } catch (error: any) {
      console.error('❌ Failed to load orders:', error);
      setError(error.message);
      toast.error(`Failed to load orders: ${error.message}`);
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
          bundle_items (
            id,
            item_name,
            quantity,
            unit
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Bundles fetch failed: ${error.message}`);
      }

      const formattedBundles = (data || []).map(bundle => ({
        ...bundle,
        items: bundle.bundle_items || [],
        items_count: bundle.bundle_items?.length || 0
      }));

      console.log('✅ Bundles loaded:', formattedBundles.length);
      setBundles(formattedBundles);
    } catch (error: any) {
      console.error('❌ Failed to load bundles:', error);
      setError(error.message);
      toast.error(`Failed to load bundles: ${error.message}`);
    }
  }, []);

  const refreshAllData = useCallback(async () => {
    console.log('🔄 Refreshing all admin data...');
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchStats(),
        fetchOrders(),
        fetchBundles()
      ]);
      console.log('✅ All admin data refreshed successfully');
    } catch (error: any) {
      console.error('❌ Failed to refresh admin data:', error);
      setError('Failed to refresh admin data');
    } finally {
      setLoading(false);
    }
  }, [fetchStats, fetchOrders, fetchBundles]);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Listen for external refresh events
  useEffect(() => {
    const handleRefreshStats = () => {
      console.log('🔄 External refresh event received');
      fetchStats();
    };

    window.addEventListener('refresh-admin-stats', handleRefreshStats);
    return () => {
      window.removeEventListener('refresh-admin-stats', handleRefreshStats);
    };
  }, [fetchStats]);

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
