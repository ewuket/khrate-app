
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, Clock, Zap } from "lucide-react";
import GroupPreviewModal from "./GroupPreviewModal";

interface PresetGroupsProps {
  onJoinGroup: (groupId: string) => void;
}

const PresetGroups: React.FC<PresetGroupsProps> = ({ onJoinGroup }) => {
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  const presetGroups = [
    {
      id: 'family-essentials',
      name: 'Family Essentials',
      description: 'Perfect for families looking to stock up on daily necessities',
      memberCount: 8,
      maxMembers: 12,
      discount: '15% off',
      location: 'Kigali City',
      estimatedDelivery: 'Tomorrow by 2 PM',
      sampleItems: ['Rice 25kg', 'Cooking Oil 5L', 'Sugar 2kg', 'Beans 5kg'],
      totalValue: 45000,
      tag: 'Popular'
    },
    {
      id: 'office-snacks',
      name: 'Office Snacks',
      description: 'Keep your workplace energized with bulk office snacks',
      memberCount: 5,
      maxMembers: 10,
      discount: '12% off',
      location: 'Kigali CBD',
      estimatedDelivery: 'Today by 6 PM',
      sampleItems: ['Coffee packets', 'Biscuits', 'Juice boxes', 'Nuts mix'],
      totalValue: 28000,
      tag: 'Fast'
    },
    {
      id: 'fresh-produce',
      name: 'Fresh Produce',
      description: 'Fresh fruits and vegetables delivered daily',
      memberCount: 12,
      maxMembers: 15,
      discount: '20% off',
      location: 'Nyarutarama',
      estimatedDelivery: 'Daily delivery available',
      sampleItems: ['Tomatoes 5kg', 'Onions 3kg', 'Bananas bunch', 'Avocados 2kg'],
      totalValue: 35000,
      tag: 'Best Deal'
    }
  ];

  const handlePreviewGroup = (group: any) => {
    setSelectedGroup(group);
    setShowPreview(true);
  };

  const handleJoinGroup = (groupId: string) => {
    setShowPreview(false);
    onJoinGroup(groupId);
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Join Active Groups</h2>
        <p className="text-muted-foreground mb-6">
          Jump into these popular group buying sessions happening right now
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {presetGroups.map((group) => (
            <Card key={group.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <CardDescription className="mt-1">{group.description}</CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {group.tag}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-khrate-500" />
                    <span>{group.memberCount}/{group.maxMembers} members</span>
                    <Badge variant="outline" className="ml-auto text-green-600 border-green-200">
                      {group.discount}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{group.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{group.estimatedDelivery}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Sample items:</p>
                  <p className="text-sm text-muted-foreground">
                    {group.sampleItems.slice(0, 2).join(', ')}
                    {group.sampleItems.length > 2 && ` +${group.sampleItems.length - 2} more`}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handlePreviewGroup(group)}
                    className="flex-1"
                  >
                    Preview
                  </Button>
                  <Button 
                    onClick={() => handleJoinGroup(group.id)}
                    className="flex-1 bg-khrate-500 hover:bg-khrate-600"
                  >
                    <Zap className="mr-1 h-3 w-3" />
                    Join Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <GroupPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        group={selectedGroup}
      />
    </>
  );
};

export default PresetGroups;
