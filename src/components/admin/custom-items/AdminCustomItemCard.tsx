
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Edit, Trash2, Package } from "lucide-react";
import { AdminCustomItem } from "@/hooks/useAdminCustomItems";

interface AdminCustomItemCardProps {
  item: AdminCustomItem;
  onEdit: (item: AdminCustomItem) => void;
  onDelete: (itemId: number) => void;
  onToggleActive: (itemId: number, isActive: boolean) => void;
  isToggling?: boolean;
}

const AdminCustomItemCard: React.FC<AdminCustomItemCardProps> = ({
  item,
  onEdit,
  onDelete,
  onToggleActive,
  isToggling = false
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className={`transition-all duration-200 ${item.is_active ? 'border-green-200' : 'border-gray-200 opacity-75'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{item.name}</h3>
            <Badge variant="secondary" className="mt-1">{item.category}</Badge>
          </div>
          <img 
            src={item.image_url} 
            alt={item.name}
            className="w-16 h-16 object-cover rounded-md ml-3"
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Price:</span>
          <span className="font-bold text-khrate-600">{formatCurrency(item.price)} / {item.unit}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Stock:</span>
          <div className="flex items-center gap-1">
            <Package className="h-4 w-4 text-gray-500" />
            <span className="font-medium">{item.stock_quantity}</span>
          </div>
        </div>

        {item.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
        )}

        <div className="flex items-center justify-between pt-2">
          <span className="text-sm font-medium">Active:</span>
          <Switch
            checked={item.is_active}
            onCheckedChange={() => onToggleActive(item.id, item.is_active)}
            disabled={isToggling}
          />
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(item)}
          className="flex-1"
          disabled={isToggling}
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(item.id)}
          className="flex-1"
          disabled={isToggling}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdminCustomItemCard;
