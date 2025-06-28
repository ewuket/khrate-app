
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AdminGroupSession {
  id: string;
  name: string | null;
  description?: string;
  discount_percentage: number;
  min_participants: number;
  max_participants: number;
  status: 'active' | 'inactive';
  created_at: string;
  join_code: string;
  leader_id: string;
  group_type: string;
  order_status: string | null;
  is_public: boolean;
  items: any;
  updated_at: string;
  location?: string;
  region?: string;
  admin_notes?: string;
  is_featured: boolean;
}

const AdminGroupManagement = () => {
  const [groups, setGroups] = useState<AdminGroupSession[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    region: '',
    discount_percentage: 10,
    min_participants: 3,
    max_participants: 10,
    admin_notes: '',
    is_public: false,
    is_featured: false
  });

  const loadGroups = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('group_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const typedGroups = (data || []).map(group => ({
        ...group,
        status: group.status as 'active' | 'inactive'
      }));
      
      setGroups(typedGroups);
    } catch (error) {
      console.error('Error loading groups:', error);
      toast.error('Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const generateJoinCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
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

    try {
      setLoading(true);
      
      const newGroup = {
        name: formData.name,
        location: formData.location || null,
        region: formData.region || null,
        discount_percentage: formData.discount_percentage,
        min_participants: formData.min_participants,
        max_participants: formData.max_participants,
        status: 'active' as const,
        join_code: generateJoinCode(),
        leader_id: user.id,
        group_type: formData.is_public ? 'public' : 'private',
        is_public: formData.is_public,
        is_featured: formData.is_featured,
        admin_notes: formData.admin_notes || null,
        order_status: 'collecting',
        items: []
      };

      console.log('Creating group with data:', newGroup);

      const { data, error } = await supabase
        .from('group_sessions')
        .insert(newGroup)
        .select()
        .single();

      if (error) {
        console.error('Group creation error:', error);
        throw error;
      }

      const typedGroup = {
        ...data,
        status: data.status as 'active' | 'inactive'
      };

      setGroups(prev => [typedGroup, ...prev]);
      setFormData({
        name: '',
        description: '',
        location: '',
        region: '',
        discount_percentage: 10,
        min_participants: 3,
        max_participants: 10,
        admin_notes: '',
        is_public: false,
        is_featured: false
      });
      setShowCreateForm(false);
      toast.success('Group created successfully!');
    } catch (error: any) {
      console.error('Error creating group:', error);
      toast.error(`Failed to create group: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('group_sessions')
        .delete()
        .eq('id', groupId);

      if (error) throw error;

      setGroups(prev => prev.filter(group => group.id !== groupId));
      toast.success('Group deleted successfully!');
    } catch (error) {
      console.error('Error deleting group:', error);
      toast.error('Failed to delete group');
    }
  };

  const toggleGroupStatus = async (groupId: string) => {
    try {
      const group = groups.find(g => g.id === groupId);
      if (!group) return;

      const newStatus = group.status === 'active' ? 'inactive' : 'active';
      
      const { error } = await supabase
        .from('group_sessions')
        .update({ status: newStatus })
        .eq('id', groupId);

      if (error) throw error;

      setGroups(prev => prev.map(group => 
        group.id === groupId 
          ? { ...group, status: newStatus }
          : group
      ));
      toast.success('Group status updated!');
    } catch (error) {
      console.error('Error updating group status:', error);
      toast.error('Failed to update group status');
    }
  };

  const toggleFeaturedStatus = async (groupId: string) => {
    try {
      const group = groups.find(g => g.id === groupId);
      if (!group) return;

      const newFeatured = !group.is_featured;
      
      const { error } = await supabase
        .from('group_sessions')
        .update({ is_featured: newFeatured })
        .eq('id', groupId);

      if (error) throw error;

      setGroups(prev => prev.map(group => 
        group.id === groupId 
          ? { ...group, is_featured: newFeatured }
          : group
      ));
      toast.success(newFeatured ? 'Group featured!' : 'Group unfeatured!');
    } catch (error) {
      console.error('Error updating featured status:', error);
      toast.error('Failed to update featured status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Group Management</h2>
          <p className="text-muted-foreground">Create and manage group buying sessions</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-khrate-500 hover:bg-khrate-600"
          disabled={loading}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Group</CardTitle>
            <CardDescription>Set up a new group buying session</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Group Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Weekend Groceries"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., Kigali City"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Input
                  id="region"
                  value={formData.region}
                  onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                  placeholder="e.g., Nyarugenge"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="discount">Discount Percentage</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  max="50"
                  value={formData.discount_percentage}
                  onChange={(e) => setFormData(prev => ({ ...prev, discount_percentage: parseInt(e.target.value) || 0 }))}
                  placeholder="10"
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
                  placeholder="3"
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
                  placeholder="10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="admin_notes">Admin Notes</Label>
              <Textarea
                id="admin_notes"
                value={formData.admin_notes}
                onChange={(e) => setFormData(prev => ({ ...prev, admin_notes: e.target.value }))}
                placeholder="Internal notes about this group..."
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_public}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_public: e.target.checked }))}
                />
                <span>Make Public</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                />
                <span>Featured Group</span>
              </label>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleCreateGroup}
                className="bg-khrate-500 hover:bg-khrate-600"
                disabled={!formData.name.trim() || loading}
              >
                {loading ? 'Creating...' : 'Create Group'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowCreateForm(false)}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {groups.map((group) => (
          <Card key={group.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{group.name || 'Unnamed Group'}</h3>
                    <Badge variant={group.status === 'active' ? 'default' : 'secondary'}>
                      {group.status}
                    </Badge>
                    {group.is_featured && (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                        Featured
                      </Badge>
                    )}
                    {group.is_public && (
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Public
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Join Code:</span>
                      <p className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">{group.join_code}</p>
                    </div>
                    <div>
                      <span className="font-medium">Location:</span>
                      <p>{group.location || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="font-medium">Region:</span>
                      <p>{group.region || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="font-medium">Discount:</span>
                      <p>{group.discount_percentage}%</p>
                    </div>
                    <div>
                      <span className="font-medium">Participants:</span>
                      <p>{group.min_participants} - {group.max_participants}</p>
                    </div>
                    <div>
                      <span className="font-medium">Created:</span>
                      <p>{new Date(group.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  {group.admin_notes && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Admin Notes:</span>
                      <p className="text-gray-600">{group.admin_notes}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleFeaturedStatus(group.id)}
                    disabled={loading}
                  >
                    {group.is_featured ? 'Unfeature' : 'Feature'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleGroupStatus(group.id)}
                    disabled={loading}
                  >
                    {group.status === 'active' ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteGroup(group.id)}
                    disabled={loading}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {groups.length === 0 && !loading && (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Groups Created</h3>
              <p className="text-muted-foreground mb-4">Create your first group buying session to get started.</p>
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
      </div>
    </div>
  );
};

export default AdminGroupManagement;
