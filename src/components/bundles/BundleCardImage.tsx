
import React from 'react';
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface BundleCardImageProps {
  image: string;
  title: string;
  onPreview: (e: React.MouseEvent) => void;
}

const BundleCardImage: React.FC<BundleCardImageProps> = ({
  image,
  title,
  onPreview
}) => {
  return (
    <div className="relative aspect-video bg-gradient-to-br from-khrate-50 to-khrate-100 rounded-xl mb-4 overflow-hidden group-hover:shadow-lg transition-shadow">
      <img 
        src={image} 
        alt={title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        onError={(e) => {
          e.currentTarget.src = '/placeholder.svg';
        }}
      />
      <Button
        onClick={onPreview}
        className="absolute top-3 right-3 bg-white/90 hover:bg-white text-khrate-600 shadow-lg backdrop-blur-sm p-2 h-8 w-8 rounded-full"
        size="sm"
      >
        <Eye className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default BundleCardImage;
