
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Plus, UserPlus, Crown, Clock } from "lucide-react";
import { useGroupBuying } from "@/contexts/GroupBuyingContext";
import { useAuth } from "@/contexts/AuthContext";
import CreateGroupModal from "@/components/group-buy/CreateGroupModal";
import JoinGroupModal from "@/components/group-buy/JoinGroupModal";
import GroupCartSidebar from "@/components/group-buy/GroupCartSidebar";
import PresetGroups from "@/components/group-buy/PresetGroups";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

const GroupBuy = () => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const { 
    currentGroup, 
    groupMembers, 
    groupCartItems, 
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
    // For now, simulate joining a preset group with a toast
    // In a real implementation, this would create or join an actual group
    toast.success(`Joined ${groupId.replace('-', ' ')} group! Start adding items to your group cart.`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        <section className="bg-gradient-to-r from-khrate-500 to-khrate-600 py-12 text-white">
          <div className="container mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold">Group Buy</h1>
            <p className="mt-2 max-w-lg">
              Join forces with others to unlock bigger discounts and share delivery costs
            </p>
          </div>
        </section>
        
        <section className="py-12">
          <div className="container mx-auto">
            {!currentGroup ? (
              <>
                {/* Preset Groups Section */}
                <PresetGroups onJoinGroup={handleJoinPresetGroup} />

                <div className="my-12">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or create your own</span>
                    </div>
                  </div>
                </div>

                {/* How it works section */}
                <div className="bg-khrate-50 border border-khrate-100 rounded-lg p-6 mb-8">
                  <h2 className="text-xl font-semibold mb-2">How Group Buy Works</h2>
                  <p className="text-muted-foreground mb-4">
                    Create or join a group with friends to enjoy bulk buying discounts. Once a group reaches its minimum members, everyone gets the discount!
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                    <div className="p-4">
                      <div className="bg-khrate-100 rounded-full h-10 w-10 flex items-center justify-center mx-auto mb-2">
                        <span className="font-bold text-khrate-700">1</span>
                      </div>
                      <p className="font-medium">Create or join a group</p>
                    </div>
                    <div className="p-4">
                      <div className="bg-khrate-100 rounded-full h-10 w-10 flex items-center justify-center mx-auto mb-2">
                        <span className="font-bold text-khrate-700">2</span>
                      </div>
                      <p className="font-medium">Add items to group cart</p>
                    </div>
                    <div className="p-4">
                      <div className="bg-khrate-100 rounded-full h-10 w-10 flex items-center justify-center mx-auto mb-2">
                        <span className="font-bold text-khrate-700">3</span>
                      </div>
                      <p className="font-medium">Reach minimum members</p>
                    </div>
                    <div className="p-4">
                      <div className="bg-khrate-100 rounded-full h-10 w-10 flex items-center justify-center mx-auto mb-2">
                        <span className="font-bold text-khrate-700">4</span>
                      </div>
                      <p className="font-medium">Enjoy group discounts</p>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                  <Button 
                    className="bg-khrate-500 hover:bg-khrate-600"
                    onClick={handleCreateGroup}
                    size="lg"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Create New Group
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={handleJoinGroup}
                    size="lg"
                  >
                    <UserPlus className="mr-2 h-5 w-5" />
                    Join Existing Group
                  </Button>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-khrate-500" />
                        Group Discounts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Get 5-15% off when your group reaches the minimum size. The more members, the bigger the savings!
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-khrate-500" />
                        Fast Delivery
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Share delivery costs and get your groceries delivered faster with consolidated orders.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Plus className="h-5 w-5 text-khrate-500" />
                        Easy Sharing
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Simple join codes make it easy to invite friends and family to your group buying session.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              /* Current Group Display */
              <div className="space-y-6">
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
                        onClick={() => setShowGroupCart(true)}
                      >
                        View Group Cart ({groupCartItems.length})
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
                        <p className="text-2xl font-bold text-khrate-500">{groupCartItems.length}</p>
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
                        onClick={() => setShowGroupCart(true)}
                        className="bg-khrate-500 hover:bg-khrate-600"
                      >
                        Manage Group Cart
                      </Button>
                      <Button variant="outline" onClick={leaveGroup}>
                        Leave Group
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Continue shopping to add more items to your group cart
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button asChild variant="outline">
                      <a href="/bundles">Browse Bundles</a>
                    </Button>
                    <Button asChild variant="outline">
                      <a href="/custom-buy">Custom Shopping</a>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />

      {/* Modals */}
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
