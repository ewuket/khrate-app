
import React, { createContext, useContext, useEffect } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAdminData } from "@/hooks/useAdminData";
import { useAdminOperations } from "@/hooks/useAdminOperations";
import { AdminUser, AdminOrder, AdminGroupSession, AdminStats } from "@/types/admin";

interface AdminContextType {
  adminUser: AdminUser | null;
  orders: AdminOrder[];
  groupSessions: AdminGroupSession[];
  stats: AdminStats | null;
  loading: boolean;
  loginAsAdmin: (email: string, password: string) => Promise<boolean>;
  logoutAdmin: () => Promise<void>;
  loadOrders: () => Promise<void>;
  loadGroupSessions: () => Promise<void>;
  loadStats: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: string) => Promise<boolean>;
  updatePaymentStatus: (orderId: string, paymentStatus: string) => Promise<boolean>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAdminAuth();
  const data = useAdminData();
  const operations = useAdminOperations();

  const loadDashboardData = async () => {
    await Promise.all([
      data.loadOrders(),
      data.loadGroupSessions(),
      data.loadStats()
    ]);
  };

  useEffect(() => {
    if (auth.adminUser) {
      loadDashboardData();
    }
  }, [auth.adminUser]);

  const enhancedUpdateOrderStatus = async (orderId: string, status: string): Promise<boolean> => {
    const result = await operations.updateOrderStatus(orderId, status);
    if (result) {
      await data.loadOrders();
      await data.loadStats();
    }
    return result;
  };

  const enhancedUpdatePaymentStatus = async (orderId: string, paymentStatus: string): Promise<boolean> => {
    const result = await operations.updatePaymentStatus(orderId, paymentStatus);
    if (result) {
      await data.loadOrders();
      await data.loadStats();
    }
    return result;
  };

  return (
    <AdminContext.Provider
      value={{
        adminUser: auth.adminUser,
        orders: data.orders,
        groupSessions: data.groupSessions,
        stats: data.stats,
        loading: auth.loading,
        loginAsAdmin: auth.loginAsAdmin,
        logoutAdmin: auth.logoutAdmin,
        loadOrders: data.loadOrders,
        loadGroupSessions: data.loadGroupSessions,
        loadStats: data.loadStats,
        updateOrderStatus: enhancedUpdateOrderStatus,
        updatePaymentStatus: enhancedUpdatePaymentStatus
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
