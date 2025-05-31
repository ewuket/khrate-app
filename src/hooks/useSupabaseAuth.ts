
import { useState, useEffect } from 'react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthOperations } from './useAuthOperations';
import { useProfileOperations } from './useProfileOperations';
import { UserProfile } from '@/types/user';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const { signUp, signIn, signOut, resetPassword } = useAuthOperations();
  const { 
    profile, 
    setProfile, 
    fetchUserProfile, 
    applyFirstTimeUserDiscount, 
    updateProfile: updateUserProfile 
  } = useProfileOperations();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session) => {
      console.log('Auth state changed:', event, session);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
        
        // Check if this is a new user registration and apply first-time discount
        if (event === 'SIGNED_UP' as AuthChangeEvent || (event === 'SIGNED_IN' as AuthChangeEvent && !profile)) {
          await applyFirstTimeUserDiscount(session.user.id);
          toast.success("Welcome! You've received a 10% discount on your first 3 orders!");
        }
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setProfile(null);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    await updateUserProfile(user, updates);
  };

  return {
    user,
    profile,
    session,
    loading,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut: handleSignOut,
    resetPassword,
    updateProfile
  };
};
