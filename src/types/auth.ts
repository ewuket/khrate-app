
export interface User {
  id: string;
  email: string;
  name?: string;
  verified: boolean;
  profileImage?: string;
  createdAt: string;
}

export interface AuthContextType {
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
