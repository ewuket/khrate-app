
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface SignupFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateRwandaPhone = (phone: string): boolean => {
    // Rwanda phone number formats: +250XXXXXXXXX, 250XXXXXXXXX, 07XXXXXXXX, 78XXXXXXXX, 79XXXXXXXX
    const rwandaPhoneRegex = /^(\+250|250)?(07|78|79)[0-9]{7}$/;
    return rwandaPhoneRegex.test(phone.replace(/\s/g, ''));
  };

  const formatPhoneNumber = (phone: string): string => {
    // Remove all non-digit characters except +
    const cleaned = phone.replace(/[^\d+]/g, '');
    
    // If it starts with 07, 78, or 79, add +250
    if (/^(07|78|79)/.test(cleaned)) {
      return `+250${cleaned}`;
    }
    
    // If it starts with 250, add +
    if (/^250/.test(cleaned)) {
      return `+${cleaned}`;
    }
    
    // If it already starts with +250, return as is
    if (/^\+250/.test(cleaned)) {
      return cleaned;
    }
    
    return phone;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }

    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return;
    }

    if (!validateRwandaPhone(formData.phone)) {
      setError('Please enter a valid Rwanda phone number (e.g., +250781234567, 0781234567)');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const formattedPhone = formatPhoneNumber(formData.phone);

      // Sign up with Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formattedPhone
          }
        }
      });

      if (signUpError) {
        console.error('Signup error:', signUpError);
        setError(signUpError.message);
        return;
      }

      if (data.user) {
        // Update the user profile with phone number
        const { error: profileError } = await supabase
          .from('user_profiles')
          .upsert({
            id: data.user.id,
            email: formData.email,
            full_name: formData.fullName,
            phone: formattedPhone
          });

        if (profileError) {
          console.error('Profile update error:', profileError);
          // Don't throw error here as the user is already signed up
        }

        toast.success('Account created successfully! Please check your email to verify your account.');
        onSuccess();
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error.message || 'An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          type="text"
          value={formData.fullName}
          onChange={(e) => handleInputChange('fullName', e.target.value)}
          placeholder="Enter your full name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="Enter your email"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          placeholder="e.g., +250781234567 or 0781234567"
          required
        />
        <p className="text-xs text-gray-500">
          Enter your Rwanda phone number for order notifications
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="Enter your password"
            required
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

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            placeholder="Confirm your password"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        className="w-full bg-khrate-500 hover:bg-khrate-600"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          'Create Account'
        )}
      </Button>

      <div className="text-center">
        <Button
          type="button"
          variant="link"
          onClick={onSwitchToLogin}
          className="text-sm"
        >
          Already have an account? Sign in
        </Button>
      </div>
    </form>
  );
};

export default SignupForm;
