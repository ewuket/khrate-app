
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  toggleLanguage: () => void;
  language: 'en' | 'rw';
}

const ChatInput = ({ onSendMessage, toggleLanguage, language }: ChatInputProps) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleLanguage}
          className="text-xs px-3"
        >
          {language === 'en' ? '🇬🇧 EN' : '🇷🇼 RW'}
        </Button>
        <span className="text-xs text-muted-foreground">
          {language === 'en' ? 'Press Enter to send' : 'Kanda Enter wohereze'}
        </span>
      </div>
      
      <div className="flex gap-2 items-end">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={language === 'en' ? "Type your message..." : "Andika ubutumwa bwawe..."}
          className="flex-1 min-h-[40px] max-h-[120px] resize-none"
          rows={1}
        />
        <Button 
          onClick={handleSendMessage}
          disabled={!input.trim()}
          className="bg-khrate-500 hover:bg-khrate-600 h-10 w-10 p-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
