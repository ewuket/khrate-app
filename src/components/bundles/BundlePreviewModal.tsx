
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, X, CreditCard } from "lucide-react";
import { useCartContext } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import GroupBuyButton from "@/components/group-buy/GroupBuyButton";
import CheckoutDialog from "@/components/checkout/CheckoutDialog";

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
  bundle: Bundle;
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
  const [showCheckout, setShowCheckout] = useState(false);
  const { addToCart, getCartTotal, clearCart, cart, isAddingToCart } = useCartContext();
  const { isAuthenticated, openAuthModal } = useAuth();

  if (!bundle) return null;

  const bundleName = bundle.title || bundle.name || 'Bundle';

  const formatItems = (items: BundleItem[] | string[]) => {
    if (Array.isArray(items) && items.length > 0) {
      if (typeof items[0] === 'string') {
        return items as string[];
      } else {
        return (items as BundleItem[]).map(item => 
          `${item.name} (${item.quantity}${typeof item.quantity === 'number' && item.quantity < 1 ? 'kg' : 'pcs'})`
        );
      }
    }
    return [];
  };

  const displayItems = formatItems(bundle.items);

  const handleAddToCart = async () => {
    if (isAddingToCart) return;
    
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    try {
      const bundleItem = {
        id: bundle.id,
        name: bundleName,
        price: bundle.price,
        unit: 'bundle',
        type: 'bundle' as const,
        items: Array.isArray(bundle.items) ? 
          (typeof bundle.items[0] === 'string' ? bundle.items as string[] : (bundle.items as BundleItem[]).map(item => item.name)) : 
          []
      };

      await addToCart(bundleItem);
      onAddToCart();
    } catch (error) {
      console.error('Error adding bundle to cart:', error);
      toast.error('Failed to add bundle to cart. Please try again.');
    }
  };

  const handleProceedToCheckout = async () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    try {
      const bundleInCart = cart.find(item => item.product_id === bundle.id);
      
      if (!bundleInCart) {
        await handleAddToCart();
      }
      
      onOpenChange(false);
      setShowCheckout(true);
    } catch (error) {
      console.error('Error proceeding to checkout:', error);
      toast.error('Failed to proceed to checkout. Please try again.');
    }
  };

  const formatPrice = (price: number) => {
    return `RWF ${price.toLocaleString()}`;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold pr-8">{bundleName}</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
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
                  alt={bundleName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground">{bundle.description}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-khrate-600">
                    {formatPrice(bundle.price)}
                  </span>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">What's included:</h4>
                <ul className="space-y-1 max-h-40 overflow-y-auto">
                  {displayItems.map((item, index) => (
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
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="w-full bg-khrate-500 hover:bg-khrate-600 disabled:opacity-50"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </Button>

                <Button 
                  onClick={handleProceedToCheckout}
                  disabled={isAddingToCart}
                  variant="outline"
                  className="w-full border-khrate-500 text-khrate-600 hover:bg-khrate-50 disabled:opacity-50"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Proceed to Checkout
                </Button>
                
                <GroupBuyButton 
                  item={{
                    id: bundle.id,
                    name: bundleName,
                    price: bundle.price,
                    unit: 'bundle',
                    type: 'bundle',
                    items: Array.isArray(bundle.items) ? 
                      (typeof bundle.items[0] === 'string' ? bundle.items as string[] : (bundle.items as BundleItem[]).map(item => item.name)) : 
                      []
                  }}
                  variant="outline"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <CheckoutDialog
        open={showCheckout}
        onOpenChange={setShowCheckout}
        getCartTotal={getCartTotal}
        formatPrice={formatPrice}
        cartItems={cart.map(item => ({
          id: item.product_id,
          name: item.product_name,
          price: item.product_price,
          quantity: item.quantity,
          unit: item.product_unit
        }))}
        clearCart={clearCart}
        saveOrder={() => {}}
      />
    </>
  );
};

export default BundlePreviewModal;
