
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, X } from "lucide-react";
import { toast } from "sonner";
import { Message, initialMessage } from "@/types/chat";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import SupportTab from "./SupportTab";
import TypingIndicator from "./TypingIndicator";

const ChatAssistant = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [language, setLanguage] = useState<'en' | 'rw'>('en');
  const [isTyping, setIsTyping] = useState(false);

  // Scroll to bottom effect
  useEffect(() => {
    const messageContainer = document.getElementById('message-container');
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }, [messages]);

  // Handle sending a new message
  const handleSendMessage = (input: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate bot typing
    setIsTyping(true);
    
    setTimeout(() => {
      // Generate a response based on the user's message
      let botResponse = '';
      const lowerInput = input.toLowerCase();
      
      if (lowerInput.includes('bundle') || lowerInput.includes('product')) {
        botResponse = language === 'en' 
          ? "Our bundles are carefully selected products that save you money. We have various options like essential groceries, fresh produce, and household items."
          : "Ibikoresho byacu bishyizwe hamwe kugira ngo bikugabanyirize amafaranga. Dufite amoko atandukanye nk'ibikoresho by'ibanze, imbuto n'imboga bishyashya, n'ibikoresho byo mu rugo.";
      } else if (lowerInput.includes('delivery') || lowerInput.includes('shipping')) {
        botResponse = language === 'en'
          ? "We offer free delivery for all orders! Your items will typically arrive within 24 hours of ordering." 
          : "Dutanga serivisi y'ubwikorezi ku buntu ku byo ushaka byose! Ibyo wasabye bishobora kugera mu masaha 24 nyuma yo gusaba.";
      } else if (lowerInput.includes('payment') || lowerInput.includes('momo') || lowerInput.includes('mtn')) {
        botResponse = language === 'en' 
          ? "We accept MTN MoMo payments. The payment phone number is 0795754391."
          : "Twakira ubwishyu bwa MTN MoMo. Numero ya telefoni yo kwishyura ni 0795754391.";
      } else if (lowerInput.includes('group buy') || lowerInput.includes('discount')) {
        botResponse = language === 'en'
          ? "Group Buy allows you to join others to get bigger discounts - up to 30% off! The more people join, the bigger the savings."
          : "Group Buy ikwemerera kwifatanya n'abandi kugira ngo ubone igabanyuka ry'ibiciro - kugeza ku 30%! Abantu benshi bayifatamo, niko ubugabane bugenda bukura.";
      } else if (lowerInput.includes('help') || lowerInput.includes('human') || lowerInput.includes('support')) {
        botResponse = language === 'en'
          ? "If you need to speak with a human, please contact us via email at bamlak.mulugeta@khrate.com or robert.katabarwa@khrate.com, or call us at 0795754391 or 0789843707."
          : "Niba ukeneye kuvugana n'umukozi, watwandikira imeyili kuri bamlak.mulugeta@khrate.com cyangwa robert.katabarwa@khrate.com, cyangwa uhamagare kuri 0795754391 cyangwa 0789843707.";
      } else {
        botResponse = language === 'en'
          ? "I'm here to help! You can ask me about our bundles, delivery options, payment methods, or group buy discounts."
          : "Ndi hano kugira ngo ngufashe! Ushobora kumbaza ku bikoresho byacu, uburyo bwo kubitanga, uburyo bwo kwishyura, cyangwa se kugabanyirizwa ibiciro mu ikoraniro.";
      }
      
      // Add bot response
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setIsTyping(false);
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'rw' : 'en';
    setLanguage(newLanguage);
    
    // Add system message about language change
    const systemMessage: Message = {
      id: Date.now().toString(),
      text: newLanguage === 'en' 
        ? "Switched to English" 
        : "Guhindura ururimi mu Kinyarwanda",
      sender: 'system',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, systemMessage]);
  };

  const handleContactSupport = (type: 'email' | 'phone', value: string) => {
    if (type === 'email') {
      window.location.href = `mailto:${value}`;
    } else {
      window.location.href = `tel:${value}`;
    }
    
    toast.success(`Contacting support via ${type === 'email' ? 'email' : 'phone'}`);
  };

  return (
    <>
      {/* Chat Button */}
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-khrate-500 hover:bg-khrate-600 shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>
      
      {/* Chat Panel */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="sm:max-w-md p-0 flex flex-col h-full">
          <SheetHeader className="px-4 py-4 border-b bg-khrate-500 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 bg-white text-khrate-500">
                  <img src="/lovable-uploads/206fd2ee-0377-47a0-8083-70118088988f.png" alt="BOB" />
                </Avatar>
                <SheetTitle className="text-white">Chat with BOB</SheetTitle>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setOpen(false)}
                className="text-white hover:bg-khrate-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>
          
          <Tabs defaultValue="chat" className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-2 mx-4 my-2">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="support">Human Support</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="flex-1 flex flex-col p-4 pt-0">
              {/* Messages Container */}
              <div 
                id="message-container"
                className="flex-1 overflow-y-auto mb-4 space-y-4"
              >
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                
                {isTyping && <TypingIndicator />}
              </div>
              
              {/* Input Area */}
              <ChatInput 
                onSendMessage={handleSendMessage}
                toggleLanguage={toggleLanguage}
                language={language}
              />
            </TabsContent>
            
            <TabsContent value="support">
              <SupportTab handleContactSupport={handleContactSupport} />
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ChatAssistant;
