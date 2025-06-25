
import React, { useState } from 'react';
import { useAdminBundles, useCreateBundle, useUpdateBundle, useDeleteBundle, AdminBundle } from "@/hooks/useAdminBundles";
import AdminBundleForm from "./AdminBundleForm";
import AdminBundleHeader from "./bundle-management/AdminBundleHeader";
import AdminBundleGrid from "./bundle-management/AdminBundleGrid";
import AdminBundleEmptyState from "./bundle-management/AdminBundleEmptyState";
import AdminBundleLoadingState from "./bundle-management/AdminBundleLoadingState";

const AdminBundleManagement: React.FC = () => {
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

  const handleRefresh = () => {
    refetch();
  };

  const handleCreateBundleClick = () => {
    setShowForm(true);
  };

  if (isLoading) {
    return <AdminBundleLoadingState />;
  }

  return (
    <div className="space-y-6">
      <AdminBundleHeader
        onCreateBundle={handleCreateBundleClick}
        onRefresh={handleRefresh}
        isRefreshing={isFetching}
      />

      {!bundles || bundles.length === 0 ? (
        <AdminBundleEmptyState onCreateBundle={handleCreateBundleClick} />
      ) : (
        <AdminBundleGrid
          bundles={bundles}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
          onToggleFeatured={handleToggleFeatured}
        />
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

export default AdminBundleManagement;
