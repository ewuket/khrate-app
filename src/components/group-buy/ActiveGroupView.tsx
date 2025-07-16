
import ActiveGroupCard from "./ActiveGroupCard";
import ContinueShopping from "./ContinueShopping";
import { GroupSession, GroupMember, GroupCartItem, GroupSummary } from "@/types/groupBuying";

interface ActiveGroupViewProps {
  currentGroup: GroupSession;
  groupMembers: GroupMember[];
  groupCart: GroupCartItem[];
  groupSummary: GroupSummary | null;
  onViewGroupCart: () => void;
  onLeaveGroup: () => void;
}

const ActiveGroupView = ({
  currentGroup,
  groupMembers,
  groupCart,
  groupSummary,
  onViewGroupCart,
  onLeaveGroup
}: ActiveGroupViewProps) => {
  return (
    <div className="space-y-6">
      <ActiveGroupCard
        currentGroup={currentGroup}
        groupMembers={groupMembers}
        groupCart={groupCart}
        groupSummary={groupSummary}
        onViewGroupCart={onViewGroupCart}
        onLeaveGroup={onLeaveGroup}
      />
      <ContinueShopping />
    </div>
  );
};

export default ActiveGroupView;
