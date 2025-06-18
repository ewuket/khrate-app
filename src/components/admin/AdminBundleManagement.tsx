
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Plus, Save, X } from 'lucide-react';
import { useBundles, Bundle, BundleItem } from '@/hooks/useBundles';
import { toast } from 'sonner';

const AdminBundleManagement = () => {
  const { bundles, loading, updateBundle, updateBundleItems, deleteBundle } = useBundles();
  const [editingBundle, setEditingBundle] = useState<Bundle | null>(null);
  const [editingItems, setEditingItems] = useState<Omit<BundleItem, 'id'>[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditBundle = (bundle: Bundle) => {
    setEditingBundle(bundle);
    setEditingItems(bundle.items?.map(item => ({
      item_name: item.item_name,
      quantity: item.quantity,
      unit: item.unit
    })) || []);
    setIsEditDialogOpen(true);
  };

  const handleSaveBundle = async () => {
    if (!editingBundle) return;

    const bundleUpdates = {
      title: editingBundle.title,
      description: editingBundle.description,
      price: editingBundle.price,
      original_price: editingBundle.original_price,
      image_url: editingBundle.image_url,
      is_featured: editingBundle.is_featured,
      is_active: editingBundle.is_active
    };

    const success = await updateBundle(editingBundle.id, bundleUpdates);
    if (success) {
      await updateBundleItems(editingBundle.id, editingItems);
      setIsEditDialogOpen(false);
      setEditingBundle(null);
    }
  };

  const handleDeleteBundle = async (id: number) => {
    if (confirm('Are you sure you want to delete this bundle?')) {
      await deleteBundle(id);
    }
  };

  const addNewItem = () => {
    setEditingItems([...editingItems, { item_name: '', quantity: 1, unit: 'pieces' }]);
  };

  const updateItem = (index: number, field: keyof Omit<BundleItem, 'id'>, value: string | number) => {
    const newItems = [...editingItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setEditingItems(newItems);
  };

  const removeItem = (index: number) => {
    setEditingItems(editingItems.filter((_, i) => i !== index));
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} RWF`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-khrate-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Bundle Management</h2>
      </div>

      <div className="grid gap-6">
        {bundles.map((bundle) => (
          <Card key={bundle.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  {bundle.title}
                  {bundle.is_featured && (
                    <Badge variant="secondary">Featured</Badge>
                  )}
                  {!bundle.is_active && (
                    <Badge variant="destructive">Inactive</Badge>
                  )}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEditBundle(bundle)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleDeleteBundle(bundle.id)}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <img
                    src={bundle.image_url}
                    alt={bundle.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-3">
                  <p className="text-gray-600">{bundle.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-khrate-600">
                      {formatPrice(bundle.price)}
                    </span>
                    {bundle.original_price && bundle.original_price > bundle.price && (
                      <span className="text-gray-500 line-through">
                        {formatPrice(bundle.original_price)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Items ({bundle.items?.length || 0}):</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      {bundle.items?.slice(0, 3).map((item, index) => (
                        <div key={index}>
                          {item.item_name} ({item.quantity} {item.unit})
                        </div>
                      ))}
                      {bundle.items && bundle.items.length > 3 && (
                        <div className="text-khrate-600 font-medium">
                          +{bundle.items.length - 3} more items
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Bundle</DialogTitle>
          </DialogHeader>
          {editingBundle && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={editingBundle.title}
                      onChange={(e) => setEditingBundle({
                        ...editingBundle,
                        title: e.target.value
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={editingBundle.description || ''}
                      onChange={(e) => setEditingBundle({
                        ...editingBundle,
                        description: e.target.value
                      })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="price">Price (RWF)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={editingBundle.price}
                        onChange={(e) => setEditingBundle({
                          ...editingBundle,
                          price: Number(e.target.value)
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="originalPrice">Original Price (RWF)</Label>
                      <Input
                        id="originalPrice"
                        type="number"
                        value={editingBundle.original_price || ''}
                        onChange={(e) => setEditingBundle({
                          ...editingBundle,
                          original_price: Number(e.target.value) || null
                        })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      value={editingBundle.image_url || ''}
                      onChange={(e) => setEditingBundle({
                        ...editingBundle,
                        image_url: e.target.value
                      })}
                    />
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="featured"
                        checked={editingBundle.is_featured}
                        onCheckedChange={(checked) => setEditingBundle({
                          ...editingBundle,
                          is_featured: checked
                        })}
                      />
                      <Label htmlFor="featured">Featured</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="active"
                        checked={editingBundle.is_active}
                        onCheckedChange={(checked) => setEditingBundle({
                          ...editingBundle,
                          is_active: checked
                        })}
                      />
                      <Label htmlFor="active">Active</Label>
                    </div>
                  </div>
                </div>
                <div>
                  <img
                    src={editingBundle.image_url}
                    alt={editingBundle.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Bundle Items</h3>
                  <Button onClick={addNewItem} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {editingItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-5">
                        <Label>Item Name</Label>
                        <Input
                          value={item.item_name}
                          onChange={(e) => updateItem(index, 'item_name', e.target.value)}
                          placeholder="Item name"
                        />
                      </div>
                      <div className="col-span-3">
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                        />
                      </div>
                      <div className="col-span-3">
                        <Label>Unit</Label>
                        <Input
                          value={item.unit}
                          onChange={(e) => updateItem(index, 'unit', e.target.value)}
                          placeholder="kg, pieces, etc."
                        />
                      </div>
                      <div className="col-span-1">
                        <Button
                          onClick={() => removeItem(index)}
                          variant="destructive"
                          size="sm"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  onClick={() => setIsEditDialogOpen(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveBundle}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBundleManagement;
