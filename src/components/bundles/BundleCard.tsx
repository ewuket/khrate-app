
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useSupabaseCart } from "@/contexts/SupabaseCartContext";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import GroupBuyButton from "@/components/group-buy/GroupBuyButton";
import { SaveBundleButton } from '../custom-buy/SaveBundleButton';

interface BundleCardProps {
  bundle: {
    id: number;
    name?: string;
    title?: string;
    description: string;
    price: number;
    image: string;
    items: { name: string; quantity: number }[] | string[];
  };
  onSaveBundle?: (bundleId: number) => void;
}

const BundleCard: React.FC<BundleCardProps> = ({ bundle, onSaveBundle }) => {
  const { addToCart, openCart } = useSupabaseCart();
  const { user } = useAuth();
  
  // Handle both name and title properties
  const bundleName = bundle.title || bundle.name || 'Bundle';
  
  const handleSaveBundle = () => {
    if (onSaveBundle) {
      onSaveBundle(bundle.id);
      toast.success("Bundle saved!");
    }
  };

  const handleAddToCart = async () => {
    await addToCart({
      product_id: bundle.id,
      product_name: bundleName,
      product_price: bundle.price,
      product_type: 'bundle',
      product_unit: 'bundle',
      product_items: bundle.items,
      quantity: 1
    }, 'bundle');
    
    toast.success(`${bundleName} added to cart`);
    
    // Auto-open cart sidebar
    setTimeout(() => {
      openCart();
    }, 500);
  };

  // Handle both string[] and object[] formats for items
  const renderItems = () => {
    if (typeof bundle.items[0] === 'string') {
      return (bundle.items as string[]).map((item, index) => (
        <li key={index}>{item}</li>
      ));
    } else {
      return (bundle.items as { name: string; quantity: number }[]).map((item, index) => (
        <li key={index}>
          {item.quantity} {item.name}
        </li>
      ));
    }
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
          <p className="text-orange-500 font-bold text-xl mt-3">
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
          
          {user && onSaveBundle && (
            <SaveBundleButton bundleId={bundle.id} onSaveBundle={handleSaveBundle} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BundleCard;
