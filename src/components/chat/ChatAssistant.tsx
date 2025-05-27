
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Enhanced scroll to bottom effect
  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages, isTyping]);

  // Enhanced message handling with more intelligent responses
  const handleSendMessage = (input: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    setTimeout(() => {
      const botResponse = generateIntelligentResponse(input, language);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setIsTyping(false);
      setMessages(prev => [...prev, botMessage]);
    }, 1000 + Math.random() * 1000); // Variable typing time for realism
  };

  const generateIntelligentResponse = (input: string, lang: 'en' | 'rw'): string => {
    const lowerInput = input.toLowerCase();
    
    // Enhanced response logic with more categories
    
    // Greetings
    if (lowerInput.match(/\b(hello|hi|hey|good morning|good afternoon|good evening|greetings)\b/)) {
      return lang === 'en' 
        ? "Hello! I'm BOB, your KHRATE assistant. I'm here to help you with anything you need - from shopping and orders to delivery scheduling and account questions. How can I assist you today?"
        : "Muraho! Ndi BOB, umufasha wawe wa KHRATE. Ndi hano kugira ngo ngufashe mu bintu byose ukeneye - kuva mu kugura no gutumiza ibicuruzwa kugeza ku guteganya ubwikorezi n'ibibazo by'konti yawe. Ese nashobora kugufasha iki uyu munsi?";
    }

    // Product and Bundle queries
    if (lowerInput.match(/\b(bundle|product|item|grocery|food|price|cost|available|stock)\b/)) {
      return lang === 'en' 
        ? "Our bundles are carefully curated to save you money! We offer fresh produce bundles, essential groceries, household items, and seasonal specials. Each bundle is designed to give you maximum value. Would you like to know about specific products or see our current deals?"
        : "Ibikoresho byacu bishyizwe hamwe kugira ngo bikugabanyirize amafaranga! Dutanga ibikoresho by'imbuto n'imboga bishyashya, ibikoresho by'ibanze, ibikoresho byo mu rugo, n'ibyihariye by'igihe. Buri kikoresho cyashyizwe kugira ngo uhabwe agaciro kenshi. Wifuza kumenya ibikoresho byihariye cyangwa kureba amasoko yacu y'ubu?";
    }

    // Delivery and shipping
    if (lowerInput.match(/\b(delivery|shipping|when|arrive|schedule|time|fast|quick)\b/)) {
      return lang === 'en'
        ? "We offer FREE delivery for all orders! Your items typically arrive within 24 hours. You can schedule delivery for a convenient time, and we'll send you updates along the way. Would you like to schedule a delivery or track an existing order?"
        : "Dutanga serivisi y'ubwikorezi ku buntu ku byo ushaka byose! Ibyo wasabye bishobora kugera mu masaha 24. Ushobora guteganya ubwikorezi mu gihe cyiza, kandi tuzakwohereza amakuru ku nzira. Wifuza guteganya ubwikorezi cyangwa gukurikirana ibyo wasabye?";
    }

    // Payment methods
    if (lowerInput.match(/\b(payment|pay|momo|mtn|money|cash|card|bank)\b/)) {
      return lang === 'en' 
        ? "We accept MTN MoMo payments for your convenience! Our payment number is 0795754391. Payment is secure and you'll receive confirmation immediately. You can also pay on delivery. Need help with payment or have payment issues?"
        : "Twakira ubwishyu bwa MTN MoMo kugira ngo bikorosheje! Numero yacu yo kwishyura ni 0795754391. Ubwishyu burafite umutekano kandi uzabona ubutumwa bw'iyemeza ako kanya. Urashobora no kwishyura igihe bitanzwe. Ukeneye ubufasha mu kwishyura cyangwa ufite ibibazo byo kwishyura?";
    }

    // Group buy and discounts
    if (lowerInput.match(/\b(group buy|discount|save|cheaper|deal|offer|promotion)\b/)) {
      return lang === 'en'
        ? "Group Buy is amazing for bigger savings! Join with others to unlock discounts up to 30% off regular prices. The more people who join, the bigger the discount. I can help you find active group buys or notify you when new ones start!"
        : "Group Buy ni byiza cyane kubera kugabanya ibiciro! Fatanya n'abandi kugira ngo ubone igabanyuka ry'ibiciro kugeza ku 30% ku biciro bisanzwe. Abantu benshi bafatanyije, niko igabanyuka rigenda rikura. Nshobora kugufasha kubona Group Buy zikora cyangwa nkakumenyesha igihe zishya zitangira!";
    }

    // Order tracking and history
    if (lowerInput.match(/\b(order|track|status|history|where|my order|ordered)\b/)) {
      return lang === 'en'
        ? "I can help you track your orders! You can view your order history, check delivery status, and get updates on current orders. Would you like me to help you check on a specific order or show you how to track orders yourself?"
        : "Nshobora kugufasha gukurikirana ibyo wasabye! Urashobora kureba amateka y'ibyo wasabye, kugenzura uko ubwikorezi bujya, no kubona amakuru y'ibyo wasabye ubu. Wifuza ko ngufasha kugenzura ikintu cyihariye wasabye cyangwa nkerekanye uburyo bwo gukurikirana ibyo wasabye wenyine?";
    }

    // Account and profile issues
    if (lowerInput.match(/\b(account|profile|login|password|email|phone|address|update|change)\b/)) {
      return lang === 'en'
        ? "I can help with account issues! Whether you need to update your profile, change your address, reset your password, or modify contact information, I'm here to guide you. What specific account help do you need?"
        : "Nshobora gufasha mu bibazo by'konti! Haba ukeneye kuvugurura profil yawe, guhindura aderesi yawe, kugarura ijambo ry'ibanga, cyangwa guhindura amakuru y'itumanaho, ndi hano kugira ngo nkuyobore. Ni ubufasha bwihariye bwehe bukeneye ku konti yawe?";
    }

    // Customer service and complaints
    if (lowerInput.match(/\b(problem|issue|complaint|help|support|wrong|error|refund|return)\b/)) {
      return lang === 'en'
        ? "I'm sorry to hear you're having an issue! I'm here to help resolve any problems with your orders, deliveries, or account. Can you tell me more about what's happening so I can assist you better, or would you prefer to speak with our human support team?"
        : "Ndababaye ko ufite ikibazo! Ndi hano kugira ngo ngufashe gukemura ibibazo byose bijyanye n'ibyo wasabye, ubwikorezi, cyangwa konti yawe. Ushobora kumbwira byinshi ku bibazo uri guhura nabyo kugira ngo nkufashe neza, cyangwa wifuza kuvugana n'ikipe yacu ya serivisi?";
    }

    // FAQ topics
    if (lowerInput.match(/\b(faq|question|how|what|when|why|where)\b/)) {
      return lang === 'en'
        ? "I'm here to answer your questions! I can help with information about our products, ordering process, delivery options, payment methods, group buying, account management, and much more. What would you like to know?"
        : "Ndi hano kugira ngo nsubize ibibazo byawe! Nshobora gufasha mu makuru ajyanye n'ibicuruzwa byacu, uburyo bwo gutumiza, amahitamo y'ubwikorezi, uburyo bwo kwishyura, kugura mu itsinda, gucunga konti, n'ibindi byinshi. Ni iki wifuza kumenya?";
    }

    // Business hours and contact
    if (lowerInput.match(/\b(hours|open|closed|contact|call|email|time|available)\b/)) {
      return lang === 'en'
        ? "We're available to help you! Our support team works Monday to Saturday, 8:00 AM to 6:00 PM. You can reach us by email at bamlak.mulugeta@khrate.com or robert.katabarwa@khrate.com, or call us at 0795754391 or 0789843707. I'm here 24/7 for basic assistance!"
        : "Turi hano kugira ngo tugufashe! Ikipe yacu ya serivisi ikora kuva ku wa mbere kugeza ku wa gatandatu, saa mbiri z'igitondo kugeza saa kumi n'ebyiri z'umugoroba. Urashobora kuduhamagara kuri imeyili bamlak.mulugeta@khrate.com cyangwa robert.katabarwa@khrate.com, cyangwa kuduhamagara kuri 0795754391 cyangwa 0789843707. Ndi hano masaha 24/7 kubufasha bw'ibanze!";
    }

    // Thank you and positive feedback
    if (lowerInput.match(/\b(thank|thanks|appreciate|good|great|excellent|awesome)\b/)) {
      return lang === 'en'
        ? "You're very welcome! I'm so glad I could help. Remember, I'm always here whenever you need assistance with KHRATE. Is there anything else I can help you with today?"
        : "Weze ! Nishimye cyane ko nshoboye kugufasha. Wibuke, ndi hano buri gihe igihe ukeneye ubufasha na KHRATE. Hari ikindi nshobora kugufasha muri uyu munsi?";
    }

    // Goodbye
    if (lowerInput.match(/\b(bye|goodbye|see you|later|exit|quit)\b/)) {
      return lang === 'en'
        ? "Goodbye! Thank you for choosing KHRATE. Feel free to come back anytime if you need help. Have a wonderful day!"
        : "Muraho neza! Urakoze guhitamo KHRATE. Wifuze gusubira igihe icyo ari cyo cyose ukeneye ubufasha. Mugire umunsi mwiza!";
    }

    // Default intelligent response
    return lang === 'en'
      ? "I understand you're asking about something specific! While I can help with most things related to KHRATE - like products, orders, delivery, payments, and account issues - I want to make sure I give you the best answer. Could you tell me a bit more about what you're looking for, or would you prefer to speak with our human support team?"
      : "Ndumva ubaza ikintu cyihariye! Nubwo nshobora gufasha mu bintu byinshi bijyanye na KHRATE - nk'ibicuruzwa, ibyo gutumiza, ubwikorezi, ubwishyu, n'ibibazo by'konti - ndashaka kwisuzuma ko nkaguha igisubizo cyiza. Urashobora kumbwira byinshi ku bintu ushaka, cyangwa wifuza kuvugana n'ikipe yacu ya serivisi?";
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'rw' : 'en';
    setLanguage(newLanguage);
    
    const systemMessage: Message = {
      id: Date.now().toString(),
      text: newLanguage === 'en' 
        ? "Language switched to English" 
        : "Ururimi rwahinduwe mu Kinyarwanda",
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
              {/* Messages Container with proper scrolling */}
              <div className="flex-1 relative">
                <ScrollArea 
                  ref={scrollAreaRef}
                  className="h-full w-full pr-4"
                >
                  <div className="space-y-4 pb-4">
                    {messages.map((message) => (
                      <ChatMessage key={message.id} message={message} />
                    ))}
                    
                    {isTyping && <TypingIndicator />}
                  </div>
                </ScrollArea>
              </div>
              
              {/* Input Area */}
              <div className="mt-4 pt-4 border-t">
                <ChatInput 
                  onSendMessage={handleSendMessage}
                  toggleLanguage={toggleLanguage}
                  language={language}
                />
              </div>
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
