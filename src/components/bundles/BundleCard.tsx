
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import BundleCardHeader from './BundleCardHeader';
import BundleCardContent from './BundleCardContent';
import BundleCardFooter from './BundleCardFooter';
import BundlePreviewModal from './BundlePreviewModal';
import { useCartContext } from '@/contexts/CartContext';

interface BundleCardProps {
  id: number;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  discount?: number;
  items?: string[];
  image: string;
  features?: string[];
  onAuthRequired?: () => void;
  isAuthenticated?: boolean;
  onClick?: () => void;
}

const BundleCard: React.FC<BundleCardProps> = ({
  id,
  title,
  description,
  price,
  originalPrice,
  discount = 0,
  items = [],
  image,
  features = [],
  onAuthRequired,
  isAuthenticated = false,
  onClick
}) => {
  const { addToCart } = useCartContext();
  const [showPreview, setShowPreview] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if user needs to authenticate
    if (!isAuthenticated && onAuthRequired) {
      onAuthRequired();
      return;
    }
    
    if (isAdding) return;
    
    setIsAdding(true);
    
    const bundleItem = {
      id,
      name: title,
      price,
      unit: 'bundle',
      type: 'bundle' as const,
      items
    };

    console.log('Adding bundle to cart:', bundleItem);
    
    try {
      await addToCart(bundleItem);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setTimeout(() => {
        setIsAdding(false);
      }, 500);
    }
  };

  const handlePreview = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPreview(true);
  };

  const bundleForPreview = {
    id,
    title,
    price,
    originalPrice,
    image,
    items: items.map(item => {
      const parts = item.split(' (');
      const name = parts[0];
      const quantityPart = parts[1]?.replace(')', '') || '';
      const [quantity, unit] = quantityPart.split(' ');
      return {
        name,
        quantity: quantity || '1',
        unit: unit || 'piece'
      };
    }),
    description
  };

  return (
    <>
      <Card 
        className="cursor-pointer hover:shadow-xl transition-all duration-300 h-full flex flex-col group overflow-hidden border-gray-200 hover:border-khrate-300"
        onClick={onClick}
      >
        <BundleCardHeader 
          title={title}
          description={description}
          discount={discount}
        />

        <BundleCardContent
          image={image}
          title={title}
          features={features}
          itemsCount={items.length}
          onPreview={handlePreview}
        />

        <BundleCardFooter
          price={price}
          originalPrice={originalPrice}
          isAdding={isAdding}
          onPreview={handlePreview}
          onAddToCart={handleAddToCart}
        />
      </Card>

      <BundlePreviewModal
        bundle={bundleForPreview}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        onAddToCart={handleAddToCart}
        isAdding={isAdding}
      />
    </>
  );
};

export default BundleCard;
