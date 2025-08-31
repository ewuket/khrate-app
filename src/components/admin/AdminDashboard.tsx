
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminData } from "@/hooks/useAdminData";
import { useAdminOperations } from "@/hooks/useAdminOperations";
import AdminStatsCards from "./AdminStatsCards";
import AdminOrdersList from "./AdminOrdersList";
import AdminBundleManagement from "./AdminBundleManagement";
import AdminCustomItemsManagement from "./custom-items/AdminCustomItemsManagement";
import AdminGroupManagement from "./AdminGroupManagement";
import { OrderStatus } from "@/types/order";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const { stats, orders, loading, error, refreshAllData, fetchStats } = useAdminData();
  const operations = useAdminOperations();
  const [activeTab, setActiveTab] = useState("overview");

  console.log('🎯 AdminDashboard render state:', { 
    loading, 
    error, 
    ordersCount: orders.length,
    hasOperations: !!operations
  });

  // Listen for stats refresh events
  useEffect(() => {
    const handleRefreshStats = () => {
      console.log('🔄 Refreshing admin stats due to order update...');
      fetchStats();
    };

    window.addEventListener('refresh-admin-stats', handleRefreshStats);
    return () => {
      window.removeEventListener('refresh-admin-stats', handleRefreshStats);
    };
  }, [fetchStats]);

  const handleUpdateOrderStatus = async (orderId: string, currentStatus: string) => {
    const statusOptions: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
    const newStatus = prompt(`Current status: ${currentStatus}\nEnter new status (${statusOptions.join(', ')}):`, currentStatus);
    
    if (newStatus && statusOptions.includes(newStatus as OrderStatus) && newStatus !== currentStatus) {
      const success = await operations?.updateOrderStatus?.(orderId, newStatus);
      if (success) {
        setTimeout(() => {
          refreshAllData();
        }, 1000);
      }
    }
  };

  const handleUpdatePaymentStatus = async (orderId: string, currentStatus: string) => {
    const paymentOptions = ['pending', 'completed', 'failed'];
    const newStatus = prompt(`Current payment status: ${currentStatus}\nEnter new status (${paymentOptions.join(', ')}):`, currentStatus);
    
    if (newStatus && paymentOptions.includes(newStatus) && newStatus !== currentStatus) {
      const success = await operations?.updatePaymentStatus?.(orderId, newStatus);
      if (success) {
        setTimeout(() => {
          refreshAllData();
        }, 1000);
      }
    }
  };

  // Error state
  if (error && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="h-6 w-6 text-red-500" />
                <h2 className="text-lg font-semibold text-red-800">Admin Dashboard Error</h2>
              </div>
              <p className="text-red-700 mb-4">{error}</p>
              <Button 
                onClick={refreshAllData}
                className="bg-red-600 hover:bg-red-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Loading Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your store operations and monitor performance</p>
          {loading && (
            <div className="flex items-center gap-2 mt-2 text-sm text-blue-600">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Loading dashboard data...
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bundles">Bundles</TabsTrigger>
            <TabsTrigger value="custom-items">Custom Items</TabsTrigger>
            <TabsTrigger value="groups">Group Buying</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <AdminStatsCards stats={stats} loading={loading} />
            <AdminOrdersList 
              orders={orders} 
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onUpdatePaymentStatus={handleUpdatePaymentStatus}
            />
          </TabsContent>

          <TabsContent value="bundles">
            <AdminBundleManagement />
          </TabsContent>

          <TabsContent value="custom-items">
            <AdminCustomItemsManagement />
          </TabsContent>

          <TabsContent value="groups">
            <AdminGroupManagement />
          </TabsContent>

          <TabsContent value="orders">
            <AdminOrdersList 
              orders={orders} 
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onUpdatePaymentStatus={handleUpdatePaymentStatus}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
