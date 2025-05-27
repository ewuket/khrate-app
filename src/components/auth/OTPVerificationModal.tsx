
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InputOTP } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, RefreshCcw } from "lucide-react";

const OTPVerificationModal: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [otp, setOtp] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);

  // Handle countdown for OTP resend and expiry
  useEffect(() => {
    if (!isOpen || countdown <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isOpen, countdown]);

  // Reset OTP when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setOtp("");
    }
  }, [isOpen]);

  const handleResendOTP = async () => {
    if (user?.email && canResend) {
      // In a real implementation, this would trigger OTP resend
      toast.info("OTP resent to your email");
      setCountdown(300);
      setCanResend(false);
    }
  };

  const handleVerify = async () => {
    if (otp.length === 6) {
      setIsVerifying(true);
      // Simulate OTP verification
      setTimeout(() => {
        setIsVerifying(false);
        toast.success("Email verified successfully!");
        setIsOpen(false);
        setOtp("");
      }, 2000);
    } else {
      toast.error("Please enter a valid 6-digit OTP");
    }
  };

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  // This component is currently not used since we don't have OTP functionality in AuthContext
  // It's kept for future implementation
  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Verify Your Email</DialogTitle>
          <DialogDescription>
            We've sent a verification code to your email address.
            Please enter the 6-digit code below.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center py-6">
          <div className="bg-blue-50 text-blue-700 p-3 rounded-full mb-4">
            <Mail className="h-8 w-8" />
          </div>
          
          {user?.email && (
            <p className="text-center mb-6">
              Code sent to: <span className="font-medium">{user.email}</span>
            </p>
          )}

          <div className="w-full">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
            />
          </div>

          <div className="mt-4 text-sm text-center">
            {canResend ? (
              <Button 
                variant="link" 
                className="p-0 h-auto text-khrate-500"
                onClick={handleResendOTP}
                disabled={!canResend}
              >
                <RefreshCcw className="h-3 w-3 mr-1" />
                Resend Code
              </Button>
            ) : (
              <span className="text-muted-foreground">
                Code expires in {formatTime(countdown)}
              </span>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleVerify} 
            className="w-full sm:w-auto bg-khrate-500 hover:bg-khrate-600"
            disabled={otp.length !== 6 || isVerifying}
          >
            {isVerifying ? "Verifying..." : "Verify Email"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OTPVerificationModal;
