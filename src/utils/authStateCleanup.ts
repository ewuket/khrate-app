
import { SupabaseClient } from '@supabase/supabase-js';

export const cleanupAuthState = () => {
  console.log('🧹 Cleaning up auth state...');
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-') || key.includes('khrate_')) {
      console.log(`🗑️ Removing localStorage key: ${key}`);
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if it exists
  if (typeof sessionStorage !== 'undefined') {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-') || key.includes('khrate_')) {
        console.log(`🗑️ Removing sessionStorage key: ${key}`);
        sessionStorage.removeItem(key);
      }
    });
  }
};

export const performSecureSignOut = async (supabase: SupabaseClient): Promise<boolean> => {
  try {
    console.log('🚪 Performing secure sign out...');
    
    // Clean up first
    cleanupAuthState();
    
    // Attempt global sign out
    const { error } = await supabase.auth.signOut({ scope: 'global' });
    
    if (error) {
      console.error('❌ Sign out error (ignoring):', error);
      // Continue anyway - we've cleaned up the local state
    }
    
    console.log('✅ Secure sign out completed');
    return true;
  } catch (error) {
    console.error('❌ Secure sign out failed:', error);
    // Even if sign out fails, we've cleaned up local state
    return true;
  }
};

export const performSecureSignIn = async (
  supabase: SupabaseClient, 
  email: string, 
  password: string
) => {
  try {
    console.log('🔐 Performing secure sign in...');
    
    // Clean up any existing state
    cleanupAuthState();
    
    // Attempt to sign out any existing session
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (err) {
      // Ignore errors here
      console.log('⚠️ Previous session cleanup (ignoring errors)');
    }
    
    // Wait a moment for cleanup
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Sign in with fresh state
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    console.log('✅ Secure sign in completed');
    return { data, error: null };
  } catch (error) {
    console.error('❌ Secure sign in failed:', error);
    return { data: null, error };
  }
};
