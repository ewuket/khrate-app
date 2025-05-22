
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 container mx-auto py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">About KHRATE</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg mb-6">
              At KHRATE, our mission is to make grocery shopping more affordable and accessible for everyone.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Our Story</h2>
            <p className="mb-6">
              KHRATE was founded with a simple yet powerful idea: what if we could bring people together to get better prices on everyday essentials?
            </p>
            <p className="mb-6">
              We noticed that grocery prices were becoming increasingly difficult for many households to manage. By leveraging the power of group purchasing and efficient logistics, we created a platform that delivers significant savings directly to consumers.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">What We Do</h2>
            <p className="mb-6">
              We offer three main ways to save:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Pre-curated Bundles:</strong> Carefully selected packages of groceries at discounted prices.</li>
              <li><strong>Group Buying:</strong> Join with others to unlock bulk purchase discounts.</li>
              <li><strong>Custom Orders:</strong> Build your own grocery list with the exact items you need.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Our Vision</h2>
            <p className="mb-6">
              We envision a world where quality groceries are affordable for every household. By cutting out unnecessary middlemen and leveraging collective buying power, we're working to make this vision a reality.
            </p>
            
            <p className="mt-8 text-lg">
              Join us in our mission to bring big savings to every crate!
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
