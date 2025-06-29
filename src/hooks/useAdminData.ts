
import { useState, useEffect } from 'react';
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

  const fetchStats = async () => {
    try {
      console.log('Fetching admin stats...');
      
      // Fetch orders stats
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*');

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
      }

      // Fetch group sessions stats
      const { data: groupsData, error: groupsError } = await supabase
        .from('group_sessions')
        .select('*');

      if (groupsError) {
        console.error('Error fetching groups:', groupsError);
      }

      // Fetch user profiles count
      const { data: usersData, error: usersError } = await supabase
        .from('user_profiles')
        .select('id');

      if (usersError) {
        console.error('Error fetching users:', usersError);
      }

      // Calculate stats
      const totalOrders = ordersData?.length || 0;
      const pendingOrders = ordersData?.filter(order => order.status === 'pending').length || 0;
      const totalRevenue = ordersData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
      const activeGroups = groupsData?.filter(group => group.status === 'active').length || 0;
      const totalUsers = usersData?.length || 0;

      console.log('Calculated stats:', {
        totalOrders,
        pendingOrders,
        totalRevenue,
        activeGroups,
        totalUsers
      });

      setStats({
        total_orders: totalOrders,
        pending_orders: pendingOrders,
        total_revenue: totalRevenue,
        active_groups: activeGroups,
        total_users: totalUsers
      });

    } catch (error) {
      console.error('Error fetching admin stats:', error);
      toast.error('Failed to load admin statistics');
    }
  };

  const fetchOrders = async () => {
    try {
      console.log('Fetching admin orders...');
      
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select(`
          *,
          user_profiles!orders_user_id_fkey (
            full_name,
            email,
            phone
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }

      console.log('Fetched orders:', ordersData);

      // Transform the data to match AdminOrder interface
      const transformedOrders = ordersData?.map(order => ({
        ...order,
        user_profile: {
          full_name: order.user_profiles?.full_name || 'Unknown',
          email: order.user_profiles?.email || 'unknown@example.com',
          phone: order.user_profiles?.phone || null
        }
      })) || [];

      setOrders(transformedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    }
  };

  const fetchBundles = async () => {
    try {
      console.log('Fetching admin bundles...');
      
      const { data: bundlesData, error } = await supabase
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
        console.error('Error fetching bundles:', error);
        throw error;
      }

      console.log('Fetched bundles:', bundlesData);

      // Transform the data to match AdminBundle interface
      const transformedBundles = bundlesData?.map(bundle => ({
        ...bundle,
        items: bundle.bundle_items || [],
        items_count: bundle.bundle_items?.length || 0
      })) || [];

      setBundles(transformedBundles);
    } catch (error) {
      console.error('Error fetching bundles:', error);
      toast.error('Failed to load bundles');
    }
  };

  const refreshAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchStats(),
        fetchOrders(),
        fetchBundles()
      ]);
    } catch (error) {
      console.error('Error refreshing admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

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
