
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AdminStats {
  total_orders: number;
  pending_orders: number;
  total_revenue: number;
  active_groups: number;
  total_users: number;
}

export interface AdminOrder {
  id: string;
  user_id: string | null;
  items: any[];
  total_amount: number;
  status: string;
  payment_status: string;
  delivery_address: string;
  delivery_date: string | null;
  created_at: string;
  user_profile?: {
    full_name: string;
    email: string;
    phone?: string;
  };
}

export interface AdminBundle {
  id: number;
  title: string;
  description: string | null;
  price: number;
  original_price: number | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  items_count: number;
}

export const useAdminData = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [bundles, setBundles] = useState<AdminBundle[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);

  const loadOrders = useCallback(async () => {
    try {
      console.log('Loading admin orders...');
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          user_profiles(full_name, email, phone)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const formattedOrders: AdminOrder[] = (data || []).map((order: any) => ({
        id: order.id,
        user_id: order.user_id,
        items: typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || []),
        total_amount: Number(order.total_amount || 0),
        delivery_address: order.delivery_address || '',
        delivery_date: order.delivery_date,
        status: order.status || 'pending',
        payment_status: order.payment_status || 'pending',
        created_at: order.created_at,
        user_profile: order.user_profiles || {
          full_name: 'Guest User',
          email: 'N/A',
        }
      }));

      console.log('Admin orders loaded:', formattedOrders.length);
      setOrders(formattedOrders);
      return formattedOrders;
      
    } catch (error) {
      console.error('Error loading admin orders:', error);
      toast.error('Failed to load orders');
      setOrders([]);
      throw error;
    }
  }, []);

  const loadBundles = useCallback(async () => {
    try {
      console.log('Loading admin bundles...');
      
      const { data: bundlesData, error: bundlesError } = await supabase
        .from('bundles')
        .select('*')
        .order('created_at', { ascending: false });

      if (bundlesError) throw bundlesError;

      const { data: itemsData, error: itemsError } = await supabase
        .from('bundle_items')
        .select('bundle_id');

      if (itemsError) {
        console.warn('Could not load bundle items:', itemsError);
      }

      // Count items per bundle
      const itemCounts: Record<number, number> = {};
      (itemsData || []).forEach(item => {
        itemCounts[item.bundle_id] = (itemCounts[item.bundle_id] || 0) + 1;
      });

      const formattedBundles: AdminBundle[] = (bundlesData || []).map((bundle: any) => ({
        id: bundle.id,
        title: bundle.title,
        description: bundle.description,
        price: Number(bundle.price),
        original_price: bundle.original_price ? Number(bundle.original_price) : null,
        is_featured: Boolean(bundle.is_featured),
        is_active: Boolean(bundle.is_active),
        created_at: bundle.created_at,
        items_count: itemCounts[bundle.id] || 0
      }));

      console.log('Admin bundles loaded:', formattedBundles.length);
      setBundles(formattedBundles);
      return formattedBundles;
      
    } catch (error) {
      console.error('Error loading admin bundles:', error);
      toast.error('Failed to load bundles');
      setBundles([]);
      throw error;
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      console.log('Loading admin stats...');
      
      // Get orders data
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('total_amount, status, payment_status');

      if (ordersError) {
        console.warn('Error loading orders for stats:', ordersError);
      }

      // Get user profiles count (this represents registered users)
      const { count: usersCount, error: usersError } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      if (usersError) {
        console.warn('Error loading users count:', usersError);
      }

      // Get group sessions count
      const { count: groupsCount, error: groupsError } = await supabase
        .from('group_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      if (groupsError) {
        console.warn('Error loading groups count:', groupsError);
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

      console.log('Admin stats calculated:', calculatedStats);
      setStats(calculatedStats);
      return calculatedStats;
    } catch (error) {
      console.error('Error loading admin stats:', error);
      toast.error('Failed to load stats');
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

  const refreshAllData = useCallback(async () => {
    console.log('Refreshing all admin data...');
    setLoading(true);
    try {
      await Promise.allSettled([
        loadOrders(),
        loadBundles(),
        loadStats()
      ]);
      toast.success('Data refreshed successfully');
    } catch (error) {
      console.error('Error refreshing admin data:', error);
      toast.error('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  }, [loadOrders, loadBundles, loadStats]);

  return {
    orders,
    bundles,
    stats,
    loading,
    loadOrders,
    loadBundles,
    loadStats,
    refreshAllData
  };
};
