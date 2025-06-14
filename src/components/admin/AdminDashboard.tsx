
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

const AdminDashboard = () => {
  const { orders, groupSessions, stats, loading, loadOrders, loadGroupSessions, loadStats } = useAdminData();
  const { updateOrderStatus, updatePaymentStatus } = useAdminOperations();

  useEffect(() => {
    loadOrders();
    loadGroupSessions();
    loadStats();
  }, []);

  const handleUpdateOrderStatus = async (orderId: string, currentStatus: string) => {
    const statusOptions = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
    const currentIndex = statusOptions.indexOf(currentStatus);
    const nextStatus = statusOptions[(currentIndex + 1) % statusOptions.length];
    
    const success = await updateOrderStatus(orderId, nextStatus);
    if (success) {
      loadOrders();
    }
  };

  const handleUpdatePaymentStatus = async (orderId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    const success = await updatePaymentStatus(orderId, newStatus);
    if (success) {
      loadOrders();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your e-commerce platform</p>
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
