
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingBasket, Plus, Minus } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  unit: string;
  image: string;
  category: string;
  quantity: number;
  onAddToCart: (product: {
    id: number;
    name: string;
    price: number;
    unit: string;
    image: string;
    category: string;
  }) => void;
  onRemoveFromCart: (productId: number) => void;
}

const ProductCard = ({
  id,
  name,
  price,
  unit,
  image,
  category,
  quantity,
  onAddToCart,
  onRemoveFromCart
}: ProductCardProps) => {
  const product = { id, name, price, unit, image, category };
  const [imageError, setImageError] = useState(false);
  const fallbackImage = "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop";
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="aspect-square overflow-hidden relative bg-gray-100">
        <img 
          src={imageError ? fallbackImage : image} 
          alt={name}
          className="w-full h-full object-cover absolute inset-0 transition-opacity duration-300"
          loading="lazy"
          onError={() => setImageError(true)}
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium">{name}</h3>
          <span className="font-semibold">{price.toLocaleString()} RWF/{unit}</span>
        </div>
        
        <div className="mt-4">
          {quantity === 0 ? (
            <Button 
              className="w-full bg-khrate-500 hover:bg-khrate-600"
              onClick={() => onAddToCart(product)}
            >
              <ShoppingBasket className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          ) : (
            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => onRemoveFromCart(id)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-medium">{quantity}</span>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => onAddToCart(product)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
