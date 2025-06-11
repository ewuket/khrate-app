
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import BundlePreviewModal from './BundlePreviewModal';
import BundleAddToCartButton from './BundleAddToCartButton';
import GroupBuyButton from '../group-buy/GroupBuyButton';
import { useCartContext } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface BundleItem {
  name: string;
  quantity: number;
  unit: string;
}

interface BundleCardProps {
  id: number;
  title: string;
  price: number;
  originalPrice: number;
  items: BundleItem[];
  image?: string;
  description?: string;
}

const BundleCard: React.FC<BundleCardProps> = ({
  id,
  title,
  price,
  originalPrice,
  items,
  image,
  description
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const { addToCart, isAddingToCart } = useCartContext();

  const savings = originalPrice - price;
  const savingsPercentage = Math.round((savings / originalPrice) * 100);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      console.log('Adding bundle to cart:', { id, title, price, items });
      
      const bundleItem = {
        id,
        name: title,
        title,
        price,
        unit: 'bundle',
        type: 'bundle' as const,
        items: items.map(item => `${item.quantity} ${item.unit} ${item.name}`)
      };
      
      await addToCart(bundleItem);
      console.log('Bundle added to cart successfully');
    } catch (error) {
      console.error('Error adding bundle to cart:', error);
      toast.error('Failed to add bundle to cart. Please try again.');
    }
  };

  const groupBuyItem = {
    id,
    name: title,
    price,
    unit: 'bundle',
    type: 'bundle',
    items: items.map(item => `${item.quantity} ${item.unit} ${item.name}`)
  };

  return (
    <>
      <Card className="h-full flex flex-col group hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-khrate-300">
        <div className="relative overflow-hidden rounded-t-lg">
          {image ? (
            <img 
              src={image} 
              alt={title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-khrate-100 to-khrate-200 flex items-center justify-center">
              <span className="text-khrate-600 font-medium">Bundle Image</span>
            </div>
          )}
          
          <Badge 
            variant="destructive" 
            className="absolute top-3 right-3 bg-green-500 hover:bg-green-600"
          >
            Save {savingsPercentage}%
          </Badge>

          <button
            onClick={() => setShowPreview(true)}
            className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
          >
            <div className="bg-white rounded-full p-2 shadow-lg">
              <Eye className="h-5 w-5 text-khrate-600" />
            </div>
          </button>
        </div>

        <CardContent className="flex-1 flex flex-col p-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2 text-gray-900 line-clamp-2">
              {title}
            </h3>
            
            {description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {description}
              </p>
            )}

            <div className="space-y-2 mb-4">
              <p className="text-sm font-medium text-gray-700">
                Includes {items.length} items:
              </p>
              <div className="space-y-1">
                {items.slice(0, 3).map((item, index) => (
                  <p key={index} className="text-xs text-gray-600">
                    • {item.quantity} {item.unit} {item.name}
                  </p>
                ))}
                {items.length > 3 && (
                  <p className="text-xs text-khrate-600 font-medium">
                    +{items.length - 3} more items
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-khrate-600">
                  {price.toLocaleString()} RWF
                </span>
                <span className="text-sm text-gray-500 line-through ml-2">
                  {originalPrice.toLocaleString()} RWF
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <BundleAddToCartButton 
                  onAddToCart={handleAddToCart}
                  isAdding={isAddingToCart(id, 'bundle')}
                  className="w-full"
                />
              </div>
              <GroupBuyButton 
                item={groupBuyItem}
                variant="outline"
                size="default"
                className="px-3"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <BundlePreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        bundle={{
          id,
          title,
          price,
          originalPrice,
          items,
          image: image || "/lovable-uploads/4730e151-0c90-4bde-a3cf-7eb370e2cac1.png"
        }}
        onAddToCart={handleAddToCart}
        isAdding={isAddingToCart(id, 'bundle')}
      />
    </>
  );
};

export default BundleCard;
