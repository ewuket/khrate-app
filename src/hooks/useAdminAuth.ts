
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AdminUser } from "@/types/admin";

export const useAdminAuth = () => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const adminSession = localStorage.getItem('admin_session');
      return adminSession ? JSON.parse(adminSession) : null;
    } catch (error) {
      console.error('Error parsing admin session from localStorage:', error);
      localStorage.removeItem('admin_session');
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('🔐 Initializing admin auth system...');
    checkAdminStatus();
  }, []);

  const ensureAdminRoleExists = async (userId: string, email: string) => {
    try {
      console.log('🔍 Ensuring admin role exists for user:', email);
      
      // Check if user already has admin role
      const { data: existingRole, error: checkError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      if (checkError && !checkError.message.includes('No rows')) {
        console.error('❌ Error checking user role:', checkError);
        return false;
      }

      if (!existingRole) {
        console.log('📝 Adding admin role via RPC:', email);
        const { error: rpcError } = await supabase.rpc('add_admin_role', {
          target_user_id: userId
        });

        if (rpcError) {
          console.error('❌ Error adding admin role:', rpcError);
          return false;
        }
        console.log('✅ Admin role added successfully');
      }

      return true;
    } catch (error) {
      console.error('❌ Error in ensureAdminRoleExists:', error);
      return false;
    }
  };

  const checkAdminStatus = async () => {
    try {
      setLoading(true);
      console.log('🔍 Checking admin status...');
      
      // First check if there's an active session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.log('📝 No active session found, clearing admin state');
        setAdminUser(null);
        localStorage.removeItem('admin_session');
        return;
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('❌ Error getting user:', userError);
        setAdminUser(null);
        localStorage.removeItem('admin_session');
        return;
      }

      if (!user?.email) {
        console.log('📝 No authenticated user found');
        setAdminUser(null);
        localStorage.removeItem('admin_session');
        return;
      }

      console.log('👤 Found authenticated user:', user.email);

      // Demo emails that should have admin access
      const demoEmails = ['admin@khrate.com', 'bamulneg@gmail.com'];
      
      if (demoEmails.includes(user.email)) {
        console.log('✅ Demo admin access granted for:', user.email);
        
        // Ensure this user has admin role
        await ensureAdminRoleExists(user.id, user.email);
        
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
        localStorage.setItem('admin_session', JSON.stringify(adminSession));
        return;
      }

      // Check user_roles table for other users
      console.log('🔍 Checking user_roles table for:', user.email);
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (roleError && !roleError.message.includes('No rows')) {
        console.error('❌ Error checking user_roles:', roleError);
        return;
      }

      if (roleData) {
        console.log('✅ Admin role found for user:', roleData);
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
        localStorage.setItem('admin_session', JSON.stringify(adminSession));
      } else {
        console.log('❌ User does not have admin role');
        setAdminUser(null);
        localStorage.removeItem('admin_session');
      }
    } catch (error) {
      console.error('❌ Error in checkAdminStatus:', error);
    } finally {
      setLoading(false);
    }
  };

  const loginAsAdmin = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      console.log('🔑 Attempting admin login for:', email);

      // Demo credentials handling
      if (email === 'admin@khrate.com' && password === 'admin123') {
        console.log('🎯 Using demo credentials');
        
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError && authError.message.includes('Invalid login credentials')) {
          console.log('📝 Creating demo admin user...');
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/admin/dashboard`
            }
          });

          if (signUpError) {
            console.error('❌ Signup error:', signUpError);
            toast.error('Failed to create admin account');
            return false;
          }

          if (signUpData.user) {
            await ensureAdminRoleExists(signUpData.user.id, signUpData.user.email!);
            
            const adminSession: AdminUser = {
              id: signUpData.user.id,
              email: signUpData.user.email!,
              role: 'admin',
              is_active: true,
              created_at: signUpData.user.created_at || new Date().toISOString(),
              updated_at: new Date().toISOString(),
              last_login: new Date().toISOString()
            };
            
            setAdminUser(adminSession);
            localStorage.setItem('admin_session', JSON.stringify(adminSession));
            toast.success('Admin account created and logged in');
            return true;
          }
        } else if (authData.user) {
          await ensureAdminRoleExists(authData.user.id, authData.user.email!);
          
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
          localStorage.setItem('admin_session', JSON.stringify(adminSession));
          toast.success('Admin login successful');
          return true;
        }
      }

      // Normal auth flow for other users
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error('❌ Auth error:', authError);
        toast.error(authError.message);
        return false;
      }

      // Check admin status after successful auth
      setTimeout(() => {
        checkAdminStatus();
      }, 500);

      return true;
    } catch (error: any) {
      console.error('❌ Login error:', error);
      toast.error('Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logoutAdmin = async () => {
    try {
      console.log('🚪 Admin logout initiated');
      setAdminUser(null);
      localStorage.removeItem('admin_session');
      await supabase.auth.signOut();
      toast.info('Admin logged out');
    } catch (error) {
      console.error('❌ Logout error:', error);
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
