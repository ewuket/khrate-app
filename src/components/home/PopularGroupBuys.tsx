
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Eye, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useGroupBuying } from "@/contexts/GroupBuyingContext";
import { toast } from "sonner";
import BundlePreviewModal from "@/components/bundles/BundlePreviewModal";

const popularGroups = [
  {
    id: 1,
    name: "Weekend Groceries Group",
    description: "Fresh produce and essentials for the weekend",
    memberCount: 5,
    maxMembers: 8,
    discountPercentage: 10,
    timeLeft: "2 days",
    bundle: {
      id: 101,
      title: "Weekend Bundle",
      price: 45000,
      originalPrice: 50000,
      image: "/lovable-uploads/4730e151-0c90-4bde-a3cf-7eb370e2cac1.png",
      items: [
        { name: "Fresh Vegetables", quantity: 3 },
        { name: "Fruits", quantity: 2 },
        { name: "Bread", quantity: 2 },
        { name: "Milk", quantity: 2 },
        { name: "Eggs", quantity: 12 }
      ]
    }
  },
  {
    id: 2,
    name: "Family Essentials Group",
    description: "Complete family grocery package",
    memberCount: 7,
    maxMembers: 10,
    discountPercentage: 15,
    timeLeft: "1 day",
    bundle: {
      id: 102,
      title: "Family Bundle",
      price: 85000,
      originalPrice: 100000,
      image: "/lovable-uploads/6d22b9d7-17a9-457a-947a-9bb8301a4051.png",
      items: [
        { name: "Rice", quantity: 15 },
        { name: "Beans", quantity: 5 },
        { name: "Oil", quantity: 3 },
        { name: "Sugar", quantity: 3 },
        { name: "Vegetables", quantity: 5 },
        { name: "Meat", quantity: 2 }
      ]
    }
  },
  {
    id: 3,
    name: "Office Lunch Group",
    description: "Quick lunch solutions for busy professionals",
    memberCount: 3,
    maxMembers: 6,
    discountPercentage: 10,
    timeLeft: "3 days",
    bundle: {
      id: 103,
      title: "Lunch Bundle",
      price: 25000,
      originalPrice: 28000,
      image: "/lovable-uploads/30fe686e-a6f6-469f-bb69-c889c304c4e7.png",
      items: [
        { name: "Sandwich Bread", quantity: 3 },
        { name: "Cold Cuts", quantity: 1 },
        { name: "Cheese", quantity: 1 },
        { name: "Snacks", quantity: 5 },
        { name: "Drinks", quantity: 6 }
      ]
    }
  }
];

const PopularGroupBuys = () => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const { joinGroup } = useGroupBuying();
  const [selectedBundle, setSelectedBundle] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleJoinGroup = async (group: typeof popularGroups[0]) => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    try {
      // Simulate joining with a mock join code
      const mockJoinCode = `GROUP${group.id}`;
      await joinGroup(mockJoinCode);
      toast.success(`Successfully joined ${group.name}!`);
    } catch (error) {
      console.error('Error joining group:', error);
      toast.error('Failed to join group. Please try again.');
    }
  };

  const handlePreview = (group: typeof popularGroups[0]) => {
    setSelectedBundle(group.bundle);
    setShowPreview(true);
  };

  const formatPrice = (price: number) => {
    return `RWF ${price.toLocaleString()}`;
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    // Mock cart functionality - just close the modal
    setShowPreview(false);
    toast.success('Item added to cart!');
  };

  return (
    <>
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Group Buys</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Join active groups and save money together with your neighbors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularGroups.map((group) => (
              <Card key={group.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden bg-white border">
                <div className="relative overflow-hidden">
                  <img 
                    src={group.bundle.image} 
                    alt={group.bundle.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <Badge 
                    variant="destructive" 
                    className="absolute top-3 right-3 bg-green-500 hover:bg-green-600"
                  >
                    {group.discountPercentage}% OFF
                  </Badge>
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {group.name}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {group.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{group.memberCount}/{group.maxMembers} members</span>
                    </div>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{group.timeLeft} left</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-xl font-bold text-khrate-600">
                      {formatPrice(group.bundle.price)}
                    </div>
                    <div className="text-sm text-gray-500 line-through">
                      {formatPrice(group.bundle.originalPrice)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button 
                      onClick={() => handlePreview(group)}
                      variant="outline"
                      className="w-full border-khrate-500 text-khrate-600 hover:bg-khrate-50"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview Bundle
                    </Button>
                    
                    <Button 
                      onClick={() => handleJoinGroup(group)}
                      className="w-full bg-khrate-500 hover:bg-khrate-600 text-white"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Join Group
                    </Button>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-khrate-500 h-2 rounded-full" 
                      style={{ width: `${(group.memberCount / group.maxMembers) * 100}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {selectedBundle && (
        <BundlePreviewModal
          bundle={selectedBundle}
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          onAddToCart={handleAddToCart}
          isAdding={false}
        />
      )}
    </>
  );
};

export default PopularGroupBuys;
