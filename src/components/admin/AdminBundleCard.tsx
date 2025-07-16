
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { AdminBundle } from "@/hooks/useAdminBundles";

interface AdminBundleCardProps {
  bundle: AdminBundle;
  onEdit: (bundle: AdminBundle) => void;
  onDelete: (bundleId: number) => void;
  onToggleActive: (bundleId: number, isActive: boolean) => void;
  onToggleFeatured: (bundleId: number, isFeatured: boolean) => void;
}

const AdminBundleCard: React.FC<AdminBundleCardProps> = ({
  bundle,
  onEdit,
  onDelete,
  onToggleActive,
  onToggleFeatured
}) => {
  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} RWF`;
  };

  const discount = bundle.original_price && bundle.original_price > bundle.price
    ? Math.round(((bundle.original_price - bundle.price) / bundle.original_price) * 100)
    : 0;

  return (
    <Card className={`${!bundle.is_active ? 'opacity-60 border-gray-300' : 'border-khrate-200'}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold text-gray-900 line-clamp-1">
            {bundle.title}
          </CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleActive(bundle.id, bundle.is_active)}
              className={bundle.is_active ? 'text-green-600' : 'text-gray-400'}
            >
              {bundle.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(bundle)}
              className="text-blue-600 hover:text-blue-700"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(bundle.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {bundle.image_url && (
          <img
            src={bundle.image_url}
            alt={bundle.title}
            className="w-full h-32 object-cover rounded-md"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
        )}
        
        <p className="text-sm text-gray-600 line-clamp-2">{bundle.description}</p>
        
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-khrate-600">
            {formatPrice(bundle.price)}
          </span>
          {bundle.original_price && bundle.original_price > bundle.price && (
            <>
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(bundle.original_price)}
              </span>
              <Badge variant="destructive" className="bg-red-500 text-white text-xs">
                -{discount}% OFF
              </Badge>
            </>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          <Badge 
            variant={bundle.is_active ? "default" : "secondary"}
            className="text-xs"
          >
            {bundle.is_active ? 'Active' : 'Inactive'}
          </Badge>
          <Badge 
            variant={bundle.is_featured ? "default" : "outline"}
            className="text-xs cursor-pointer"
            onClick={() => onToggleFeatured(bundle.id, bundle.is_featured)}
          >
            {bundle.is_featured ? 'Featured' : 'Not Featured'}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {bundle.items.length} items
          </Badge>
        </div>

        {bundle.items.length > 0 && (
          <div className="mt-2">
            <p className="text-xs font-semibold text-gray-700 mb-1">Items:</p>
            <div className="text-xs text-gray-600 space-y-1 max-h-16 overflow-y-auto">
              {bundle.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.item_name}</span>
                  <span>{item.quantity} {item.unit}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminBundleCard;
