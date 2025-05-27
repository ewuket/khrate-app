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
    title: string;
    description: string;
    price: number;
    image: string;
    items: { name: string; quantity: number }[];
  };
  onSaveBundle?: (bundleId: number) => void;
}

const BundleCard: React.FC<BundleCardProps> = ({ bundle, onSaveBundle }) => {
  const { addToCart, openCart } = useSupabaseCart();
  const { user } = useAuth();
  
  const handleSaveBundle = () => {
    if (onSaveBundle) {
      onSaveBundle(bundle.id);
      toast.success("Bundle saved!");
    }
  };

  const handleAddToCart = async () => {
    await addToCart({
      product_id: bundle.id,
      product_name: bundle.title,
      product_price: bundle.price,
      product_type: 'bundle',
      product_unit: 'bundle',
      product_items: bundle.items,
      quantity: 1
    });
    
    toast.success(`${bundle.title} added to cart`);
    
    // Auto-open cart sidebar
    setTimeout(() => {
      openCart();
    }, 500);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle>{bundle.title}</CardTitle>
        <CardDescription>{bundle.description}</CardDescription>
      </CardHeader>
      
      <div className="aspect-square">
        <img 
          src={bundle.image} 
          alt={bundle.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      <CardContent className="p-6">
        <div className="mb-4">
          <h4 className="text-lg font-semibold mb-2">What's included:</h4>
          <ul className="list-disc pl-4 space-y-1">
            {bundle.items.map((item, index) => (
              <li key={index}>
                {item.quantity} {item.name}
              </li>
            ))}
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
              name: bundle.title,
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
