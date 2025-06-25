
import React from 'react';
import { Button } from "@/components/ui/button";
import { Package, Plus } from "lucide-react";

interface AdminBundleEmptyStateProps {
  onCreateBundle: () => void;
}

const AdminBundleEmptyState: React.FC<AdminBundleEmptyStateProps> = ({
  onCreateBundle
}) => {
  return (
    <div className="text-center py-12">
      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-500 mb-4">No bundles found</p>
      <Button 
        onClick={onCreateBundle} 
        className="bg-khrate-500 hover:bg-khrate-600"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Your First Bundle
      </Button>
    </div>
  );
};

export default AdminBundleEmptyState;
