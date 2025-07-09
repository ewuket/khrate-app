
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { useAdminCustomItems } from "@/hooks/useAdminCustomItems";

interface GroupItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  price: number;
}

interface AdminGroupItemsManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentItems: GroupItem[];
  onItemsUpdate: (items: GroupItem[]) => void;
}

const AdminGroupItemsManager = ({ 
  open, 
  onOpenChange, 
  currentItems, 
  onItemsUpdate 
}: AdminGroupItemsManagerProps) => {
  const { customItems } = useAdminCustomItems();
  const [items, setItems] = useState<GroupItem[]>(currentItems);
  const [newItem, setNewItem] = useState({
    id: 0,
    name: '',
    quantity: 1,
    unit: 'kg',
    price: 0
  });

  const handleAddItem = () => {
    if (newItem.name && newItem.quantity > 0 && newItem.price > 0) {
      const selectedCustomItem = customItems.find(item => item.name === newItem.name);
      if (selectedCustomItem) {
        const itemToAdd: GroupItem = {
          id: selectedCustomItem.id,
          name: selectedCustomItem.name,
          quantity: newItem.quantity,
          unit: selectedCustomItem.unit,
          price: selectedCustomItem.price * newItem.quantity
        };
        
        setItems([...items, itemToAdd]);
        setNewItem({ id: 0, name: '', quantity: 1, unit: 'kg', price: 0 });
      }
    }
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onItemsUpdate(items);
    onOpenChange(false);
  };

  const handleItemSelect = (itemName: string) => {
    const selectedItem = customItems.find(item => item.name === itemName);
    if (selectedItem) {
      setNewItem({
        id: selectedItem.id,
        name: selectedItem.name,
        quantity: 1,
        unit: selectedItem.unit,
        price: selectedItem.price
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Group Items</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Add New Item */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-4">Add New Item</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="item-select">Select Item</Label>
                  <Select onValueChange={handleItemSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an item..." />
                    </SelectTrigger>
                    <SelectContent>
                      {customItems.map((item) => (
                        <SelectItem key={item.id} value={item.name}>
                          {item.name} - {item.price} RWF/{item.unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                  />
                </div>
              </div>
              
              {newItem.name && (
                <div className="mt-4 p-3 bg-gray-50 rounded">
                  <p className="text-sm">
                    <strong>{newItem.name}</strong> - {newItem.quantity} {newItem.unit} 
                    @ {newItem.price} RWF/{newItem.unit} = {(newItem.price * newItem.quantity).toLocaleString()} RWF
                  </p>
                </div>
              )}
              
              <Button 
                onClick={handleAddItem} 
                className="mt-4 w-full"
                disabled={!newItem.name || newItem.quantity <= 0}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </CardContent>
          </Card>

          {/* Current Items */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-4">Group Items ({items.length})</h3>
              {items.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No items added yet</p>
              ) : (
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-600">
                          {item.quantity} {item.unit} • {item.price.toLocaleString()} RWF
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveItem(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <div className="border-t pt-3 mt-4">
                    <div className="flex justify-between font-medium">
                      <span>Total Value:</span>
                      <span>{items.reduce((sum, item) => sum + item.price, 0).toLocaleString()} RWF</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Items
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminGroupItemsManager;
