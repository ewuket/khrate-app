
import { useState } from "react";
import { useGroupBuying } from "@/contexts/GroupBuyingContext";
import { useAuth } from "@/contexts/AuthContext";
import CreateGroupModal from "@/components/group-buy/CreateGroupModal";
import JoinGroupModal from "@/components/group-buy/JoinGroupModal";
import GroupCartSidebar from "@/components/group-buy/GroupCartSidebar";
import GroupBuyHero from "@/components/group-buy/GroupBuyHero";
import NoGroupView from "@/components/group-buy/NoGroupView";
import ActiveGroupView from "@/components/group-buy/ActiveGroupView";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";

const GroupBuy = () => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const { 
    currentGroup, 
    groupMembers, 
    groupCart, 
    groupSummary,
    leaveGroup,
    joinGroup
  } = useGroupBuying();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showGroupCart, setShowGroupCart] = useState(false);

  const handleCreateGroup = () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    setShowCreateModal(true);
  };

  const handleJoinGroup = () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    setShowJoinModal(true);
  };

  const handleJoinPresetGroup = async (groupId: string) => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    
    try {
      // Simulate joining a preset group with enhanced feedback
      const mockJoinCode = `PRESET${groupId.slice(-3)}`;
      await joinGroup(mockJoinCode);
      toast.success(`Successfully joined ${groupId.replace('-', ' ')} group! Start adding items to your group cart.`);
    } catch (error) {
      console.error('Error joining preset group:', error);
      toast.error('Failed to join group. Please try again.');
    }
  };

  const handleLeaveGroup = async () => {
    try {
      await leaveGroup();
      toast.success('Left group successfully');
    } catch (error) {
      console.error('Error leaving group:', error);
      toast.error('Failed to leave group. Please try again.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header with orange background and white text */}
      <div className="bg-khrate-500 text-white">
        <GroupBuyHero 
          onCreateGroup={handleCreateGroup}
          onJoinGroup={handleJoinGroup}
        />
      </div>
      
      <section className="py-12 flex-1">
        <div className="container mx-auto">
          {!currentGroup ? (
            <NoGroupView
              onCreateGroup={handleCreateGroup}
              onJoinGroup={handleJoinGroup}
              onJoinPresetGroup={handleJoinPresetGroup}
            />
          ) : (
            <ActiveGroupView
              currentGroup={currentGroup}
              groupMembers={groupMembers}
              groupCart={groupCart}
              groupSummary={groupSummary}
              onViewGroupCart={() => setShowGroupCart(true)}
              onLeaveGroup={handleLeaveGroup}
            />
          )}
        </div>
      </section>

      <CreateGroupModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      <JoinGroupModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
      />

      <GroupCartSidebar
        isOpen={showGroupCart}
        onClose={() => setShowGroupCart(false)}
      />

      <Footer />
    </div>
  );
};

export default GroupBuy;
