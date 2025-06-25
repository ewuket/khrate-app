
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { AdminBundle } from "@/hooks/useAdminBundles";

interface AdminBundleFormProps {
  bundle?: AdminBundle | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bundleData: any) => void;
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
    price: '',
    original_price: '',
    image_url: '',
    is_active: true,
    is_featured: false
  });

  useEffect(() => {
    if (bundle) {
      setFormData({
        title: bundle.title,
        description: bundle.description || '',
        price: bundle.price.toString(),
        original_price: bundle.original_price?.toString() || '',
        image_url: bundle.image_url || '',
        is_active: bundle.is_active,
        is_featured: bundle.is_featured
      });
    } else {
      setFormData({
        title: '',
        description: '',
        price: '',
        original_price: '',
        image_url: '',
        is_active: true,
        is_featured: false
      });
    }
  }, [bundle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const bundleData = {
      ...formData,
      price: parseFloat(formData.price),
      original_price: formData.original_price ? parseFloat(formData.original_price) : null,
      description: formData.description || null,
      image_url: formData.image_url || null
    };

    if (bundle) {
      bundleData.id = bundle.id;
    }

    onSubmit(bundleData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {bundle ? 'Edit Bundle' : 'Create New Bundle'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Bundle title"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="price">Price (RWF) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="0"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="original_price">Original Price (RWF)</Label>
              <Input
                id="original_price"
                type="number"
                value={formData.original_price}
                onChange={(e) => setFormData(prev => ({ ...prev, original_price: e.target.value }))}
                placeholder="0"
              />
            </div>
            
            <div>
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Bundle description"
              rows={3}
            />
          </div>

          <div className="flex gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
              />
              <Label htmlFor="is_featured">Featured</Label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-khrate-500 hover:bg-khrate-600">
              {bundle ? 'Update Bundle' : 'Create Bundle'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminBundleForm;
