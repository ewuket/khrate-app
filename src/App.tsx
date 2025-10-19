
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { CartProvider } from "@/contexts/CartContext";
import { GroupBuyingProvider } from "@/contexts/GroupBuyingContext";
import Layout from "@/components/layout/Layout";
import Index from "@/pages/Index";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Bundles from "@/pages/Bundles";
import CustomBuy from "@/pages/CustomBuy";
import GroupBuy from "@/pages/GroupBuy";
import Orders from "@/pages/Orders";
import Profile from "@/pages/Profile";
import Terms from "@/pages/Terms";
import ResetPassword from "@/pages/ResetPassword";
import AuthCallback from "@/pages/AuthCallback";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/NotFound";
import Welcome from "@/pages/Welcome";
import LiveChatButton from "@/components/support/LiveChatButton";
import OfflineIndicator from "@/components/offline/OfflineIndicator";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AdminProvider>
            <CartProvider>
              <GroupBuyingProvider>
                <Toaster />
                <OfflineIndicator />
                <BrowserRouter>
                  <Routes>
                    <Route path="/welcome" element={<Welcome />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/*" element={<Layout><Outlet /></Layout>}>
                      <Route index element={<Index />} />
                      <Route path="about" element={<About />} />
                      <Route path="contact" element={<Contact />} />
                      <Route path="bundles" element={<Bundles />} />
                      <Route path="custom-buy" element={<CustomBuy />} />
                      <Route path="group-buy" element={<GroupBuy />} />
                      <Route path="orders" element={<Orders />} />
                      <Route path="profile" element={<Profile />} />
                      <Route path="terms" element={<Terms />} />
                      <Route path="*" element={<NotFound />} />
                    </Route>
                  </Routes>
                  <LiveChatButton />
                </BrowserRouter>
              </GroupBuyingProvider>
            </CartProvider>
          </AdminProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
