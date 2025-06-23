
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { CartProvider } from "@/contexts/CartContext";
import { GroupBuyingProvider } from "@/contexts/GroupBuyingContext";
import Layout from "@/components/layout/Layout";
import Index from "@/pages/Index";
import Bundles from "@/pages/Bundles";
import CustomBuy from "@/pages/CustomBuy";
import GroupBuy from "@/pages/GroupBuy";
import Orders from "@/pages/Orders";
import Profile from "@/pages/Profile";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Terms from "@/pages/Terms";
import NotFound from "@/pages/NotFound";
import AuthCallback from "@/pages/AuthCallback";
import ResetPassword from "@/pages/ResetPassword";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
          <AdminProvider>
            <CartProvider>
              <GroupBuyingProvider>
                <Routes>
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/" element={<Layout><Index /></Layout>} />
                  <Route path="/bundles" element={<Layout><Bundles /></Layout>} />
                  <Route path="/custom-buy" element={<Layout><CustomBuy /></Layout>} />
                  <Route path="/group-buy" element={<Layout><GroupBuy /></Layout>} />
                  <Route path="/orders" element={<Layout><Orders /></Layout>} />
                  <Route path="/profile" element={<Layout><Profile /></Layout>} />
                  <Route path="/about" element={<Layout><About /></Layout>} />
                  <Route path="/contact" element={<Layout><Contact /></Layout>} />
                  <Route path="/terms" element={<Layout><Terms /></Layout>} />
                  <Route path="*" element={<Layout><NotFound /></Layout>} />
                </Routes>
              </GroupBuyingProvider>
            </CartProvider>
          </AdminProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
