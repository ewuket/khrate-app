
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, MapPin, Clock, ShoppingCart, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useGroupBuying } from "@/contexts/GroupBuyingContext";

interface GroupPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: {
    id: string;
    name: string;
    description: string;
    location: string;
    memberCount: number;
    estimatedDelivery: string;
    discount: string;
    sampleItems: string[];
    totalValue: number;
  } | null;
}

const GroupPreviewModal: React.FC<GroupPreviewModalProps> = ({ isOpen, onClose, group }) => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const { joinGroup } = useGroupBuying();

  const handleJoinGroup = async () => {
    if (!group) return;
    
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    
    // For open groups, we'll simulate joining with the group ID
    const success = await joinGroup(group.id);
    if (success) {
      onClose();
    }
  };

  if (!isOpen || !group) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">{group.name || 'Group Preview'}</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-muted-foreground">{group.description || 'Join this group to enjoy bulk buying discounts!'}</p>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-khrate-500" />
              <span>{group.location || 'Location TBD'}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-khrate-500" />
              <span>{group.memberCount || 0} members</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-khrate-500" />
              <span>{group.estimatedDelivery || 'Delivery date TBD'}</span>
            </div>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <ShoppingCart className="h-4 w-4 text-khrate-500" />
                <span className="font-medium">Items in this group:</span>
                <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded ml-auto">
                  {group.discount || '10% off'}
                </span>
              </div>
              
              <div className="space-y-2">
                {group.sampleItems && group.sampleItems.length > 0 ? (
                  group.sampleItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span>• {item}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">No items added yet</div>
                )}
              </div>
              
              <div className="mt-3 pt-3 border-t">
                <div className="flex justify-between items-center font-medium">
                  <span>Estimated Total:</span>
                  <span className="text-khrate-600">{(group.totalValue || 0).toLocaleString()} RWF</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleJoinGroup}
              className="flex-1 bg-khrate-500 hover:bg-khrate-600"
            >
              {isAuthenticated ? 'Join Group' : 'Login to Join'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GroupPreviewModal;
