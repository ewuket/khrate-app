import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AdminUser } from "@/types/admin";

export const useAdminAuth = () => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const ensureAdminRoleExists = async (userId: string) => {
    try {
      const { data: existingRole, error: checkError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      if (checkError && !checkError.message.includes('No rows')) {
        return false;
      }

      if (!existingRole) {
        const { error: rpcError } = await supabase.rpc('add_admin_role', {
          target_user_id: userId
        });

        if (rpcError) {
          return false;
        }
      }

      return true;
    } catch (error) {
      return false;
    }
  };

  const checkAdminStatus = async () => {
    try {
      setLoading(true);
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        setAdminUser(null);
        return;
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user?.email) {
        setAdminUser(null);
        return;
      }

      const { data: isAdmin, error: adminCheckError } = await supabase.rpc('is_admin_user');
      
      if (adminCheckError || !isAdmin) {
        setAdminUser(null);
        return;
      }

      await ensureAdminRoleExists(user.id);
      
      const adminSession: AdminUser = {
        id: user.id,
        email: user.email,
        role: 'admin',
        is_active: true,
        created_at: user.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      };
      
      setAdminUser(adminSession);
    } catch (error) {
      setAdminUser(null);
    } finally {
      setLoading(false);
    }
  };

  const loginAsAdmin = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        toast.error('Invalid email or password');
        return false;
      }

      if (!authData.user) {
        toast.error('Authentication failed');
        return false;
      }

      const { data: isAdmin } = await supabase.rpc('is_admin_user');
      
      if (!isAdmin) {
        await supabase.auth.signOut();
        toast.error('Access denied. Admin privileges required.');
        return false;
      }

      await ensureAdminRoleExists(authData.user.id);
      
      const adminSession: AdminUser = {
        id: authData.user.id,
        email: authData.user.email!,
        role: 'admin',
        is_active: true,
        created_at: authData.user.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      };
      
      setAdminUser(adminSession);
      toast.success('Admin login successful');
      return true;
    } catch (error) {
      toast.error('Login failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logoutAdmin = async () => {
    try {
      await supabase.auth.signOut();
      setAdminUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return {
    adminUser,
    loading,
    loginAsAdmin,
    logoutAdmin,
    checkAdminStatus
  };
};
