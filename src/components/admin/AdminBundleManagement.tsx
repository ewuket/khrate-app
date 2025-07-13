
import React, { useState } from 'react';
import { useAdminBundles, AdminBundle, BundleFormData } from "@/hooks/useAdminBundles";
import { useAdminOperations } from "@/hooks/useAdminOperations";
import AdminBundleForm from "./AdminBundleForm";
import AdminBundleHeader from "./bundle-management/AdminBundleHeader";
import AdminBundleGrid from "./bundle-management/AdminBundleGrid";
import AdminBundleEmptyState from "./bundle-management/AdminBundleEmptyState";
import AdminBundleLoadingState from "./bundle-management/AdminBundleLoadingState";
import AdminBundleDebugInfo from "./bundle-management/AdminBundleDebugInfo";

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
    isDeleting,
    error
  } = useAdminBundles();
  
  const { toggleBundleFeatured, toggleBundleActive } = useAdminOperations();
  
  const [showForm, setShowForm] = useState(false);
  const [editingBundle, setEditingBundle] = useState<AdminBundle | null>(null);

  const handleCreateBundle = async (bundleData: BundleFormData) => {
    try {
      console.log('Creating bundle with data:', bundleData);
      await createBundle(bundleData);
      setShowForm(false);
      // Force refresh after creation
      setTimeout(() => {
        fetchBundles();
      }, 1000);
    } catch (error) {
      console.error('Error creating bundle:', error);
    }
  };

  const handleUpdateBundle = async (bundleData: Partial<BundleFormData> & { id: number }) => {
    try {
      console.log('Updating bundle with data:', bundleData);
      await updateBundle(bundleData);
      setShowForm(false);
      setEditingBundle(null);
      // Force refresh after update
      setTimeout(() => {
        fetchBundles();
      }, 1000);
    } catch (error) {
      console.error('Error updating bundle:', error);
    }
  };

  const handleEdit = (bundle: AdminBundle) => {
    console.log('Editing bundle:', bundle);
    setEditingBundle(bundle);
    setShowForm(true);
  };

  const handleDelete = async (bundleId: number) => {
    if (confirm('Are you sure you want to delete this bundle?')) {
      try {
        await deleteBundle(bundleId);
        // Force refresh after deletion
        setTimeout(() => {
          fetchBundles();
        }, 1000);
      } catch (error) {
        console.error('Error deleting bundle:', error);
      }
    }
  };

  const handleToggleActive = async (bundleId: number, isActive: boolean) => {
    try {
      console.log('Toggling bundle active status:', bundleId, 'from', isActive, 'to', !isActive);
      await toggleBundleActive(bundleId, isActive);
      // Force refresh after toggle
      setTimeout(() => {
        fetchBundles();
      }, 1000);
    } catch (error) {
      console.error('Error toggling bundle status:', error);
    }
  };

  const handleToggleFeatured = async (bundleId: number, isFeatured: boolean) => {
    try {
      console.log('Toggling bundle featured status:', bundleId, 'from', isFeatured, 'to', !isFeatured);
      await toggleBundleFeatured(bundleId, isFeatured);
      // Force refresh after toggle
      setTimeout(() => {
        fetchBundles();
      }, 1000);
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBundle(null);
  };

  const handleRefresh = () => {
    console.log('Refreshing bundles...');
    fetchBundles();
  };

  const handleCreateBundleClick = () => {
    setEditingBundle(null);
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

      {/* Debug Information */}
      <AdminBundleDebugInfo
        bundles={bundles}
        isLoading={isLoading}
        error={error}
        onRefresh={handleRefresh}
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
