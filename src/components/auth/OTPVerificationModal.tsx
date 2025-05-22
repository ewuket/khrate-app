
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
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, RefreshCcw } from "lucide-react";

const OTPVerificationModal: React.FC = () => {
  const {
    isOTPModalOpen,
    closeOTPModal,
    pendingEmail,
    otpSent,
    sendOTP,
    verifyOTP,
    isVerifyingOTP
  } = useAuth();

  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Handle countdown for OTP resend
  useEffect(() => {
    if (!otpSent || countdown <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [otpSent, countdown]);

  // Reset OTP when modal is closed
  useEffect(() => {
    if (!isOTPModalOpen) {
      setOtp("");
    }
  }, [isOTPModalOpen]);

  const handleResendOTP = async () => {
    if (pendingEmail && canResend) {
      await sendOTP(pendingEmail);
      setCountdown(60);
      setCanResend(false);
    }
  };

  const handleVerify = async () => {
    if (otp.length === 6) {
      const success = await verifyOTP(otp);
      if (success) {
        setOtp("");
      }
    } else {
      toast.error("Please enter a valid 6-digit OTP");
    }
  };

  return (
    <Dialog open={isOTPModalOpen} onOpenChange={closeOTPModal}>
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
          
          {pendingEmail && (
            <p className="text-center mb-6">
              Code sent to: <span className="font-medium">{pendingEmail}</span>
            </p>
          )}

          <div className="w-full">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
              render={({ slots }) => (
                <InputOTPGroup>
                  {slots.map((slot, index) => (
                    <InputOTPSlot key={index} {...slot} index={index} />
                  ))}
                </InputOTPGroup>
              )}
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
                Resend code in {countdown} seconds
              </span>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={closeOTPModal}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleVerify} 
            className="w-full sm:w-auto bg-khrate-500 hover:bg-khrate-600"
            disabled={otp.length !== 6 || isVerifyingOTP}
          >
            {isVerifyingOTP ? "Verifying..." : "Verify Email"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OTPVerificationModal;
