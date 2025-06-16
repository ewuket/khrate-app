
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminStatsCards from "./AdminStatsCards";
import AdminOrdersList from "./AdminOrdersList";
import AdminGroupsList from "./AdminGroupsList";
import AdminGroupManagement from "./AdminGroupManagement";
import AdminHeader from "./AdminHeader";
import AdminNotifications from "./AdminNotifications";
import { useAdminData } from "@/hooks/useAdminData";
import { useAdminOperations } from "@/hooks/useAdminOperations";
import { Button } from "@/components/ui/button";
import { RefreshCw, Settings, Users, ShoppingBag, BarChart3, Bell } from "lucide-react";
import { toast } from "sonner";

const AdminDashboard = () => {
  const { 
    orders, 
    groupSessions, 
    stats, 
    loading, 
    loadOrders, 
    loadGroupSessions, 
    loadStats,
    subscribeToOrders 
  } = useAdminData();
  const { updateOrderStatus, updatePaymentStatus } = useAdminOperations();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const refreshAllData = async () => {
    setRefreshing(true);
    try {
      console.log('Refreshing all admin data...');
      await Promise.all([
        loadOrders(),
        loadGroupSessions(),
        loadStats()
      ]);
      console.log('All admin data refreshed successfully');
      toast.success('Data refreshed successfully');
    } catch (error) {
      console.error('Error refreshing admin data:', error);
      toast.error('Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    console.log('Admin dashboard initializing...');
    
    // Load initial data
    refreshAllData();
    
    // Set up real-time subscription
    const unsubscribe = subscribeToOrders();
    
    // Set up periodic refresh every 30 seconds
    const interval = setInterval(() => {
      console.log('Periodic refresh of admin data...');
      loadOrders();
      loadStats();
    }, 30000);

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  const handleUpdateOrderStatus = async (orderId: string, currentStatus: string) => {
    const statusOptions = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
    const currentIndex = statusOptions.indexOf(currentStatus);
    const nextStatus = statusOptions[(currentIndex + 1) % statusOptions.length];
    
    const success = await updateOrderStatus(orderId, nextStatus);
    if (success) {
      await loadOrders();
      await loadStats();
      toast.success(`Order status updated to ${nextStatus}`);
    }
  };

  const handleUpdatePaymentStatus = async (orderId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    const success = await updatePaymentStatus(orderId, newStatus);
    if (success) {
      await loadOrders();
      await loadStats();
      toast.success(`Payment status updated to ${newStatus}`);
    }
  };

  const handleSettingsClick = () => {
    toast.info('Settings panel - feature coming soon');
    console.log('Settings button clicked - functionality can be expanded here');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your Khrate platform with real-time data</p>
              <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                <Bell className="h-4 w-4" />
                <span>Real-time order tracking active</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleSettingsClick}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
              <Button
                onClick={refreshAllData}
                disabled={refreshing}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh Data'}
              </Button>
            </div>
          </div>
        </div>

        <AdminNotifications />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Orders ({orders.length})
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Groups ({groupSessions.length})
            </TabsTrigger>
            <TabsTrigger value="group-management" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <AdminStatsCards stats={stats} loading={loading} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
                <AdminOrdersList 
                  orders={orders.slice(0, 5)} 
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                  onUpdatePaymentStatus={handleUpdatePaymentStatus}
                />
                {orders.length === 0 && (
                  <div className="text-center py-8">
                    <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No orders yet. Orders will appear here in real-time when users place them.</p>
                    <Button 
                      onClick={refreshAllData} 
                      variant="outline" 
                      className="mt-4"
                      size="sm"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Check for Orders
                    </Button>
                  </div>
                )}
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Active Groups</h3>
                <AdminGroupsList groupSessions={groupSessions.slice(0, 5)} />
                {groupSessions.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No active groups yet.</p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">All Orders</h2>
                  <div className="text-sm text-gray-500">
                    Total: {orders.length} orders
                  </div>
                </div>
              </div>
              <AdminOrdersList 
                orders={orders}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                onUpdatePaymentStatus={handleUpdatePaymentStatus}
              />
              {orders.length === 0 && (
                <div className="p-8 text-center">
                  <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No orders yet. Orders will appear here in real-time when users place them.</p>
                  <Button onClick={refreshAllData} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Check for New Orders
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="groups">
            <div className="bg-white rounded-lg shadow-sm">
              <AdminGroupsList groupSessions={groupSessions} />
              {groupSessions.length === 0 && (
                <div className="p-8 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No group sessions yet.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="group-management">
            <AdminGroupManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
