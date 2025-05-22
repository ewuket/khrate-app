
import { User } from "@/types/auth";

export const useAuthStorage = () => {
  const getStoredUser = (): User | null => {
    const storedUser = localStorage.getItem("khrate_user");
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error("Failed to parse user data", error);
        localStorage.removeItem("khrate_user");
      }
    }
    return null;
  };

  const saveUser = (userData: User | null): void => {
    if (userData) {
      localStorage.setItem("khrate_user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("khrate_user");
    }
  };

  const getStoredAccount = (email: string): any | null => {
    const userAccount = localStorage.getItem(`khrate_account_${email}`);
    return userAccount ? JSON.parse(userAccount) : null;
  };

  const saveAccount = (email: string, accountData: any): void => {
    localStorage.setItem(`khrate_account_${email}`, JSON.stringify(accountData));
  };

  const getOTPData = (email: string): { otp: string; expiresAt: string } | null => {
    const otpData = localStorage.getItem(`khrate_otp_${email}`);
    return otpData ? JSON.parse(otpData) : null;
  };

  const saveOTPData = (email: string, otp: string, expiresAt: string): void => {
    localStorage.setItem(`khrate_otp_${email}`, JSON.stringify({ otp, expiresAt }));
  };

  const removeOTPData = (email: string): void => {
    localStorage.removeItem(`khrate_otp_${email}`);
  };

  return {
    getStoredUser,
    saveUser,
    getStoredAccount,
    saveAccount,
    getOTPData,
    saveOTPData,
    removeOTPData,
  };
};
