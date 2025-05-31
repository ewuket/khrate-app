
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductList from "@/components/custom-buy/ProductList";
import products from "@/components/custom-buy/productsData";

const CustomBuy = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        <section className="bg-gradient-to-r from-khrate-500 to-khrate-600 py-12 text-white">
          <div className="container mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold">Custom Buy</h1>
            <p className="mt-2 max-w-lg">
              Build your own grocery list with exactly what you need
            </p>
          </div>
        </section>
        
        <section className="py-12">
          <div className="container mx-auto">
            <ProductList products={products} />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default CustomBuy;
