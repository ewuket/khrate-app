
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, ShoppingCart, Package, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useGroupBuying } from "@/contexts/GroupBuyingContext";
import { toast } from "sonner";

interface PresetGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
}

// Mock preset group data - in real app this would come from backend
const presetGroups = {
  'office-snacks': {
    id: 'office-snacks',
    name: 'Office Snacks',
    description: 'Perfect for office break rooms and team gatherings',
    discount: 15,
    items: [
      { id: 1, name: 'Mixed Nuts Pack', price: 2500, quantity: 5, unit: 'pack' },
      { id: 2, name: 'Coffee Beans Premium', price: 8000, quantity: 2, unit: 'kg' },
      { id: 3, name: 'Energy Bars Variety', price: 1800, quantity: 10, unit: 'pack' },
      { id: 4, name: 'Tea Selection Box', price: 4500, quantity: 3, unit: 'box' }
    ],
    minParticipants: 5,
    currentMembers: 3
  },
  'family-groceries': {
    id: 'family-groceries',
    name: 'Family Groceries',
    description: 'Essential groceries for families',
    discount: 12,
    items: [
      { id: 5, name: 'Rice Premium', price: 15000, quantity: 3, unit: 'kg' },
      { id: 6, name: 'Cooking Oil', price: 4000, quantity: 2, unit: 'liter' },
      { id: 7, name: 'Sugar White', price: 2000, quantity: 2, unit: 'kg' },
      { id: 8, name: 'Milk Powder', price: 6500, quantity: 1, unit: 'pack' }
    ],
    minParticipants: 4,
    currentMembers: 2
  }
};

const PresetGroupModal: React.FC<PresetGroupModalProps> = ({ isOpen, onClose, groupId }) => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const { addItemToGroupCart, createGroup } = useGroupBuying();
  const [isJoining, setIsJoining] = useState(false);

  const group = presetGroups[groupId as keyof typeof presetGroups];

  if (!group) {
    return null;
  }

  const totalAmount = group.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = totalAmount * (group.discount / 100);
  const finalAmount = totalAmount - discountAmount;

  const handleJoinAndCheckout = async () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    setIsJoining(true);
    try {
      // Create a new group based on preset
      const joinCode = await createGroup(group.name, group.minParticipants);
      
      if (joinCode) {
        // Add all preset items to the group cart
        for (const item of group.items) {
          await addItemToGroupCart({
            id: item.id,
            name: item.name,
            price: item.price,
            unit: item.unit,
            type: 'group'
          });
        }

        toast.success(`Joined ${group.name} group! Redirecting to checkout...`);
        onClose();
        
        // Open group cart for checkout
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('openGroupCart'));
        }, 500);
      }
    } catch (error) {
      toast.error('Failed to join group. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {group.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-khrate-50 p-4 rounded-lg">
            <p className="text-sm text-khrate-700 mb-2">{group.description}</p>
            <div className="flex items-center gap-4 text-sm">
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {group.currentMembers}/{group.minParticipants} members
              </Badge>
              <Badge variant="default" className="bg-green-500">
                {group.discount}% discount
              </Badge>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Included Items:</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {group.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-gray-600">{item.quantity} {item.unit}(s)</p>
                  </div>
                  <p className="font-medium text-sm">{item.price.toLocaleString()} RWF</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{totalAmount.toLocaleString()} RWF</span>
            </div>
            <div className="flex justify-between text-sm text-green-600">
              <span>Group Discount ({group.discount}%)</span>
              <span>-{discountAmount.toLocaleString()} RWF</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Your Share</span>
              <span>{finalAmount.toLocaleString()} RWF</span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2">
          <Button 
            onClick={handleJoinAndCheckout}
            disabled={isJoining}
            className="w-full bg-khrate-500 hover:bg-khrate-600"
          >
            {isJoining ? 'Joining...' : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Join Group & Checkout
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
          <Button variant="outline" onClick={onClose} className="w-full">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PresetGroupModal;
