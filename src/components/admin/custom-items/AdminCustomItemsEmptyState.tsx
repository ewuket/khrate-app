
import React from 'react';
import { Button } from "@/components/ui/button";
import { Package, Plus } from "lucide-react";

interface AdminCustomItemsEmptyStateProps {
  onCreateItem: () => void;
}

const AdminCustomItemsEmptyState: React.FC<AdminCustomItemsEmptyStateProps> = ({
  onCreateItem
}) => {
  return (
    <div className="text-center py-12">
      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-500 mb-4">No custom buy items found</p>
      <Button 
        onClick={onCreateItem} 
        className="bg-khrate-500 hover:bg-khrate-600"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Your First Item
      </Button>
    </div>
  );
};

export default AdminCustomItemsEmptyState;
