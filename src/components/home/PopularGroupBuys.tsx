
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, MapPin, Package } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useGroupBuying } from "@/contexts/GroupBuyingContext";
import JoinGroupModal from "@/components/group-buy/JoinGroupModal";
import { toast } from "sonner";

const PopularGroupBuys = () => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const { joinGroup } = useGroupBuying();
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [groups, setGroups] = useState([
    {
      id: 'group-1',
      name: 'Nyamirambo Neighborhood',
      description: 'Weekly groceries for families in Nyamirambo area',
      join_code: 'NYA123',
      location: 'Nyamirambo',
      members: 8,
      max_participants: 12,
      min_participants: 3,
      discount_percentage: 10,
      status: 'active',
      items: [
        { name: 'Rice', quantity: 25, unit: 'kg' },
        { name: 'Beans', quantity: 10, unit: 'kg' },
        { name: 'Oil', quantity: 5, unit: 'L' },
        { name: 'Sugar', quantity: 5, unit: 'kg' }
      ],
      estimated_total: 45000,
      time_remaining: '2 days',
      created_at: new Date().toISOString()
    },
    {
      id: 'group-2',
      name: 'Kigali City Bulk Buy',
      description: 'Monthly bulk purchase for office workers',
      join_code: 'KGL456',
      location: 'City Center',
      members: 15,
      max_participants: 20,
      min_participants: 3,
      discount_percentage: 10,
      status: 'active',
      items: [
        { name: 'Coffee', quantity: 10, unit: 'kg' },
        { name: 'Tea', quantity: 5, unit: 'kg' },
        { name: 'Sugar', quantity: 15, unit: 'kg' },
        { name: 'Milk Powder', quantity: 8, unit: 'kg' }
      ],
      estimated_total: 65000,
      time_remaining: '5 days',
      created_at: new Date().toISOString()
    },
    {
      id: 'group-3',
      name: 'Student Housing Group',
      description: 'Affordable groceries for students near university',
      join_code: 'STU789',
      location: 'Remera',
      members: 6,
      max_participants: 15,
      min_participants: 3,
      discount_percentage: 10,
      status: 'active',
      items: [
        { name: 'Rice', quantity: 20, unit: 'kg' },
        { name: 'Cooking Oil', quantity: 3, unit: 'L' },
        { name: 'Tomatoes', quantity: 10, unit: 'kg' },
        { name: 'Onions', quantity: 8, unit: 'kg' }
      ],
      estimated_total: 32000,
      time_remaining: '1 day',
      created_at: new Date().toISOString()
    }
  ]);

  const formatPrice = (price: number) => {
    return `RWF ${price.toLocaleString()}`;
  };

  const handleJoinGroup = async (groupId: string) => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    try {
      await joinGroup(groupId);
      toast.success('Successfully joined the group!');
    } catch (error) {
      console.error('Error joining group:', error);
      toast.error('Failed to join group. Please try again.');
    }
  };

  const getStatusColor = (members: number, minParticipants: number) => {
    if (members >= minParticipants) {
      return 'bg-green-100 text-green-800';
    }
    return 'bg-yellow-100 text-yellow-800';
  };

  const getProgressPercentage = (members: number, maxParticipants: number) => {
    return Math.min((members / maxParticipants) * 100, 100);
  };

  return (
    <>
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Group Buys</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Join active groups in your area and save money on bulk purchases
            </p>
          </div>
        
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {groups.map((group) => {
              const qualifiesForDiscount = group.members >= group.min_participants;
              const progressPercentage = getProgressPercentage(group.members, group.max_participants);
              
              return (
                <Card key={group.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-lg font-semibold line-clamp-2">
                        {group.name}
                      </CardTitle>
                      <Badge className={getStatusColor(group.members, group.min_participants)}>
                        {qualifiesForDiscount ? 'Ready' : 'Collecting'}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm line-clamp-2">
                      {group.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Location and Code */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="h-3 w-3" />
                        <span>{group.location}</span>
                      </div>
                      <div className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {group.join_code}
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span>{group.members}/{group.max_participants} members</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Clock className="h-3 w-3" />
                          <span>{group.time_remaining}</span>
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-khrate-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Items Preview */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-1 text-sm font-medium">
                        <Package className="h-3 w-3" />
                        <span>Items ({group.items.length})</span>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        {group.items.slice(0, 3).map((item, index) => (
                          <div key={index} className="flex justify-between">
                            <span>{item.name}</span>
                            <span>{item.quantity} {item.unit}</span>
                          </div>
                        ))}
                        {group.items.length > 3 && (
                          <div className="text-center text-khrate-500">
                            +{group.items.length - 3} more items
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Price and Discount */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Estimated Total:</span>
                        <div className="text-right">
                          {qualifiesForDiscount ? (
                            <div>
                              <span className="text-lg font-bold text-khrate-600">
                                {formatPrice(group.estimated_total * 0.9)}
                              </span>
                              <span className="text-sm text-gray-500 line-through ml-2">
                                {formatPrice(group.estimated_total)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-lg font-bold text-gray-600">
                              {formatPrice(group.estimated_total)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {qualifiesForDiscount && (
                        <div className="text-xs text-green-600 text-right">
                          🎉 10% discount applied!
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      onClick={() => handleJoinGroup(group.id)}
                      className="w-full bg-khrate-500 hover:bg-khrate-600"
                      size="sm"
                    >
                      Join Group
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Button 
              variant="outline"
              onClick={() => setShowJoinModal(true)}
              className="border-khrate-500 text-khrate-600 hover:bg-khrate-50"
            >
              Join with Code
            </Button>
          </div>
        </div>
      </section>

      <JoinGroupModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
      />
    </>
  );
};

export default PopularGroupBuys;
