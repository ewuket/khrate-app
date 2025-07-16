
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Calendar, MapPin, Edit, Trash2, Star, StarOff, AlertCircle } from "lucide-react";
import { AdminGroupSession } from '@/types/admin';
import { useAdminGroups } from '@/hooks/useAdminGroups';
import { useAdminOperations } from '@/hooks/useAdminOperations';

interface AdminGroupsListProps {
  groupSessions: AdminGroupSession[];
  loading?: boolean;
}

const AdminGroupsList = ({ groupSessions, loading }: AdminGroupsListProps) => {
  const { updateGroup, deleteGroup, error } = useAdminGroups();
  const { toggleGroupFeatured } = useAdminOperations();
  const [selectedGroup, setSelectedGroup] = useState<AdminGroupSession | null>(null);

  const handleEdit = (group: AdminGroupSession) => {
    setSelectedGroup(group);
  };

  const handleDelete = async (groupId: string) => {
    if (confirm('Are you sure you want to delete this group?')) {
      await deleteGroup(groupId);
    }
  };

  const handleToggleFeatured = async (groupId: string, isFeatured: boolean) => {
    await toggleGroupFeatured(groupId, isFeatured);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-khrate-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading groups...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <p className="text-red-600 mb-2">Failed to load groups</p>
        <p className="text-gray-500 text-sm">{error.message}</p>
      </div>
    );
  }

  if (!groupSessions || groupSessions.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No groups found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Groups Overview</h2>
          <p className="text-gray-600">Manage active group buying sessions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groupSessions.map((group) => (
          <Card key={group.id} className="border-khrate-200">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-bold text-gray-900 line-clamp-1">
                  {group.name || 'Unnamed Group'}
                </CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleFeatured(group.id, group.is_featured)}
                    className={group.is_featured ? 'text-yellow-600' : 'text-gray-400'}
                  >
                    {group.is_featured ? <Star className="h-4 w-4 fill-current" /> : <StarOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(group)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(group.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{group.location || 'No location'}</span>
                {group.region && <span>• {group.region}</span>}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>{group.member_count || 0} / {group.max_participants} members</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{new Date(group.created_at).toLocaleDateString()}</span>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Badge 
                  variant={group.status === 'active' ? "default" : "secondary"}
                  className="text-xs"
                >
                  {group.status}
                </Badge>
                <Badge 
                  variant={group.is_featured ? "default" : "outline"}
                  className="text-xs"
                >
                  {group.is_featured ? 'Featured' : 'Not Featured'}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {group.discount_percentage}% discount
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Code: {group.join_code}
                </Badge>
              </div>

              {group.admin_notes && (
                <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                  <strong>Admin Notes:</strong> {group.admin_notes}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminGroupsList;
