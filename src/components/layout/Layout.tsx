
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import ChatAssistant from '@/components/chat/ChatAssistant';
import CartSidebar from '@/components/cart/CartSidebar';
import AuthModal from '@/components/auth/AuthModal';

interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
  showFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showNavigation = true, 
  showFooter = true 
}) => {
  return (
    <div className="flex flex-col min-h-screen">
      {showNavigation && <Navbar />}
      <main className="flex-1">
        {children}
      </main>
      {showFooter && <Footer />}
      <ChatAssistant />
      <CartSidebar />
      <AuthModal />
    </div>
  );
};

export default Layout;
