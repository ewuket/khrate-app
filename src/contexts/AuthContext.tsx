
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import AuthModal from '@/components/auth/AuthModal';
import { UserProfile } from '@/types/user';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, fullName: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    console.log('Setting up auth listener...');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile fetching to prevent deadlocks
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
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
      } else {
        console.log('Initial session check:', session?.user?.email);
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
        console.log('Profile loaded:', data);
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
      
      const newProfile = {
        id: userId,
        email: userData.user?.email || '',
        full_name: userData.user?.user_metadata?.full_name || '',
        discount_orders_remaining: 3,
        total_orders: 0,
        created_at: new Date().toISOString()
      };

      console.log('Creating new profile:', newProfile);

      const { data, error } = await supabase
        .from('user_profiles')
        .insert([newProfile])
        .select()
        .single();

      if (error) throw error;
      
      console.log('Profile created:', data);
      setProfile(data);
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Attempting sign in for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        toast.error(error.message);
        return { error };
      }

      console.log('Sign in successful:', data.user?.email);
      toast.success('Welcome back!');
      return { data };
    } catch (error: any) {
      console.error('Sign in exception:', error);
      toast.error('Sign in failed');
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
      console.log('Attempting sign up for:', email);
      
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
        console.error('Sign up error:', error);
        toast.error(error.message);
        return { error };
      }

      console.log('Sign up successful:', data.user?.email);
      
      if (data.user && !data.session) {
        toast.success('Account created! Please check your email to confirm your account.');
      } else {
        toast.success('Account created successfully!');
      }
      
      return { data };
    } catch (error: any) {
      console.error('Sign up exception:', error);
      toast.error('Sign up failed');
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      console.log('Signing out user...');
      
      // Clear localStorage auth keys
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error('Sign out error:', error);
        toast.error('Failed to sign out');
        return;
      }

      // Clear all state immediately
      setUser(null);
      setSession(null);
      setProfile(null);
      
      console.log('Sign out successful');
      toast.success('Signed out successfully');
      
      // Force page reload for clean state
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    } catch (error: any) {
      console.error('Sign out exception:', error);
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
        console.error('Password reset error:', error);
        toast.error(error.message);
        return { error };
      }

      toast.success('Password reset email sent! Check your inbox.');
      return { error: null };
    } catch (error: any) {
      console.error('Password reset exception:', error);
      toast.error('Failed to sen
d reset email');
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
        .single();

      if (error) throw error;
      
      setProfile(data);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error('Failed to update profile');
      console.error('Update profile error:', error);
    }
  };

  const openAuthModal = () => {
    console.log('Opening auth modal');
    setIsAuthModalOpen(true);
  };
  
  const closeAuthModal = () => {
    console.log('Closing auth modal');
    setIsAuthModalOpen(false);
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    isAuthenticated: !!user && !!session,
    isAuthModalOpen,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    openAuthModal,
    closeAuthModal,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthModal />
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
