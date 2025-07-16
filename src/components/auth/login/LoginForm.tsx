
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import ForgotPasswordModal from "../password-reset/ForgotPasswordModal";

interface LoginFormProps {
  onSwitchToSignup: () => void;
  onClose: () => void;
}

const LoginForm = ({ onSwitchToSignup, onClose }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await signIn(email, password);
      
      if (error) {
        toast.error(error.message || "Login failed");
      } else if (data?.user) {
        toast.success("Welcome back!");
        onClose();
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="login-email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </Label>
          <Input
            id="login-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="pl-10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="login-password" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Password
          </Label>
          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-10 pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="link"
            className="p-0 h-auto font-normal text-sm text-khrate-500 hover:text-khrate-600"
            onClick={handleForgotPassword}
          >
            Forgot password?
          </Button>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-khrate-500 hover:bg-khrate-600"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Button
            type="button"
            variant="link"
            className="p-0 h-auto font-normal text-khrate-500 hover:text-khrate-600"
            onClick={onSwitchToSignup}
          >
            Sign up
          </Button>
        </div>
      </form>

      <ForgotPasswordModal
        open={showForgotPassword}
        onOpenChange={setShowForgotPassword}
        onBackToLogin={handleBackToLogin}
      />
    </>
  );
};

export default LoginForm;
