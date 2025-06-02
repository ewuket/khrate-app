
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Users, X } from "lucide-react";
import { useCartContext } from "@/contexts/CartContext";
import { toast } from "sonner";
import GroupBuyButton from "@/components/group-buy/GroupBuyButton";

interface Bundle {
  id: number;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  savings: number;
  category: string;
  image: string;
  items: string[];
  delivery: string;
}

interface BundlePreviewModalProps {
  bundle: Bundle | null;
  isOpen: boolean;
  onClose: () => void;
}

const BundlePreviewModal: React.FC<BundlePreviewModalProps> = ({ bundle, isOpen, onClose }) => {
  const { addToCart } = useCartContext();

  if (!bundle) return null;

  const handleAddToCart = async () => {
    try {
      const bundleItem = {
        id: bundle.id,
        name: bundle.title,
        price: bundle.price,
        unit: 'bundle',
        type: 'bundle',
        items: bundle.items
      };

      await addToCart(bundleItem);
      toast.success(`${bundle.title} added to cart!`);
      onClose();
    } catch (error) {
      console.error('Error adding bundle to cart:', error);
      toast.error('Failed to add bundle to cart');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold pr-8">{bundle.title}</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 hover:bg-gray-100 absolute right-4 top-4"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="aspect-[4/3] rounded-lg overflow-hidden">
              <img 
                src={bundle.image} 
                alt={bundle.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground">{bundle.description}</p>
              <p className="text-sm text-muted-foreground">📦 {bundle.delivery}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-khrate-600">{bundle.price.toLocaleString()} RWF</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="line-through">{bundle.originalPrice.toLocaleString()} RWF</span>
                <span className="text-green-600 font-medium">Save {bundle.savings.toLocaleString()} RWF</span>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-2">What's included:</h4>
              <ul className="space-y-1">
                {bundle.items.map((item, index) => (
                  <li key={index} className="text-sm flex items-center gap-2">
                    <span className="w-1 h-1 bg-khrate-500 rounded-full"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div className="space-y-3">
              <Button 
                className="w-full bg-khrate-500 hover:bg-khrate-600"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              
              <GroupBuyButton 
                item={{
                  id: bundle.id,
                  name: bundle.title,
                  price: bundle.price,
                  unit: 'bundle',
                  type: 'bundle',
                  items: bundle.items
                }}
                variant="outline"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BundlePreviewModal;
