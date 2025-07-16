
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

interface PasswordResetFormProps {
  onBackToLogin?: () => void;
  onResetSent?: (email: string) => void;
}

const PasswordResetForm = ({ onBackToLogin, onResetSent }: PasswordResetFormProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !isValidEmail(email)) return;
    
    setLoading(true);
    try {
      await resetPassword(email);
      onResetSent?.(email);
    } catch (error) {
      console.error('Password reset error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={isValidEmail(email) && email ? "border-green-500" : ""}
            required
          />
          {isValidEmail(email) && email && (
            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
          )}
        </div>
        <p className="text-sm text-gray-500">
          We'll send you a link to reset your password
        </p>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-khrate-500 hover:bg-khrate-600"
        disabled={loading || !email || !isValidEmail(email)}
      >
        {loading ? 'Sending...' : 'Send Reset Link'}
      </Button>

      <div className="text-center">
        <button
          type="button"
          onClick={onBackToLogin}
          className="text-sm text-khrate-500 hover:underline"
        >
          Back to Login
        </button>
      </div>
    </form>
  );
};

export default PasswordResetForm;
