
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminGroupManagement from './AdminGroupManagement';
import AdminGroupsList from './AdminGroupsList';
import { useAdminGroups } from '@/hooks/useAdminGroups';

const AdminGroupBuyingManagement = () => {
  const { groups, isLoading } = useAdminGroups();

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Group Buying Management</h2>
        <p className="text-gray-600">Manage group buying sessions and monitor activity</p>
      </div>
      
      <Tabs defaultValue="management" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="management">Group Management</TabsTrigger>
          <TabsTrigger value="overview">Groups Overview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="management" className="space-y-6">
          <AdminGroupManagement />
        </TabsContent>
        
        <TabsContent value="overview" className="space-y-6">
          <AdminGroupsList groupSessions={groups} loading={isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminGroupBuyingManagement;
