
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import LoginForm from "./login/LoginForm";
import SignupForm from "./signup/SignupForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal } = useAuth();
  const [currentTab, setCurrentTab] = useState("login");

  const handleSwitchToLogin = () => {
    setCurrentTab("login");
  };

  const handleSwitchToSignup = () => {
    setCurrentTab("signup");
  };

  const handleSuccess = () => {
    closeAuthModal();
  };

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={closeAuthModal}>
      <DialogContent className="sm:max-w-md max-h-[95vh] overflow-y-auto bg-white p-0">
        <DialogHeader className="flex flex-row items-center justify-between p-6 border-b">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Welcome to KHRATE
          </DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={closeAuthModal}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="p-6">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 mb-6">
              <TabsTrigger 
                value="login" 
                className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 py-3"
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="signup" 
                className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 py-3"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-0">
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900">Welcome back!</h3>
                  <p className="text-gray-600">Sign in to your account to continue</p>
                </div>
                
                <LoginForm 
                  onSwitchToSignup={handleSwitchToSignup}
                  onClose={closeAuthModal}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-0">
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900">Create Account</h3>
                  <p className="text-gray-600">Join KHRATE and start saving on groceries!</p>
                </div>
                
                <SignupForm 
                  onSuccess={handleSuccess}
                  onSwitchToLogin={handleSwitchToLogin}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
