
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, X, Send, Minimize2, Maximize2 } from "lucide-react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { Message, initialMessage } from "@/types/chat";
import { toast } from "sonner";

const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [language, setLanguage] = useState<'en' | 'rw'>('en');
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Order-related queries
    if (message.includes('order') || message.includes('track')) {
      return language === 'en' 
        ? "You can track your orders by clicking on your profile icon and selecting 'Order History'. There you'll see all your past and current orders with their delivery status."
        : "Ushobora gukurikirana ibicuruzwa byawe ukanda ku ishusho y'umuntu hanyuma uhitemo 'Amateka y'ibicuruzwa'. Hariya uzabona ibicuruzwa byawe byose by'ejo n'ubu hamwe n'uko bigenda.";
    }
    
    // Group buying queries
    if (message.includes('group') || message.includes('bulk')) {
      return language === 'en'
        ? "Group buying lets you save money by purchasing with others! Click 'Group Buy' in the menu to create a new group or join an existing one. You'll get 10% discount when your group reaches minimum participants."
        : "Kugura muri rusange bikugirira ubwoba bwo kwishyura! Kanda 'Kugura muri Rusange' kuri menu kugira ngo ukore itsinda rishya cyangwa winjire mu irindi risanzwe rihari. Uzabona igishoro cya 10% iyo itsinda ryawe rigeze ku mubare muto w'abagize.";
    }
    
    // Bundle queries
    if (message.includes('bundle')) {
      return language === 'en'
        ? "Our bundles are pre-curated collections of groceries at discounted prices. Check out our Featured Bundles on the homepage - perfect for families and individuals looking to save time and money!"
        : "Amapaki yacu ni inyongeramusaruro zateguwe mbere ku bicuruzwa ku giciro cyihagije. Reba Amapaki yacu y'ingenzi ku rupapuro rw'itangiriro - birakwiye imiryango n'abantu ku giti cyabo bashaka kwizigama igihe n'amafaranga!";
    }
    
    // Delivery queries
    if (message.includes('deliver') || message.includes('shipping')) {
      return language === 'en'
        ? "We offer scheduled delivery across Kigali. During checkout, you can choose your preferred delivery date and time slot (8AM-11AM, 11AM-2PM, 2PM-5PM, or 5PM-8PM). Delivery is free for orders above RWF 10,000."
        : "Dutanga serivisi yo gutwariza ibicuruzwa mu Kigali hose. Mu gihe cyo kwishyura, ushobora guhitamo itariki n'isaha wifuza ko bigushira (8AM-11AM, 11AM-2PM, 2PM-5PM, cyangwa 5PM-8PM). Gutwariza ni ubuntu ku bicuruzwa birengeje RWF 10,000.";
    }
    
    // Payment queries
    if (message.includes('pay') || message.includes('payment')) {
      return language === 'en'
        ? "We accept MTN Mobile Money and Airtel Money. During checkout, you'll receive payment instructions. Send payment to 0795754391 and your order will be confirmed once payment is received."
        : "Twakira MTN Mobile Money na Airtel Money. Mu gihe cyo kwishyura, uzabona amabwiriza yo kwishyura. Ohereza amafaranga kuri 0795754391 kandi icyifuzo cyawe kizakanemezwa amafaranga amaze kutugeraho.";
    }
    
    // Support queries
    if (message.includes('support') || message.includes('help') || message.includes('contact')) {
      return language === 'en'
        ? "For additional support, you can reach us at support@khrate.com or call +250 795 754 391. Our team is available Monday-Saturday, 8AM-6PM. You can also use this chat for immediate assistance!"
        : "Kugira ngo ubure ubufasha bwiyongera, ushobora kutubona kuri support@khrate.com cyangwa ukadutabagia kuri +250 795 754 391. Ikipe yacu irahari kuwa mbere-kuwa gatandatu, 8AM-6PM. Ushobora kandi gukoresha iki kiganiro kugira ngo ubure ubufasha bwihuse!";
    }
    
    // Default responses
    const defaultResponses = language === 'en' ? [
      "I'm here to help with any questions about ordering, group buying, deliveries, or our services. What would you like to know?",
      "You can ask me about our bundles, how to place orders, group buying discounts, delivery schedules, or payment methods. How can I assist you?",
      "I can help you navigate our platform, explain our services, or guide you through placing an order. What do you need help with?"
    ] : [
      "Ndi hano kugira ngo nkugirire ubufasha mu bibazo byose bijyanye no gutumiza, kugura muri rusange, gutwariza, cyangwa serivisi zacu. Ni iki wifuza kumenya?",
      "Ushobora kunbaza ku mapaki yacu, uburyo bwo gutumiza, igishoro cyo kugura muri rusange, gahunda zo gutwariza, cyangwa uburyo bwo kwishyura. Ese nakugirira ubufasha nte?",
      "Nshobora kukugirira ubufasha mu kuyobora urubuga rwacu, gusobanura serivisi zacu, cyangwa nkugane mu gutumiza. Ni iki ukeneye ubufasha bwako?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(text),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'rw' : 'en');
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={toggleChat}
          className="fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full bg-khrate-500 hover:bg-khrate-600 shadow-lg"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-4 right-4 z-50 w-80 sm:w-96 shadow-xl border-0">
          <CardHeader className="pb-2 bg-khrate-500 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-khrate-500 font-bold text-sm">B</span>
                </div>
                {language === 'en' ? 'Bob - Shopping Assistant' : 'Bob - Umufasha w\'Kugura'}
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMinimize}
                  className="h-8 w-8 p-0 text-white hover:bg-khrate-600"
                >
                  {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleChat}
                  className="h-8 w-8 p-0 text-white hover:bg-khrate-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm opacity-90">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              {language === 'en' ? 'Online now' : 'Ku murongo ubu'}
            </div>
          </CardHeader>

          {!isMinimized && (
            <CardContent className="p-0">
              {/* Messages */}
              <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                  />
                ))}
                {isTyping && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <div className="w-8 h-8 bg-khrate-100 rounded-full flex items-center justify-center">
                      <span className="text-khrate-600 font-bold text-xs">B</span>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t bg-white rounded-b-lg">
                <ChatInput 
                  onSendMessage={handleSendMessage}
                  toggleLanguage={toggleLanguage}
                  language={language}
                />
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </>
  );
};

export default ChatAssistant;
