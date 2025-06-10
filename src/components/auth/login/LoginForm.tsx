
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface LoginFormProps {
  onSwitchToSignup?: () => void;
  onSwitchToReset?: () => void;
}

const LoginForm = ({ onSwitchToSignup, onSwitchToReset }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, closeAuthModal } = useAuth();

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    try {
      console.log('Attempting to sign in with:', email);
      const result = await signIn(email, password);
      console.log('Sign in result:', result);
      
      if (result && !result.error) {
        toast.success('Welcome back!');
        closeAuthModal();
        // Force refresh to ensure clean state
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } else if (result?.error) {
        toast.error(result.error.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-700">Email</Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${isValidEmail(email) && email ? "border-green-500" : ""} bg-white text-black`}
            required
          />
          {isValidEmail(email) && email && (
            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-700">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white text-black pr-10"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-khrate-500 hover:bg-khrate-600 text-white"
        disabled={loading || !email || !password}
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>

      <div className="flex flex-col space-y-2 text-sm text-center">
        {onSwitchToReset && (
          <button
            type="button"
            onClick={onSwitchToReset}
            className="text-khrate-500 hover:underline"
          >
            Forgot your password?
          </button>
        )}
        {onSwitchToSignup && (
          <div className="text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="text-khrate-500 hover:underline font-medium"
            >
              Sign up
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default LoginForm;
