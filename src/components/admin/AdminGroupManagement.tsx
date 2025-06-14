
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

interface GroupSession {
  id: string;
  name: string;
  description?: string;
  discount_percentage: number;
  min_participants: number;
  max_participants: number;
  status: 'active' | 'inactive';
  created_at: string;
  join_code: string;
}

const AdminGroupManagement = () => {
  const [groups, setGroups] = useState<GroupSession[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discount_percentage: 10,
    min_participants: 3,
    max_participants: 10
  });

  const loadGroups = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('group_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGroups(data || []);
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

    try {
      setLoading(true);
      
      const newGroup = {
        name: formData.name,
        description: formData.description,
        discount_percentage: formData.discount_percentage,
        min_participants: formData.min_participants,
        max_participants: formData.max_participants,
        status: 'active',
        join_code: generateJoinCode()
      };

      const { data, error } = await supabase
        .from('group_sessions')
        .insert(newGroup)
        .select()
        .single();

      if (error) throw error;

      setGroups(prev => [data, ...prev]);
      setFormData({
        name: '',
        description: '',
        discount_percentage: 10,
        min_participants: 3,
        max_participants: 10
      });
      setShowCreateForm(false);
      toast.success('Group created successfully!');
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error('Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
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
                <Label htmlFor="name">Group Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Weekend Groceries"
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
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the group buying session..."
              />
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
                    <h3 className="text-lg font-semibold">{group.name}</h3>
                    <Badge variant={group.status === 'active' ? 'default' : 'secondary'}>
                      {group.status}
                    </Badge>
                  </div>
                  
                  {group.description && (
                    <p className="text-sm text-muted-foreground mb-3">{group.description}</p>
                  )}
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Join Code:</span>
                      <p className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">{group.join_code}</p>
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
                </div>
                
                <div className="flex gap-2 ml-4">
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
