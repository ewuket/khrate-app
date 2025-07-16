
import React from 'react';
import { AdminCustomItem } from "@/hooks/useAdminCustomItemsQuery";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Package, RefreshCw } from "lucide-react";

interface AdminCustomItemsDebugInfoProps {
  items: AdminCustomItem[];
  isLoading: boolean;
  error?: any;
  onRefresh: () => void;
}

const AdminCustomItemsDebugInfo: React.FC<AdminCustomItemsDebugInfoProps> = ({
  items,
  isLoading,
  error,
  onRefresh
}) => {
  const stats = {
    total: items?.length || 0,
    active: items?.filter(item => item.is_active).length || 0,
    inactive: items?.filter(item => !item.is_active).length || 0,
    lowStock: items?.filter(item => item.stock_quantity <= 5).length || 0
  };

  const categories = [...new Set(items?.map(item => item.category) || [])];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Custom Items Management Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Items</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
            <div className="text-sm text-gray-600">Inactive</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.lowStock}</div>
            <div className="text-sm text-gray-600">Low Stock</div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-700">Error: {error.message || 'Unknown error occurred'}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="ml-auto"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Retry
            </Button>
          </div>
        )}

        <div className="space-y-2">
          <div className="text-sm text-gray-600">
            <p><strong>Categories:</strong> {categories.length > 0 ? categories.join(', ') : 'None'}</p>
            <p><strong>Admin View:</strong> You can see ALL items (active and inactive)</p>
            <p><strong>User View:</strong> Users only see active items</p>
            <p><strong>Status:</strong> {isLoading ? 'Loading...' : 'Ready'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminCustomItemsDebugInfo;
