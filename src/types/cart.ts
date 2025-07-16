
export type CartItem = {
  id: string;
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
  product_unit: string;
  product_type: 'bundle' | 'custom' | 'group';
  product_items?: string[];
};

export interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  loading?: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: any, type?: 'bundle' | 'custom' | 'group') => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartCount: () => number;
  syncCart: () => Promise<void>;
  isAddingToCart: (productId: string | number, productType?: string) => boolean;
}
