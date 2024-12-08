"use client";
import { Avatar } from "@nextui-org/react";
import React from "react";

import Chat from "@/components/chat/chat";
// import SecondaryNavbar from "@/components/SecondaryNavbar";

export default function ChatPage({ setAgentResponse }) {
 
  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-3/4">
        <Chat setAgentResponse={setAgentResponse} />
      </div>
    </div>
  );
}
