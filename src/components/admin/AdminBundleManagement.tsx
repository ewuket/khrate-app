
import React, { useState } from 'react';
import { useAdminBundles, AdminBundle, BundleFormData } from "@/hooks/useAdminBundles";
import AdminBundleForm from "./AdminBundleForm";
import AdminBundleHeader from "./bundle-management/AdminBundleHeader";
import AdminBundleGrid from "./bundle-management/AdminBundleGrid";
import AdminBundleEmptyState from "./bundle-management/AdminBundleEmptyState";
import AdminBundleLoadingState from "./bundle-management/AdminBundleLoadingState";

const AdminBundleManagement: React.FC = () => {
  const { 
    bundles, 
    isLoading, 
    fetchBundles, 
    createBundle, 
    updateBundle, 
    deleteBundle,
    isCreating,
    isUpdating,
    isDeleting
  } = useAdminBundles();
  
  const [showForm, setShowForm] = useState(false);
  const [editingBundle, setEditingBundle] = useState<AdminBundle | null>(null);

  const handleCreateBundle = async (bundleData: BundleFormData) => {
    try {
      await createBundle(bundleData);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating bundle:', error);
    }
  };

  const handleUpdateBundle = async (bundleData: Partial<BundleFormData> & { id: number }) => {
    try {
      const { id, ...updateData } = bundleData;
      await updateBundle(id, updateData);
      setShowForm(false);
      setEditingBundle(null);
    } catch (error) {
      console.error('Error updating bundle:', error);
    }
  };

  const handleEdit = (bundle: AdminBundle) => {
    setEditingBundle(bundle);
    setShowForm(true);
  };

  const handleDelete = async (bundleId: number) => {
    if (confirm('Are you sure you want to delete this bundle?')) {
      try {
        await deleteBundle(bundleId);
      } catch (error) {
        console.error('Error deleting bundle:', error);
      }
    }
  };

  const handleToggleActive = async (bundleId: number, isActive: boolean) => {
    try {
      await updateBundle(bundleId, { is_active: !isActive });
    } catch (error) {
      console.error('Error toggling bundle status:', error);
    }
  };

  const handleToggleFeatured = async (bundleId: number, isFeatured: boolean) => {
    try {
      await updateBundle(bundleId, { is_featured: !isFeatured });
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBundle(null);
  };

  const handleRefresh = () => {
    fetchBundles();
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
        isRefreshing={isLoading}
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
