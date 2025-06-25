
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ShoppingCart } from "lucide-react";
import BundlePreviewModal from './BundlePreviewModal';
import { useCartContext } from '@/contexts/CartContext';

interface BundleCardProps {
  id: number;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  items: string[];
  image: string;
  features?: string[];
  onClick?: () => void;
}

const BundleCard: React.FC<BundleCardProps> = ({
  id,
  title,
  description,
  price,
  originalPrice,
  discount,
  items,
  image,
  features = [],
  onClick
}) => {
  const { addToCart } = useCartContext();
  const [showPreview, setShowPreview] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} RWF`;
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAdding) return; // Prevent double clicks
    
    setIsAdding(true);
    
    const bundleItem = {
      id,
      name: title,
      price,
      unit: 'bundle',
      type: 'bundle' as const,
      items
    };

    console.log('Adding bundle to cart:', bundleItem);
    
    try {
      await addToCart(bundleItem);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      // Reset adding state quickly to allow multiple additions
      setTimeout(() => {
        setIsAdding(false);
      }, 500);
    }
  };

  const handlePreview = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPreview(true);
  };

  const bundleForPreview = {
    id,
    title,
    price,
    originalPrice,
    image,
    items: items.map(item => {
      const parts = item.split(' (');
      const name = parts[0];
      const quantityPart = parts[1]?.replace(')', '') || '';
      const [quantity, unit] = quantityPart.split(' ');
      return {
        name,
        quantity: quantity || '1',
        unit: unit || 'piece'
      };
    }),
    description
  };

  return (
    <>
      <Card 
        className="cursor-pointer hover:shadow-xl transition-all duration-300 h-full flex flex-col group overflow-hidden border-gray-200 hover:border-khrate-300"
        onClick={onClick}
      >
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <CardTitle className="text-lg font-bold text-gray-900 mb-2 group-hover:text-khrate-600 transition-colors line-clamp-2">
                {title}
              </CardTitle>
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{description}</p>
            </div>
            {discount > 0 && (
              <Badge variant="destructive" className="ml-2 bg-red-500 text-white font-semibold text-xs">
                -{discount}%
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-1">
          <div className="relative aspect-video bg-gradient-to-br from-khrate-50 to-khrate-100 rounded-xl mb-4 overflow-hidden group-hover:shadow-lg transition-shadow">
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
            <Button
              onClick={handlePreview}
              className="absolute top-3 right-3 bg-white/90 hover:bg-white text-khrate-600 shadow-lg backdrop-blur-sm p-2 h-8 w-8 rounded-full"
              size="sm"
            >
              <Eye className="h-3 w-3" />
            </Button>
          </div>

          {features.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-1">
                {features.slice(0, 2).map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
                {features.length > 2 && (
                  <Badge variant="outline" className="text-xs text-khrate-600">
                    +{features.length - 2} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500 mb-2">
            {items.length} items included
          </div>
        </CardContent>

        <CardFooter className="pt-3 border-t bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="w-full space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-khrate-600">
                    {formatPrice(price)}
                  </span>
                  {originalPrice > price && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(originalPrice)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">Per bundle</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handlePreview}
                variant="outline"
                className="flex-1 text-xs border-khrate-200 hover:bg-khrate-50 h-8"
                size="sm"
              >
                <Eye className="h-3 w-3 mr-1" />
                Preview
              </Button>
              <Button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="flex-1 bg-khrate-500 hover:bg-khrate-600 text-white text-xs shadow-md h-8"
                size="sm"
              >
                <ShoppingCart className="h-3 w-3 mr-1" />
                {isAdding ? 'Adding...' : 'Add to Cart'}
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>

      <BundlePreviewModal
        bundle={bundleForPreview}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        onAddToCart={handleAddToCart}
        isAdding={isAdding}
      />
    </>
  );
};

export default BundleCard;
