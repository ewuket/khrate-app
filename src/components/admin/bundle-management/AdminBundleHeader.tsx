
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";

interface AdminBundleHeaderProps {
  onCreateBundle: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const AdminBundleHeader: React.FC<AdminBundleHeaderProps> = ({
  onCreateBundle,
  onRefresh,
  isRefreshing
}) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold">Bundle Management</h2>
        <p className="text-gray-600">Manage your product bundles</p>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={onRefresh}
          variant="outline"
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <Button
          onClick={onCreateBundle}
          className="bg-khrate-500 hover:bg-khrate-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Bundle
        </Button>
      </div>
    </div>
  );
};

export default AdminBundleHeader;
