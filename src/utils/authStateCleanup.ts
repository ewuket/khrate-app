
/**
 * Auth State Cleanup Utilities
 * Prevents authentication limbo states and ensures clean auth transitions
 */

export const cleanupAuthState = () => {
  console.log('Cleaning up auth state...');
  
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
      console.log(`Removed localStorage key: ${key}`);
    }
  });
  
  // Remove from sessionStorage if in use
  if (typeof sessionStorage !== 'undefined') {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
        console.log(`Removed sessionStorage key: ${key}`);
      }
    });
  }
};

export const performSecureSignOut = async (supabaseClient: any) => {
  try {
    console.log('Performing secure sign out...');
    
    // Clean up auth state first
    cleanupAuthState();
    
    // Attempt global sign out
    try {
      await supabaseClient.auth.signOut({ scope: 'global' });
      console.log('Global sign out successful');
    } catch (err) {
      console.warn('Global sign out failed, continuing...', err);
    }
    
    return true;
  } catch (error) {
    console.error('Error during secure sign out:', error);
    return false;
  }
};

export const performSecureSignIn = async (
  supabaseClient: any, 
  email: string, 
  password: string
) => {
  try {
    console.log('Performing secure sign in...');
    
    // Clean up existing state
    cleanupAuthState();
    
    // Attempt global sign out first
    try {
      await supabaseClient.auth.signOut({ scope: 'global' });
    } catch (err) {
      console.warn('Pre-signin signout failed, continuing...', err);
    }
    
    // Sign in with email/password
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error during secure sign in:', error);
    return { data: null, error };
  }
};
