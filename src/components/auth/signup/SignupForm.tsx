
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

const SignupForm: React.FC = () => {
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signup(email, name, password);
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
          value={name}
          onChange={(e) => setName(e.target.value)} 
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
        />
      </div>
      <Button 
        type="submit" 
        className="w-full bg-khrate-500 hover:bg-khrate-600"
        disabled={loading}
      >
        {loading ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
};

export default SignupForm;
