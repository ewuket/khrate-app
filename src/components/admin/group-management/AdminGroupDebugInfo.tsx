
import React from 'react';
import { AdminGroupSession } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Users, RefreshCw } from "lucide-react";

interface AdminGroupDebugInfoProps {
  groups: AdminGroupSession[];
  isLoading: boolean;
  error?: any;
  onRefresh: () => void;
}

const AdminGroupDebugInfo: React.FC<AdminGroupDebugInfoProps> = ({
  groups,
  isLoading,
  error,
  onRefresh
}) => {
  const stats = {
    total: groups?.length || 0,
    active: groups?.filter(g => g.status === 'active').length || 0,
    inactive: groups?.filter(g => g.status === 'inactive').length || 0,
    completed: groups?.filter(g => g.status === 'completed').length || 0,
    featured: groups?.filter(g => g.is_featured).length || 0,
    public: groups?.filter(g => g.is_public).length || 0
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Group Management Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Groups</div>
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
            <div className="text-2xl font-bold text-gray-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.featured}</div>
            <div className="text-sm text-gray-600">Featured</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.public}</div>
            <div className="text-sm text-gray-600">Public</div>
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
          <p><strong>Admin View:</strong> You can see ALL groups (active, inactive, completed)</p>
          <p><strong>User View:</strong> Users only see active public groups</p>
          <p><strong>Status:</strong> {isLoading ? 'Loading...' : 'Ready'}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminGroupDebugInfo;
