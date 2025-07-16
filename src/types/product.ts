
export interface Product {
  id: number;
  name: string;
  price: number;
  unit: string;
  category: string;
  image: string;
  inStock: boolean;
  description?: string;
}
