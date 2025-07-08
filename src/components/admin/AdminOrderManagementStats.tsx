
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface OrderSourceStats {
  bundle_orders: number;
  custom_orders: number;
  group_orders: number;
  bundle_revenue: number;
  custom_revenue: number;
  group_revenue: number;
}

interface AdminOrderManagementStatsProps {
  orderStats: OrderSourceStats;
  loading: boolean;
}

const AdminOrderManagementStats = ({ orderStats, loading }: AdminOrderManagementStatsProps) => {
  const totalOrders = orderStats.bundle_orders + orderStats.custom_orders + orderStats.group_orders;
  const totalRevenue = orderStats.bundle_revenue + orderStats.custom_revenue + orderStats.group_revenue;

  const statsCards = [
    {
      title: "Bundle Orders",
      value: orderStats.bundle_orders,
      revenue: orderStats.bundle_revenue,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Custom Orders",
      value: orderStats.custom_orders,
      revenue: orderStats.custom_revenue,
      icon: ShoppingCart,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Group Orders",
      value: orderStats.group_orders,
      revenue: orderStats.group_revenue,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Total Revenue",
      value: totalRevenue,
      revenue: 0,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      isRevenue: true,
    },
  ];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order Management Statistics</CardTitle>
          <CardDescription>Loading order statistics...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-24 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Management Statistics</CardTitle>
        <CardDescription>
          Breakdown of orders by source • Total: {totalOrders} orders
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className={`p-4 rounded-lg border ${stat.bgColor} transition-all hover:shadow-md`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.isRevenue ? formatCurrency(stat.value) : stat.value}
                    </p>
                    {!stat.isRevenue && stat.revenue > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Revenue: {formatCurrency(stat.revenue)}
                      </p>
                    )}
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                {!stat.isRevenue && totalOrders > 0 && (
                  <div className="mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {Math.round((stat.value / totalOrders) * 100)}% of total
                    </Badge>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminOrderManagementStats;
