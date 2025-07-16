
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

interface LoginFormProps {
  onShowResetPassword: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onShowResetPassword }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
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
  
  return (
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
          onClick={onShowResetPassword}
          type="button"
        >
          Forgot password?
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
