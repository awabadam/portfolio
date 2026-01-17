"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { X, Send, Loader2, MessageCircle } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import MessageBubble from "./MessageBubble";
import QuickActions from "./QuickActions";
import { useWhatsApp } from "./WhatsAppContext";
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
  conversationId: initialConversationId,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>(initialConversationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const { openWhatsApp } = useWhatsApp();

  const handleWhatsAppClick = () => {
    onClose(); // Close chat window
    openWhatsApp(); // Open WhatsApp modal
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // WebSocket connection management
  useEffect(() => {
    if (!isOpen) {
      // Close WebSocket when chat is closed
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      return;
    }

    // Initialize with welcome message if not already initialized and no conversationId
    if (!isInitialized && !currentConversationId) {
      setMessages([
        {
          role: "assistant",
          content:
            "Hello! I'm here to help you learn about Awab's web design services. How can I assist you today?",
        },
      ]);
      setIsInitialized(true);
      inputRef.current?.focus();
    } else if (!isInitialized) {
      setIsInitialized(true);
      inputRef.current?.focus();
    }

    // Connect WebSocket
    const connectWebSocket = () => {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/api/chat/ws?sessionId=${sessionId}${currentConversationId ? `&conversationId=${currentConversationId}` : ''}`;
        
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('WebSocket connected');
          reconnectAttempts.current = 0;
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            if (data.type === 'init') {
              setIsInitialized(true);
              if (data.data?.messages && Array.isArray(data.data.messages)) {
                // Load conversation history
                setMessages(data.data.messages);
              } else if (data.data?.message) {
                // Single welcome message
                setMessages([data.data.message]);
              }
              inputRef.current?.focus();
            } else if (data.type === 'message') {
              setIsTyping(false);
              setIsLoading(false);
              if (data.data) {
                const newMessage: ChatMessage = {
                  role: data.data.role,
                  content: data.data.content,
                  metadata: data.data.metadata,
                };
                setMessages((prev) => [...prev, newMessage]);
                
                // Update conversationId if provided
                if (data.data.conversationId && !currentConversationId) {
                  setCurrentConversationId(data.data.conversationId);
                  window.history.replaceState(
                    {},
                    "",
                    `?conversation=${data.data.conversationId}`
                  );
                }
                
                // Focus input after message is received
                setTimeout(() => {
                  inputRef.current?.focus();
                }, 0);
              }
            } else if (data.type === 'typing') {
              setIsTyping(data.data?.typing || false);
            } else if (data.type === 'pong') {
              // Keep-alive response
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
        };

        ws.onclose = () => {
          console.log('WebSocket disconnected');
          wsRef.current = null;
          
          // Attempt to reconnect if chat is still open
          if (isOpen && reconnectAttempts.current < 5) {
            reconnectAttempts.current++;
            const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
            reconnectTimeoutRef.current = setTimeout(() => {
              connectWebSocket();
            }, delay);
          }
        };
      } catch (error) {
        console.error('Error connecting WebSocket:', error);
        // Fallback: try again after delay
        if (isOpen && reconnectAttempts.current < 5) {
          reconnectAttempts.current++;
          reconnectTimeoutRef.current = setTimeout(() => {
            connectWebSocket();
          }, 2000);
        }
      }
    };

    connectWebSocket();

    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, [isOpen, sessionId, currentConversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
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

    // Maintain focus after clearing input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

    // Send message via WebSocket if available, otherwise use HTTP
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'message',
        message: userMessage,
      }));
    } else {
      // Fallback to HTTP if WebSocket is not available
      handleSendHTTP(userMessage);
    }
  };

  const handleSendHTTP = async (userMessage: string) => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          sessionId,
          conversationId: currentConversationId,
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

        if (data.conversationId && !currentConversationId) {
          setCurrentConversationId(data.conversationId);
          window.history.replaceState(
            {},
            "",
            `?conversation=${data.conversationId}`
          );
        }
        
        // Focus input after response is received
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
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
        <div className="flex items-center gap-2">
          {/* WhatsApp Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-[#25D366]/10"
            onClick={handleWhatsAppClick}
            aria-label="Open WhatsApp"
            title="Chat on WhatsApp"
          >
            <FaWhatsapp className="h-5 w-5 text-[#25D366]" />
          </Button>
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-muted"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
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
        {(isLoading || isTyping) && (
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

