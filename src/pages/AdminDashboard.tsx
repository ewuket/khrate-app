
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AdminDashboard from "@/components/admin/AdminDashboard";

const AdminDashboardPage = () => {
  const { user, isAuthenticated } = useAuth();

  // For demo purposes, allow any authenticated user to access admin
  // In production, you should check user role from database
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <AdminDashboard />;
};

export default AdminDashboardPage;
