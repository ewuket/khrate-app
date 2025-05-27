
import React, { createContext, useState, useContext, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { UserProfile } from "@/types/user";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  signUp: (email: string, password: string, fullName?: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const supabaseAuth = useSupabaseAuth();

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user: supabaseAuth.user,
        profile: supabaseAuth.profile,
        isAuthenticated: supabaseAuth.isAuthenticated,
        loading: supabaseAuth.loading,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        signUp: supabaseAuth.signUp,
        signIn: supabaseAuth.signIn,
        signOut: supabaseAuth.signOut,
        updateProfile: supabaseAuth.updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
