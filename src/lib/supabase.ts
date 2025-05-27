
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create a mock client that prevents crashes
const mockClient = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    signOut: () => Promise.resolve({ error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null })
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: { code: 'PGRST116' } })
      })
    }),
    insert: () => ({
      select: () => ({
        single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
      })
    }),
    update: () => ({
      eq: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
        })
      })
    })
  })
} as any;

// Check if we're in a Lovable environment with Supabase integration
const isLovableWithSupabase = typeof window !== 'undefined' && 
  (window as any).__LOVABLE_SUPABASE_URL && 
  (window as any).__LOVABLE_SUPABASE_ANON_KEY;

// Use Lovable's injected Supabase credentials if available, otherwise fall back to env vars
const finalSupabaseUrl = isLovableWithSupabase 
  ? (window as any).__LOVABLE_SUPABASE_URL 
  : supabaseUrl;
  
const finalSupabaseAnonKey = isLovableWithSupabase 
  ? (window as any).__LOVABLE_SUPABASE_ANON_KEY 
  : supabaseAnonKey;

// Export the appropriate client based on available credentials
export const supabase = (finalSupabaseUrl && finalSupabaseAnonKey) 
  ? createClient(finalSupabaseUrl, finalSupabaseAnonKey)
  : (() => {
      console.warn('Supabase not configured. Using mock client.');
      return mockClient;
    })();
