
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye } from "lucide-react";
import { useSupabaseCart } from "@/contexts/SupabaseCartContext";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import GroupBuyButton from "@/components/group-buy/GroupBuyButton";
import BundlePreviewModal from "./BundlePreviewModal";

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
  const [previewOpen, setPreviewOpen] = useState(false);

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
      setPreviewOpen(false);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  return (
    <>
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
            <p className="text-khrate-500 font-bold text-xl mb-3">
              {bundle.price.toLocaleString()} RWF
            </p>
            
            <Button 
              variant="outline" 
              className="w-full mb-3"
              onClick={() => setPreviewOpen(true)}
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview Items
            </Button>
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

      <BundlePreviewModal
        bundle={bundle}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        onAddToCart={handleAddToCart}
      />
    </>
  );
};

export default BundleCard;
