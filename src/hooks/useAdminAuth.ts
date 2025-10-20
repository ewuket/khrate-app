
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

  const ensureAdminUserExists = async (userId: string, email: string) => {
    try {
      console.log('🔍 Ensuring admin user exists in database:', email);
      
      // Check if admin user already exists
      const { data: existingAdmin, error: checkError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (checkError && !checkError.message.includes('No rows')) {
        console.error('❌ Error checking admin user:', checkError);
        return false;
      }

      if (!existingAdmin) {
        console.log('📝 Creating admin user entry via RPC:', email);
        const { error: rpcError } = await supabase.rpc('add_admin_user', {
          admin_email: email
        });

        if (rpcError) {
          console.error('❌ Error creating admin user:', rpcError);
          return false;
        }
        console.log('✅ Admin user created successfully');
      }

      return true;
    } catch (error) {
      console.error('❌ Error in ensureAdminUserExists:', error);
      return false;
    }
  };

  const checkAdminStatus = async () => {
    try {
      setLoading(true);
      console.log('🔍 Checking admin status...');
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('❌ Error getting user:', userError);
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
        
        // Ensure this user exists in admin_users table
        await ensureAdminUserExists(user.id, user.email);
        
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

      // Check admin_users table for other users
      console.log('🔍 Checking admin_users table for:', user.email);
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', user.email)
        .eq('is_active', true)
        .maybeSingle();

      if (adminError) {
        console.error('❌ Error checking admin_users:', adminError);
        return;
      }

      if (adminData) {
        console.log('✅ Admin user found in database:', adminData);
        const adminSession: AdminUser = {
          id: adminData.id,
          email: adminData.email,
          role: adminData.role || 'admin',
          is_active: adminData.is_active || true,
          created_at: adminData.created_at || new Date().toISOString(),
          updated_at: adminData.updated_at || new Date().toISOString(),
          last_login: new Date().toISOString()
        };
        
        setAdminUser(adminSession);
        localStorage.setItem('admin_session', JSON.stringify(adminSession));
      } else {
        console.log('❌ User not found in admin_users table');
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
            await ensureAdminUserExists(signUpData.user.id, signUpData.user.email!);
            
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
          await ensureAdminUserExists(authData.user.id, authData.user.email!);
          
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
