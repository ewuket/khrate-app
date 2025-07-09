
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminData } from "@/hooks/useAdminData";
import { useAdminOrderSourceStats } from "@/hooks/useAdminOrderSourceStats";
import { useAdminDailyStats } from "@/hooks/useAdminDailyStats";
import { useStockManagement } from "@/hooks/useStockManagement";
import AdminStatsCards from "./AdminStatsCards";
import AdminOrdersList from "./AdminOrdersList";
import AdminOrderManagementStats from "./AdminOrderManagementStats";
import AdminBundlesSidebar from "./AdminBundlesSidebar";
import AdminBundleManagement from "./AdminBundleManagement";
import AdminCustomItemsManagement from "./custom-items/AdminCustomItemsManagement";
import AdminGroupManagement from "./AdminGroupManagement";
import { OrderStatus } from "@/types/order";
import { AdminBundle } from "@/types/admin";
import { toast } from "sonner";

const AdminDashboard = () => {
  const { stats, orders, bundles, loading, refreshAllData, fetchStats } = useAdminData();
  const { data: orderSourceStats, isLoading: loadingOrderStats } = useAdminOrderSourceStats();
  const { data: dailyStats } = useAdminDailyStats();
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

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string): Promise<boolean> => {
    try {
      console.log('🔄 Updating order status:', orderId, 'to', newStatus);
      
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) {
        console.error('❌ Error updating order status:', error);
        toast.error('Failed to update order status');
        return false;
      }

      console.log('✅ Order status updated successfully');
      toast.success(`Order status updated to ${newStatus}`);
      
      // Refresh data
      setTimeout(() => {
        refreshAllData();
      }, 1000);
      
      return true;
    } catch (error: any) {
      console.error('❌ Failed to update order status:', error);
      toast.error('Failed to update order status');
      return false;
    }
  };

  const handleUpdatePaymentStatus = async (orderId: string, newPaymentStatus: string): Promise<boolean> => {
    try {
      console.log('🔄 Updating payment status:', orderId, 'to', newPaymentStatus);
      
      const { error } = await supabase
        .from('orders')
        .update({ 
          payment_status: newPaymentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) {
        console.error('❌ Error updating payment status:', error);
        toast.error('Failed to update payment status');
        return false;
      }

      console.log('✅ Payment status updated successfully');
      toast.success(`Payment status updated to ${newPaymentStatus}`);
      
      // Refresh data
      setTimeout(() => {
        refreshAllData();
      }, 1000);
      
      return true;
    } catch (error: any) {
      console.error('❌ Failed to update payment status:', error);
      toast.error('Failed to update payment status');
      return false;
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
      console.log('Delete bundle:', bundleId);
    }
  };

  const handleStatsClick = (type: 'bundle' | 'custom' | 'group' | 'daily') => {
    console.log('Stats clicked:', type);
    if (type === 'daily') {
      console.log('Daily stats:', dailyStats);
    }
    // Could open a detailed view modal here
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
              onStatsClick={handleStatsClick}
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
