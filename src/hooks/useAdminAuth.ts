
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);
        
        if (!user) {
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        console.log('🔍 Checking admin status for user:', user.email);
        
        // Check if user is admin
        const { data: adminCheck, error } = await supabase.rpc('is_admin_user');
        
        if (error) {
          console.error('❌ Error checking admin status:', error);
          setIsAdmin(false);
        } else {
          console.log('✅ Admin check result:', adminCheck);
          setIsAdmin(!!adminCheck);
        }
      } catch (error) {
        console.error('❌ Admin auth check failed:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAdminStatus();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { isAdmin, isLoading, currentUser };
};
