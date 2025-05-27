
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

const SignupForm: React.FC = () => {
  const { signUp, closeAuthModal } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await signUp(email, password, fullName);
      if (data && !error) {
        closeAuthModal();
      }
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-name">Full Name</Label>
        <Input 
          id="signup-name" 
          placeholder="John Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)} 
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input 
          id="signup-email" 
          type="email" 
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <Input 
          id="signup-password" 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}  
          required
          minLength={6}
        />
      </div>
      <Button 
        type="submit" 
        className="w-full bg-khrate-500 hover:bg-khrate-600"
        disabled={loading}
      >
        {loading ? "Creating Account..." : "Create Account"}
      </Button>
      
      <div className="text-center text-sm text-muted-foreground mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
        <p className="font-medium text-green-800">🎉 Welcome Bonus!</p>
        <p className="text-green-700">Get 10% off your first 3 orders when you create an account</p>
      </div>
    </form>
  );
};

export default SignupForm;
