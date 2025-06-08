
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { useGroupBuying } from "@/contexts/GroupBuyingContext";
import { toast } from 'sonner';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialItem?: any;
}

const commonItems = [
  { name: "Rice", unit: "kg" },
  { name: "Beans", unit: "kg" },
  { name: "Oil", unit: "L" },
  { name: "Sugar", unit: "kg" },
  { name: "Salt", unit: "kg" },
  { name: "Tomatoes", unit: "kg" },
  { name: "Onions", unit: "kg" },
  { name: "Potatoes", unit: "kg" },
  { name: "Eggs", unit: "dozen" },
  { name: "Milk", unit: "L" },
  { name: "Bread", unit: "loaf" },
  { name: "Bananas", unit: "kg" }
];

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
  initialItem
}) => {
  const { createGroup, addItemToGroupCart } = useGroupBuying();
  const [formData, setFormData] = useState({
    name: '',
    minParticipants: 3,
    maxParticipants: 10,
    isPublic: false
  });
  const [selectedItems, setSelectedItems] = useState<Array<{name: string, quantity: number, unit: string}>>([]);
  const [customItem, setCustomItem] = useState({ name: '', quantity: 1, unit: 'kg' });
  const [isCreating, setIsCreating] = useState(false);

  const handleAddItem = (item: {name: string, unit: string}) => {
    if (!selectedItems.find(selected => selected.name === item.name)) {
      setSelectedItems(prev => [...prev, { ...item, quantity: 1 }]);
    }
  };

  const handleAddCustomItem = () => {
    if (customItem.name.trim() && !selectedItems.find(item => item.name === customItem.name)) {
      setSelectedItems(prev => [...prev, customItem]);
      setCustomItem({ name: '', quantity: 1, unit: 'kg' });
    }
  };

  const handleRemoveItem = (itemName: string) => {
    setSelectedItems(prev => prev.filter(item => item.name !== itemName));
  };

  const handleUpdateQuantity = (itemName: string, quantity: number) => {
    setSelectedItems(prev => 
      prev.map(item => 
        item.name === itemName ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please enter a group name');
      return;
    }

    if (selectedItems.length === 0 && !initialItem) {
      toast.error('Please select at least one item for the group');
      return;
    }

    setIsCreating(true);
    try {
      const group = await createGroup({
        name: formData.name,
        min_participants: formData.minParticipants,
        max_participants: formData.maxParticipants,
        discount_percentage: 10, // Fixed admin-controlled discount
        is_public: formData.isPublic,
        group_type: formData.isPublic ? 'public' : 'private',
        items: selectedItems.length > 0 ? selectedItems : (initialItem ? [initialItem] : [])
      });

      if (group) {
        // Add initial item if provided
        if (initialItem) {
          await addItemToGroupCart(initialItem);
        }

        // Add selected items to group cart
        for (const item of selectedItems) {
          await addItemToGroupCart({
            id: Math.random(),
            name: item.name,
            price: 1000, // Default price, admin can adjust
            quantity: item.quantity,
            unit: item.unit,
            type: 'product'
          });
        }

        toast.success(`Group "${formData.name}" created successfully!`);
      }

      onClose();
      setFormData({
        name: '',
        minParticipants: 3,
        maxParticipants: 10,
        isPublic: false
      });
      setSelectedItems([]);
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error('Failed to create group. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="groupName">Group Name</Label>
            <Input
              id="groupName"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Neighborhood Group"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minParticipants">Min. Participants</Label>
              <Input
                id="minParticipants"
                type="number"
                min="2"
                max="20"
                value={formData.minParticipants}
                onChange={(e) => setFormData(prev => ({ ...prev, minParticipants: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxParticipants">Max. Participants</Label>
              <Input
                id="maxParticipants"
                type="number"
                min="3"
                max="50"
                value={formData.maxParticipants}
                onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: Number(e.target.value) }))}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Pre-select Items for Group</Label>
            
            {/* Selected Items */}
            {selectedItems.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm text-gray-600">Selected Items:</Label>
                {selectedItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <span className="flex-1">{item.name}</span>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleUpdateQuantity(item.name, Number(e.target.value))}
                      className="w-16 h-6 text-sm"
                    />
                    <span className="text-sm text-gray-500">{item.unit}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.name)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Common Items */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">Quick Add:</Label>
              <div className="flex flex-wrap gap-1">
                {commonItems.map((item) => (
                  <Badge
                    key={item.name}
                    variant="outline"
                    className="cursor-pointer hover:bg-khrate-50"
                    onClick={() => handleAddItem(item)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {item.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Custom Item */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">Add Custom Item:</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Item name"
                  value={customItem.name}
                  onChange={(e) => setCustomItem(prev => ({ ...prev, name: e.target.value }))}
                  className="flex-1"
                />
                <Input
                  type="number"
                  min="1"
                  value={customItem.quantity}
                  onChange={(e) => setCustomItem(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                  className="w-16"
                />
                <Input
                  value={customItem.unit}
                  onChange={(e) => setCustomItem(prev => ({ ...prev, unit: e.target.value }))}
                  className="w-16"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddCustomItem}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isPublic"
              checked={formData.isPublic}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: checked }))}
            />
            <Label htmlFor="isPublic">Make group public (others can find and join)</Label>
          </div>

          <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
            <strong>Note:</strong> Group discount (10%) is automatically applied when minimum participants join.
          </div>

          <DialogFooter className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isCreating}
              className="bg-khrate-500 hover:bg-khrate-600"
            >
              {isCreating ? 'Creating...' : 'Create Group'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupModal;
