
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AdminHeader from "./AdminHeader";
import AdminStatsCards from "./AdminStatsCards";
import AdminOrdersList from "./AdminOrdersList";
import AdminBundlesList from "./AdminBundlesList";
import AdminBundleManagement from "./AdminBundleManagement";
import AdminCustomItemsManagement from "./custom-items/AdminCustomItemsManagement";
import AdminNotifications from "./AdminNotifications";
import { useAdminData } from "@/hooks/useAdminData";
import { useAdminOperations } from "@/hooks/useAdminOperations";
import AdminGroupsList from "./AdminGroupsList";
import AdminGroupBuyingManagement from "./AdminGroupBuyingManagement";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { stats, orders, bundles, loading, refreshAllData } = useAdminData();
  const { 
    updateOrderStatus, 
    updatePaymentStatus, 
    toggleBundleFeatured, 
    toggleBundleActive, 
    toggleGroupFeatured,
    toggleCustomItemActive 
  } = useAdminOperations();

  const handleUpdateOrderStatus = async (orderId: string, currentStatus: string) => {
    // Cycle through status options
    const statusOptions = ['pending', 'confirmed', 'delivered', 'cancelled'];
    const currentIndex = statusOptions.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % statusOptions.length;
    const newStatus = statusOptions[nextIndex];
    
    console.log('🔄 Cycling order status from', currentStatus, 'to', newStatus);
    const success = await updateOrderStatus(orderId, newStatus);
    if (success) {
      // Refresh data to show updated status
      await refreshAllData();
    }
  };

  const handleUpdatePaymentStatus = async (orderId: string, currentPaymentStatus: string) => {
    // Cycle through payment status options
    const paymentStatusOptions = ['pending', 'completed', 'failed'];
    const currentIndex = paymentStatusOptions.indexOf(currentPaymentStatus);
    const nextIndex = (currentIndex + 1) % paymentStatusOptions.length;
    const newPaymentStatus = paymentStatusOptions[nextIndex];
    
    console.log('🔄 Cycling payment status from', currentPaymentStatus, 'to', newPaymentStatus);
    const success = await updatePaymentStatus(orderId, newPaymentStatus);
    if (success) {
      // Refresh data to show updated payment status
      await refreshAllData();
    }
  };

  const handleToggleBundleFeatured = async (bundleId: number, isFeatured: boolean) => {
    const success = await toggleBundleFeatured(bundleId, isFeatured);
    if (success) {
      await refreshAllData();
    }
  };

  const handleToggleBundleActive = async (bundleId: number, isActive: boolean) => {
    const success = await toggleBundleActive(bundleId, isActive);
    if (success) {
      await refreshAllData();
    }
  };

  const handleToggleGroupFeatured = async (groupId: string, isFeatured: boolean) => {
    const success = await toggleGroupFeatured(groupId, isFeatured);
    if (success) {
      await refreshAllData();
    }
  };

  const handleToggleCustomItemActive = async (itemId: number, isActive: boolean) => {
    const success = await toggleCustomItemActive(itemId, isActive);
    if (success) {
      await refreshAllData();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="bundles">Bundles</TabsTrigger>
            <TabsTrigger value="custom-items">Custom Items</TabsTrigger>
            <TabsTrigger value="groups">Group Buying</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <AdminStatsCards stats={stats} loading={loading} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AdminOrdersList 
                orders={orders} 
                onUpdateOrderStatus={handleUpdateOrderStatus}
                onUpdatePaymentStatus={handleUpdatePaymentStatus}
              />
              <AdminBundlesList />
            </div>
          </TabsContent>

          <TabsContent value="orders">
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
            <AdminGroupBuyingManagement />
          </TabsContent>

          <TabsContent value="notifications">
            <AdminNotifications />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
