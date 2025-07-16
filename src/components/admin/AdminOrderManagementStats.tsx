
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Package, Users, ShoppingCart, Calendar } from "lucide-react";
import { OrderSourceStats } from "@/types/admin";
import AdminDailyStatsModal from "./AdminDailyStatsModal";
import { useAdminDailyStats } from "@/hooks/useAdminDailyStats";

interface AdminOrderManagementStatsProps {
  orderStats: OrderSourceStats;
  loading: boolean;
  onStatsClick: (type: 'bundle' | 'custom' | 'group' | 'daily') => void;
}

const AdminOrderManagementStats = ({ 
  orderStats, 
  loading,
  onStatsClick 
}: AdminOrderManagementStatsProps) => {
  const [dailyStatsOpen, setDailyStatsOpen] = useState(false);
  const { data: dailyStats } = useAdminDailyStats();

  const handleDailyStatsClick = () => {
    setDailyStatsOpen(true);
    onStatsClick('daily');
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onStatsClick('bundle')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bundle Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : orderStats.bundle_orders}</div>
            <p className="text-xs text-muted-foreground">
              Revenue: {loading ? '...' : `${Number(orderStats.bundle_revenue).toLocaleString()} RWF`}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onStatsClick('custom')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custom Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : orderStats.custom_orders}</div>
            <p className="text-xs text-muted-foreground">
              Revenue: {loading ? '...' : `${Number(orderStats.custom_revenue).toLocaleString()} RWF`}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onStatsClick('group')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Group Orders</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : orderStats.group_orders}</div>
            <p className="text-xs text-muted-foreground">
              Revenue: {loading ? '...' : `${Number(orderStats.group_revenue).toLocaleString()} RWF`}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={handleDailyStatsClick}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Tracking</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : dailyStats?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Days with orders (Click to view)
            </p>
          </CardContent>
        </Card>
      </div>

      <AdminDailyStatsModal
        open={dailyStatsOpen}
        onOpenChange={setDailyStatsOpen}
        dailyStats={dailyStats}
      />
    </>
  );
};

export default AdminOrderManagementStats;
