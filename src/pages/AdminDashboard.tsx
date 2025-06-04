
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminStatsCards from "@/components/admin/AdminStatsCards";
import AdminOrdersList from "@/components/admin/AdminOrdersList";
import AdminGroupsList from "@/components/admin/AdminGroupsList";

const AdminDashboard = () => {
  const { 
    adminUser, 
    orders, 
    groupSessions, 
    stats, 
    logoutAdmin,
    loadOrders,
    loadGroupSessions,
    updateOrderStatus,
    updatePaymentStatus
  } = useAdmin();

  // Redirect if not logged in
  if (!adminUser) {
    return <Navigate to="/admin/login" replace />;
  }

  useEffect(() => {
    // Load data on mount
    loadOrders();
    loadGroupSessions();
  }, []);

  const handleUpdateOrderStatus = (orderId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'pending' ? 'confirmed' : 'delivered';
    updateOrderStatus(orderId, newStatus);
  };

  const handleUpdatePaymentStatus = (orderId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    updatePaymentStatus(orderId, newStatus);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader 
        userEmail={adminUser.email} 
        onLogout={logoutAdmin} 
      />

      <div className="container mx-auto px-4 py-8">
        <AdminStatsCards stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AdminOrdersList
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onUpdatePaymentStatus={handleUpdatePaymentStatus}
          />

          <AdminGroupsList groupSessions={groupSessions} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
