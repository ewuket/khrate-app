
import React from 'react';
import { AdminBundle } from "@/hooks/useAdminBundles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Database, RefreshCw } from "lucide-react";

interface AdminBundleDebugInfoProps {
  bundles: AdminBundle[];
  isLoading: boolean;
  error?: any;
  onRefresh: () => void;
}

const AdminBundleDebugInfo: React.FC<AdminBundleDebugInfoProps> = ({
  bundles,
  isLoading,
  error,
  onRefresh
}) => {
  const stats = {
    total: bundles?.length || 0,
    active: bundles?.filter(b => b.is_active).length || 0,
    inactive: bundles?.filter(b => !b.is_active).length || 0,
    featured: bundles?.filter(b => b.is_featured).length || 0
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Bundle Management Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Bundles</div>
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
            <div className="text-2xl font-bold text-purple-600">{stats.featured}</div>
            <div className="text-sm text-gray-600">Featured</div>
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

        <div className="text-sm text-gray-600">
          <p><strong>Admin View:</strong> You can see ALL bundles (active and inactive)</p>
          <p><strong>User View:</strong> Users only see active bundles</p>
          <p><strong>Status:</strong> {isLoading ? 'Loading...' : 'Ready'}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminBundleDebugInfo;
