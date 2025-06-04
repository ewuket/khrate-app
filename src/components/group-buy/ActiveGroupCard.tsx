
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Crown } from "lucide-react";
import { GroupSession, GroupMember, GroupCartItem, GroupSummary } from "@/types/groupBuying";
import { formatCurrency } from "@/lib/utils";

interface ActiveGroupCardProps {
  currentGroup: GroupSession;
  groupMembers: GroupMember[];
  groupCart: GroupCartItem[];
  groupSummary: GroupSummary | null;
  onViewGroupCart: () => void;
  onLeaveGroup: () => void;
}

const ActiveGroupCard = ({
  currentGroup,
  groupMembers,
  groupCart,
  groupSummary,
  onViewGroupCart,
  onLeaveGroup
}: ActiveGroupCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {currentGroup.name || 'Your Group'}
            <Crown className="h-4 w-4 text-yellow-500" />
          </div>
          <Button
            variant="outline"
            onClick={onViewGroupCart}
          >
            View Group Cart ({groupCart.length})
          </Button>
        </CardTitle>
        <CardDescription>
          Join Code: <code className="font-mono bg-gray-100 px-2 py-1 rounded">{currentGroup.join_code}</code>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded">
            <p className="text-2xl font-bold text-khrate-500">{groupMembers.length}</p>
            <p className="text-sm text-muted-foreground">Members</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded">
            <p className="text-2xl font-bold text-khrate-500">{groupCart.length}</p>
            <p className="text-sm text-muted-foreground">Items</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded">
            <p className="text-2xl font-bold text-khrate-500">
              {groupSummary ? formatCurrency(groupSummary.final_amount) : '0 RWF'}
            </p>
            <p className="text-sm text-muted-foreground">Total</p>
          </div>
        </div>

        {groupSummary && (
          <div className="mt-4 p-4 bg-khrate-50 rounded">
            {groupSummary.qualifies_for_discount ? (
              <p className="text-green-700 font-medium">
                🎉 Group discount active! Saving {formatCurrency(groupSummary.discount_amount)}
              </p>
            ) : (
              <p className="text-amber-700">
                Need {currentGroup.min_participants - groupMembers.length} more members for group discount
              </p>
            )}
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <Button 
            onClick={onViewGroupCart}
            className="bg-khrate-500 hover:bg-khrate-600"
          >
            Manage Group Cart
          </Button>
          <Button variant="outline" onClick={onLeaveGroup}>
            Leave Group
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveGroupCard;
