
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, ShoppingCart, Check, Clock } from "lucide-react";
import { useGroupBuying } from "@/contexts/GroupBuyingContext";
import { GroupSession, GroupMember } from "@/types/groupBuying";

interface GroupJoinSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: GroupSession;
  members: GroupMember[];
  onCheckout: () => void;
}

const GroupJoinSuccessModal: React.FC<GroupJoinSuccessModalProps> = ({
  isOpen,
  onClose,
  group,
  members,
  onCheckout
}) => {
  const { groupPayments } = useGroupBuying();

  const getMemberPaymentStatus = (userId: string) => {
    const payment = groupPayments.find(p => p.user_id === userId);
    return payment?.payment_status === 'completed' ? 'paid' : 'pending';
  };

  const paidMembers = members.filter(member => getMemberPaymentStatus(member.user_id) === 'paid');
  const pendingMembers = members.filter(member => getMemberPaymentStatus(member.user_id) === 'pending');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            Successfully Joined Group!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-medium text-green-800 mb-1">{group.name}</h3>
            <p className="text-sm text-green-700">
              You're now part of this group buy! Add items to your cart and complete checkout to secure your discounts.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Group Members</span>
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {members.length} members
              </Badge>
            </div>

            <div className="space-y-2 max-h-32 overflow-y-auto">
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
          </div>
        </div>

        <DialogFooter className="flex-col gap-2">
          <Button 
            onClick={onCheckout}
            className="w-full bg-khrate-500 hover:bg-khrate-600"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Start Shopping & Checkout
          </Button>
          <Button variant="outline" onClick={onClose} className="w-full">
            Continue Browsing
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GroupJoinSuccessModal;
