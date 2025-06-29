
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShoppingCart, Percent, UserPlus } from "lucide-react";
import GroupBuyFeatures from './GroupBuyFeatures';
import HowItWorks from './HowItWorks';
import PresetGroups from './PresetGroups';
import JoinGroupModal from './JoinGroupModal';
import GroupPreviewModal from './GroupPreviewModal';

interface NoGroupViewProps {
  onJoinGroup: (joinCode: string) => void;
  isJoining: boolean;
}

const NoGroupView = ({ onJoinGroup, isJoining }: NoGroupViewProps) => {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);

  const handleSelectGroup = (group: any) => {
    setSelectedGroup(group);
    setShowPreviewModal(true);
  };

  const handleJoinSelectedGroup = () => {
    if (selectedGroup) {
      onJoinGroup(selectedGroup.join_code);
      setShowPreviewModal(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-br from-khrate-50 to-khrate-100 rounded-lg">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Join Group Buying & Save More
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Team up with others to unlock bulk discounts on fresh groceries and essentials
          </p>
          
          <div className="flex justify-center">
            <Button 
              className="bg-khrate-500 hover:bg-khrate-600 text-white px-8 py-3 text-lg"
              onClick={() => setShowJoinModal(true)}
              size="lg"
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Join Existing Group
            </Button>
          </div>
        </div>
      </div>

      {/* Benefits Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <ShoppingCart className="h-8 w-8 text-khrate-500" />
            <CardTitle>Bulk Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Get better prices when you order together with your neighbors and friends
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Users className="h-8 w-8 text-khrate-500" />
            <CardTitle>Community Driven</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Connect with people in your area and build lasting relationships
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Percent className="h-8 w-8 text-khrate-500" />
            <CardTitle>Guaranteed Discounts</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Enjoy up to 15% off when your group reaches the minimum order size
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Featured Groups */}
      <PresetGroups onSelectGroup={handleSelectGroup} />

      {/* How It Works */}
      <HowItWorks />

      {/* Features */}
      <GroupBuyFeatures />

      {/* Modals */}
      <JoinGroupModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
      />

      <GroupPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        group={selectedGroup}
      />
    </div>
  );
};

export default NoGroupView;
