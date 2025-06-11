
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`pl-10 py-3 bg-white border-gray-300 focus:border-khrate-500 focus:ring-khrate-500 ${
              isValidEmail(email) && email ? "border-green-500 focus:border-green-500" : ""
            }`}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 pr-10 py-3 bg-white border-gray-300 focus:border-khrate-500 focus:ring-khrate-500"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-khrate-500 hover:bg-khrate-600 text-white py-3 text-lg font-semibold"
        disabled={loading || !email || !password}
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>

      <div className="flex flex-col space-y-3 text-sm text-center">
        {onSwitchToReset && (
          <button
            type="button"
            onClick={onSwitchToReset}
            className="text-khrate-500 hover:underline hover:text-khrate-600"
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
              className="text-khrate-500 hover:underline font-semibold hover:text-khrate-600"
            >
              Sign up here
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default LoginForm;
