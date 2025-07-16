
import { Navigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import AdminDashboard from "@/components/admin/AdminDashboard";

const AdminDashboardPage = () => {
  const { adminUser } = useAdmin();

  // Temporarily bypass authentication for immediate access
  // TODO: Re-enable authentication later
  // if (!adminUser) {
  //   return <Navigate to="/admin/login" replace />;
  // }

  return <AdminDashboard />;
};

export default AdminDashboardPage;
