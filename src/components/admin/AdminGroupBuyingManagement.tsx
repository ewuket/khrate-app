
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminGroupManagement from './AdminGroupManagement';
import AdminGroupsList from './AdminGroupsList';
import { useAdminGroups } from '@/hooks/useAdminGroups';

const AdminGroupBuyingManagement = () => {
  const { groupSessions, loading } = useAdminGroups();

  return (
    <div className="space-y-6">
      <Tabs defaultValue="management" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="management">Group Management</TabsTrigger>
          <TabsTrigger value="overview">Groups Overview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="management" className="space-y-6">
          <AdminGroupManagement />
        </TabsContent>
        
        <TabsContent value="overview" className="space-y-6">
          <AdminGroupsList groupSessions={groupSessions} loading={loading} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminGroupBuyingManagement;
