
import React from 'react';
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BundleCardHeaderProps {
  title: string;
  description: string;
  discount: number;
}

const BundleCardHeader: React.FC<BundleCardHeaderProps> = ({
  title,
  description,
  discount
}) => {
  return (
    <CardHeader className="pb-3">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <CardTitle className="text-lg font-bold text-gray-900 mb-2 group-hover:text-khrate-600 transition-colors line-clamp-2">
            {title}
          </CardTitle>
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{description}</p>
        </div>
        {discount > 0 && (
          <Badge variant="destructive" className="ml-2 bg-red-500 text-white font-semibold text-xs">
            -{discount}%
          </Badge>
        )}
      </div>
    </CardHeader>
  );
};

export default BundleCardHeader;
