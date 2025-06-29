
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Users, MapPin, Tag, Clock, DollarSign } from "lucide-react";
import GroupCheckoutModal from "./GroupCheckoutModal";

interface GroupPreviewModalProps {
  group: any;
  isOpen: boolean;
  onClose: () => void;
  onJoinGroup: (joinCode: string) => void;
  isJoining: boolean;
}

const GroupPreviewModal: React.FC<GroupPreviewModalProps> = ({
  group,
  isOpen,
  onClose,
  onJoinGroup,
  isJoining
}) => {
  const [showCheckout, setShowCheckout] = useState(false);

  if (!group) return null;

  const memberProgress = ((group.member_count || 0) / group.max_participants) * 100;
  const isNearlyFull = memberProgress >= 80;
  const qualifiesForDiscount = (group.member_count || 0) >= group.min_participants;

  const handleJoinAndCheckout = () => {
    setShowCheckout(true);
  };

  const handleCheckoutComplete = () => {
    onJoinGroup(group.join_code);
    setShowCheckout(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{group.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Group Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Users className="h-5 w-5 mx-auto mb-1 text-khrate-600" />
                <div className="text-sm font-medium">{group.member_count || 0}/{group.max_participants}</div>
                <div className="text-xs text-gray-500">Members</div>
              </div>
              
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Tag className="h-5 w-5 mx-auto mb-1 text-green-600" />
                <div className="text-sm font-medium">{group.discount_percentage}%</div>
                <div className="text-xs text-gray-500">Discount</div>
              </div>
              
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <MapPin className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                <div className="text-sm font-medium">{group.location || 'TBD'}</div>
                <div className="text-xs text-gray-500">Location</div>
              </div>
              
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <DollarSign className="h-5 w-5 mx-auto mb-1 text-purple-600" />
                <div className="text-sm font-medium">
                  {group.total_amount ? `RWF ${group.total_amount.toLocaleString()}` : 'TBD'}
                </div>
                <div className="text-xs text-gray-500">Total Price</div>
              </div>
            </div>

            {/* Member Progress */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Group Progress</span>
                <span className="text-sm text-gray-500">
                  {group.member_count || 0} of {group.max_participants} joined
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    qualifiesForDiscount ? 'bg-green-500' : 'bg-khrate-500'
                  }`}
                  style={{ width: `${Math.min(memberProgress, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Minimum: {group.min_participants}</span>
                <span>Maximum: {group.max_participants}</span>
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex gap-2">
              {qualifiesForDiscount && (
                <Badge className="bg-green-100 text-green-800">
                  ✓ Discount Qualified
                </Badge>
              )}
              {isNearlyFull && (
                <Badge className="bg-orange-100 text-orange-800">
                  ⚡ Nearly Full
                </Badge>
              )}
              {group.is_featured && (
                <Badge className="bg-purple-100 text-purple-800">
                  ⭐ Featured
                </Badge>
              )}
            </div>

            <Separator />

            {/* Items List */}
            {group.items && Array.isArray(group.items) && group.items.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">What's Included</h3>
                <div className="grid gap-2">
                  {group.items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{item.name}</span>
                      <Badge variant="outline">
                        {item.quantity} {item.unit}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pricing Breakdown */}
            {group.total_amount && (
              <div className="bg-khrate-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Pricing</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Base Price:</span>
                    <span>RWF {group.total_amount.toLocaleString()}</span>
                  </div>
                  {qualifiesForDiscount && (
                    <>
                      <div className="flex justify-between text-green-600">
                        <span>Group Discount ({group.discount_percentage}%):</span>
                        <span>-RWF {((group.total_amount * group.discount_percentage) / 100).toLocaleString()}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>Your Price:</span>
                        <span>RWF {(group.total_amount * (1 - group.discount_percentage / 100)).toLocaleString()}</span>
                      </div>
                    </>
                  )}
                  {!qualifiesForDiscount && (
                    <p className="text-sm text-amber-600">
                      ⚠️ Need {group.min_participants - (group.member_count || 0)} more members for discount
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Additional Info */}
            {group.region && (
              <div>
                <h3 className="font-semibold mb-2">Region</h3>
                <p className="text-gray-600">{group.region}</p>
              </div>
            )}

            {/* Join Button */}
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleJoinAndCheckout}
                disabled={isJoining || memberProgress >= 100}
                className="flex-1 bg-khrate-500 hover:bg-khrate-600"
              >
                {isJoining ? 'Joining...' : memberProgress >= 100 ? 'Group Full' : 'Join & Pay'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <GroupCheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        group={group}
        onCheckoutComplete={handleCheckoutComplete}
      />
    </>
  );
};

export default GroupPreviewModal;
