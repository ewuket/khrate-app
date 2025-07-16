
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Lock, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PasswordChangeForm = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [loading, setLoading] = useState(false);

  const validatePassword = (password: string) => {
    const errors = [];
    if (password.length < 8) errors.push("At least 8 characters");
    if (!/(?=.*[a-z])/.test(password)) errors.push("One lowercase letter");
    if (!/(?=.*[A-Z])/.test(password)) errors.push("One uppercase letter");
    if (!/(?=.*\d)/.test(password)) errors.push("One number");
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    const passwordErrors = validatePassword(passwords.newPassword);
    if (passwordErrors.length > 0) {
      toast.error(`Password must have: ${passwordErrors.join(", ")}`);
      return;
    }

    setLoading(true);
    
    try {
      console.log('🔐 Updating user password...');
      
      const { error } = await supabase.auth.updateUser({
        password: passwords.newPassword
      });

      if (error) {
        console.error('❌ Password update error:', error);
        throw error;
      }

      console.log('✅ Password updated successfully');
      toast.success("Password updated successfully");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error: any) {
      console.error('❌ Failed to update password:', error);
      toast.error(error.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setPasswords(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleShowPassword = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const newPasswordErrors = validatePassword(passwords.newPassword);
  const isFormValid = passwords.newPassword === passwords.confirmPassword && 
                     newPasswordErrors.length === 0 && 
                     passwords.newPassword.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Change Password
        </CardTitle>
        <CardDescription>
          Update your password to keep your account secure
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPasswords.current ? "text" : "password"}
                value={passwords.currentPassword}
                onChange={(e) => handleChange('currentPassword', e.target.value)}
                required
                placeholder="Enter current password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => toggleShowPassword('current')}
              >
                {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPasswords.new ? "text" : "password"}
                value={passwords.newPassword}
                onChange={(e) => handleChange('newPassword', e.target.value)}
                required
                placeholder="Enter new password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => toggleShowPassword('new')}
              >
                {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {passwords.newPassword && (
              <div className="text-xs text-gray-500 space-y-1 mt-2">
                <div className="flex items-center gap-1">
                  <CheckCircle className={`h-3 w-3 ${passwords.newPassword.length >= 8 ? 'text-green-500' : 'text-gray-300'}`} />
                  <span>At least 8 characters</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className={`h-3 w-3 ${/(?=.*[a-z])/.test(passwords.newPassword) ? 'text-green-500' : 'text-gray-300'}`} />
                  <span>One lowercase letter</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className={`h-3 w-3 ${/(?=.*[A-Z])/.test(passwords.newPassword) ? 'text-green-500' : 'text-gray-300'}`} />
                  <span>One uppercase letter</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className={`h-3 w-3 ${/(?=.*\d)/.test(passwords.newPassword) ? 'text-green-500' : 'text-gray-300'}`} />
                  <span>One number</span>
                </div>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                value={passwords.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                required
                placeholder="Confirm new password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => toggleShowPassword('confirm')}
              >
                {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {passwords.newPassword !== passwords.confirmPassword && passwords.confirmPassword && (
            <p className="text-sm text-red-600">Passwords do not match</p>
          )}

          <Button 
            type="submit" 
            disabled={loading || !isFormValid}
            className="w-full bg-khrate-500 hover:bg-khrate-600"
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PasswordChangeForm;
