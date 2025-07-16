
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, ShoppingCart, Check, Clock, UserPlus } from "lucide-react";
import { GroupSession, GroupMember } from "@/types/groupBuying";

interface GroupMembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: GroupSession;
  members: GroupMember[];
  onJoinAndCheckout: () => void;
  isCurrentMember: boolean;
}

const GroupMembershipModal: React.FC<GroupMembershipModalProps> = ({
  isOpen,
  onClose,
  group,
  members,
  onJoinAndCheckout,
  isCurrentMember
}) => {
  const getMemberPaymentStatus = (userId: string) => {
    // Mock payment status - in real app this would come from props
    return Math.random() > 0.5 ? 'paid' : 'pending';
  };

  const paidMembers = members.filter(member => getMemberPaymentStatus(member.user_id) === 'paid');
  const pendingMembers = members.filter(member => getMemberPaymentStatus(member.user_id) === 'pending');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-khrate-500" />
            {group.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-khrate-50 rounded-lg border border-khrate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-khrate-800">Group Discount</span>
              <Badge variant="default" className="bg-green-500">
                {group.discount_percentage}% OFF
              </Badge>
            </div>
            <p className="text-sm text-khrate-700">
              Minimum {group.min_participants} members required for discount
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Group Members</span>
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {members.length} / {group.max_participants} members
              </Badge>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto">
              {paidMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between py-2 px-3 bg-green-50 rounded">
                  <span className="text-sm font-medium">
                    {member.user_profile?.full_name || member.user_profile?.email || 'Member'}
                  </span>
                  <Badge variant="default" className="bg-green-500 text-white">
                    <Check className="h-3 w-3 mr-1" />
                    Paid
                  </Badge>
                </div>
              ))}
              
              {pendingMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between py-2 px-3 bg-yellow-50 rounded">
                  <span className="text-sm font-medium">
                    {member.user_profile?.full_name || member.user_profile?.email || 'Member'}
                  </span>
                  <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending
                  </Badge>
                </div>
              ))}
            </div>

            {members.length >= group.min_participants && (
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-700 font-medium">
                  ✅ Discount Available! This group qualifies for {group.discount_percentage}% off
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col gap-2">
          {!isCurrentMember ? (
            <Button 
              onClick={onJoinAndCheckout}
              className="w-full bg-khrate-500 hover:bg-khrate-600"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Join Group & Checkout
            </Button>
          ) : (
            <Button 
              onClick={onJoinAndCheckout}
              className="w-full bg-khrate-500 hover:bg-khrate-600"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Proceed to Checkout
            </Button>
          )}
          <Button variant="outline" onClick={onClose} className="w-full">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GroupMembershipModal;
