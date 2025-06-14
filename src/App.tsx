
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { GroupBuyingProvider } from "@/contexts/GroupBuyingContext";
import { AdminProvider } from "@/contexts/AdminContext";
import Layout from "@/components/layout/Layout";
import Index from "./pages/Index";
import Bundles from "./pages/Bundles";
import CustomBuy from "./pages/CustomBuy";
import GroupBuy from "./pages/GroupBuy";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <AdminProvider>
              <GroupBuyingProvider>
                <Routes>
                  {/* Admin routes without Layout wrapper */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  
                  {/* All other routes with Layout wrapper */}
                  <Route path="/*" element={
                    <Layout>
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/bundles" element={<Bundles />} />
                        <Route path="/custom-buy" element={<CustomBuy />} />
                        <Route path="/group-buy" element={<GroupBuy />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/auth/callback" element={<AuthCallback />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Layout>
                  } />
                </Routes>
              </GroupBuyingProvider>
            </AdminProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
