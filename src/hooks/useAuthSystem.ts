
import { useState, useEffect } from 'react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserProfile } from '@/types/user';

export const useAuthSystem = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔐 Setting up auth system...');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile fetching to prevent deadlocks
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 100);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('❌ Error getting session:', error);
      } else {
        console.log('✅ Initial session check:', session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchUserProfile(session.user.id);
        } else {
          setLoading(false);
        }
      }
    });

    return () => {
      console.log('🧹 Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('👤 Fetching user profile for:', userId);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error && error.code === 'PGRST116') {
        console.log('➕ Profile not found, creating new profile');
        await createUserProfile(userId);
      } else if (error) {
        console.error('❌ Error fetching profile:', error);
        setLoading(false);
      } else if (data) {
        console.log('✅ Profile loaded:', data.email);
        setProfile(data);
        setLoading(false);
      } else {
        console.log('➕ No profile found, creating new profile');
        await createUserProfile(userId);
      }
    } catch (error) {
      console.error('❌ Profile fetch error:', error);
      setLoading(false);
    }
  };

  const createUserProfile = async (userId: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      const newProfile = {
        id: userId,
        email: userData.user?.email || '',
        full_name: userData.user?.user_metadata?.full_name || '',
        discount_orders_remaining: 3,
        total_orders: 0,
        created_at: new Date().toISOString()
      };

      console.log('➕ Creating new profile:', newProfile.email);

      const { data, error } = await supabase
        .from('user_profiles')
        .insert([newProfile])
        .select()
        .maybeSingle();

      if (error) {
        console.error('❌ Error creating profile:', error);
        throw error;
      }
      
      if (data) {
        console.log('✅ Profile created:', data.email);
        setProfile(data);
      }
    } catch (error) {
      console.error('❌ Error creating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
      console.log('📝 Attempting sign up for:', email);
      
      const redirectUrl = `${window.location.origin}/`;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) {
        console.error('❌ Sign up error:', error);
        toast.error(error.message);
        return { error };
      }

      console.log('✅ Sign up successful:', data.user?.email);
      
      if (data.user && !data.session) {
        toast.success('Account created! Please check your email to confirm your account.');
      } else {
        toast.success('Account created successfully!');
      }
      
      return { data };
    } catch (error: any) {
      console.error('❌ Sign up exception:', error);
      toast.error('Sign up failed');
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('🔑 Attempting sign in for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Sign in error:', error);
        toast.error(error.message);
        return { error };
      }

      console.log('✅ Sign in successful:', data.user?.email);
      toast.success('Welcome back!');
      return { data };
    } catch (error: any) {
      console.error('❌ Sign in exception:', error);
      toast.error('Sign in failed');
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      console.log('🚪 Signing out user...');
      
      // Clear localStorage auth keys
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error('❌ Sign out error:', error);
        toast.error('Failed to sign out');
        return;
      }

      // Clear all state immediately
      setUser(null);
      setSession(null);
      setProfile(null);
      
      console.log('✅ Sign out successful');
      toast.success('Signed out successfully');
      
      // Force page reload for clean state
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    } catch (error: any) {
      console.error('❌ Sign out exception:', error);
      toast.error('Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const resetUrl = `${window.location.origin}/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: resetUrl
      });

      if (error) {
        console.error('❌ Password reset error:', error);
        toast.error(error.message);
        return { error };
      }

      toast.success('Password reset email sent! Check your inbox.');
      return { error: null };
    } catch (error: any) {
      console.error('❌ Password reset exception:', error);
      toast.error('Failed to send reset email');
      return { error };
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setProfile(data);
        toast.success('Profile updated successfully');
      }
    } catch (error: any) {
      toast.error('Failed to update profile');
      console.error('❌ Update profile error:', error);
    }
  };

  return {
    user,
    profile,
    session,
    loading,
    isAuthenticated: !!user && !!session,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile
  };
};
