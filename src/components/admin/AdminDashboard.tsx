
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
import { RefreshCw } from "lucide-react";

const AdminDashboard = () => {
  const { orders, groupSessions, stats, loading, loadOrders, loadGroupSessions, loadStats } = useAdminData();
  const { updateOrderStatus, updatePaymentStatus } = useAdminOperations();
  const [refreshing, setRefreshing] = useState(false);

  const refreshAllData = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        loadOrders(),
        loadGroupSessions(),
        loadStats()
      ]);
      console.log('All admin data refreshed');
    } catch (error) {
      console.error('Error refreshing admin data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    console.log('Admin dashboard initializing...');
    refreshAllData();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      console.log('Auto-refreshing admin data...');
      refreshAllData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleUpdateOrderStatus = async (orderId: string, currentStatus: string) => {
    const statusOptions = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
    const currentIndex = statusOptions.indexOf(currentStatus);
    const nextStatus = statusOptions[(currentIndex + 1) % statusOptions.length];
    
    const success = await updateOrderStatus(orderId, nextStatus);
    if (success) {
      loadOrders();
      loadStats(); // Update stats when order status changes
    }
  };

  const handleUpdatePaymentStatus = async (orderId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    const success = await updatePaymentStatus(orderId, newStatus);
    if (success) {
      loadOrders();
      loadStats(); // Update stats when payment status changes
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your e-commerce platform</p>
            </div>
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

        <AdminNotifications />

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="groups">Group Sessions</TabsTrigger>
            <TabsTrigger value="group-management">Group Management</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <AdminStatsCards stats={stats} loading={loading} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AdminOrdersList 
                orders={orders.slice(0, 5)} 
                onUpdateOrderStatus={handleUpdateOrderStatus}
                onUpdatePaymentStatus={handleUpdatePaymentStatus}
              />
              <AdminGroupsList groupSessions={groupSessions.slice(0, 5)} />
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <AdminOrdersList 
              orders={orders}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onUpdatePaymentStatus={handleUpdatePaymentStatus}
            />
          </TabsContent>

          <TabsContent value="groups">
            <AdminGroupsList groupSessions={groupSessions} />
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
