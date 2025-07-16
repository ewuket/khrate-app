import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminCustomItem } from "@/hooks/useAdminCustomItemsQuery";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { toast } from "sonner";

interface AdminCustomItemFormProps {
  item?: AdminCustomItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

const AdminCustomItemForm: React.FC<AdminCustomItemFormProps> = ({
  item,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false
}) => {
  const { isAdmin, isLoading: authLoading, currentUser } = useAdminAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    unit: '',
    category: '',
    stock_quantity: '',
    image_url: '',
    is_active: true
  });

  const categories = [
    'Vegetables',
    'Fruits', 
    'Grains',
    'Dairy',
    'Meat',
    'Beverages',
    'Spices',
    'Other'
  ];

  const units = [
    'kg',
    'pieces',
    'liters',
    'grams',
    'pounds'
  ];

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description || '',
        price: item.price.toString(),
        unit: item.unit,
        category: item.category,
        stock_quantity: item.stock_quantity?.toString() || '0',
        image_url: item.image_url || '',
        is_active: item.is_active
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        unit: '',
        category: '',
        stock_quantity: '',
        image_url: '',
        is_active: true
      });
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAdmin) {
      toast.error('Admin access required to manage items');
      return;
    }

    if (!currentUser) {
      toast.error('Please log in as admin to manage items');
      return;
    }

    // Validate required fields
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    if (!formData.unit.trim()) {
      toast.error('Unit is required');
      return;
    }

    if (!formData.category.trim()) {
      toast.error('Category is required');
      return;
    }

    if (!formData.price || isNaN(Number(formData.price))) {
      toast.error('Valid price is required');
      return;
    }

    console.log('🔄 Admin user creating/updating custom item:', {
      user: currentUser.email,
      isAdmin,
      formData
    });

    const submitData: any = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      unit: formData.unit,
      category: formData.category,
      stock_quantity: Number(formData.stock_quantity) || 0,
      image_url: formData.image_url || '/placeholder.svg',
      is_active: formData.is_active
    };

    if (item?.id) {
      submitData.id = item.id;
    }

    console.log('Submitting custom item data:', submitData);
    onSubmit(submitData);
  };

  if (authLoading) {
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
            <p className="text-gray-600">Admin access required to manage custom items.</p>
            <p className="text-sm text-gray-500 mt-2">Current user: {currentUser?.email || 'Not logged in'}</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {item ? 'Edit Custom Item' : 'Create New Custom Item'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Item name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Item description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (RWF) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0"
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => setFormData({ ...formData, unit: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="/placeholder.svg"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : item ? 'Update Item' : 'Create Item'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminCustomItemForm;
