
import { Toaster } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { CartProvider } from "@/contexts/CartContext";
import { GroupBuyingProvider } from "@/contexts/GroupBuyingContext";
import Navbar from "@/components/layout/Navbar";
import CartSidebar from "@/components/cart/CartSidebar";
import ChatWidget from "@/components/ai-chat/ChatWidget";
import Index from "@/pages/Index";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Bundles from "@/pages/Bundles";
import CustomBuy from "@/pages/CustomBuy";
import GroupBuy from "@/pages/GroupBuy";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import ProfilePage from "@/components/profile/ProfilePage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminProvider>
          <CartProvider>
            <GroupBuyingProvider>
              <div className="min-h-screen bg-white">
                <Navbar />
                <main className="relative">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/bundles" element={<Bundles />} />
                    <Route path="/custom-buy" element={<CustomBuy />} />
                    <Route path="/group-buy" element={<GroupBuy />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  </Routes>
                </main>
                <CartSidebar />
                <ChatWidget />
              </div>
              <Toaster />
            </GroupBuyingProvider>
          </CartProvider>
        </AdminProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
