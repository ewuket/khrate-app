
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to KHRATE</DialogTitle>
        </DialogHeader>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Welcome back! Sign in to your account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LoginForm 
                  onSwitchToSignup={handleSwitchToSignup}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  Join KHRATE and start saving on groceries today!
                </CardDescription>
              </CardHeader>
              <CardContent>
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
