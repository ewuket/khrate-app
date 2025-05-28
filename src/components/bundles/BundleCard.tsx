
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useSupabaseCart } from "@/contexts/SupabaseCartContext";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import GroupBuyButton from "@/components/group-buy/GroupBuyButton";

interface BundleItem {
  name: string;
  quantity: number;
}

interface Bundle {
  id: number;
  title?: string;
  name?: string;
  description: string;
  price: number;
  image: string;
  items: BundleItem[] | string[];
}

interface BundleCardProps {
  bundle: Bundle;
  onSaveBundle?: (bundleId: number) => void;
}

const BundleCard: React.FC<BundleCardProps> = ({ bundle, onSaveBundle }) => {
  const { addToCart } = useSupabaseCart();
  const { user } = useAuth();

  const bundleName = bundle.title || bundle.name || 'Bundle';

  const handleAddToCart = async () => {
    try {
      await addToCart({
        id: bundle.id,
        name: bundleName,
        price: bundle.price,
        unit: 'bundle',
        items: bundle.items
      }, 'bundle');
      
      toast.success(`${bundleName} added to cart`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const renderItems = () => {
    if (Array.isArray(bundle.items) && bundle.items.length > 0) {
      if (typeof bundle.items[0] === 'object' && 'name' in bundle.items[0]) {
        // Bundle items with quantity
        return (bundle.items as BundleItem[]).map((item, index) => (
          <li key={index} className="text-sm text-gray-600">
            {item.quantity}kg {item.name}
          </li>
        ));
      } else {
        // String array items
        return (bundle.items as string[]).map((item, index) => (
          <li key={index} className="text-sm text-gray-600">
            {item}
          </li>
        ));
      }
    }
    return null;
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle>{bundleName}</CardTitle>
        <CardDescription>{bundle.description}</CardDescription>
      </CardHeader>
      
      <div className="aspect-square">
        <img
          src={bundle.image}
          alt={bundleName}
          className="w-full h-full object-cover"
        />
      </div>
      
      <CardContent className="p-6">
        <div className="mb-4">
          <h4 className="text-lg font-semibold mb-2">What's included:</h4>
          <ul className="list-disc pl-4 space-y-1">
            {renderItems()}
          </ul>
          <p className="text-khrate-500 font-bold text-xl mt-3">
            {bundle.price.toLocaleString()} RWF
          </p>
        </div>
        
        <div className="space-y-2">
          <Button 
            className="w-full bg-khrate-500 hover:bg-khrate-600"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add Bundle to Cart
          </Button>
          
          <GroupBuyButton
            item={{
              id: bundle.id,
              name: bundleName,
              price: bundle.price,
              unit: 'bundle',
              type: 'bundle',
              items: bundle.items
            }}
            variant="outline"
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BundleCard;
