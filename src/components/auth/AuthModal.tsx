
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import LoginForm from "./login/LoginForm";
import SignupForm from "./signup/SignupForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-hidden bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Welcome to KHRATE</DialogTitle>
        </DialogHeader>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100">
            <TabsTrigger value="login" className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900">Login</TabsTrigger>
            <TabsTrigger value="signup" className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="mt-4">
            <Card className="border-0 shadow-none">
              <CardHeader className="px-0 pb-4">
                <CardTitle className="text-gray-900">Login</CardTitle>
                <CardDescription className="text-gray-600">
                  Welcome back! Sign in to your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <LoginForm 
                  onSwitchToSignup={handleSwitchToSignup}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="signup" className="mt-4">
            <Card className="border-0 shadow-none bg-khrate-500">
              <CardHeader className="px-0 pb-4">
                <CardTitle className="text-white">Create Account</CardTitle>
                <CardDescription className="text-gray-200">
                  Join KHRATE and start saving on groceries today!
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <SignupForm 
                  onSuccess={handleSuccess}
                  onSwitchToLogin={handleSwitchToLogin}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
