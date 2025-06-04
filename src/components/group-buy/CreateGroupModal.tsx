
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Lock, X, Copy, Check } from "lucide-react";
import { useGroupBuying } from "@/contexts/GroupBuyingContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialItem?: any;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose, initialItem }) => {
  const { createGroup, addItemToGroupCart } = useGroupBuying();
  const { isAuthenticated, openAuthModal } = useAuth();
  const [groupName, setGroupName] = useState('');
  const [minParticipants, setMinParticipants] = useState('3');
  const [groupType, setGroupType] = useState<'open' | 'private'>('private');
  const [isCreating, setIsCreating] = useState(false);
  const [createdJoinCode, setCreatedJoinCode] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCreateGroup = async () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    setIsCreating(true);
    try {
      const joinCode = await createGroup(groupName || undefined, parseInt(minParticipants));
      if (joinCode) {
        setCreatedJoinCode(joinCode);
        setShowSuccess(true);
        
        if (initialItem) {
          await addItemToGroupCart(initialItem);
        }
      }
    } finally {
      setIsCreating(false);
    }
  };

  const copyJoinCode = async () => {
    if (createdJoinCode) {
      await navigator.clipboard.writeText(createdJoinCode);
      setCopied(true);
      toast.success('Join code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setGroupName('');
    setMinParticipants('3');
    setGroupType('private');
    setCreatedJoinCode(null);
    setShowSuccess(false);
    setCopied(false);
    onClose();
  };

  const handleContinue = () => {
    handleClose();
    // Trigger group cart to open
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('openGroupCart'));
    }, 300);
  };

  if (showSuccess && createdJoinCode) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-center text-green-600">Group Created Successfully!</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 text-center">
            <div className="p-6 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">
                {groupName || 'Your Group'}
              </h3>
              <p className="text-sm text-green-700 mb-4">
                Share this code with others to let them join your group:
              </p>
              
              <div className="flex items-center justify-center gap-2 p-3 bg-white rounded border border-green-300">
                <code className="text-2xl font-mono font-bold text-green-800 tracking-wider">
                  {createdJoinCode}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyJoinCode}
                  className="text-green-600 hover:text-green-700"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <p>✅ Group created with minimum {minParticipants} participants</p>
              <p>✅ Group type: {groupType === 'private' ? 'Private (join code required)' : 'Open (public)'}</p>
              {initialItem && <p>✅ {initialItem.name} added to group cart</p>}
            </div>
          </div>

          <DialogFooter className="flex-col gap-2">
            <Button 
              onClick={handleContinue}
              className="w-full bg-khrate-500 hover:bg-khrate-600"
            >
              Continue to Group Cart
            </Button>
            <Button variant="outline" onClick={handleClose} className="w-full">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Create Group Buy</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label className="text-base font-medium mb-3 block">Group Type</Label>
            <RadioGroup value={groupType} onValueChange={(value: 'open' | 'private') => setGroupType(value)}>
              <Card className={`cursor-pointer transition-colors ${groupType === 'private' ? 'border-khrate-500 bg-khrate-50' : ''}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private" id="private" />
                    <Lock className="h-4 w-4" />
                    <CardTitle className="text-sm">Private Group (Recommended)</CardTitle>
                  </div>
                  <CardDescription className="text-xs">
                    Only people with the join code can access this group
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className={`cursor-pointer transition-colors ${groupType === 'open' ? 'border-khrate-500 bg-khrate-50' : ''}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="open" id="open" />
                    <Globe className="h-4 w-4" />
                    <CardTitle className="text-sm">Open Group</CardTitle>
                  </div>
                  <CardDescription className="text-xs">
                    Anyone can discover and join this group
                  </CardDescription>
                </CardHeader>
              </Card>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="groupName">Group Name (Optional)</Label>
            <Input
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="My Group Buy"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Leave blank to use your email as the group name
            </p>
          </div>

          <div>
            <Label htmlFor="minParticipants">Minimum Participants for Discount</Label>
            <Select value={minParticipants} onValueChange={setMinParticipants}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 people</SelectItem>
                <SelectItem value="3">3 people (Recommended)</SelectItem>
                <SelectItem value="4">4 people</SelectItem>
                <SelectItem value="5">5 people</SelectItem>
                <SelectItem value="6">6 people</SelectItem>
                <SelectItem value="8">8 people</SelectItem>
                <SelectItem value="10">10 people</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-1">
              Group discount (10%) applies when this number is reached
            </p>
          </div>

          {initialItem && (
            <div className="p-3 bg-khrate-50 rounded-lg border border-khrate-200">
              <p className="text-sm font-medium text-khrate-700">
                ✅ {initialItem.name} will be added to your group cart
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateGroup}
            disabled={isCreating}
            className="bg-khrate-500 hover:bg-khrate-600"
          >
            {isCreating ? 'Creating...' : 'Create Group'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupModal;
