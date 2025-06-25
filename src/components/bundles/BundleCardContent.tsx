
import React from 'react';
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BundleCardImage from './BundleCardImage';

interface BundleCardContentProps {
  image: string;
  title: string;
  features: string[];
  itemsCount: number;
  onPreview: (e: React.MouseEvent) => void;
}

const BundleCardContent: React.FC<BundleCardContentProps> = ({
  image,
  title,
  features,
  itemsCount,
  onPreview
}) => {
  return (
    <CardContent className="flex-1">
      <BundleCardImage 
        image={image}
        title={title}
        onPreview={onPreview}
      />

      {features.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {features.slice(0, 2).map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
            {features.length > 2 && (
              <Badge variant="outline" className="text-xs text-khrate-600">
                +{features.length - 2} more
              </Badge>
            )}
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500 mb-2">
        {itemsCount} items included
      </div>
    </CardContent>
  );
};

export default BundleCardContent;
