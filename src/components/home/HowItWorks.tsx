
import React from 'react';
import { Users, ShoppingCart, Package, CheckCircle } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Users className="h-8 w-8 text-khrate-500" />,
      title: "Group Buying",
      description: "Join neighbors to buy groceries together and save money with bulk discounts",
      steps: [
        "Create or join a group with your neighbors",
        "Add items to your group cart",
        "Get 10% discount when group reaches 3+ members",
        "Share delivery costs with group members"
      ]
    },
    {
      icon: <ShoppingCart className="h-8 w-8 text-khrate-500" />,
      title: "Custom Buying", 
      description: "Build your own personalized grocery selection with individual items",
      steps: [
        "Browse our fresh produce and essentials",
        "Select exactly what you need",
        "Customize quantities to fit your family",
        "Enjoy flexible individual shopping"
      ]
    },
    {
      icon: <Package className="h-8 w-8 text-khrate-500" />,
      title: "Bundle Options",
      description: "Choose from pre-curated packages designed for families and individuals",
      steps: [
        "Select from family or individual bundles",
        "Get complete meal solutions",
        "Save time with pre-selected items",
        "Perfect portions for your household"
      ]
    }
  ];

  const processSteps = [
    {
      icon: <ShoppingCart className="h-6 w-6" />,
      title: "Choose Your Method",
      description: "Select group buying, custom selection, or pre-made bundles"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Add Items",
      description: "Pick your groceries or join a group to add items together"
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Schedule Delivery",
      description: "Choose your delivery time and pay with Mobile Money"
    },
    {
      icon: <Package className="h-6 w-6" />,
      title: "Receive Fresh Groceries",
      description: "Get fresh, quality groceries delivered to your door"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How Khrate Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Three convenient ways to get fresh groceries delivered to your door in Kigali
          </p>
        </div>

        {/* Shopping Methods */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {steps.map((method, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="text-center mb-4">
                {method.icon}
                <h3 className="text-xl font-semibold mt-3 mb-2">{method.title}</h3>
                <p className="text-gray-600 text-sm">{method.description}</p>
              </div>
              <ul className="space-y-2">
                {method.steps.map((step, stepIndex) => (
                  <li key={stepIndex} className="flex items-start text-sm">
                    <div className="w-2 h-2 bg-khrate-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Process Steps */}
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-center mb-8">Simple 4-Step Process</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-khrate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-khrate-500">
                    {step.icon}
                  </div>
                </div>
                <div className="relative">
                  <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
                  <p className="text-sm text-gray-600">{step.description}</p>
                  {index < processSteps.length - 1 && (
                    <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-gray-200 -translate-x-1/2"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="text-center mt-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-khrate-500 mb-2">10%</div>
              <div className="text-sm text-gray-600">Group Buying Discount</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-khrate-500 mb-2">Free</div>
              <div className="text-sm text-gray-600">Delivery on Orders 10,000+ RWF</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-khrate-500 mb-2">Fresh</div>
              <div className="text-sm text-gray-600">Quality Guaranteed</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
