
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import LoginForm from "./login/LoginForm";
import SignupForm from "./signup/SignupForm";
import PasswordResetForm from "./password-reset/PasswordResetForm";
import ResetEmailSent from "./password-reset/ResetEmailSent";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("login");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  
  const handleResetSent = (email: string) => {
    setResetEmail(email);
    setResetSent(true);
  };
  
  const handleGuestCheckout = () => {
    toast.success("Continuing as guest");
    onClose();
  };
  
  const handleCloseModal = () => {
    // Reset all states when modal is closed
    setShowResetPassword(false);
    setResetSent(false);
    setResetEmail("");
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="sm:max-w-[425px]">
        {!showResetPassword ? (
          <>
            <DialogHeader>
              <DialogTitle>Welcome to KHRATE</DialogTitle>
              <DialogDescription>
                Sign in to your account or create a new one to get started.
              </DialogDescription>
            </DialogHeader>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4 py-4">
                <LoginForm 
                  onShowResetPassword={() => {
                    setShowResetPassword(true);
                    setActiveTab("login");
                  }} 
                />
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4 py-4">
                <SignupForm />
              </TabsContent>
            </Tabs>
            
            <div className="mt-4 pt-4 border-t">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleGuestCheckout}
              >
                Continue as Guest
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Reset Password</DialogTitle>
              <DialogDescription>
                {!resetSent ? 
                  "Enter your email address and we'll send you a link to reset your password." : 
                  "Check your email for a password reset link. Follow the instructions to create a new password."
                }
              </DialogDescription>
            </DialogHeader>
            
            {!resetSent ? (
              <PasswordResetForm 
                onBackToLogin={() => setShowResetPassword(false)} 
                onResetSent={handleResetSent}
              />
            ) : (
              <ResetEmailSent 
                email={resetEmail} 
                onBackToLogin={() => {
                  setShowResetPassword(false);
                  setResetSent(false);
                }}
              />
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
