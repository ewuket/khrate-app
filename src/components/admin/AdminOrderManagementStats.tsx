
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderSourceStats } from "@/types/admin";
import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react";

interface AdminOrderManagementStatsProps {
  orderStats: OrderSourceStats;
  loading: boolean;
  onStatsClick?: (type: 'bundle' | 'custom' | 'group' | 'daily') => void;
}

const AdminOrderManagementStats = ({ 
  orderStats, 
  loading,
  onStatsClick 
}: AdminOrderManagementStatsProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card 
        className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => onStatsClick?.('bundle')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-800">Bundle Orders</CardTitle>
          <Package className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900">{orderStats.bundle_orders}</div>
          <p className="text-xs text-blue-600">
            {orderStats.bundle_revenue.toLocaleString()} RWF Revenue
          </p>
        </CardContent>
      </Card>

      <Card 
        className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => onStatsClick?.('custom')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-800">Custom Orders</CardTitle>
          <ShoppingCart className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900">{orderStats.custom_orders}</div>
          <p className="text-xs text-green-600">
            {orderStats.custom_revenue.toLocaleString()} RWF Revenue
          </p>
        </CardContent>
      </Card>

      <Card 
        className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => onStatsClick?.('group')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-800">Group Orders</CardTitle>
          <Users className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900">{orderStats.group_orders}</div>
          <p className="text-xs text-purple-600">
            {orderStats.group_revenue.toLocaleString()} RWF Revenue
          </p>
        </CardContent>
      </Card>

      <Card 
        className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => onStatsClick?.('daily')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-orange-800">Daily Tracking</CardTitle>
          <TrendingUp className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-900">
            {orderStats.bundle_orders + orderStats.custom_orders + orderStats.group_orders}
          </div>
          <p className="text-xs text-orange-600">Total Orders Today</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrderManagementStats;
