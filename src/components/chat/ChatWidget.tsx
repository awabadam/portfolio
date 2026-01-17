"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import ChatWindow from "./ChatWindow";
import { useWhatsApp } from "./WhatsAppContext";
import { generateSessionId } from "@/lib/chat/chatBot";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const { openWhatsApp, isOpen: isWhatsAppOpen } = useWhatsApp();

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

  const handleWhatsAppClick = () => {
    setIsOpen(false); // Close chat if open
    openWhatsApp();
  };

  return (
    <>
      {/* Chat Window */}
      <ChatWindow
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        sessionId={sessionId}
      />

      {/* Action Buttons Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 sm:bottom-6 sm:right-6">
        {/* WhatsApp Button - Green */}
        <button
          onClick={handleWhatsAppClick}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-[#128C7E] hover:shadow-xl"
          aria-label="Open WhatsApp"
        >
          <FaWhatsapp className="h-7 w-7 transition-transform group-hover:scale-110" />
          {/* Pulse animation ring */}
          {!isWhatsAppOpen && (
            <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/40 opacity-75"></span>
          )}
        </button>

        {/* Chat Button - More Prominent */}
        <button
          onClick={toggleChat}
          className="group relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary/30 bg-primary text-primary-foreground shadow-xl transition-all duration-200 hover:scale-110 hover:border-primary hover:shadow-2xl"
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
      </div>
    </>
  );
}
