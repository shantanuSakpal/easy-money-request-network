"use client";
import React, { useState } from 'react';
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { SendIcon } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

export default function ChatbotUI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: "Hello! How can I help you today?",
      sender: 'bot'
    }
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');

  const sendMessage = () => {
    if (inputMessage.trim() === '') return;

    // Add user message
    const newUserMessage: Message = {
      id: messages.length,
      text: inputMessage,
      sender: 'user'
    };

    // Simulate bot response (replace with actual logic)
    const botResponse: Message = {
      id: messages.length + 1,
      text: `You said: ${inputMessage}`,
      sender: 'bot'
    };

    setMessages([...messages, newUserMessage, botResponse]);
    setInputMessage('');
  };

  return (
    <div className="flex flex-col h-screen m-10 px-8 max-w-[70%] mx-auto bg-gray-100 shadow-md">
      {/* Chat Header */}
      <div className="bg-gray-100 p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Chatbot</h2>
      </div>

      {/* Messages Container */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div 
              className={`
                max-w-[70%] p-3 rounded-lg 
                ${msg.sender === 'user' 
                  ? 'bg-gray-800 text-white' 
                  : 'bg-gray-200 text-black'}
              `}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-100 border-t border-gray-200 flex items-center space-x-2">
        <Input 
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          className="flex-grow"
          variant="bordered"
        />
        <Button 
          isIconOnly 
          color="default" 
          variant="solid"
          onClick={sendMessage}
          className="bg-gray-800 text-white hover:bg-gray-700"
        >
          <SendIcon size={20} />
        </Button>
      </div>
    </div>
  );
}