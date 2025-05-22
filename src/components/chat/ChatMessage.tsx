
import React from 'react';
import { Avatar } from "@/components/ui/avatar";
import { Message } from '@/types/chat';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div
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
  );
};

export default ChatMessage;
