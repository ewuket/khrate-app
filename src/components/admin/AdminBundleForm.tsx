
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AdminBundle } from "@/hooks/useAdminBundles";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminBundleFormHeader from "./bundle-form/AdminBundleFormHeader";
import AdminBundleBasicFields from "./bundle-form/AdminBundleBasicFields";
import AdminBundleItemsSection from "./bundle-form/AdminBundleItemsSection";
import AdminBundleFormSettings from "./bundle-form/AdminBundleFormSettings";
import AdminBundleFormActions from "./bundle-form/AdminBundleFormActions";
import { toast } from "sonner";

interface AdminBundleFormProps {
  bundle?: AdminBundle | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

interface BundleItem {
  item_name: string;
  quantity: number;
  unit: string;
}

const AdminBundleForm: React.FC<AdminBundleFormProps> = ({
  bundle,
  isOpen,
  onClose,
  onSubmit
}) => {
  const { isAdmin, isLoading, currentUser } = useAdminAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    original_price: 0,
    image_url: '',
    is_active: true,
    is_featured: false
  });

  const [items, setItems] = useState<BundleItem[]>([
    { item_name: '', quantity: 1, unit: 'pieces' }
  ]);

  useEffect(() => {
    if (bundle) {
      setFormData({
        title: bundle.title,
        description: bundle.description || '',
        price: bundle.price,
        original_price: bundle.original_price || bundle.price,
        image_url: bundle.image_url || '',
        is_active: bundle.is_active,
        is_featured: bundle.is_featured
      });
      
      const bundleItems = bundle.bundle_items || bundle.items || [];
      setItems(bundleItems.length > 0 ? bundleItems.map(item => ({
        item_name: item.item_name,
        quantity: item.quantity,
        unit: item.unit || 'pieces'
      })) : [{ item_name: '', quantity: 1, unit: 'pieces' }]);
    } else {
      setFormData({
        title: '',
        description: '',
        price: 0,
        original_price: 0,
        image_url: '',
        is_active: true,
        is_featured: false
      });
      setItems([{ item_name: '', quantity: 1, unit: 'pieces' }]);
    }
  }, [bundle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAdmin) {
      toast.error('Admin access required to create bundles');
      return;
    }

    if (!currentUser) {
      toast.error('Please log in as admin to create bundles');
      return;
    }

    console.log('🔄 Admin user creating bundle:', {
      user: currentUser.email,
      isAdmin,
      formData
    });
    
    const submitData: any = {
      ...formData,
      bundle_items: items.filter(item => item.item_name.trim() !== '')
    };

    if (bundle) {
      submitData.id = bundle.id;
    }

    console.log('Submitting bundle data:', submitData);
    onSubmit(submitData);
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2">Checking admin access...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!isAdmin) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <div className="text-center p-8">
            <h3 className="text-lg font-semibold text-red-600 mb-2">Access Denied</h3>
            <p className="text-gray-600">Admin access required to manage bundles.</p>
            <p className="text-sm text-gray-500 mt-2">Current user: {currentUser?.email || 'Not logged in'}</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <AdminBundleFormHeader bundle={bundle} />

        <form onSubmit={handleSubmit} className="space-y-6">
          <AdminBundleBasicFields 
            formData={formData} 
            setFormData={setFormData} 
          />

          <AdminBundleItemsSection 
            items={items} 
            setItems={setItems} 
          />

          <AdminBundleFormSettings 
            formData={formData} 
            setFormData={setFormData} 
          />

          <AdminBundleFormActions 
            bundle={bundle} 
            onClose={onClose} 
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminBundleForm;
