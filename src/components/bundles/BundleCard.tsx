
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye } from "lucide-react";
import { useCartContext } from "@/contexts/CartContext";
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
  const { addToCart } = useCartContext();
  const { user } = useAuth();
  const [previewOpen, setPreviewOpen] = useState(false);

  const bundleName = bundle.title || bundle.name || 'Bundle';

  const handleAddToCart = async () => {
    try {
      console.log('Adding bundle to cart:', bundle);
      
      await addToCart({
        id: bundle.id,
        name: bundleName,
        price: bundle.price,
        unit: 'bundle',
        items: bundle.items,
        type: 'bundle'
      }, true); // Skip cart open for bundles
      
      toast.success(`${bundleName} added to cart!`);
      setPreviewOpen(false);
    } catch (error) {
      console.error('Error adding bundle to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-white">
        {/* Image Section */}
        <div className="aspect-[4/3] w-full bg-gray-50">
          <img
            src={bundle.image}
            alt={bundleName}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Content Section - Title and Description below image */}
        <CardContent className="p-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{bundleName}</h3>
            <p className="text-gray-600 text-sm mb-3">{bundle.description}</p>
            
            <p className="text-khrate-500 font-bold text-2xl mb-4">
              {bundle.price.toLocaleString()} RWF
            </p>
          </div>
          
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full border-gray-300 text-gray-700"
              onClick={() => setPreviewOpen(true)}
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview Items
            </Button>
            
            <Button 
              className="w-full bg-khrate-500 hover:bg-khrate-600 text-white"
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
