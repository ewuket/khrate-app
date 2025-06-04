
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useGroupBuying } from "@/contexts/GroupBuyingContext";
import { useAuth } from "@/contexts/AuthContext";
import CreateGroupModal from "@/components/group-buy/CreateGroupModal";
import JoinGroupModal from "@/components/group-buy/JoinGroupModal";
import GroupCartSidebar from "@/components/group-buy/GroupCartSidebar";
import GroupBuyHero from "@/components/group-buy/GroupBuyHero";
import NoGroupView from "@/components/group-buy/NoGroupView";
import ActiveGroupView from "@/components/group-buy/ActiveGroupView";
import { toast } from "sonner";

const GroupBuy = () => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const { 
    currentGroup, 
    groupMembers, 
    groupCart, 
    groupSummary,
    leaveGroup
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
    
    // Simulate joining a preset group with enhanced feedback
    toast.success(`Successfully joined ${groupId.replace('-', ' ')} group! Start adding items to your group cart.`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        <GroupBuyHero 
          onCreateGroup={handleCreateGroup}
          onJoinGroup={handleJoinGroup}
        />
        
        <section className="py-12">
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
                onLeaveGroup={leaveGroup}
              />
            )}
          </div>
        </section>
      </main>
      
      <Footer />

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
    </div>
  );
};

export default GroupBuy;
