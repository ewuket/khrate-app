
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import BundleAddToCartButton from './BundleAddToCartButton';
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
  const { addToCart, isAddingToCart } = useCartContext();
  const [showPreview, setShowPreview] = useState(false);

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} RWF`;
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const bundleItem = {
      id,
      name: title,
      price,
      unit: 'bundle',
      type: 'bundle' as const,
      items
    };

    console.log('Adding bundle to cart:', bundleItem);
    await addToCart(bundleItem);
  };

  const handlePreview = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPreview(true);
  };

  const isAdding = isAddingToCart(id, 'bundle');

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
        className="cursor-pointer hover:shadow-lg transition-shadow duration-200 h-full flex flex-col"
        onClick={onClick}
      >
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                {title}
              </CardTitle>
              <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
            </div>
            {discount > 0 && (
              <Badge variant="destructive" className="ml-2 bg-red-500 text-white">
                -{discount}%
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-1">
          <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden relative">
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover"
            />
            <Button
              onClick={handlePreview}
              className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white p-2 h-8 w-8"
              size="sm"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">What's included:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {items.slice(0, 4).map((item, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-khrate-500 rounded-full mr-2 flex-shrink-0"></span>
                    {item}
                  </li>
                ))}
                {items.length > 4 && (
                  <li className="text-khrate-600 font-medium">
                    +{items.length - 4} more items
                  </li>
                )}
              </ul>
            </div>

            {features.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Features:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 flex-shrink-0"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-4 border-t bg-gray-50">
          <div className="w-full space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-khrate-600">
                    {formatPrice(price)}
                  </span>
                  {originalPrice > price && (
                    <span className="text-lg text-gray-500 line-through">
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
                className="flex-1 text-sm"
                size="sm"
              >
                Preview
              </Button>
              <div className="flex-1">
                <BundleAddToCartButton
                  onAddToCart={handleAddToCart}
                  isAdding={isAdding}
                  className="w-full text-sm"
                  size="sm"
                />
              </div>
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
