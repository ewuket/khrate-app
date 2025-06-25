import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { AdminBundle } from "@/hooks/useAdminBundles";
import { X, Plus, Trash2 } from "lucide-react";

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
      setItems(bundle.items.length > 0 ? bundle.items.map(item => ({
        item_name: item.item_name,
        quantity: item.quantity,
        unit: item.unit
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
    
    const submitData = {
      ...formData,
      items: items.filter(item => item.item_name.trim() !== '')
    };

    // Add ID for updates
    if (bundle) {
      submitData.id = bundle.id;
    }

    onSubmit(submitData);
  };

  const addItem = () => {
    setItems([...items, { item_name: '', quantity: 1, unit: 'pieces' }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof BundleItem, value: string | number) => {
    const updatedItems = items.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setItems(updatedItems);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {bundle ? 'Edit Bundle' : 'Create New Bundle'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>

            <div>
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                placeholder="/placeholder.svg"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (RWF)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                required
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <Label htmlFor="original_price">Original Price (RWF)</Label>
              <Input
                id="original_price"
                type="number"
                value={formData.original_price}
                onChange={(e) => setFormData({...formData, original_price: parseFloat(e.target.value) || 0})}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Bundle Items</Label>
              <Button type="button" onClick={addItem} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>

            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 p-3 border rounded-md">
                <div className="col-span-5">
                  <Input
                    placeholder="Item name"
                    value={item.item_name}
                    onChange={(e) => updateItem(index, 'item_name', e.target.value)}
                    required
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    type="number"
                    placeholder="Quantity"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 1)}
                    min="0.1"
                    step="0.1"
                    required
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    placeholder="Unit"
                    value={item.unit}
                    onChange={(e) => updateItem(index, 'unit', e.target.value)}
                    required
                  />
                </div>
                <div className="col-span-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(index)}
                    disabled={items.length === 1}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData({...formData, is_featured: checked})}
              />
              <Label htmlFor="is_featured">Featured</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-khrate-500 hover:bg-khrate-600">
              {bundle ? 'Update Bundle' : 'Create Bundle'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminBundleForm;
