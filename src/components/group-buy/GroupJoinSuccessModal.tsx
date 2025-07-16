
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGroupBuying } from "@/contexts/GroupBuyingContext";
import { CheckCircle, Users, Gift } from "lucide-react";

interface GroupJoinSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupName: string;
  joinCode: string;
}

const GroupJoinSuccessModal: React.FC<GroupJoinSuccessModalProps> = ({
  isOpen,
  onClose,
  groupName,
  joinCode
}) => {
  const { 
    currentGroup, 
    groupMembers, 
    groupSummary 
  } = useGroupBuying();

  const handleStartShopping = () => {
    onClose();
    // Navigate to custom buy or bundles
    window.location.href = '/custom-buy';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-100 rounded-full p-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <DialogTitle className="text-center">
            Successfully Joined Group!
          </DialogTitle>
        </DialogHeader>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="text-center">
              <h3 className="font-semibold text-lg">{groupName}</h3>
              <p className="text-sm text-muted-foreground">
                Join Code: <code className="bg-gray-100 px-2 py-1 rounded">{joinCode}</code>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded">
                <div className="flex items-center justify-center mb-1">
                  <Users className="h-4 w-4 mr-1" />
                  <span className="font-semibold">{groupMembers.length}</span>
                </div>
                <p className="text-xs text-muted-foreground">Members</p>
              </div>
              
              <div className="text-center p-3 bg-gray-50 rounded">
                <div className="flex items-center justify-center mb-1">
                  <Gift className="h-4 w-4 mr-1" />
                  <span className="font-semibold">
                    {currentGroup?.discount_percentage || 10}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Group Discount</p>
              </div>
            </div>

            {groupSummary && (
              <div className="text-center">
                {groupSummary.qualifies_for_discount ? (
                  <Badge className="bg-green-100 text-green-800">
                    🎉 Group discount active!
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    Need {(currentGroup?.min_participants || 3) - groupMembers.length} more members for discount
                  </Badge>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Button 
                onClick={handleStartShopping}
                className="w-full bg-khrate-500 hover:bg-khrate-600"
              >
                Start Shopping Together
              </Button>
              
              <Button 
                variant="outline" 
                onClick={onClose}
                className="w-full"
              >
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default GroupJoinSuccessModal;
