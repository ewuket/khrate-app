
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

interface BundleItem {
  item_name: string;
  quantity: number;
  unit: string;
}

interface AdminBundleItemsSectionProps {
  items: BundleItem[];
  setItems: React.Dispatch<React.SetStateAction<BundleItem[]>>;
}

const AdminBundleItemsSection: React.FC<AdminBundleItemsSectionProps> = ({
  items,
  setItems
}) => {
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
  );
};

export default AdminBundleItemsSection;
