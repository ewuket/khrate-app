
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import GroupBuyButton from "@/components/group-buy/GroupBuyButton";
import { useSupabaseCart } from "@/contexts/SupabaseCartContext";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  price: number;
  unit: string;
  image: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, openCart } = useSupabaseCart();

  const handleAddToCart = async () => {
    await addToCart({
      product_id: product.id,
      product_name: product.name,
      product_price: product.price,
      product_type: 'product',
      product_unit: product.unit,
      quantity: 1
    }, 'custom');
    
    toast.success(`${product.name} added to cart`);
    
    // Auto-open cart sidebar
    setTimeout(() => {
      openCart();
    }, 500);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
        <p className="text-orange-500 font-bold text-xl mb-3">
          {product.price.toLocaleString()} RWF
          <span className="text-sm text-gray-500 ml-1">per {product.unit}</span>
        </p>
        
        <div className="space-y-2">
          <Button 
            className="w-full bg-khrate-500 hover:bg-khrate-600"
            onClick={handleAddToCart}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
          
          <GroupBuyButton 
            item={{
              id: product.id,
              name: product.name,
              price: product.price,
              unit: product.unit,
              type: 'product'
            }}
            variant="outline"
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
