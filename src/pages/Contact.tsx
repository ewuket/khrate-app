
import React from "react";
import { Mail, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/layout/Footer";

const Contact = () => {
  const contactEmails = [
    "robert.katabarwa@khrate.com",
    "bamlak.mulugeta@khrate.com"
  ];
  
  const contactPhones = [
    "0789843707",
    "0795754391"
  ];
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 container mx-auto py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Contact Us</h1>
          
          <p className="text-lg mb-8">
            We're here to help! Reach out to us using any of the contact methods below.
          </p>
          
          <div className="grid gap-8 md:grid-cols-2 mb-12">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="h-6 w-6 text-khrate-500" />
                  <h2 className="text-xl font-semibold">Email Us</h2>
                </div>
                <ul className="space-y-3">
                  {contactEmails.map((email, index) => (
                    <li key={index}>
                      <a 
                        href={`mailto:${email}`} 
                        className="text-khrate-500 hover:underline flex items-center gap-2"
                      >
                        {email}
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <Phone className="h-6 w-6 text-khrate-500" />
                  <h2 className="text-xl font-semibold">Call Us</h2>
                </div>
                <ul className="space-y-3">
                  {contactPhones.map((phone, index) => (
                    <li key={index}>
                      <a 
                        href={`tel:${phone}`} 
                        className="text-khrate-500 hover:underline flex items-center gap-2"
                      >
                        {phone}
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-muted p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Business Hours</h2>
            <p>Monday - Sunday: 8:00 AM - 8:00 PM</p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
