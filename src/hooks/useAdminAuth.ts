
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
        // Check if user is admin - for demo purposes, allow admin@khrate.com
        if (user.email === 'admin@khrate.com') {
          const adminSession: AdminUser = {
            id: user.id,
            email: user.email,
            role: 'admin',
            created_at: user.created_at || new Date().toISOString(),
            last_login: new Date().toISOString()
          };
          
          setAdminUser(adminSession);
          localStorage.setItem('admin_session', JSON.stringify(adminSession));
        } else {
          // Try to check in admin_users table
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
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

  const loginAsAdmin = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      // For demo purposes, allow hardcoded admin credentials
      if (email === 'admin@khrate.com' && password === 'admin123') {
        // First try to sign in with Supabase auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        // If auth fails, create the user first
        if (authError && authError.message.includes('Invalid login credentials')) {
          console.log('Creating admin user...');
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/admin/dashboard`
            }
          });

          if (signUpError) {
            console.error('Signup error:', signUpError);
            toast.error('Failed to create admin account');
            return false;
          }

          if (signUpData.user) {
            const adminSession: AdminUser = {
              id: signUpData.user.id,
              email: signUpData.user.email!,
              role: 'admin',
              created_at: signUpData.user.created_at || new Date().toISOString(),
              last_login: new Date().toISOString()
            };
            
            setAdminUser(adminSession);
            localStorage.setItem('admin_session', JSON.stringify(adminSession));
            toast.success('Admin account created and logged in');
            return true;
          }
        } else if (authData.user) {
          const adminSession: AdminUser = {
            id: authData.user.id,
            email: authData.user.email!,
            role: 'admin',
            created_at: authData.user.created_at || new Date().toISOString(),
            last_login: new Date().toISOString()
          };
          
          setAdminUser(adminSession);
          localStorage.setItem('admin_session', JSON.stringify(adminSession));
          toast.success('Admin login successful');
          return true;
        }
      } else {
        // Try normal auth flow for other credentials
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
          .maybeSingle();

        if (adminError) {
          console.error('Admin check error:', adminError);
        }

        if (!adminData && email !== 'admin@khrate.com') {
          toast.error('Access denied. You are not an admin user.');
          await supabase.auth.signOut();
          return false;
        }

        const adminSession: AdminUser = {
          id: adminData?.id || authData.user!.id,
          email: email,
          role: adminData?.role || 'admin',
          created_at: adminData?.created_at || authData.user!.created_at || new Date().toISOString(),
          last_login: new Date().toISOString()
        };
        
        setAdminUser(adminSession);
        localStorage.setItem('admin_session', JSON.stringify(adminSession));
        toast.success('Admin login successful');
        return true;
      }
      
      toast.error('Invalid credentials');
      return false;
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
