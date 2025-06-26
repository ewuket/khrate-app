
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";

interface AdminCustomItemsHeaderProps {
  onCreateItem: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const AdminCustomItemsHeader: React.FC<AdminCustomItemsHeaderProps> = ({
  onCreateItem,
  onRefresh,
  isRefreshing
}) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold">Custom Buy Items Management</h2>
        <p className="text-gray-600">Manage your custom buy products and inventory</p>
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
          onClick={onCreateItem}
          className="bg-khrate-500 hover:bg-khrate-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>
    </div>
  );
};

export default AdminCustomItemsHeader;
