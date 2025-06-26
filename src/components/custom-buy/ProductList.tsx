
import React from "react";
import { useCustomBuyItems } from "@/hooks/useCustomBuyItems";
import ProductCard from "./ProductCard";

interface ProductListProps {
  onAddToCart: (product: any) => void;
}

const ProductList: React.FC<ProductListProps> = ({ onAddToCart }) => {
  const { items, loading, error } = useCustomBuyItems();

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-khrate-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Error loading products: {error}</p>
      </div>
    );
  }

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  return (
    <div className="space-y-8">
      {Object.entries(groupedItems).map(([category, categoryItems]) => (
        <div key={category}>
          <h3 className="text-xl font-semibold text-khrate-600 mb-4 pb-2 border-b border-khrate-200">
            {category}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryItems.map((item) => (
              <ProductCard 
                key={item.id} 
                product={{
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  unit: item.unit,
                  category: item.category,
                  image: item.image_url,
                  inStock: item.stock_quantity > 0,
                  description: item.description || ''
                }}
                onAddToCart={onAddToCart} 
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
