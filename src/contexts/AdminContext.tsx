
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuthOperations } from '@/hooks/useAuthOperations';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  const [adminUser, setAdminUser] = React.useState<AdminUser | null>(null);
  const [loading, setLoading] = React.useState(true);
  const { signIn, signOut } = useAuthOperations();

  React.useEffect(() => {
    checkAdminStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Admin auth state changed:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN' && session?.user) {
        await checkAdminStatus();
      } else if (event === 'SIGNED_OUT') {
        setAdminUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('❌ No authenticated user found');
        setAdminUser(null);
        setLoading(false);
        return;
      }

      console.log('🔍 Checking admin status for user:', user.email);
      
      const { data: adminCheck, error } = await supabase.rpc('is_admin_user');
      
      if (error) {
        console.error('❌ Error checking admin status:', error);
        setAdminUser(null);
      } else if (adminCheck) {
        console.log('✅ User is admin, setting admin user state');
        setAdminUser({
          id: user.id,
          email: user.email || '',
          role: 'admin',
          is_active: true,
          created_at: user.created_at || new Date().toISOString(),
          updated_at: user.updated_at || new Date().toISOString()
        });
      } else {
        console.log('❌ User is not admin:', user.email);
        setAdminUser(null);
      }
    } catch (error) {
      console.error('❌ Admin check failed:', error);
      setAdminUser(null);
    } finally {
      setLoading(false);
    }
  };

  const loginAsAdmin = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      console.log('🔄 Attempting admin login for:', email);
      
      const { data, error } = await signIn(email, password);
      
      if (error) {
        console.error('❌ Login error:', error);
        toast.error(error.message || 'Login failed');
        setLoading(false);
        return false;
      }

      if (data?.user) {
        console.log('✅ Login successful, checking admin status...');
        
        // Check admin status immediately after successful login
        const { data: adminCheck, error: adminError } = await supabase.rpc('is_admin_user');
        
        if (adminError) {
          console.error('❌ Error checking admin status:', adminError);
          toast.error('Failed to verify admin privileges');
          await signOut();
          setLoading(false);
          return false;
        }
        
        if (adminCheck) {
          console.log('✅ Admin privileges confirmed');
          setAdminUser({
            id: data.user.id,
            email: data.user.email || '',
            role: 'admin',
            is_active: true,
            created_at: data.user.created_at || new Date().toISOString(),
            updated_at: data.user.updated_at || new Date().toISOString()
          });
          toast.success('Welcome to Admin Dashboard!');
          setLoading(false);
          return true;
        } else {
          console.log('❌ User does not have admin privileges');
          toast.error('Access denied. Admin privileges required.');
          await signOut();
          setLoading(false);
          return false;
        }
      }

      setLoading(false);
      return false;
    } catch (error: any) {
      console.error('❌ Login failed:', error);
      toast.error(error.message || 'Login failed');
      setLoading(false);
      return false;
    }
  };

  const logoutAdmin = async (): Promise<void> => {
    try {
      setLoading(true);
      await signOut();
      setAdminUser(null);
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('❌ Logout failed:', error);
      toast.error(error.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  const value: AdminContextType = {
    adminUser,
    loading,
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
