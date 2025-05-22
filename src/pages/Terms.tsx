
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Terms = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Terms & Conditions</h1>
          
          <Tabs defaultValue="terms" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="terms">Terms of Service</TabsTrigger>
              <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
            </TabsList>
            
            <TabsContent value="terms" className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-semibold mb-4">Terms of Service</h2>
              <p className="mb-4">
                Last Updated: May 22, 2025
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">1. Acceptance of Terms</h3>
              <p className="mb-4">
                By accessing or using KHRATE's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">2. Description of Services</h3>
              <p className="mb-4">
                KHRATE provides a platform for users to purchase groceries through pre-curated bundles, group buying, or custom orders. We facilitate the connection between consumers and grocery suppliers.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">3. User Accounts</h3>
              <p className="mb-4">
                To use certain features of our service, you must register for an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">4. Orders and Payments</h3>
              <p className="mb-4">
                All orders are subject to product availability. Prices are subject to change without notice. Payment must be made at the time of order.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">5. Delivery</h3>
              <p className="mb-4">
                Delivery times are estimates and cannot be guaranteed. KHRATE is not responsible for delays caused by unforeseen circumstances.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">6. Cancellation and Refunds</h3>
              <p className="mb-4">
                Orders can be cancelled up to 24 hours before scheduled delivery. Refunds will be processed according to our refund policy.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">7. Modifications to Terms</h3>
              <p className="mb-4">
                KHRATE reserves the right to modify these terms at any time. Your continued use of the service after such changes constitutes your acceptance of the new terms.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">8. Governing Law</h3>
              <p className="mb-4">
                These terms shall be governed by and construed in accordance with the laws of the Republic of Kenya.
              </p>
            </TabsContent>
            
            <TabsContent value="privacy" className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-semibold mb-4">Privacy Policy</h2>
              <p className="mb-4">
                Last Updated: May 22, 2025
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">1. Information We Collect</h3>
              <p className="mb-4">
                We collect personal information such as your name, email address, phone number, and delivery address when you create an account or place an order.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">2. How We Use Your Information</h3>
              <p className="mb-4">
                We use your information to process orders, communicate with you about your account or orders, and improve our services.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">3. Information Sharing</h3>
              <p className="mb-4">
                We may share your information with delivery partners to fulfill your orders. We do not sell or rent your personal information to third parties.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">4. Data Security</h3>
              <p className="mb-4">
                We implement appropriate security measures to protect your personal information from unauthorized access or disclosure.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">5. Cookies</h3>
              <p className="mb-4">
                We use cookies to enhance your experience on our platform. You can adjust your browser settings to refuse cookies, but this may limit your ability to use some features.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">6. Your Rights</h3>
              <p className="mb-4">
                You have the right to access, correct, or delete your personal information. Contact us if you wish to exercise these rights.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">7. Changes to Privacy Policy</h3>
              <p className="mb-4">
                We may update this privacy policy periodically. We will notify you of significant changes by posting the new policy on our website.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">8. Contact Us</h3>
              <p className="mb-4">
                If you have questions about our privacy practices, please contact us at support@khrate.com.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Terms;
