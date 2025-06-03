import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useGroupBuying } from "@/contexts/GroupBuyingContext";
import { Users, ShoppingCart, Plus, Minus, Trash2, Crown, Copy, DollarSign, CheckCircle, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface GroupCartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const GroupCartSidebar: React.FC<GroupCartSidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const {
    currentGroup,
    groupMembers,
    groupCart,
    groupPayments,
    groupSummary,
    groupPaymentSummary,
    updateGroupCartItemQuantity,
    removeItemFromGroupCart,
    leaveGroup,
    completeGroupPayment,
    completeGroupOrder
  } = useGroupBuying();

  if (!currentGroup) return null;

  const isLeader = user?.id === currentGroup.leader_id;
  const userItems = groupCart.filter(item => item.user_id === user?.id);
  const memberCount = groupMembers.length;
  const progressPercentage = (memberCount / currentGroup.min_participants) * 100;
  
  const userPayment = groupPayments.find(payment => payment.user_id === user?.id);
  const hasUserPaid = userPayment?.payment_status === 'completed';

  const copyJoinCode = () => {
    navigator.clipboard.writeText(currentGroup.join_code);
    toast.success('Join code copied to clipboard!');
  };

  const handleCompletePayment = async () => {
    const success = await completeGroupPayment();
    if (success) {
      // Payment completed, keep sidebar open to show updated status
    }
  };

  const handleCompleteOrder = async () => {
    const success = await completeGroupOrder();
    if (success) {
      onClose();
    }
  };

  const getMemberPaymentStatus = (userId: string) => {
    const payment = groupPayments.find(p => p.user_id === userId);
    return payment?.payment_status || 'pending';
  };

  const getMemberItemCount = (userId: string) => {
    return groupCart.filter(item => item.user_id === userId).length;
  };

  const getUserTotal = () => {
    return userItems.reduce((total, item) => total + (item.product_price * item.quantity), 0);
  };

  const getUserFinalTotal = () => {
    const userTotal = getUserTotal();
    if (groupSummary?.qualifies_for_discount) {
      return userTotal * (1 - currentGroup.discount_percentage / 100);
    }
    return userTotal;
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Group Cart
            {currentGroup.name && (
              <span className="text-sm text-muted-foreground">- {currentGroup.name}</span>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Join Code */}
          <div className="bg-khrate-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Join Code</p>
                <code className="text-lg font-mono">{currentGroup.join_code}</code>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={copyJoinCode}
                className="h-8 w-8"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Group Progress</span>
              <span className="text-sm text-muted-foreground">
                {memberCount}/{currentGroup.min_participants} members
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            {!groupSummary?.qualifies_for_discount && (
              <p className="text-xs text-muted-foreground mt-1">
                {currentGroup.min_participants - memberCount} more members needed for discount
              </p>
            )}
          </div>

          {/* Payment Progress */}
          {groupPaymentSummary && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Payment Status</span>
                <span className="text-sm text-muted-foreground">
                  {groupPaymentSummary.paid_members}/{groupPaymentSummary.total_members} paid
                </span>
              </div>
              <Progress 
                value={(groupPaymentSummary.paid_members / groupPaymentSummary.total_members) * 100} 
                className="h-2" 
              />
              {groupPaymentSummary.group_ready && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Group ready for order!
                </p>
              )}
            </div>
          )}

          {/* Members with Payment Status */}
          <div>
            <h3 className="font-medium mb-3">Members ({memberCount})</h3>
            <div className="space-y-2">
              {groupMembers.map((member) => {
                const paymentStatus = getMemberPaymentStatus(member.user_id);
                return (
                  <div key={member.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 bg-khrate-100 rounded-full flex items-center justify-center">
                        {member.user_profile?.full_name?.[0] || member.user_profile?.email[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium flex items-center gap-1">
                          {member.user_profile?.full_name || member.user_profile?.email}
                          {member.user_id === currentGroup.leader_id && (
                            <Crown className="h-3 w-3 text-yellow-500" />
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {getMemberItemCount(member.user_id)} items
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {member.user_id === user?.id && (
                        <Badge variant="secondary">You</Badge>
                      )}
                      <Badge 
                        variant={paymentStatus === 'completed' ? 'default' : 'outline'}
                        className={paymentStatus === 'completed' ? 'bg-green-100 text-green-700' : ''}
                      >
                        {paymentStatus === 'completed' ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        {paymentStatus === 'completed' ? 'Paid' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Your Items */}
          {userItems.length > 0 && (
            <div>
              <h3 className="font-medium mb-3">Your Items ({userItems.length})</h3>
              <div className="space-y-3">
                {userItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex-1">
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(item.product_price)} each
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateGroupCartItemQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateGroupCartItemQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500"
                        onClick={() => removeItemFromGroupCart(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* User's Payment Summary */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2">Your Payment</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(getUserTotal())}</span>
                  </div>
                  {groupSummary?.qualifies_for_discount && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({currentGroup.discount_percentage}%)</span>
                      <span>-{formatCurrency(getUserTotal() - getUserFinalTotal())}</span>
                    </div>
                  )}
                  <div className="border-t pt-1 flex justify-between font-medium">
                    <span>Your Total</span>
                    <span>{formatCurrency(getUserFinalTotal())}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* All Group Items Summary */}
          <div>
            <h3 className="font-medium mb-3">All Group Items ({groupCart.length})</h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {groupCart.map((item) => {
                const member = groupMembers.find(m => m.user_id === item.user_id);
                return (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                    <div>
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-muted-foreground">
                        by {member?.user_profile?.full_name || member?.user_profile?.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <p>{item.quantity}x</p>
                      <p className="text-muted-foreground">
                        {formatCurrency(item.product_price * item.quantity)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Group Summary */}
          {groupSummary && (
            <div className="bg-white border rounded-lg p-4">
              <h3 className="font-medium mb-3">Group Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Group Subtotal</span>
                  <span>{formatCurrency(groupSummary.total_amount)}</span>
                </div>
                {groupSummary.qualifies_for_discount && (
                  <div className="flex justify-between text-green-600">
                    <span>Group Discount ({currentGroup.discount_percentage}%)</span>
                    <span>-{formatCurrency(groupSummary.discount_amount)}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between font-medium text-base">
                  <span>Group Total</span>
                  <span>{formatCurrency(groupSummary.final_amount)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <SheetFooter className="flex-col gap-2">
          {/* Payment button for user */}
          {userItems.length > 0 && !hasUserPaid && (
            <Button 
              onClick={handleCompletePayment}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <DollarSign className="mr-2 h-4 w-4" />
              Complete Payment ({formatCurrency(getUserFinalTotal())})
            </Button>
          )}

          {/* Order completion button for leader */}
          {isLeader && groupPaymentSummary?.group_ready && (
            <Button 
              onClick={handleCompleteOrder}
              className="w-full bg-khrate-500 hover:bg-khrate-600"
            >
              Complete Group Order
            </Button>
          )}
          
          <div className="flex gap-2 w-full">
            <Button variant="outline" onClick={leaveGroup} className="flex-1">
              Leave Group
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Continue Shopping
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default GroupCartSidebar;
