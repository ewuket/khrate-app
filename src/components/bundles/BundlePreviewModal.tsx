
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, X } from "lucide-react";

interface BundlePreviewModalProps {
  bundle: {
    id: number;
    title: string;
    price: number;
    originalPrice: number;
    image: string;
    items: Array<{
      name: string;
      quantity: string;
      unit: string;
    }>;
    description: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (e: React.MouseEvent) => void;
  isAdding: boolean;
}

const BundlePreviewModal: React.FC<BundlePreviewModalProps> = ({
  bundle,
  isOpen,
  onClose,
  onAddToCart,
  isAdding
}) => {
  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} RWF`;
  };

  const discount = bundle.originalPrice > bundle.price
    ? Math.round(((bundle.originalPrice - bundle.price) / bundle.originalPrice) * 100)
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative">
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="absolute -top-2 -right-2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
          <DialogTitle className="text-xl font-bold text-gray-900 pr-8">
            {bundle.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Image and basic info */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-shrink-0">
              <img
                src={bundle.image}
                alt={bundle.title}
                className="w-full md:w-48 h-32 md:h-32 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </div>
            
            <div className="flex-1 space-y-2">
              <p className="text-sm text-gray-600 leading-relaxed">{bundle.description}</p>
              
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-khrate-600">
                  {formatPrice(bundle.price)}
                </span>
                {bundle.originalPrice > bundle.price && (
                  <>
                    <span className="text-lg text-gray-500 line-through">
                      {formatPrice(bundle.originalPrice)}
                    </span>
                    <Badge variant="destructive" className="bg-red-500 text-white">
                      -{discount}% OFF
                    </Badge>
                  </>
                )}
              </div>
              
              <p className="text-xs text-gray-500">{bundle.items.length} items included</p>
            </div>
          </div>

          {/* Items list */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Bundle Contents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {bundle.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <span className="text-sm font-medium text-gray-800">{item.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {item.quantity} {item.unit}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Close
            </Button>
            <Button
              onClick={onAddToCart}
              disabled={isAdding}
              className="flex-1 bg-khrate-500 hover:bg-khrate-600 text-white"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BundlePreviewModal;
