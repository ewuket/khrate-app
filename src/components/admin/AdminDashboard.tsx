
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
import { RefreshCw, Settings, Users, ShoppingBag, BarChart3 } from "lucide-react";
import { toast } from "sonner";

const AdminDashboard = () => {
  const { 
    orders, 
    groupSessions, 
    stats, 
    loading, 
    subscribeToOrders,
    refreshAllData
  } = useAdminData();
  const { updateOrderStatus, updatePaymentStatus } = useAdminOperations();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [initializing, setInitializing] = useState(true);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshAllData();
      toast.success('Data refreshed successfully');
    } catch (error) {
      console.error('Refresh error:', error);
      toast.error('Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const initializeDashboard = async () => {
      console.log('Admin dashboard initializing...');
      setInitializing(true);
      
      try {
        // Load initial data
        await refreshAllData();
        console.log('Initial data loaded successfully');
        
        // Set up real-time subscription
        const unsubscribe = subscribeToOrders();
        
        // Cleanup function
        return () => {
          console.log('Cleaning up dashboard subscriptions');
          unsubscribe();
        };
      } catch (error) {
        console.error('Failed to initialize dashboard:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setInitializing(false);
      }
    };

    initializeDashboard();
  }, [refreshAllData, subscribeToOrders]);

  const handleUpdateOrderStatus = async (orderId: string, currentStatus: string) => {
    const statusOptions = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
    const currentIndex = statusOptions.indexOf(currentStatus);
    const nextStatus = statusOptions[(currentIndex + 1) % statusOptions.length];
    
    const success = await updateOrderStatus(orderId, nextStatus);
    if (success) {
      await refreshAllData();
      toast.success(`Order status updated to ${nextStatus}`);
    }
  };

  const handleUpdatePaymentStatus = async (orderId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    const success = await updatePaymentStatus(orderId, newStatus);
    if (success) {
      await refreshAllData();
      toast.success(`Payment status updated to ${newStatus}`);
    }
  };

  const isLoading = initializing || loading;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your Khrate platform</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleRefresh}
                disabled={refreshing || isLoading}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing || isLoading ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
          </div>
        </div>

        <AdminNotifications />

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-khrate-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        ) : (
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
              <TabsTrigger value="management" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Management
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <AdminStatsCards stats={stats} loading={false} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
                  {orders.length > 0 ? (
                    <AdminOrdersList 
                      orders={orders.slice(0, 5)} 
                      onUpdateOrderStatus={handleUpdateOrderStatus}
                      onUpdatePaymentStatus={handleUpdatePaymentStatus}
                    />
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No orders yet</p>
                    </div>
                  )}
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4">Active Groups</h3>
                  {groupSessions.length > 0 ? (
                    <AdminGroupsList groupSessions={groupSessions.slice(0, 5)} />
                  ) : (
                    <p className="text-gray-500 text-center py-8">No active groups</p>
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
                {orders.length > 0 ? (
                  <AdminOrdersList 
                    orders={orders}
                    onUpdateOrderStatus={handleUpdateOrderStatus}
                    onUpdatePaymentStatus={handleUpdatePaymentStatus}
                  />
                ) : (
                  <div className="p-8 text-center">
                    <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No orders yet</p>
                    <Button onClick={handleRefresh} variant="outline">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Check for Orders
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="groups">
              <div className="bg-white rounded-lg shadow-sm">
                {groupSessions.length > 0 ? (
                  <AdminGroupsList groupSessions={groupSessions} />
                ) : (
                  <div className="p-8 text-center">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No group sessions yet</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="management">
              <AdminGroupManagement />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
