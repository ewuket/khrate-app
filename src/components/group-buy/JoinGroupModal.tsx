
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGroupBuying } from "@/contexts/GroupBuyingContext";
import { useAuth } from "@/contexts/AuthContext";
import { UserPlus, X } from "lucide-react";

interface JoinGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const JoinGroupModal: React.FC<JoinGroupModalProps> = ({ isOpen, onClose }) => {
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { joinGroup } = useGroupBuying();
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      return;
    }

    if (!joinCode.trim()) {
      return;
    }

    setLoading(true);
    
    try {
      const success = await joinGroup(joinCode.trim().toUpperCase());
      
      if (success) {
        onClose();
        setJoinCode('');
      }
    } catch (error) {
      console.error('Error joining group:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setJoinCode('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-khrate-500" />
              Join Group Buy
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
            <Label htmlFor="joinCode">Group Join Code</Label>
            <Input
              id="joinCode"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="Enter 6-character code"
              maxLength={6}
              required
              disabled={loading}
              className="uppercase"
            />
            <p className="text-sm text-gray-500 mt-1">
              Ask the group leader for the join code
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-3 rounded-md">
            <p className="text-sm text-blue-700">
              <strong>How it works:</strong> Enter the group code to join an existing group buy and get discounts when enough people participate.
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
              disabled={loading || !joinCode.trim() || joinCode.length !== 6}
              className="bg-khrate-500 hover:bg-khrate-600"
            >
              {loading ? 'Joining...' : 'Join Group'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinGroupModal;
