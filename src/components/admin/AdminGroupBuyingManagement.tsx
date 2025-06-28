
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  MapPin, 
  Star, 
  StarOff,
  Eye,
  Settings,
  TrendingUp,
  Calendar,
  DollarSign
} from "lucide-react";
import { toast } from "sonner";
import { useAdminGroups, useAdminGroupStats } from '@/hooks/useAdminGroups';
import { useAuth } from '@/contexts/AuthContext';
import { AdminGroupSession } from '@/types/admin';

const AdminGroupBuyingManagement = () => {
  const { user } = useAuth();
  const { 
    groups, 
    isLoading, 
    createGroup, 
    updateGroup, 
    deleteGroup, 
    toggleFeatured,
    isCreating,
    isUpdating,
    isDeleting,
    refetch
  } = useAdminGroups();
  
  const { data: groupStats, isLoading: statsLoading } = useAdminGroupStats();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<AdminGroupSession | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    region: '',
    discount_percentage: 10,
    min_participants: 3,
    max_participants: 10,
    is_featured: false,
    admin_notes: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      region: '',
      discount_percentage: 10,
      min_participants: 3,
      max_participants: 10,
      is_featured: false,
      admin_notes: ''
    });
    setEditingGroup(null);
  };

  const handleCreateGroup = async () => {
    if (!formData.name.trim()) {
      toast.error('Group name is required');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to create groups');
      return;
    }

    createGroup({
      ...formData,
      leader_id: user.id,
      status: 'active' as const
    });

    resetForm();
    setShowCreateForm(false);
  };

  const handleEditGroup = (group: AdminGroupSession) => {
    setEditingGroup(group);
    setFormData({
      name: group.name || '',
      location: group.location || '',
      region: group.region || '',
      discount_percentage: group.discount_percentage,
      min_participants: group.min_participants,
      max_participants: group.max_participants,
      is_featured: group.is_featured,
      admin_notes: group.admin_notes || ''
    });
    setShowCreateForm(true);
  };

  const handleUpdateGroup = async () => {
    if (!editingGroup) return;

    updateGroup({
      id: editingGroup.id,
      ...formData
    });

    resetForm();
    setShowCreateForm(false);
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (window.confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
      deleteGroup(groupId);
    }
  };

  const handleToggleFeatured = async (groupId: string, currentStatus: boolean) => {
    toggleFeatured({ id: groupId, is_featured: !currentStatus });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'completed': return 'secondary';
      case 'inactive': return 'outline';
      default: return 'secondary';
    }
  };

  const filteredGroups = {
    all: groups || [],
    active: (groups || []).filter(g => g.status === 'active'),
    inactive: (groups || []).filter(g => g.status === 'inactive'),
    featured: (groups || []).filter(g => g.is_featured)
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Group Buying Management</h2>
            <p className="text-muted-foreground">Loading group buying sessions...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Group Buying Management</h2>
          <p className="text-muted-foreground">Manage group buying sessions and monitor performance</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={refetch}
            variant="outline"
            disabled={isLoading}
          >
            Refresh
          </Button>
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="bg-khrate-500 hover:bg-khrate-600"
            disabled={isLoading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Group
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-khrate-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Groups</p>
                <p className="text-2xl font-bold">{statsLoading ? '...' : groupStats?.total_groups || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Groups</p>
                <p className="text-2xl font-bold">{statsLoading ? '...' : groupStats?.active_groups || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Featured Groups</p>
                <p className="text-2xl font-bold">{statsLoading ? '...' : groupStats?.featured_groups || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold">{statsLoading ? '...' : groupStats?.total_members || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingGroup ? 'Edit Group' : 'Create New Group'}</CardTitle>
            <CardDescription>
              {editingGroup ? 'Update group settings' : 'Set up a new group buying session'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Group Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Kigali Fresh Groceries"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., Kimisagara"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Input
                  id="region"
                  value={formData.region}
                  onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                  placeholder="e.g., Kigali"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="discount">Discount Percentage</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount_percentage}
                  onChange={(e) => setFormData(prev => ({ ...prev, discount_percentage: parseInt(e.target.value) || 0 }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="minParticipants">Minimum Participants</Label>
                <Input
                  id="minParticipants"
                  type="number"
                  min="2"
                  value={formData.min_participants}
                  onChange={(e) => setFormData(prev => ({ ...prev, min_participants: parseInt(e.target.value) || 2 }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxParticipants">Maximum Participants</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  min="2"
                  value={formData.max_participants}
                  onChange={(e) => setFormData(prev => ({ ...prev, max_participants: parseInt(e.target.value) || 2 }))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="adminNotes">Admin Notes</Label>
              <Textarea
                id="adminNotes"
                value={formData.admin_notes}
                onChange={(e) => setFormData(prev => ({ ...prev, admin_notes: e.target.value }))}
                placeholder="Internal notes for this group..."
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
              />
              <Label htmlFor="featured">Feature this group on homepage</Label>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={editingGroup ? handleUpdateGroup : handleCreateGroup}
                className="bg-khrate-500 hover:bg-khrate-600"
                disabled={!formData.name.trim() || isCreating || isUpdating}
              >
                {(isCreating || isUpdating) ? (editingGroup ? 'Updating...' : 'Creating...') : (editingGroup ? 'Update Group' : 'Create Group')}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  resetForm();
                  setShowCreateForm(false);
                }}
                disabled={isCreating || isUpdating}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Groups Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">All Groups ({filteredGroups.all.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({filteredGroups.active.length})</TabsTrigger>
          <TabsTrigger value="inactive">Inactive ({filteredGroups.inactive.length})</TabsTrigger>
          <TabsTrigger value="featured">Featured ({filteredGroups.featured.length})</TabsTrigger>
        </TabsList>

        {(['overview', 'active', 'inactive', 'featured'] as const).map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            {filteredGroups[tab === 'overview' ? 'all' : tab].map((group) => (
              <Card key={group.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{group.name || 'Unnamed Group'}</h3>
                        <Badge variant={getStatusBadgeVariant(group.status)}>
                          {group.status}
                        </Badge>
                        {group.is_featured && (
                          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <span className="font-medium">Join Code:</span>
                          <p className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">{group.join_code}</p>
                        </div>
                        <div>
                          <span className="font-medium">Location:</span>
                          <p className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {group.location || 'Not specified'}, {group.region || 'Not specified'}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium">Members:</span>
                          <p>{group.member_count || 0} / {group.max_participants}</p>
                        </div>
                        <div>
                          <span className="font-medium">Discount:</span>
                          <p>{group.discount_percentage}%</p>
                        </div>
                      </div>

                      {group.admin_notes && (
                        <div className="text-sm text-muted-foreground mb-2">
                          <span className="font-medium">Notes:</span> {group.admin_notes}
                        </div>
                      )}
                      
                      <div className="text-xs text-muted-foreground">
                        Created: {new Date(group.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleFeatured(group.id, group.is_featured)}
                        disabled={isUpdating}
                      >
                        {group.is_featured ? <StarOff className="h-3 w-3" /> : <Star className="h-3 w-3" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditGroup(group)}
                        disabled={isUpdating}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteGroup(group.id)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredGroups[tab === 'overview' ? 'all' : tab].length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Groups Found</h3>
                  <p className="text-muted-foreground mb-4">
                    {tab === 'overview' ? 'No groups have been created yet.' : `No ${tab} groups found.`}
                  </p>
                  <Button 
                    onClick={() => setShowCreateForm(true)}
                    className="bg-khrate-500 hover:bg-khrate-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Group
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AdminGroupBuyingManagement;
