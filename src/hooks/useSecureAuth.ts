
import { useState, useEffect } from 'react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useInputValidation } from './useInputValidation';
import { cleanupAuthState, performSecureSignOut, performSecureSignIn } from '@/utils/authStateCleanup';
import { UserProfile } from '@/types/user';

export const useSecureAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { validateEmail, sanitizeTextInput } = useInputValidation();

  useEffect(() => {
    console.log('Setting up secure auth listener...');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer data fetching to prevent deadlocks
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for:', userId);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        console.log('Profile not found, creating new profile');
        await createUserProfile(userId);
      } else if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createUserProfile = async (userId: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      const sanitizedName = await sanitizeTextInput(
        userData.user?.user_metadata?.full_name || '', 
        100
      );
      
      const newProfile = {
        id: userId,
        email: userData.user?.email || '',
        full_name: sanitizedName,
        discount_orders_remaining: 3,
        total_orders: 0,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .insert([newProfile])
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  const secureSignUp = async (email: string, password: string, fullName?: string) => {
    try {
      // Validate inputs
      const emailValidation = await validateEmail(email);
      if (!emailValidation.isValid) {
        throw new Error(emailValidation.error);
      }

      const sanitizedName = fullName ? await sanitizeTextInput(fullName, 100) : '';

      // Clean up any existing state
      cleanupAuthState();

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: sanitizedName
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;
      
      if (data.user && !data.session) {
        toast.success('Please check your email to confirm your account!');
      }
      
      return { data, error: null };
    } catch (error: any) {
      console.error('Secure signup error:', error);
      toast.error(error.message);
      return { data: null, error };
    }
  };

  const secureSignIn = async (email: string, password: string) => {
    try {
      // Validate email
      const emailValidation = await validateEmail(email);
      if (!emailValidation.isValid) {
        throw new Error(emailValidation.error);
      }

      const result = await performSecureSignIn(supabase, email, password);
      
      if (result.error) throw result.error;
      
      toast.success('Welcome back!');
      
      // Force page reload for clean state
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
      
      return result;
    } catch (error: any) {
      console.error('Secure signin error:', error);
      toast.error(error.message);
      return { data: null, error };
    }
  };

  const secureSignOut = async () => {
    try {
      const success = await performSecureSignOut(supabase);
      
      if (success) {
        setProfile(null);
        toast.success('Signed out successfully');
        
        // Force page reload for clean state
        setTimeout(() => {
          window.location.href = '/';
        }, 500);
      }
    } catch (error: any) {
      console.error('Secure signout error:', error);
      toast.error('Sign out failed');
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    try {
      // Sanitize text inputs
      const sanitizedUpdates = { ...updates };
      if (updates.full_name) {
        sanitizedUpdates.full_name = await sanitizeTextInput(updates.full_name, 100);
      }
      if (updates.phone) {
        sanitizedUpdates.phone = await sanitizeTextInput(updates.phone, 20);
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .update(sanitizedUpdates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setProfile(data);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Update profile error:', error);
      toast.error('Failed to update profile');
    }
  };

  return {
    user,
    profile,
    session,
    loading,
    isAuthenticated: !!user,
    signUp: secureSignUp,
    signIn: secureSignIn,
    signOut: secureSignOut,
    updateProfile
  };
};
