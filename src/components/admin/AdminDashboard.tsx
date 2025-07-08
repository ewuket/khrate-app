
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminData } from "@/hooks/useAdminData";
import { useAdminOperations } from "@/hooks/useAdminOperations";
import { useAdminOrderSourceStats } from "@/hooks/useAdminOrderSourceStats";
import AdminStatsCards from "./AdminStatsCards";
import AdminOrdersList from "./AdminOrdersList";
import AdminOrderManagementStats from "./AdminOrderManagementStats";
import AdminBundlesSidebar from "./AdminBundlesSidebar";
import AdminBundleManagement from "./AdminBundleManagement";
import AdminCustomItemsManagement from "./custom-items/AdminCustomItemsManagement";
import AdminGroupManagement from "./AdminGroupManagement";
import { OrderStatus } from "@/types/order";
import { AdminBundle } from "@/types/admin";

const AdminDashboard = () => {
  const { stats, orders, bundles, loading, refreshAllData, fetchStats } = useAdminData();
  const { data: orderSourceStats, isLoading: loadingOrderStats } = useAdminOrderSourceStats();
  const { updateOrderStatus, updatePaymentStatus } = useAdminOperations();
  const [activeTab, setActiveTab] = useState("overview");
  const [showBundleForm, setShowBundleForm] = useState(false);
  const [editingBundle, setEditingBundle] = useState<AdminBundle | null>(null);

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
      const success = await updateOrderStatus(orderId, newStatus);
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
      const success = await updatePaymentStatus(orderId, newStatus);
      if (success) {
        setTimeout(() => {
          refreshAllData();
        }, 1000);
      }
    }
  };

  const handleCreateBundle = () => {
    setEditingBundle(null);
    setShowBundleForm(true);
  };

  const handleEditBundle = (bundle: AdminBundle) => {
    setEditingBundle(bundle);
    setShowBundleForm(true);
  };

  const handleDeleteBundle = async (bundleId: number) => {
    if (confirm('Are you sure you want to delete this bundle?')) {
      // Implementation would go here
      console.log('Delete bundle:', bundleId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your store operations and monitor performance</p>
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
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AdminOrdersList 
                  orders={orders} 
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                  onUpdatePaymentStatus={handleUpdatePaymentStatus}
                />
              </div>
              <div className="lg:col-span-1">
                <AdminBundlesSidebar
                  bundles={bundles}
                  loading={loading}
                  onCreateBundle={handleCreateBundle}
                  onEditBundle={handleEditBundle}
                  onDeleteBundle={handleDeleteBundle}
                />
              </div>
            </div>
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

          <TabsContent value="orders" className="space-y-6">
            <AdminOrderManagementStats 
              orderStats={orderSourceStats || {
                bundle_orders: 0,
                custom_orders: 0,
                group_orders: 0,
                bundle_revenue: 0,
                custom_revenue: 0,
                group_revenue: 0
              }}
              loading={loadingOrderStats}
            />
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
