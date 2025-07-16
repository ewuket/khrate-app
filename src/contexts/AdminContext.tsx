
import React, { createContext, useContext, ReactNode } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface AdminUser {
  id: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface AdminContextType {
  adminUser: AdminUser | null;
  loading: boolean;
  loginAsAdmin: (email: string, password: string) => Promise<boolean>;
  logoutAdmin: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const { isAdmin, isLoading, currentUser } = useAdminAuth();

  // Convert currentUser to adminUser format when user is admin
  const adminUser = isAdmin && currentUser ? {
    id: currentUser.id,
    email: currentUser.email,
    role: 'admin',
    is_active: true,
    created_at: currentUser.created_at || new Date().toISOString(),
    updated_at: currentUser.updated_at || new Date().toISOString()
  } : null;

  // Placeholder functions for login/logout - these would need proper implementation
  const loginAsAdmin = async (email: string, password: string): Promise<boolean> => {
    // This would need to be implemented based on your auth system
    return false;
  };

  const logoutAdmin = async (): Promise<void> => {
    // This would need to be implemented based on your auth system
  };

  const value: AdminContextType = {
    adminUser,
    loading: isLoading,
    loginAsAdmin,
    logoutAdmin,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
