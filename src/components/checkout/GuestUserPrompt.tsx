
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface GuestUserPromptProps {
  onSignInClick: () => void;
}

const GuestUserPrompt = ({ onSignInClick }: GuestUserPromptProps) => {
  return (
    <Alert variant="default" className="bg-blue-50 border-blue-200">
      <AlertTitle className="flex items-center">
        Continue as guest or create an account
      </AlertTitle>
      <AlertDescription>
        Create an account to track your orders and get exclusive discounts.
      </AlertDescription>
      <Button
        variant="outline"
        className="mt-2 border-blue-300 text-blue-700 hover:bg-blue-100"
        onClick={onSignInClick}
      >
        Sign up / Login
      </Button>
    </Alert>
  );
};

export default GuestUserPrompt;
