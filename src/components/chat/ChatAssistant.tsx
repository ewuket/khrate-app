
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Send, X, PhoneCall, Mail } from "lucide-react";
import { toast } from "sonner";

// Types for messages
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'system';
  timestamp: Date;
}

// Initial greeting message
const initialMessage: Message = {
  id: '1',
  text: "Hello! I'm BOB, your KHRATE assistant. How can I help you today? I can assist with shopping, bundles, checkout, and more.",
  sender: 'bot',
  timestamp: new Date(),
};

const ChatAssistant = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState('');
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
  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.sender === 'bot' && (
                      <Avatar className="h-8 w-8 mr-2 mt-1 bg-khrate-50 border">
                        <img src="/lovable-uploads/206fd2ee-0377-47a0-8083-70118088988f.png" alt="BOB" />
                      </Avatar>
                    )}
                    
                    <div
                      className={`px-4 py-2 rounded-lg max-w-[85%] ${
                        message.sender === 'user'
                          ? 'bg-khrate-500 text-white rounded-tr-none'
                          : message.sender === 'system'
                          ? 'bg-gray-100 text-gray-500 text-center text-sm py-1 max-w-full mx-auto'
                          : 'bg-gray-100 text-gray-800 rounded-tl-none'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <Avatar className="h-8 w-8 mr-2 mt-1 bg-khrate-50 border">
                      <img src="/lovable-uploads/206fd2ee-0377-47a0-8083-70118088988f.png" alt="BOB" />
                    </Avatar>
                    <div className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg rounded-tl-none">
                      <span className="flex gap-1">
                        <span className="animate-pulse">.</span>
                        <span className="animate-pulse delay-150">.</span>
                        <span className="animate-pulse delay-300">.</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Input Area */}
              <div className="mt-auto border-t pt-4">
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleLanguage}
                    className="mr-2"
                  >
                    {language === 'en' ? 'EN' : 'RW'}
                  </Button>
                  
                  <div className="flex-1 flex border rounded-md overflow-hidden">
                    <textarea 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={language === 'en' ? "Type your message..." : "Andika ubutumwa bwawe..."}
                      className="flex-1 py-2 px-3 outline-none resize-none"
                      rows={1}
                    />
                    <Button 
                      type="submit"
                      onClick={handleSendMessage}
                      className="rounded-none bg-khrate-500 hover:bg-khrate-600"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="support" className="p-4 space-y-6">
              <div>
                <h3 className="font-medium text-lg mb-2">Email Support</h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleContactSupport('email', 'bamlak.mulugeta@khrate.com')}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    bamlak.mulugeta@khrate.com
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleContactSupport('email', 'robert.katabarwa@khrate.com')}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    robert.katabarwa@khrate.com
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-2">Phone Support</h3>
                <div className="space-y-2">
                  <Button
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleContactSupport('phone', '0795754391')}
                  >
                    <PhoneCall className="mr-2 h-4 w-4" />
                    0795754391
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleContactSupport('phone', '0789843707')}
                  >
                    <PhoneCall className="mr-2 h-4 w-4" />
                    0789843707
                  </Button>
                </div>
              </div>
              
              <div className="pt-4 text-sm text-muted-foreground">
                <p>Our support team is available Monday to Saturday from 8:00 AM to 6:00 PM.</p>
              </div>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ChatAssistant;
