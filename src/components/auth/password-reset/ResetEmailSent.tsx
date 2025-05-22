
import React from "react";
import { Button } from "@/components/ui/button";

interface ResetEmailSentProps {
  email: string;
  onBackToLogin: () => void;
}

const ResetEmailSent: React.FC<ResetEmailSentProps> = ({ email, onBackToLogin }) => {
  return (
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
        <p className="font-medium">{email}</p>
      </div>
      
      <div className="text-center text-sm text-muted-foreground mb-4">
        <p>Didn't receive the email? Check your spam folder or try again.</p>
      </div>
      
      <Button 
        className="w-full"
        variant="outline"
        onClick={onBackToLogin}
      >
        Back to Login
      </Button>
    </div>
  );
};

export default ResetEmailSent;
