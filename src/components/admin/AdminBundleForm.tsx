
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AdminBundle } from "@/hooks/useAdminBundles";
import AdminBundleFormHeader from "./bundle-form/AdminBundleFormHeader";
import AdminBundleBasicFields from "./bundle-form/AdminBundleBasicFields";
import AdminBundleItemsSection from "./bundle-form/AdminBundleItemsSection";
import AdminBundleFormSettings from "./bundle-form/AdminBundleFormSettings";
import AdminBundleFormActions from "./bundle-form/AdminBundleFormActions";

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
