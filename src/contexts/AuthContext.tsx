
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";

// Define our user types
interface User {
  id: string;
  email: string;
  name?: string;
  verified: boolean;
  profileImage?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isVerified: boolean;
  isAuthModalOpen: boolean;
  pendingEmail: string | null;
  otpSent: boolean;
  isVerifyingOTP: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
  sendOTP: (email: string) => Promise<void>;
  verifyOTP: (otp: string) => Promise<boolean>;
  isOTPModalOpen: boolean;
  openOTPModal: () => void;
  closeOTPModal: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [pendingUserData, setPendingUserData] = useState<Partial<User> | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("khrate_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user data", error);
        localStorage.removeItem("khrate_user");
      }
    }
  }, []);

  // Helper to save user to localStorage
  const saveUser = (userData: User | null) => {
    if (userData) {
      localStorage.setItem("khrate_user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("khrate_user");
    }
    setUser(userData);
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);
  
  const openOTPModal = () => setIsOTPModalOpen(true);
  const closeOTPModal = () => setIsOTPModalOpen(false);

  // Update user profile
  const updateUserProfile = (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    saveUser(updatedUser);
    
    toast.success("Profile updated successfully");
  };

  // Simulate login
  const login = async (email: string, password: string) => {
    try {
      // Check if user exists in localStorage (simulating a database check)
      const userAccount = localStorage.getItem(`khrate_account_${email}`);
      
      if (!userAccount) {
        toast.error("No account found with this email");
        return;
      }
      
      const account = JSON.parse(userAccount);
      
      if (account.password !== password) {
        toast.error("Invalid password");
        return;
      }
      
      // Set the pending email for OTP verification
      setPendingEmail(email);
      setPendingUserData({
        email: email,
        name: account.name,
        createdAt: account.createdAt,
      });
      setOtpSent(false);
      
      // Close auth modal and open OTP modal
      closeAuthModal();
      openOTPModal();
      
      // Send OTP for verification
      await sendOTP(email);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  // User registration
  const signup = async (email: string, name: string, password: string) => {
    try {
      // Check if user already exists
      const existingAccount = localStorage.getItem(`khrate_account_${email}`);
      
      if (existingAccount) {
        toast.error("An account with this email already exists");
        return;
      }
      
      // Create a new account (in localStorage)
      const newAccount = {
        email,
        name,
        password, // In a real app, this would be hashed
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem(`khrate_account_${email}`, JSON.stringify(newAccount));
      
      // Set the pending email and user data for OTP verification
      setPendingEmail(email);
      setPendingUserData({
        email: email,
        name: name,
        createdAt: newAccount.createdAt,
      });
      setOtpSent(false);
      
      // Close auth modal and open OTP modal
      closeAuthModal();
      openOTPModal();
      
      // Send OTP for verification
      await sendOTP(email);
      
      toast.success("Account created! Please verify your email");
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Signup failed. Please try again.");
    }
  };

  const logout = () => {
    saveUser(null);
    toast.success("Logged out successfully");
  };

  // Send OTP
  const sendOTP = async (email: string): Promise<void> => {
    try {
      // Generate a random 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // In a real app, this would send the OTP via email
      console.log(`Sending OTP ${otp} to ${email}`);
      
      // Store OTP in localStorage (simulating a database)
      localStorage.setItem(`khrate_otp_${email}`, JSON.stringify({
        otp,
        expiresAt: new Date(Date.now() + 5 * 60000).toISOString() // 5 minutes expiry
      }));
      
      setOtpSent(true);
      setPendingEmail(email);
      
      // SIMULATE email sending - in a real app, this would send an actual email
      toast.success(`OTP sent to ${email}`, { 
        description: `[For demo only] Your OTP is: ${otp}` 
      });
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  // Verify OTP
  const verifyOTP = async (otp: string): Promise<boolean> => {
    if (!pendingEmail || !pendingUserData) return false;
    
    setIsVerifyingOTP(true);
    
    try {
      // Get stored OTP from localStorage
      const storedOTPData = localStorage.getItem(`khrate_otp_${pendingEmail}`);
      
      if (!storedOTPData) {
        toast.error("OTP verification failed. Please request a new OTP.");
        setIsVerifyingOTP(false);
        return false;
      }
      
      const { otp: storedOTP, expiresAt } = JSON.parse(storedOTPData);
      
      // Check if OTP is expired
      if (new Date() > new Date(expiresAt)) {
        toast.error("OTP has expired. Please request a new one.");
        setIsVerifyingOTP(false);
        return false;
      }
      
      // Verify OTP
      if (otp !== storedOTP) {
        toast.error("Invalid OTP. Please try again.");
        setIsVerifyingOTP(false);
        return false;
      }
      
      // OTP is valid, create a user session with a unique ID
      const userId = `user_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;
      
      const newUser: User = {
        id: userId,
        email: pendingEmail,
        name: pendingUserData.name,
        verified: true,
        createdAt: pendingUserData.createdAt || new Date().toISOString(),
      };
      
      // Save the user session
      saveUser(newUser);
      
      // Clear OTP data
      localStorage.removeItem(`khrate_otp_${pendingEmail}`);
      setPendingEmail(null);
      setPendingUserData(null);
      
      toast.success("Email verified successfully");
      closeOTPModal();
      setIsVerifyingOTP(false);
      return true;
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error("Verification failed. Please try again.");
      setIsVerifyingOTP(false);
      return false;
    }
  };

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
