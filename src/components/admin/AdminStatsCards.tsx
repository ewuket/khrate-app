
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Package, 
  Clock
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { AdminStats } from "@/types/admin";

interface AdminStatsCardsProps {
  stats: AdminStats | null;
  loading?: boolean;
}

const AdminStatsCards = ({ stats, loading = false }: AdminStatsCardsProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {[...Array(5)].map((_, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="h-4 w-4 bg-gray-200 rounded mr-2 animate-pulse" />
                <span className="text-2xl font-bold bg-gray-200 rounded animate-pulse">--</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
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
  );
};

export default AdminStatsCards;
