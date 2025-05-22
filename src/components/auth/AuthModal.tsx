
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, signup } = useAuth();
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(email, password);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signup(email, name, password);
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate password reset
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResetSent(true);
      toast.success("Password reset link has been sent to your email");
    } catch (error) {
      toast.error("Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
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
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input 
                      id="login-email" 
                      type="email" 
                      placeholder="your@email.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input 
                      id="login-password" 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)} 
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-khrate-500 hover:bg-khrate-600"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                  
                  <div className="text-center mt-4">
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="text-muted-foreground hover:text-khrate-600"
                      onClick={() => {
                        setShowResetPassword(true);
                        setActiveTab("login");
                      }}
                      type="button"
                    >
                      Forgot password?
                    </Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4 py-4">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input 
                      id="signup-name" 
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input 
                      id="signup-email" 
                      type="email" 
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input 
                      id="signup-password" 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}  
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-khrate-500 hover:bg-khrate-600"
                    disabled={loading}
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
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
              <form onSubmit={handleResetPassword} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input 
                    id="reset-email" 
                    type="email" 
                    placeholder="your@email.com" 
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required 
                  />
                </div>
                
                <DialogFooter className="flex-col sm:flex-col gap-2 sm:space-x-0">
                  <Button 
                    type="submit" 
                    className="w-full bg-khrate-500 hover:bg-khrate-600"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setShowResetPassword(false)}
                  >
                    Back to Login
                  </Button>
                </DialogFooter>
              </form>
            ) : (
              <div className="py-4">
                <div className="flex justify-center py-4">
                  <div className="bg-green-50 text-green-700 p-4 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                
                <div className="text-center mb-4">
                  <h3 className="text-lg font-medium">Email Sent!</h3>
                  <p className="text-muted-foreground mt-1">
                    We've sent a password reset link to:
                  </p>
                  <p className="font-medium">{resetEmail}</p>
                </div>
                
                <div className="text-center text-sm text-muted-foreground mb-4">
                  <p>Didn't receive the email? Check your spam folder or try again.</p>
                </div>
                
                <Button 
                  className="w-full"
                  variant="outline"
                  onClick={() => {
                    setShowResetPassword(false);
                    setResetSent(false);
                  }}
                >
                  Back to Login
                </Button>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
