
import { useState } from "react";
import { toast } from "sonner";
import { User } from "@/types/auth";
import { useAuthStorage } from "./useAuthStorage";

export const useAuthOperations = (
  setUser: (user: User | null) => void,
  setPendingEmail: (email: string | null) => void,
  setPendingUserData: (data: Partial<User> | null) => void,
  setOtpSent: (sent: boolean) => void,
  closeAuthModal: () => void,
  openOTPModal: () => void,
  setIsVerifyingOTP: (verifying: boolean) => void
) => {
  const {
    saveUser,
    getStoredAccount,
    saveAccount,
    saveOTPData,
    getOTPData,
    removeOTPData
  } = useAuthStorage();

  const updateUserProfile = (updates: Partial<User>) => {
    const storedUser = localStorage.getItem("khrate_user");
    if (!storedUser) return;
    
    try {
      const user = JSON.parse(storedUser);
      const updatedUser = { ...user, ...updates };
      saveUser(updatedUser);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const account = getStoredAccount(email);
      
      if (!account) {
        toast.error("No account found with this email");
        return;
      }
      
      if (account.password !== password) {
        toast.error("Invalid password");
        return;
      }
      
      setPendingEmail(email);
      setPendingUserData({
        email: email,
        name: account.name,
        createdAt: account.createdAt,
      });
      setOtpSent(false);
      
      closeAuthModal();
      openOTPModal();
      
      await sendOTP(email);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  const signup = async (email: string, name: string, password: string) => {
    try {
      const existingAccount = getStoredAccount(email);
      
      if (existingAccount) {
        toast.error("An account with this email already exists");
        return;
      }
      
      const newAccount = {
        email,
        name,
        password,
        createdAt: new Date().toISOString()
      };
      
      saveAccount(email, newAccount);
      
      setPendingEmail(email);
      setPendingUserData({
        email: email,
        name: name,
        createdAt: newAccount.createdAt,
      });
      setOtpSent(false);
      
      closeAuthModal();
      openOTPModal();
      
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

  const sendOTP = async (email: string) => {
    try {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log(`Sending OTP ${otp} to ${email}`);
      
      const expiresAt = new Date(Date.now() + 5 * 60000).toISOString(); // 5 minutes expiry
      saveOTPData(email, otp, expiresAt);
      
      setOtpSent(true);
      setPendingEmail(email);
      
      toast.success(`OTP sent to ${email}`, { 
        description: `[For demo only] Your OTP is: ${otp}` 
      });
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  const verifyOTP = async (otp: string): Promise<boolean> => {
    const pendingEmail = localStorage.getItem("pendingEmail");
    const pendingUserDataStr = localStorage.getItem("pendingUserData");
    
    if (!pendingEmail || !pendingUserDataStr) return false;
    
    const pendingUserData = JSON.parse(pendingUserDataStr);
    setIsVerifyingOTP(true);
    
    try {
      const otpData = getOTPData(pendingEmail);
      
      if (!otpData) {
        toast.error("OTP verification failed. Please request a new OTP.");
        setIsVerifyingOTP(false);
        return false;
      }
      
      const { otp: storedOTP, expiresAt } = otpData;
      
      if (new Date() > new Date(expiresAt)) {
        toast.error("OTP has expired. Please request a new one.");
        setIsVerifyingOTP(false);
        return false;
      }
      
      if (otp !== storedOTP) {
        toast.error("Invalid OTP. Please try again.");
        setIsVerifyingOTP(false);
        return false;
      }
      
      const userId = `user_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;
      
      const newUser: User = {
        id: userId,
        email: pendingEmail,
        name: pendingUserData.name,
        verified: true,
        createdAt: pendingUserData.createdAt || new Date().toISOString(),
      };
      
      saveUser(newUser);
      setUser(newUser);
      
      removeOTPData(pendingEmail);
      setPendingEmail(null);
      setPendingUserData(null);
      
      toast.success("Email verified successfully");
      setIsVerifyingOTP(false);
      return true;
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error("Verification failed. Please try again.");
      setIsVerifyingOTP(false);
      return false;
    }
  };

  return {
    login,
    signup,
    logout,
    sendOTP,
    verifyOTP,
    updateUserProfile
  };
};
