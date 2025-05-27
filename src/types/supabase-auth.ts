
import { User, Session } from '@supabase/supabase-js';
import { UserProfile } from '@/types/user';

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export interface AuthOperations {
  signUp: (email: string, password: string, fullName?: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}
