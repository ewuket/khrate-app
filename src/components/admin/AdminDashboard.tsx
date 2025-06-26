
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
import AdminGroupsList from "./AdminGroupsList";
import AdminGroupBuyingManagement from "./AdminGroupBuyingManagement";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { stats, orders, bundles, loading, refreshAllData } = useAdminData();

  // Placeholder functions for order management
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    console.log('Update order status:', orderId, status);
    // TODO: Implement order status update
  };

  const handleUpdatePaymentStatus = async (orderId: string, paymentStatus: string) => {
    console.log('Update payment status:', orderId, paymentStatus);
    // TODO: Implement payment status update
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
            <AdminGroupsList groupSessions={[]} />
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
