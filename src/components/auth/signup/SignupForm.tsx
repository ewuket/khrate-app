
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, Gift, User, Mail, Phone, Lock } from "lucide-react";

interface SignupFormProps {
  onSwitchToLogin: () => void;
  onSuccess: () => void;
}

const SignupForm = ({ onSwitchToLogin, onSuccess }: SignupFormProps) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signUp, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return;
    }
    
    const result = await signUp(formData.email, formData.password, formData.fullName);
    if (result && !result.error) {
      onSuccess();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Discount Banner */}
      <div className="bg-gradient-to-r from-green-50 to-khrate-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-green-700 mb-2">
          <Gift className="h-5 w-5" />
          <p className="font-bold text-green-700">
            🎉 Get 10% discount on your first 3 orders!
          </p>
        </div>
        <p className="text-sm text-green-600">
          Start saving on groceries immediately after creating your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-gray-700 font-medium">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              className="pl-10 py-3 bg-white border-gray-300 focus:border-khrate-500 focus:ring-khrate-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email address"
              className="pl-10 py-3 bg-white border-gray-300 focus:border-khrate-500 focus:ring-khrate-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber" className="text-gray-700 font-medium">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="pl-10 py-3 bg-white border-gray-300 focus:border-khrate-500 focus:ring-khrate-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a strong password"
              className="pl-10 pr-10 py-3 bg-white border-gray-300 focus:border-khrate-500 focus:ring-khrate-500"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              className="pl-10 pr-10 py-3 bg-white border-gray-300 focus:border-khrate-500 focus:ring-khrate-500"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </Button>
          </div>
        </div>

        {formData.password !== formData.confirmPassword && formData.confirmPassword && (
          <p className="text-sm text-red-600">Passwords do not match</p>
        )}

        <Button 
          type="submit" 
          className="w-full bg-khrate-500 hover:bg-khrate-600 text-white py-3 text-lg font-semibold"
          disabled={loading || formData.password !== formData.confirmPassword}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-khrate-500 hover:text-khrate-600 font-semibold hover:underline"
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
