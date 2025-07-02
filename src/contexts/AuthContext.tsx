
import React, { createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import AuthModal from '@/components/auth/AuthModal';
import { UserProfile } from '@/types/user';
import { useAuthSystem } from '@/hooks/useAuthSystem';
import { useState } from 'react';

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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const authSystem = useAuthSystem();

  const openAuthModal = () => {
    console.log('🔓 Opening auth modal');
    setIsAuthModalOpen(true);
  };
  
  const closeAuthModal = () => {
    console.log('🔒 Closing auth modal');
    setIsAuthModalOpen(false);
  };

  const value: AuthContextType = {
    ...authSystem,
    isAuthModalOpen,
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
