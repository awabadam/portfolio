"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { X, Send, Loader2, MessageCircle } from "lucide-react";
import MessageBubble from "./MessageBubble";
import QuickActions from "./QuickActions";
import type { ChatMessage } from "@/lib/chat/chatBot";

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  conversationId?: string;
}

export default function ChatWindow({
  isOpen,
  onClose,
  sessionId,
  conversationId,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isInitialized) {
      // Load conversation history if conversationId exists
      if (conversationId) {
        loadConversation();
      } else {
        // Start with welcome message
        setMessages([
          {
            role: "assistant",
            content:
              "Hello! I'm here to help you learn about Awab's web design services. How can I assist you today?",
          },
        ]);
      }
      setIsInitialized(true);
      inputRef.current?.focus();
    }
  }, [isOpen, conversationId, isInitialized]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversation = async () => {
    if (!conversationId) return;

    try {
      const response = await fetch(`/api/chat/conversations/${conversationId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.messages) {
          setMessages(data.messages);
        }
      }
    } catch (error) {
      console.error("Error loading conversation:", error);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    // Add user message to UI immediately
    const newUserMessage: ChatMessage = {
      role: "user",
      content: userMessage,
    };
    setMessages((prev) => [...prev, newUserMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          sessionId,
          conversationId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: data.response,
          metadata: data.metadata,
        };
        setMessages((prev) => [...prev, assistantMessage]);

        // Update conversationId if this is a new conversation
        if (data.conversationId && !conversationId) {
          window.history.replaceState(
            {},
            "",
            `?conversation=${data.conversationId}`
          );
        }
      } else {
        const errorMessage: ChatMessage = {
          role: "assistant",
          content:
            "I'm sorry, I encountered an error. Please try again or contact us directly.",
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = {
        role: "assistant",
        content:
          "I'm sorry, I encountered an error. Please try again or contact us directly.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <Card className="fixed bottom-20 right-2 z-50 flex h-[550px] w-[calc(100vw-1rem)] max-w-[400px] flex-col shadow-xl sm:right-4 sm:h-[600px] sm:w-[400px] md:h-[650px] md:w-[450px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <MessageCircle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Chat with us</h3>
            <p className="text-xs text-muted-foreground">
              We typically reply in 24 hours
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-muted"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <MessageCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="mb-2 text-sm font-medium text-foreground">
              Start a conversation!
            </p>
            <p className="mb-6 text-xs text-muted-foreground">
              Ask me anything about our services
            </p>
            <QuickActions />
          </div>
        )}
        {messages.map((message, index) => (
          <MessageBubble
            key={index}
            role={message.role}
            content={message.content}
            timestamp={new Date()}
          />
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions (shown when no messages or after first message) */}
      {messages.length === 1 && (
        <div className="border-t bg-muted/30 p-4">
          <QuickActions />
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSend} className="border-t bg-card p-4">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            size="icon"
            className="shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}

