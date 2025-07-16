
import React from 'react';
import { AdminGroupSession } from "@/types/admin";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, EyeOff, Star, Users, MapPin } from "lucide-react";

interface AdminGroupCardProps {
  group: AdminGroupSession;
  onEdit: (group: AdminGroupSession) => void;
  onDelete: (groupId: string) => void;
  onToggleActive: (groupId: string, currentStatus: string) => void;
  onToggleFeatured: (groupId: string, isFeatured: boolean) => void;
  isToggling?: string | null;
}

const AdminGroupCard: React.FC<AdminGroupCardProps> = ({
  group,
  onEdit,
  onDelete,
  onToggleActive,
  onToggleFeatured,
  isToggling
}) => {
  const isTogglingThis = isToggling === `group-${group.id}` || isToggling === `group-featured-${group.id}`;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="truncate">{group.name || `Group ${group.join_code}`}</span>
          <div className="flex gap-1">
            <Badge variant={group.status === 'active' ? 'default' : 'secondary'}>
              {group.status}
            </Badge>
            {group.is_featured && (
              <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
            {group.is_public && (
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                Public
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow space-y-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>{group.member_count || 0}/{group.max_participants} members</span>
          </div>
          
          {group.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{group.location}</span>
            </div>
          )}
          
          <div className="text-sm text-gray-600">
            <span>Discount: {group.discount_percentage}%</span>
          </div>
          
          <div className="text-sm text-gray-600">
            <span>Join Code: {group.join_code}</span>
          </div>
        </div>

        {group.admin_notes && (
          <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
            <strong>Admin Notes:</strong> {group.admin_notes}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(group)}
          className="flex-1"
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onToggleActive(group.id, group.status)}
          disabled={isTogglingThis}
          className="flex-1"
        >
          {group.status === 'active' ? (
            <>
              <EyeOff className="h-4 w-4 mr-1" />
              Deactivate
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-1" />
              Activate
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onToggleFeatured(group.id, group.is_featured)}
          disabled={isTogglingThis}
          className={group.is_featured ? 'text-yellow-600 border-yellow-600' : ''}
        >
          <Star className={`h-4 w-4 ${group.is_featured ? 'fill-current' : ''}`} />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(group.id)}
          className="text-red-600 hover:text-red-700 hover:border-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdminGroupCard;
