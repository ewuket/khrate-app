
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingCart, X } from "lucide-react";

interface BundlePreviewModalProps {
  bundle: {
    id: number;
    title: string;
    price: number;
    originalPrice?: number;
    image: string;
    items: Array<{ name: string; quantity: number | string }>;
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
    return `RWF ${price.toLocaleString()}`;
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(e);
  };

  const handleCheckout = () => {
    // For now, add to cart and close modal
    const syntheticEvent = {
      preventDefault: () => {},
      stopPropagation: () => {},
      currentTarget: null
    } as React.MouseEvent;
    
    onAddToCart(syntheticEvent);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold text-gray-900">
            {bundle.title}
          </DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Smaller Bundle Image */}
          <div className="relative overflow-hidden rounded-lg">
            <img 
              src={bundle.image} 
              alt={bundle.title}
              className="w-full h-32 object-cover"
            />
          </div>
          
          {/* Price */}
          <div className="text-center">
            <div className="text-2xl font-bold text-khrate-600">
              {formatPrice(bundle.price)}
            </div>
            {bundle.originalPrice && (
              <div className="text-sm text-gray-500 line-through">
                {formatPrice(bundle.originalPrice)}
              </div>
            )}
          </div>
          
          {/* Items List */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Items included:</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {bundle.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-700">{item.name}</span>
                  <span className="text-khrate-600 font-medium">
                    {typeof item.quantity === 'number' && item.quantity < 1 
                      ? `${item.quantity}kg` 
                      : item.quantity
                    }
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col space-y-2 pt-4">
            <Button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="w-full bg-khrate-500 hover:bg-khrate-600 text-white"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </Button>
            
            <Button
              onClick={handleCheckout}
              variant="outline"
              className="w-full border-khrate-500 text-khrate-600 hover:bg-khrate-50"
            >
              Checkout Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BundlePreviewModal;
