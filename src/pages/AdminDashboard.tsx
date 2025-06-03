
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Package, 
  LogOut,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import { formatCurrency } from "@/lib/utils";

const AdminDashboard = () => {
  const { 
    adminUser, 
    orders, 
    groupSessions, 
    stats, 
    logoutAdmin,
    loadOrders,
    loadGroupSessions,
    updateOrderStatus,
    updatePaymentStatus
  } = useAdmin();

  // Redirect if not logged in
  if (!adminUser) {
    return <Navigate to="/admin/login" replace />;
  }

  useEffect(() => {
    // Load data on mount
    loadOrders();
    loadGroupSessions();
  }, []);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'confirmed':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return <CheckCircle className="h-3 w-3" />;
      case 'pending':
        return <Clock className="h-3 w-3" />;
      case 'cancelled':
        return <AlertTriangle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {adminUser.email}</p>
            </div>
            <Button variant="outline" onClick={logoutAdmin}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <ShoppingCart className="h-4 w-4 text-muted-foreground mr-2" />
                <span className="text-2xl font-bold">{stats?.total_orders || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                <span className="text-2xl font-bold">{stats?.pending_orders || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-2xl font-bold">{formatCurrency(stats?.total_revenue || 0)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-4 w-4 text-blue-500 mr-2" />
                <span className="text-2xl font-bold">{stats?.active_groups || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Package className="h-4 w-4 text-purple-500 mr-2" />
                <span className="text-2xl font-bold">{stats?.total_users || 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.slice(0, 10).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex-1">
                      <p className="font-medium">
                        {order.user_profile?.full_name || order.user_profile?.email || 'Guest'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(order.total_amount)} • {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusBadgeVariant(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{order.status}</span>
                      </Badge>
                      <Badge variant={getStatusBadgeVariant(order.payment_status)}>
                        {order.payment_status}
                      </Badge>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateOrderStatus(order.id, order.status === 'pending' ? 'confirmed' : 'delivered')}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updatePaymentStatus(order.id, order.payment_status === 'pending' ? 'completed' : 'pending')}
                        >
                          <DollarSign className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No orders found</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Group Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Group Sessions</CardTitle>
              <CardDescription>Active group buying sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {groupSessions.slice(0, 10).map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex-1">
                      <p className="font-medium">{session.name || 'Unnamed Group'}</p>
                      <p className="text-sm text-muted-foreground">
                        Code: {session.join_code} • {session.member_count} members
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(session.total_amount)} • {new Date(session.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusBadgeVariant(session.status)}>
                        {session.status}
                      </Badge>
                      <Badge variant={getStatusBadgeVariant(session.order_status)}>
                        {session.order_status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                {groupSessions.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No group sessions found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
