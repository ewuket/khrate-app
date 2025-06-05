
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye } from "lucide-react";
import { useCartContext } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useState } from "react";
import BundlePreviewModal from "@/components/bundles/BundlePreviewModal";
import GroupBuyButton from "@/components/group-buy/GroupBuyButton";

const featuredBundles = [
  {
    id: 1,
    title: "Single Breakfast Bundle",
    description: "Perfect for one person - eggs, bread, milk, and fresh fruits",
    price: 3500,
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=800&auto=format&fit=crop",
    items: [
      { name: "Eggs", quantity: 6 },
      { name: "Bread", quantity: 1 },
      { name: "Milk", quantity: 1 },
      { name: "Bananas", quantity: 3 }
    ]
  },
  {
    id: 2,
    title: "Medium Family Bundle",
    description: "Great for small families - rice, beans, vegetables, and meat",
    price: 8500,
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop",
    items: [
      { name: "Rice", quantity: 2 },
      { name: "Beans", quantity: 1 },
      { name: "Chicken", quantity: 1 },
      { name: "Tomatoes", quantity: 0.5 },
      { name: "Onions", quantity: 0.5 }
    ]
  },
  {
    id: 3,
    title: "Large Weekly Bundle",
    description: "Complete weekly groceries for large families",
    price: 15000,
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop",
    items: [
      { name: "Rice", quantity: 5 },
      { name: "Beans", quantity: 2 },
      { name: "Cooking Oil", quantity: 1 },
      { name: "Sugar", quantity: 1 },
      { name: "Salt", quantity: 1 },
      { name: "Tomatoes", quantity: 2 },
      { name: "Onions", quantity: 1 },
      { name: "Potatoes", quantity: 2 }
    ]
  }
];

const FeaturedBundles = () => {
  const { addToCart, isAddingToCart } = useCartContext();
  const { isAuthenticated, openAuthModal } = useAuth();
  const [selectedBundle, setSelectedBundle] = useState<typeof featuredBundles[0] | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [locallyAddingStates, setLocallyAddingStates] = useState<Record<number, boolean>>({});

  const handleAddToCart = async (bundle: typeof featuredBundles[0]) => {
    if (isAddingToCart || locallyAddingStates[bundle.id]) {
      console.log('Already adding to cart, preventing duplicate request');
      return;
    }
    
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    setLocallyAddingStates(prev => ({ ...prev, [bundle.id]: true }));

    try {
      const bundleItem = {
        id: bundle.id,
        name: bundle.title,
        price: bundle.price,
        unit: 'bundle',
        type: 'bundle' as const,
        items: bundle.items.map(item => item.name)
      };

      console.log('Adding featured bundle to cart:', bundleItem);
      await addToCart(bundleItem);
    } catch (error) {
      console.error('Error adding bundle to cart:', error);
      toast.error('Failed to add bundle to cart');
    } finally {
      setLocallyAddingStates(prev => ({ ...prev, [bundle.id]: false }));
    }
  };

  const handlePreview = (bundle: typeof featuredBundles[0]) => {
    setSelectedBundle(bundle);
    setShowPreview(true);
  };

  const formatPrice = (price: number) => {
    return `RWF ${price.toLocaleString()}`;
  };

  return (
    <>
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Bundles</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Save time and money with our carefully curated bundles
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBundles.map((bundle) => {
              const isCurrentlyAdding = isAddingToCart || locallyAddingStates[bundle.id];
              
              return (
                <Card key={bundle.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="relative overflow-hidden">
                    <img 
                      src={bundle.image} 
                      alt={bundle.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-lg font-semibold">
                        {bundle.title}
                      </CardTitle>
                      <div className="text-xl font-bold text-khrate-600">
                        {formatPrice(bundle.price)}
                      </div>
                    </div>
                    <CardDescription className="text-sm">
                      {bundle.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Items included:</p>
                      <div className="text-xs text-gray-600 space-y-1">
                        {bundle.items.slice(0, 3).map((item, index) => (
                          <div key={index} className="flex justify-between">
                            <span>{item.name}</span>
                            <span className="text-khrate-600 font-medium">
                              {typeof item.quantity === 'number' && item.quantity < 1 
                                ? `${item.quantity}kg` 
                                : item.quantity
                              }
                            </span>
                          </div>
                        ))}
                        {bundle.items.length > 3 && (
                          <div className="text-center text-khrate-500 font-medium">
                            +{bundle.items.length - 3} more items
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Button 
                        onClick={() => handlePreview(bundle)}
                        variant="outline"
                        className="w-full border-khrate-500 text-khrate-600 hover:bg-khrate-50 touch-manipulation"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview Bundle
                      </Button>
                      
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button 
                          onClick={() => handleAddToCart(bundle)}
                          disabled={isCurrentlyAdding}
                          className="flex-1 bg-khrate-500 hover:bg-khrate-600 text-white disabled:opacity-50 touch-manipulation active:scale-95"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {isCurrentlyAdding ? 'Adding...' : 'Add to Cart'}
                        </Button>
                        
                        <GroupBuyButton 
                          item={{
                            id: bundle.id,
                            name: bundle.title,
                            price: bundle.price,
                            unit: 'bundle',
                            type: 'bundle',
                            items: bundle.items.map(item => item.name)
                          }}
                          variant="outline"
                          className="flex-1 sm:flex-initial border-khrate-500 text-khrate-600 hover:bg-khrate-50 touch-manipulation"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {selectedBundle && (
        <BundlePreviewModal
          bundle={selectedBundle}
          open={showPreview}
          onOpenChange={setShowPreview}
          onAddToCart={() => handleAddToCart(selectedBundle)}
        />
      )}
    </>
  );
};

export default FeaturedBundles;
