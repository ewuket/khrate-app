
import React from 'react';
import { Button } from "@/components/ui/button";
import { Bell, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import AdminNotifications from "./AdminNotifications";

const AdminHeader = () => {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-600">Manage orders, groups, and system settings</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <AdminNotifications />
          
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">
              {user?.email || 'Admin'}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
