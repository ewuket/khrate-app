
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";
import { useAdminData } from "@/hooks/useAdminData";
import { useAdminOrderSourceStats } from "@/hooks/useAdminOrderSourceStats";
import { useAdminDailyStats } from "@/hooks/useAdminDailyStats";
import { useAdminOrderOperations } from "@/hooks/admin/useAdminOrderOperations";
import { useAdminBundleOperations } from "@/hooks/admin/useAdminBundleOperations";
import AdminStatsCards from "./AdminStatsCards";
import AdminOrdersList from "./AdminOrdersList";
import AdminOrderManagementStats from "./AdminOrderManagementStats";
import AdminBundlesSidebar from "./AdminBundlesSidebar";
import AdminBundleManagement from "./AdminBundleManagement";
import AdminCustomItemsManagement from "./custom-items/AdminCustomItemsManagement";
import AdminGroupBuyingManagement from "./AdminGroupBuyingManagement";
import AdminHeader from "./AdminHeader";
import { AdminBundle } from "@/types/admin";
import { toast } from "sonner";

const AdminDashboard = () => {
  const { 
    stats, 
    orders, 
    bundles, 
    loading, 
    error: dataError,
    refreshAllData, 
    fetchStats 
  } = useAdminData();
  
  const { 
    data: orderSourceStats, 
    isLoading: loadingOrderStats, 
    refetch: refetchOrderStats,
    error: orderStatsError 
  } = useAdminOrderSourceStats();
  
  const { 
    data: dailyStats, 
    refetch: refetchDailyStats,
    error: dailyStatsError 
  } = useAdminDailyStats();
  
  const { updateOrderStatus, updatePaymentStatus } = useAdminOrderOperations();
  const { deleteBundle } = useAdminBundleOperations();
  const [activeTab, setActiveTab] = useState("overview");
  const [showBundleForm, setShowBundleForm] = useState(false);
  const [editingBundle, setEditingBundle] = useState<AdminBundle | null>(null);

  // Show error state if there are critical errors
  const hasErrors = dataError || orderStatsError || dailyStatsError;

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing admin dashboard data...');
      if (!loading) {
        fetchStats();
        refetchOrderStats();
        refetchDailyStats();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchStats, refetchOrderStats, refetchDailyStats, loading]);

  // Listen for stats refresh events
  useEffect(() => {
    const handleRefreshStats = () => {
      console.log('🔄 Refreshing admin stats due to data change...');
      fetchStats();
      refetchOrderStats();
      refetchDailyStats();
      refreshAllData();
    };

    window.addEventListener('refresh-admin-stats', handleRefreshStats);
    return () => {
      window.removeEventListener('refresh-admin-stats', handleRefreshStats);
    };
  }, [fetchStats, refetchOrderStats, refetchDailyStats, refreshAllData]);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string): Promise<boolean> => {
    console.log('🔄 Admin dashboard updating order status:', orderId, 'to', newStatus);
    
    const success = await updateOrderStatus(orderId, newStatus);
    
    if (success) {
      setTimeout(() => {
        refreshAllData();
        refetchOrderStats();
        refetchDailyStats();
      }, 100);
    }
    
    return success;
  };

  const handleUpdatePaymentStatus = async (orderId: string, newPaymentStatus: string): Promise<boolean> => {
    console.log('🔄 Admin dashboard updating payment status:', orderId, 'to', newPaymentStatus);
    
    const success = await updatePaymentStatus(orderId, newPaymentStatus);
    
    if (success) {
      setTimeout(() => {
        refreshAllData();
        refetchOrderStats();
        refetchDailyStats();
      }, 100);
    }
    
    return success;
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
    if (confirm('Are you sure you want to delete this bundle? This action cannot be undone.')) {
      console.log('🔄 Deleting bundle:', bundleId);
      const success = await deleteBundle(bundleId);
      
      if (success) {
        setTimeout(() => {
          refreshAllData();
        }, 100);
      }
    }
  };

  const handleStatsClick = (type: 'bundle' | 'custom' | 'group' | 'daily') => {
    console.log('📊 Stats clicked:', type);
    
    switch (type) {
      case 'bundle':
        setActiveTab('bundles');
        break;
      case 'custom':
        setActiveTab('custom-items');
        break;
      case 'group':
        setActiveTab('groups');
        break;
      case 'daily':
        console.log('📅 Daily stats:', dailyStats);
        break;
    }
  };

  const handleRefreshAll = () => {
    console.log('🔄 Manual refresh requested');
    refreshAllData();
    refetchOrderStats();
    refetchDailyStats();
    toast.success('Dashboard refreshed successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
              <p className="text-gray-600">Monitor and manage your store operations</p>
            </div>
            <Button 
              onClick={handleRefreshAll}
              variant="outline"
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Show error alert if there are issues */}
        {hasErrors && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <div className="font-medium mb-2">Dashboard Loading Issues:</div>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {dataError && <li>Data loading: {dataError}</li>}
                {orderStatsError && <li>Order statistics: {orderStatsError.message}</li>}
                {dailyStatsError && <li>Daily statistics: {dailyStatsError.message}</li>}
              </ul>
              <Button 
                onClick={handleRefreshAll}
                variant="outline"
                size="sm"
                className="mt-3"
              >
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bundles">
              Bundles ({bundles.length})
            </TabsTrigger>
            <TabsTrigger value="custom-items">Custom Items</TabsTrigger>
            <TabsTrigger value="groups">Group Buying</TabsTrigger>
            <TabsTrigger value="orders">
              Orders ({orders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <AdminStatsCards stats={stats} loading={loading} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AdminOrdersList 
                  orders={orders.slice(0, 10)} 
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                  onUpdatePaymentStatus={handleUpdatePaymentStatus}
                />
              </div>
              <div className="lg:col-span-1">
                <AdminBundlesSidebar
                  bundles={bundles.slice(0, 5)}
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
            <AdminGroupBuyingManagement />
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
