
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MapPin, Clock, ShoppingCart, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface PresetGroup {
  id: string;
  name: string;
  description: string;
  location: string;
  memberCount: number;
  estimatedDelivery: string;
  discount: string;
  sampleItems: string[];
  totalValue: number;
}

const presetGroups: PresetGroup[] = [
  {
    id: 'norrsken-apartments',
    name: 'Norrsken Side Apartments',
    description: 'Group buy for residents and nearby community',
    location: 'Kigali, Gasabo',
    memberCount: 12,
    estimatedDelivery: 'Same day delivery',
    discount: '15% off',
    sampleItems: ['Rice (5kg)', 'Cooking Oil (2L)', 'Sugar (2kg)', 'Beans (3kg)'],
    totalValue: 15000
  },
  {
    id: 'gisozi-cafe',
    name: 'Gisozi Cafe Side',
    description: 'Local cafe community group order',
    location: 'Gisozi, Gasabo',
    memberCount: 8,
    estimatedDelivery: 'Next day delivery',
    discount: '10% off',
    sampleItems: ['Coffee Beans (1kg)', 'Milk (3L)', 'Bread (5 loaves)', 'Eggs (2 dozen)'],
    totalValue: 12000
  },
  {
    id: 'silverback-mall',
    name: 'Silverback Mall',
    description: 'Shopping mall community collective',
    location: 'Silverback Mall, Kigali',
    memberCount: 15,
    estimatedDelivery: 'Same day delivery',
    discount: '20% off',
    sampleItems: ['Fresh Vegetables Mix', 'Fruits Basket', 'Meat Package (2kg)', 'Dairy Products'],
    totalValue: 25000
  },
  {
    id: '2000-mall',
    name: '2000 Mall',
    description: 'Mall shoppers and nearby residents',
    location: '2000 Mall, Kigali',
    memberCount: 6,
    estimatedDelivery: 'Next day delivery',
    discount: '12% off',
    sampleItems: ['Household Cleaning Kit', 'Personal Care Items', 'Snacks Package'],
    totalValue: 18000
  }
];

interface PresetGroupsProps {
  onJoinGroup: (groupId: string) => void;
}

const PresetGroups: React.FC<PresetGroupsProps> = ({ onJoinGroup }) => {
  const { isAuthenticated, openAuthModal } = useAuth();

  const handleJoinGroup = (groupId: string) => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    onJoinGroup(groupId);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Popular Group Buys</h2>
        <p className="text-muted-foreground">
          Join existing groups in your area for instant discounts
        </p>
        {!isAuthenticated && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-amber-700">
              <Lock className="h-4 w-4" />
              <span className="text-sm font-medium">Login required to join group purchases</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {presetGroups.map((group) => (
          <Card key={group.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{group.name}</span>
                <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">
                  {group.discount}
                </span>
              </CardTitle>
              <CardDescription>{group.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {group.location}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {group.memberCount} members
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {group.estimatedDelivery}
                  </div>
                </div>

                <div className="border-t pt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingCart className="h-4 w-4 text-khrate-500" />
                    <span className="text-sm font-medium">Popular Items:</span>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    {group.sampleItems.map((item, index) => (
                      <div key={index}>• {item}</div>
                    ))}
                  </div>
                  <div className="mt-2 text-sm font-medium text-khrate-600">
                    Avg. Total: {group.totalValue.toLocaleString()} RWF
                  </div>
                </div>

                <Button 
                  onClick={() => handleJoinGroup(group.id)}
                  disabled={!isAuthenticated}
                  className={`w-full ${isAuthenticated ? 'bg-khrate-500 hover:bg-khrate-600' : 'bg-gray-400'}`}
                >
                  {isAuthenticated ? 'Join Group' : 'Login to Join'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PresetGroups;
