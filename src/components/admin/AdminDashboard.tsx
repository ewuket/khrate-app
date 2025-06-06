
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Users, ShoppingCart, TrendingUp, Package, CreditCard, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';

interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  activeGroups: number;
  totalUsers: number;
  pendingOrders: number;
  completedPayments: number;
}

interface RealtimeOrder {
  id: string;
  user_id: string;
  items: any[];
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  user_profiles?: {
    full_name: string;
    email: string;
  };
}

interface RealtimeGroup {
  id: string;
  name: string;
  leader_id: string;
  status: string;
  member_count: number;
  total_amount: number;
  created_at: string;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalOrders: 0,
    totalRevenue: 0,
    activeGroups: 0,
    totalUsers: 0,
    pendingOrders: 0,
    completedPayments: 0
  });
  
  const [recentOrders, setRecentOrders] = useState<RealtimeOrder[]>([]);
  const [activeGroups, setActiveGroups] = useState<RealtimeGroup[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load orders with user profiles
      const { data: orders } = await supabase
        .from('orders')
        .select(`
          *,
          user_profiles(full_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      // Load group sessions with member counts
      const { data: groups } = await supabase
        .from('group_sessions')
        .select(`
          *,
          group_members(count)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      // Load user count
      const { count: userCount } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      // Calculate stats
      const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
      const pendingOrders = orders?.filter(order => order.status === 'pending').length || 0;
      const completedPayments = orders?.filter(order => order.payment_status === 'completed').length || 0;

      setStats({
        totalOrders: orders?.length || 0,
        totalRevenue,
        activeGroups: groups?.length || 0,
        totalUsers: userCount || 0,
        pendingOrders,
        completedPayments
      });

      setRecentOrders(orders || []);
      setActiveGroups(groups?.map(group => ({
        ...group,
        member_count: group.group_members?.[0]?.count || 0,
        total_amount: 0
      })) || []);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      toast.success(`Order status updated to ${newStatus}`);
      loadDashboardData();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const updatePaymentStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      toast.success(`Payment status updated to ${newStatus}`);
      loadDashboardData();
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Failed to update payment status');
    }
  };

  useEffect(() => {
    loadDashboardData();

    // Set up realtime subscriptions
    const channel = supabase
      .channel('admin-dashboard')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          console.log('New order activity:', payload);
          loadDashboardData();
          
          if (payload.eventType === 'INSERT') {
            setNotifications(prev => [...prev, {
              id: Date.now(),
              type: 'new_order',
              message: 'New order received',
              timestamp: new Date().toISOString()
            }]);
          }
        }
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'group_sessions' },
        () => loadDashboardData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'confirmed':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return <CheckCircle className="h-3 w-3" />;
      case 'pending':
        return <Clock className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-khrate-500"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4" />
                  {notifications.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
                      {notifications.length}
                    </Badge>
                  )}
                </Button>
              </div>
              <Button variant="outline" size="sm">
                Admin Panel
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingOrders} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                {stats.completedPayments} completed payments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeGroups}</div>
              <p className="text-xs text-muted-foreground">
                Group buying sessions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Registered customers
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders">Recent Orders</TabsTrigger>
            <TabsTrigger value="groups">Active Groups</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest customer orders and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <p className="font-medium">
                            {order.user_profiles?.full_name || order.user_profiles?.email || 'Guest'}
                          </p>
                          <Badge variant={getStatusBadgeVariant(order.status)} className="flex items-center gap-1">
                            {getStatusIcon(order.status)}
                            {order.status}
                          </Badge>
                          <Badge variant={getStatusBadgeVariant(order.payment_status)}>
                            {order.payment_status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(order.total_amount)} • {new Date(order.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Items: {Array.isArray(order.items) ? order.items.length : 0}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateOrderStatus(order.id, order.status === 'pending' ? 'confirmed' : 'delivered')}
                        >
                          Update Status
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updatePaymentStatus(order.id, order.payment_status === 'pending' ? 'completed' : 'pending')}
                        >
                          <CreditCard className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {recentOrders.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No orders found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="groups" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Groups</CardTitle>
                <CardDescription>Current group buying sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeGroups.map((group) => (
                    <div key={group.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <p className="font-medium">{group.name}</p>
                          <Badge variant="outline">{group.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {group.member_count} members • Created {new Date(group.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                  {activeGroups.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No active groups found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage customer accounts and activity</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">User management features coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
