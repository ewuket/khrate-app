
import { useState } from "react";
import { toast } from "sonner";
import { AdminUser } from "@/types/admin";

export const useAdminAuth = () => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const adminSession = localStorage.getItem('admin_session');
    return adminSession ? JSON.parse(adminSession) : null;
  });
  const [loading, setLoading] = useState(false);

  const loginAsAdmin = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      // For demo purposes, we'll use a simple check
      // In production, this should be properly secured
      if (email === 'admin@khrate.com' && password === 'admin123') {
        const adminSession: AdminUser = {
          id: 'admin-1',
          email,
          role: 'admin',
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString()
        };
        
        setAdminUser(adminSession);
        localStorage.setItem('admin_session', JSON.stringify(adminSession));
        
        toast.success('Admin login successful');
        return true;
      } else {
        toast.error('Invalid admin credentials');
        return false;
      }
    } catch (error) {
      console.error('Admin login error:', error);
      toast.error('Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logoutAdmin = async () => {
    setAdminUser(null);
    localStorage.removeItem('admin_session');
    toast.info('Admin logged out');
  };

  return {
    adminUser,
    loading,
    loginAsAdmin,
    logoutAdmin
  };
};
