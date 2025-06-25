
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, Package } from "lucide-react";
import { useAdminBundles, useCreateBundle, useUpdateBundle, useDeleteBundle } from "@/hooks/useAdminBundles";
import AdminBundleCard from "./AdminBundleCard";
import AdminBundleForm from "./AdminBundleForm";
import { AdminBundle } from "@/hooks/useAdminBundles";

const AdminBundlesList = () => {
  const { data: bundles, isLoading, refetch, isFetching } = useAdminBundles();
  const createBundleMutation = useCreateBundle();
  const updateBundleMutation = useUpdateBundle();
  const deleteBundleMutation = useDeleteBundle();
  
  const [showForm, setShowForm] = useState(false);
  const [editingBundle, setEditingBundle] = useState<AdminBundle | null>(null);

  const handleCreateBundle = (bundleData: any) => {
    createBundleMutation.mutate(bundleData, {
      onSuccess: () => {
        setShowForm(false);
      }
    });
  };

  const handleUpdateBundle = (bundleData: any) => {
    updateBundleMutation.mutate(bundleData, {
      onSuccess: () => {
        setShowForm(false);
        setEditingBundle(null);
      }
    });
  };

  const handleEdit = (bundle: AdminBundle) => {
    setEditingBundle(bundle);
    setShowForm(true);
  };

  const handleDelete = (bundleId: number) => {
    if (confirm('Are you sure you want to delete this bundle?')) {
      deleteBundleMutation.mutate(bundleId);
    }
  };

  const handleToggleActive = (bundleId: number, isActive: boolean) => {
    updateBundleMutation.mutate({
      id: bundleId,
      is_active: !isActive
    });
  };

  const handleToggleFeatured = (bundleId: number, isFeatured: boolean) => {
    updateBundleMutation.mutate({
      id: bundleId,
      is_featured: !isFeatured
    });
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBundle(null);
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-khrate-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading bundles...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Bundle Management</h2>
          <p className="text-gray-600">Manage your product bundles</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => refetch()}
            variant="outline"
            disabled={isFetching}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-khrate-500 hover:bg-khrate-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Bundle
          </Button>
        </div>
      </div>

      {!bundles || bundles.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No bundles found</p>
          <Button 
            onClick={() => setShowForm(true)} 
            className="bg-khrate-500 hover:bg-khrate-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Bundle
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bundles.map((bundle) => (
            <AdminBundleCard
              key={bundle.id}
              bundle={bundle}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
              onToggleFeatured={handleToggleFeatured}
            />
          ))}
        </div>
      )}

      <AdminBundleForm
        bundle={editingBundle}
        isOpen={showForm}
        onClose={handleCloseForm}
        onSubmit={editingBundle ? handleUpdateBundle : handleCreateBundle}
      />
    </div>
  );
};

export default AdminBundlesList;
