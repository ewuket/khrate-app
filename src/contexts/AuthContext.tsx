
import React, { createContext, useState, useContext, useEffect } from "react";
import { User, AuthContextType } from "@/types/auth";
import { useAuthStorage } from "@/hooks/useAuthStorage";
import { useAuthOperations } from "@/hooks/useAuthOperations";
import { toast } from "sonner";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [pendingUserData, setPendingUserData] = useState<Partial<User> | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  
  const { getStoredUser } = useAuthStorage();

  // Helper functions for modals
  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);
  const openOTPModal = () => setIsOTPModalOpen(true);
  const closeOTPModal = () => setIsOTPModalOpen(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // Get auth operations
  const {
    login,
    signup,
    logout,
    sendOTP,
    verifyOTP,
    updateUserProfile
  } = useAuthOperations(
    setUser,
    setPendingEmail,
    setPendingUserData,
    setOtpSent,
    closeAuthModal,
    openOTPModal,
    setIsVerifyingOTP
  );

  // Store pendingEmail and pendingUserData in localStorage when they change
  useEffect(() => {
    if (pendingEmail) {
      localStorage.setItem("pendingEmail", pendingEmail);
    } else {
      localStorage.removeItem("pendingEmail");
    }
  }, [pendingEmail]);

  useEffect(() => {
    if (pendingUserData) {
      localStorage.setItem("pendingUserData", JSON.stringify(pendingUserData));
    } else {
      localStorage.removeItem("pendingUserData");
    }
  }, [pendingUserData]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isVerified: !!user?.verified,
        isAuthModalOpen,
        pendingEmail,
        otpSent,
        isVerifyingOTP,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        logout,
        sendOTP,
        verifyOTP,
        isOTPModalOpen,
        openOTPModal,
        closeOTPModal,
        updateUserProfile
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
