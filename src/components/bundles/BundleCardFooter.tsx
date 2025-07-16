
import React from 'react';
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, ShoppingCart } from "lucide-react";

interface BundleCardFooterProps {
  price: number;
  originalPrice: number;
  isAdding: boolean;
  onPreview: (e: React.MouseEvent) => void;
  onAddToCart: (e: React.MouseEvent) => void;
}

const BundleCardFooter: React.FC<BundleCardFooterProps> = ({
  price,
  originalPrice,
  isAdding,
  onPreview,
  onAddToCart
}) => {
  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} RWF`;
  };

  return (
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
            onClick={onPreview}
            variant="outline"
            className="flex-1 text-xs border-khrate-200 hover:bg-khrate-50 h-8"
            size="sm"
          >
            <Eye className="h-3 w-3 mr-1" />
            Preview
          </Button>
          <Button
            onClick={onAddToCart}
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
  );
};

export default BundleCardFooter;
