"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import ChatWindow from "./ChatWindow";
import { generateSessionId } from "@/lib/chat/chatBot";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    // Generate or retrieve session ID
    const storedSessionId = sessionStorage.getItem("chat_session_id");
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = generateSessionId();
      sessionStorage.setItem("chat_session_id", newSessionId);
      setSessionId(newSessionId);
    }
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chat Window */}
      <ChatWindow
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        sessionId={sessionId}
      />

      {/* Unified Chat Button */}
      <button
        onClick={toggleChat}
        className="group fixed bottom-4 right-4 z-50 flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary/30 bg-primary text-primary-foreground shadow-xl transition-all duration-200 hover:scale-110 hover:border-primary hover:shadow-2xl sm:bottom-6 sm:right-6"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="h-7 w-7 transition-transform group-hover:rotate-90" />
        ) : (
          <MessageCircle className="h-7 w-7 transition-transform group-hover:scale-110" />
        )}
        {/* Pulse animation for attention */}
        {!isOpen && (
          <>
            <span className="absolute inset-0 animate-ping rounded-full bg-primary/40"></span>
            <span className="absolute -inset-1 animate-pulse rounded-full bg-primary/20"></span>
          </>
        )}
      </button>
    </>
  );
}
