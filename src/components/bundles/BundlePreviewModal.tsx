
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

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

interface BundlePreviewModalProps {
  bundle: Bundle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToCart: () => void;
}

const BundlePreviewModal: React.FC<BundlePreviewModalProps> = ({
  bundle,
  open,
  onOpenChange,
  onAddToCart
}) => {
  if (!bundle) return null;

  const bundleName = bundle.title || bundle.name || 'Bundle';

  const renderItems = () => {
    if (Array.isArray(bundle.items) && bundle.items.length > 0) {
      if (typeof bundle.items[0] === 'object' && 'name' in bundle.items[0]) {
        // Bundle items with quantity
        return (bundle.items as BundleItem[]).map((item, index) => (
          <li key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-700">{item.name}</span>
            <span className="text-gray-500 text-sm">{item.quantity}kg</span>
          </li>
        ));
      } else {
        // String array items
        return (bundle.items as string[]).map((item, index) => (
          <li key={index} className="py-2 border-b border-gray-100 text-gray-700">
            {item}
          </li>
        ));
      }
    }
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{bundleName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="aspect-square">
            <img
              src={bundle.image}
              alt={bundleName}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          
          <p className="text-gray-600">{bundle.description}</p>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900">What's included:</h4>
            <ul className="space-y-1 max-h-48 overflow-y-auto">
              {renderItems()}
            </ul>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t">
            <p className="text-khrate-500 font-bold text-xl">
              {bundle.price.toLocaleString()} RWF
            </p>
            <Button 
              onClick={onAddToCart}
              className="bg-khrate-500 hover:bg-khrate-600"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BundlePreviewModal;
