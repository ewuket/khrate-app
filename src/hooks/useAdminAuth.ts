
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AdminUser } from "@/types/admin";

export const useAdminAuth = () => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const adminSession = localStorage.getItem('admin_session');
    return adminSession ? JSON.parse(adminSession) : null;
  });
  const [loading, setLoading] = useState(false);

  // Check if current user is admin on mount
  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        const { data: adminData } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', user.email)
          .eq('is_active', true)
          .single();

        if (adminData) {
          const adminSession: AdminUser = {
            id: adminData.id,
            email: adminData.email,
            role: adminData.role || 'admin',
            created_at: adminData.created_at || new Date().toISOString(),
            last_login: new Date().toISOString()
          };
          
          setAdminUser(adminSession);
          localStorage.setItem('admin_session', JSON.stringify(adminSession));
        }
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

  const loginAsAdmin = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      // First authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        toast.error(authError.message);
        return false;
      }

      // Check if user is an admin
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .single();

      if (adminError || !adminData) {
        toast.error('Access denied. You are not an admin user.');
        await supabase.auth.signOut();
        return false;
      }

      const adminSession: AdminUser = {
        id: adminData.id,
        email: adminData.email,
        role: adminData.role || 'admin',
        created_at: adminData.created_at || new Date().toISOString(),
        last_login: new Date().toISOString()
      };
      
      setAdminUser(adminSession);
      localStorage.setItem('admin_session', JSON.stringify(adminSession));
      
      toast.success('Admin login successful');
      return true;
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
    await supabase.auth.signOut();
    toast.info('Admin logged out');
  };

  return {
    adminUser,
    loading,
    loginAsAdmin,
    logoutAdmin
  };
};
