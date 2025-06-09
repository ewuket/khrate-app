import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, Package, CheckCircle } from "lucide-react";
import { useGroupBuying } from "@/contexts/GroupBuyingContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface JoinGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const JoinGroupModal: React.FC<JoinGroupModalProps> = ({
  isOpen,
  onClose
}) => {
  const { joinGroup } = useGroupBuying();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [foundGroup, setFoundGroup] = useState<any>(null);
  const [showGroupPreview, setShowGroupPreview] = useState(false);
  const [groupMembers, setGroupMembers] = useState<any[]>([]);

  // Function to find a group by code using Supabase
  const findGroupByCode = async (code: string) => {
    try {
      const { data: groupData, error: groupError } = await supabase
        .from('group_sessions')
        .select(`
          *,
          group_members!group_members_group_session_id_fkey(
            id,
            user_id,
            joined_at,
            user_profiles!group_members_user_id_fkey(
              full_name,
              email
            )
          )
        `)
        .eq('join_code', code.toUpperCase())
        .eq('status', 'active')
        .single();

      if (groupError) {
        console.error('Group not found:', groupError);
        return null;
      }

      return groupData;
    } catch (error) {
      console.error('Error finding group:', error);
      return null;
    }
  };

  const handleSearchGroup = async () => {
    if (!joinCode.trim()) {
      toast.error('Please enter a group code');
      return;
    }

    try {
      setIsJoining(true);
      const group = await findGroupByCode(joinCode.toUpperCase());
      
      if (group) {
        setFoundGroup(group);
        setShowGroupPreview(true);
        
        // Set group members from the fetched data
        const members = group.group_members?.map((member: any) => ({
          id: member.id,
          name: member.user_profiles?.full_name || member.user_profiles?.email || 'Unknown User',
          status: 'pending', // Default status, could be enhanced with payment data
          joinedAt: member.joined_at
        })) || [];
        
        setGroupMembers(members);
      } else {
        toast.error('Group not found. Please check the code and try again.');
      }
    } catch (error) {
      console.error('Error finding group:', error);
      toast.error('Failed to find group. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleJoinGroup = async () => {
    if (!foundGroup) return;

    try {
      setIsJoining(true);
      const joinedGroup = await joinGroup(foundGroup.join_code);
      
      if (joinedGroup) {
        toast.success(`Successfully joined "${foundGroup.name}"!`);
        
        // Close modal and navigate to group buy page
        onClose();
        setFoundGroup(null);
        setShowGroupPreview(false);
        setJoinCode('');
        
        // Navigate to group buy page to show the active group
        navigate('/group-buy');
      }
    } catch (error) {
      console.error('Error joining group:', error);
      toast.error('Failed to join group. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const paidMembers = groupMembers.filter(member => member.status === 'paid').length;
  const totalMembers = groupMembers.length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {showGroupPreview ? 'Group Preview' : 'Join Existing Group'}
          </DialogTitle>
        </DialogHeader>

        {!showGroupPreview ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="joinCode">Group Join Code</Label>
              <Input
                id="joinCode"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="Enter 6-digit code (e.g., ABC123)"
                maxLength={6}
                className="uppercase"
              />
              <p className="text-xs text-gray-500">
                Ask the group creator for the join code
              </p>
            </div>

            <Button 
              onClick={handleSearchGroup}
              disabled={isJoining || !joinCode.trim()}
              className="w-full bg-khrate-500 hover:bg-khrate-600"
            >
              {isJoining ? 'Searching...' : 'Find Group'}
            </Button>

            <div className="text-center">
              <Button variant="link" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Group Info */}
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{foundGroup.name}</h3>
                <Badge variant="outline">
                  Code: {foundGroup.join_code}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{totalMembers}/{foundGroup.max_participants} members</span>
                </div>
                <div className="flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  <span>{foundGroup.discount_percentage}% group discount</span>
                </div>
              </div>
            </div>

            {/* Group Members */}
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Group Members ({paidMembers}/{totalMembers} paid)
              </h4>
              
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {groupMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-2 bg-white border rounded">
                    <span className="text-sm">{member.name}</span>
                    <Badge className={getStatusColor(member.status)}>
                      {member.status === 'paid' ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Paid
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </>
                      )}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Group Items Preview */}
            {foundGroup.items && foundGroup.items.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Items in Group
                </h4>
                <div className="space-y-1 max-h-24 overflow-y-auto">
                  {foundGroup.items.slice(0, 5).map((item: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm p-2 bg-white border rounded">
                      <span>{item.name}</span>
                      <span className="text-gray-600">{item.quantity} {item.unit}</span>
                    </div>
                  ))}
                  {foundGroup.items.length > 5 && (
                    <p className="text-xs text-gray-500 text-center">
                      +{foundGroup.items.length - 5} more items
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Next step:</strong> Join this group and start adding items to your group cart. 
                You can proceed to checkout once you've selected your items.
              </p>
            </div>

            <DialogFooter className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowGroupPreview(false);
                  setFoundGroup(null);
                }}
              >
                Back
              </Button>
              <Button 
                onClick={handleJoinGroup}
                disabled={isJoining}
                className="bg-khrate-500 hover:bg-khrate-600"
              >
                {isJoining ? 'Joining...' : 'Join Group'}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default JoinGroupModal;
