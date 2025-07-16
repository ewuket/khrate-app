
import React from 'react';
import { useCustomBuyItems } from '@/hooks/useCustomBuyItems';
import ProductCard from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ProductListProps {
  onAddToCart: (product: any) => void;
}

const ProductList: React.FC<ProductListProps> = ({ onAddToCart }) => {
  const { items, groupedItems, loading, error, refetch } = useCustomBuyItems();

  console.log('📦 ProductList component state:', {
    itemsCount: items?.length,
    loading,
    error,
    groupedCategories: Object.keys(groupedItems).length,
    items: items?.slice(0, 2) // Log first 2 items for debugging
  });

  if (error) {
    console.error('❌ ProductList error:', error);
    return (
      <div className="w-full">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Unable to load products: {error}
          </AlertDescription>
        </Alert>
        
        <div className="text-center">
          <Button 
            onClick={() => {
              console.log('🔄 Manual refresh triggered for custom items');
              refetch();
            }} 
            variant="outline"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Try Again'}
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    console.log('⏳ ProductList - Loading state');
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    console.log('📭 ProductList - No items found');
    return (
      <div className="w-full text-center py-12">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">No products available</h3>
        <p className="text-gray-500 mb-6">Check back soon for new products!</p>
        <Button 
          onClick={() => {
            console.log('🔄 Manual refresh triggered for empty custom items');
            refetch();
          }} 
          variant="outline"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
    );
  }

  console.log('✅ ProductList - Rendering products by category');

  // Transform items to match ProductCard interface
  const transformedItems = items.map(item => ({
    id: item.id,
    name: item.name,
    price: item.price,
    unit: item.unit,
    category: item.category,
    image: item.image_url,
    inStock: item.stock_quantity > 0,
    description: item.description || ''
  }));

  return (
    <div className="w-full">
      {Object.keys(groupedItems).length > 0 ? (
        Object.entries(groupedItems).map(([category, categoryItems]) => {
          console.log(`📂 Rendering category: ${category} with ${categoryItems.length} items`);
          
          return (
            <div key={category} className="mb-8">
              <h2 className="text-2xl font-bold mb-6 text-khrate-600 capitalize">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryItems.map((item) => {
                  const transformedItem = {
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    unit: item.unit,
                    category: item.category,
                    image: item.image_url,
                    inStock: item.stock_quantity > 0,
                    description: item.description || ''
                  };
                  
                  console.log('🎨 Rendering product:', {
                    id: item.id,
                    name: item.name,
                    category: item.category,
                    inStock: transformedItem.inStock
                  });
                  
                  return (
                    <ProductCard
                      key={item.id}
                      product={transformedItem}
                      onAddToCart={onAddToCart}
                    />
                  );
                })}
              </div>
            </div>
          );
        })
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transformedItems.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
