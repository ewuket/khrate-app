
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Lock, AlertCircle } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";

const AdminLogin = () => {
  const { adminUser, loginAsAdmin, loading } = useAdmin();
  const [email, setEmail] = useState("bamulneg@gmail.com");
  const [password, setPassword] = useState("Khrate@2025");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Redirect if already logged in
  if (adminUser && !loading) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    
    try {
      console.log('🔄 Admin login form submitted for:', email);
      const success = await loginAsAdmin(email, password);
      
      if (success) {
        console.log('✅ Admin login successful, redirecting...');
        navigate('/admin/dashboard', { replace: true });
      } else {
        setError("Invalid credentials or insufficient privileges");
      }
    } catch (error: any) {
      console.error('❌ Login form error:', error);
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = loading || isSubmitting;

  return (
    <div className="min-h-screen bg-gradient-to-br from-khrate-500 to-khrate-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 bg-khrate-100 rounded-full flex items-center justify-center">
            <Shield className="h-6 w-6 text-khrate-600" />
          </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Access the Khrate administration dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@khrate.com"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-khrate-500 hover:bg-khrate-600"
              disabled={isLoading}
            >
              <Lock className="mr-2 h-4 w-4" />
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          
          <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded text-sm">
            <p className="font-medium text-green-800">Admin Credentials:</p>
            <p className="text-green-700">Email: bamulneg@gmail.com</p>
            <p className="text-green-700">Password: Khrate@2025</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
