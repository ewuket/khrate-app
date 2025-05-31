
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCard from "./ProductCard";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  unit: string;
  image: string;
  category: string;
}

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const ProductList = ({ products, onAddToCart }: ProductListProps) => {
  const [category, setCategory] = useState<string>("all");
  
  const filteredProducts = category === "all" 
    ? products 
    : products.filter(product => product.category === category);
    
  return (
    <div>
      <Tabs 
        defaultValue="all" 
        className="mb-8"
        onValueChange={setCategory}
        value={category}
      >
        <div className="border-b mb-6">
          <TabsList className="bg-transparent">
            <TabsTrigger value="all" className="data-[state=active]:text-khrate-500 data-[state=active]:border-khrate-500 rounded-none border-b-2 border-transparent data-[state=active]:bg-transparent">
              All Items
            </TabsTrigger>
            <TabsTrigger value="perishable" className="data-[state=active]:text-khrate-500 data-[state=active]:border-khrate-500 rounded-none border-b-2 border-transparent data-[state=active]:bg-transparent">
              Perishables
            </TabsTrigger>
            <TabsTrigger value="non-perishable" className="data-[state=active]:text-khrate-500 data-[state=active]:border-khrate-500 rounded-none border-b-2 border-transparent data-[state=active]:bg-transparent">
              Non-Perishables
            </TabsTrigger>
            <TabsTrigger value="household" className="data-[state=active]:text-khrate-500 data-[state=active]:border-khrate-500 rounded-none border-b-2 border-transparent data-[state=active]:bg-transparent">
              Household
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
