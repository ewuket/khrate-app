
import React from 'react';
import { Avatar } from "@/components/ui/avatar";

const TypingIndicator = () => {
  return (
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
  );
};

export default TypingIndicator;
