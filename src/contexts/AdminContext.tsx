
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AdminContextType {
  isAdminAuthenticated: boolean;
  adminUser: any | null;
  adminLogin: (credentials: any) => Promise<boolean>;
  adminLogout: () => void;
  loginAsAdmin: (email: string, password: string) => Promise<boolean>;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const adminLogin = async (credentials: any): Promise<boolean> => {
    setLoading(true);
    try {
      // Implement admin login logic here
      // For now, just return true for demo purposes
      setIsAdminAuthenticated(true);
      setAdminUser({ email: credentials.email });
      return true;
    } finally {
      setLoading(false);
    }
  };

  const loginAsAdmin = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      // For demo purposes, simple validation
      if (email === 'admin@khrate.com' && password === 'admin123') {
        setIsAdminAuthenticated(true);
        setAdminUser({ email, role: 'admin' });
        return true;
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    setAdminUser(null);
  };

  const value: AdminContextType = {
    isAdminAuthenticated,
    adminUser,
    adminLogin,
    adminLogout,
    loginAsAdmin,
    loading
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
