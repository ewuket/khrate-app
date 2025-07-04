
import React from 'react';
import { AdminBundle } from "@/hooks/useAdminBundles";
import AdminBundleCard from "../AdminBundleCard";

interface AdminBundleGridProps {
  bundles: AdminBundle[];
  onEdit: (bundle: AdminBundle) => void;
  onDelete: (bundleId: number) => void;
  onToggleActive: (bundleId: number, isActive: boolean) => void;
  onToggleFeatured: (bundleId: number, isFeatured: boolean) => void;
}

const AdminBundleGrid: React.FC<AdminBundleGridProps> = ({
  bundles,
  onEdit,
  onDelete,
  onToggleActive,
  onToggleFeatured
}) => {
  // Show ALL bundles (active and inactive) in admin view
  console.log('🔍 Rendering admin bundle grid with bundles:', bundles.length);
  console.log('📊 Bundle status breakdown:', {
    active: bundles.filter(b => b.is_active).length,
    inactive: bundles.filter(b => !b.is_active).length,
    featured: bundles.filter(b => b.is_featured).length
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bundles.map((bundle) => (
        <AdminBundleCard
          key={bundle.id}
          bundle={bundle}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleActive={onToggleActive}
          onToggleFeatured={onToggleFeatured}
        />
      ))}
    </div>
  );
};

export default AdminBundleGrid;
