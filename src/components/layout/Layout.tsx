
import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ChatAssistant from '@/components/chat/ChatAssistant';
import CartSidebar from '@/components/cart/CartSidebar';
import AuthModal from '@/components/auth/AuthModal';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  // Define routes that should show the footer
  const routesWithFooter = ['/', '/bundles', '/contact', '/profile', '/orders'];
  const shouldShowFooter = routesWithFooter.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {children || <Outlet />}
      </main>
      {shouldShowFooter && <Footer />}
      <ChatAssistant />
      <CartSidebar />
      <AuthModal />
    </div>
  );
};

export default Layout;
