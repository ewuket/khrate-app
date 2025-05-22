
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface PasswordResetFormProps {
  onBackToLogin: () => void;
  onResetSent: (email: string) => void;
}

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({ 
  onBackToLogin, 
  onResetSent 
}) => {
  const [resetEmail, setResetEmail] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate password reset
      await new Promise(resolve => setTimeout(resolve, 1000));
      onResetSent(resetEmail);
      toast.success("Password reset link has been sent to your email");
    } catch (error) {
      toast.error("Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
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
      
      <div className="flex flex-col sm:flex-col gap-2 sm:space-x-0">
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
          onClick={onBackToLogin}
        >
          Back to Login
        </Button>
      </div>
    </form>
  );
};

export default PasswordResetForm;
