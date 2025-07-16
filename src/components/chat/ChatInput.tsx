
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  toggleLanguage: () => void;
  language: 'en' | 'rw';
}

const ChatInput = ({ onSendMessage, toggleLanguage, language }: ChatInputProps) => {
  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
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
  );
};

export default ChatInput;
