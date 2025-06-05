
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useGroupBuying } from "@/contexts/GroupBuyingContext";
import { useAuth } from "@/contexts/AuthContext";
import { X, Users, Lock, Globe } from "lucide-react";
import { toast } from "sonner";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialItem?: any;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose, initialItem }) => {
  const [groupName, setGroupName] = useState('');
  const [groupType, setGroupType] = useState<'private' | 'public'>('private');
  const [minParticipants, setMinParticipants] = useState(3);
  const [loading, setLoading] = useState(false);
  
  const { createGroup, addItemToGroupCart } = useGroupBuying();
  const { user, isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      toast.error('Please log in to create a group');
      return;
    }

    if (!groupName.trim()) {
      toast.error('Please enter a group name');
      return;
    }

    setLoading(true);
    
    try {
      console.log('Creating group with data:', {
        name: groupName,
        type: groupType,
        minParticipants
      });

      const joinCode = await createGroup(groupName, minParticipants);
      
      if (joinCode) {
        // If there's an initial item, add it to the group cart
        if (initialItem) {
          await addItemToGroupCart(initialItem);
        }
        
        toast.success(`Group created successfully! Share code: ${joinCode}`, {
          duration: 5000
        });
        
        onClose();
        setGroupName('');
        setGroupType('private');
        setMinParticipants(3);
      }
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error('Failed to create group. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setGroupName('');
      setGroupType('private');
      setMinParticipants(3);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-khrate-500" />
              Create Group Buy
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              disabled={loading}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="groupName">Group Name</Label>
            <Input
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              required
              disabled={loading}
            />
          </div>

          <div>
            <Label>Group Type</Label>
            <RadioGroup
              value={groupType}
              onValueChange={(value: 'private' | 'public') => setGroupType(value)}
              disabled={loading}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="private" />
                <Label htmlFor="private" className="flex items-center gap-2 cursor-pointer">
                  <Lock className="h-4 w-4" />
                  Private (Join by code only)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public" className="flex items-center gap-2 cursor-pointer">
                  <Globe className="h-4 w-4" />
                  Public (Anyone can join)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="minParticipants">Minimum Participants for Discount</Label>
            <Input
              id="minParticipants"
              type="number"
              min="2"
              max="10"
              value={minParticipants}
              onChange={(e) => setMinParticipants(Number(e.target.value))}
              disabled={loading}
            />
            <p className="text-sm text-gray-500 mt-1">
              Group needs at least {minParticipants} members to get the discount
            </p>
          </div>

          <DialogFooter className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !groupName.trim()}
              className="bg-khrate-500 hover:bg-khrate-600"
            >
              {loading ? 'Creating...' : 'Create Group'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupModal;
