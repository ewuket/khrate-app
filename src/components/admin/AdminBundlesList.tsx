import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, Package } from "lucide-react";
import { useAdminBundles, AdminBundle, BundleFormData } from "@/hooks/useAdminBundles";
import AdminBundleCard from "./AdminBundleCard";
import AdminBundleForm from "./AdminBundleForm";

const AdminBundlesList = () => {
  const { 
    bundles, 
    isLoading, 
    fetchBundles, 
    createBundle, 
    updateBundle, 
    deleteBundle 
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
      await updateBundle(bundleData);
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
      await updateBundle({ id: bundleId, is_active: !isActive });
    } catch (error) {
      console.error('Error toggling bundle status:', error);
    }
  };

  const handleToggleFeatured = async (bundleId: number, isFeatured: boolean) => {
    try {
      await updateBundle({ id: bundleId, is_featured: !isFeatured });
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
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
            onClick={() => fetchBundles()}
            variant="outline"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
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
