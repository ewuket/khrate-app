
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useInputValidation } from './useInputValidation';
import { cleanupAuthState, performSecureSignOut, performSecureSignIn } from '@/utils/authStateCleanup';

export const useAuthOperations = () => {
  const { validateEmail, sanitizeTextInput } = useInputValidation();

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      // Validate email
      const emailValidation = await validateEmail(email);
      if (!emailValidation.isValid) {
        throw new Error(emailValidation.error);
      }

      // Sanitize full name
      const sanitizedName = fullName ? await sanitizeTextInput(fullName, 100) : '';

      // Clean up any existing auth state
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
      console.error('Signup error:', error);
      toast.error(error.message);
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Validate email
      const emailValidation = await validateEmail(email);
      if (!emailValidation.isValid) {
        throw new Error(emailValidation.error);
      }

      const result = await performSecureSignIn(supabase, email, password);
      
      if (result.error) throw result.error;
      
      toast.success('Welcome back!');
      return result;
    } catch (error: any) {
      console.error('Signin error:', error);
      toast.error(error.message);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      const success = await performSecureSignOut(supabase);
      
      if (success) {
        toast.success('Signed out successfully');
      }
    } catch (error: any) {
      console.error('Signout error:', error);
      toast.error('Sign out failed');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // Validate email
      const emailValidation = await validateEmail(email);
      if (!emailValidation.isValid) {
        throw new Error(emailValidation.error);
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (error) throw error;
      
      return { error: null };
    } catch (error: any) {
      console.error('Password reset error:', error);
      return { error };
    }
  };

  return {
    signUp,
    signIn,
    signOut,
    resetPassword
  };
};
