
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, AlertCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminDashboardPage = () => {
  const { adminUser, loading, checkAdminStatus } = useAdmin();

  useEffect(() => {
    console.log('🎯 AdminDashboardPage mounted, checking auth status...');
    if (!adminUser && !loading) {
      checkAdminStatus?.();
    }
  }, [adminUser, loading, checkAdminStatus]);

  console.log('🔍 AdminDashboardPage render state:', { 
    hasAdminUser: !!adminUser, 
    loading, 
    userEmail: adminUser?.email 
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-khrate-500 mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Verifying Admin Access</h2>
            <p className="text-sm text-gray-600 text-center">
              Checking your admin credentials and permissions...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!adminUser) {
    console.log('❌ No admin user, redirecting to login');
    return <Navigate to="/admin/login" replace />;
  }

  // Success state with admin info
  console.log('✅ Admin user verified, rendering dashboard');
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Status Bar */}
      <div className="bg-khrate-600 text-white px-6 py-2 text-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          <span>Admin Dashboard - Logged in as: {adminUser.email}</span>
        </div>
        <div className="text-khrate-100">
          Last Login: {new Date(adminUser.last_login || adminUser.created_at).toLocaleString()}
        </div>
      </div>
      
      <AdminDashboard />
    </div>
  );
};

export default AdminDashboardPage;
