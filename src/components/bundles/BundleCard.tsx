
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BundleAddToCartButton from './BundleAddToCartButton';
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
      type: 'bundle',
      items
    };

    console.log('Adding bundle to cart:', bundleItem);
    await addToCart(bundleItem, false);
  };

  const isAdding = isAddingToCart(id, 'bundle');

  return (
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
        <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover"
          />
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
          
          <BundleAddToCartButton
            onAddToCart={handleAddToCart}
            isAdding={isAdding}
            className="w-full"
          />
        </div>
      </CardFooter>
    </Card>
  );
};

export default BundleCard;
