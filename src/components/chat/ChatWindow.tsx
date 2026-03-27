"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { X, Send, Loader2, MessageCircle, RotateCcw, Trash2, WifiOff } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import MessageBubble from "./MessageBubble";
import QuickActions from "./QuickActions";
import { useWhatsApp } from "./WhatsAppContext";
import type { ChatMessage } from "@/lib/chat/chatBot";
import { useTranslations, useLocale } from 'next-intl';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  conversationId?: string;
  onEndConversation?: () => void;
}

const MAX_RECONNECT_ATTEMPTS = 5;
const IS_VERCEL = typeof window !== 'undefined' && (
  window.location.hostname.includes('vercel.app') ||
  window.location.hostname.includes('awab.design') ||
  process.env.NEXT_PUBLIC_VERCEL === '1'
);

export default function ChatWindow({
  isOpen,
  onClose,
  sessionId,
  conversationId: initialConversationId,
  onEndConversation,
}: ChatWindowProps) {
  const t = useTranslations('chat');
  const locale = useLocale();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>(initialConversationId);
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "connecting" | "disconnected">("connecting");
  const [showReconnectButton, setShowReconnectButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const { openWhatsApp } = useWhatsApp();

  const handleWhatsAppClick = () => {
    onClose();
    openWhatsApp();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const connectWebSocket = useCallback(() => {
    try {
      setConnectionStatus("connecting");
      setShowReconnectButton(false);

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/chat/ws?sessionId=${sessionId}${currentConversationId ? `&conversationId=${currentConversationId}` : ''}`;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnectionStatus("connected");
        reconnectAttempts.current = 0;
        setShowReconnectButton(false);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'init') {
            setIsInitialized(true);
            if (data.data?.messages && Array.isArray(data.data.messages)) {
              setMessages(data.data.messages);
            } else if (data.data?.message) {
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

              if (data.data.conversationId && !currentConversationId) {
                setCurrentConversationId(data.data.conversationId);
                window.history.replaceState(
                  {},
                  "",
                  `?conversation=${data.data.conversationId}`
                );
              }

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

      ws.onerror = () => {
        setConnectionStatus("disconnected");
      };

      ws.onclose = () => {
        setConnectionStatus("disconnected");
        wsRef.current = null;

        if (isOpen && reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempts.current++;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          reconnectTimeoutRef.current = setTimeout(() => {
            connectWebSocket();
          }, delay);
        } else if (reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) {
          setShowReconnectButton(true);
        }
      };
    } catch (error) {
      console.error('Error connecting WebSocket:', error);
      setConnectionStatus("disconnected");
      if (isOpen && reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts.current++;
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 2000);
      } else {
        setShowReconnectButton(true);
      }
    }
  }, [isOpen, sessionId, currentConversationId]);

  const handleManualReconnect = () => {
    reconnectAttempts.current = 0;
    connectWebSocket();
  };

  // WebSocket connection management
  useEffect(() => {
    if (!isOpen) {
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
          content: t('greeting'),
        },
      ]);
      setIsInitialized(true);
      inputRef.current?.focus();
    } else if (!isInitialized) {
      setIsInitialized(true);
      inputRef.current?.focus();
    }

    // Skip WebSocket on Vercel/production — use HTTP-only mode
    if (IS_VERCEL) {
      setConnectionStatus("connected");
      return;
    }

    connectWebSocket();

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
  }, [isOpen, sessionId, currentConversationId, connectWebSocket, isInitialized]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    const newUserMessage: ChatMessage = {
      role: "user",
      content: userMessage,
    };
    setMessages((prev) => [...prev, newUserMessage]);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'message',
        message: userMessage,
      }));
    } else {
      handleSendHTTP(userMessage);
    }
  };

  const handleSendHTTP = async (userMessage: string) => {
    // Show typing indicator for HTTP fallback
    setIsTyping(true);

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
          locale,
        }),
      });

      setIsTyping(false);

      if (response.status === 429) {
        const errorMessage: ChatMessage = {
          role: "assistant",
          content: t('errorTooFast'),
        };
        setMessages((prev) => [...prev, errorMessage]);
        return;
      }

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

        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      } else {
        const errorMessage: ChatMessage = {
          role: "assistant",
          content: t('errorGeneral'),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setIsTyping(false);
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: t('errorGeneral'),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleEndConversation = () => {
    // Clear current conversation
    setMessages([
      {
        role: "assistant",
        content: t('newConversation'),
      },
    ]);
    setCurrentConversationId(undefined);
    setIsInitialized(true);

    // Clear URL parameter
    window.history.replaceState({}, "", window.location.pathname);

    // Clear session storage to get new session
    sessionStorage.removeItem("chat_session_id");

    // Notify parent if needed
    if (onEndConversation) {
      onEndConversation();
    }

    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <Card
      className="fixed bottom-20 right-2 z-50 flex h-[550px] w-[calc(100vw-1rem)] max-w-[400px] flex-col shadow-xl sm:right-4 sm:h-[600px] sm:w-[400px] md:h-[650px] md:w-[450px]"
      role="dialog"
      aria-modal="true"
      aria-label={t('dialogTitle')}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <MessageCircle className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground" id="chat-title">{t('title')}</h2>
            <p className="text-xs text-muted-foreground">
              {connectionStatus === "connected" && t('online')}
              {connectionStatus === "connecting" && t('connecting')}
              {connectionStatus === "disconnected" && t('offline')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {/* End Conversation Button */}
          {messages.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-muted"
              onClick={handleEndConversation}
              aria-label={t('endConversation')}
              title={t('endConversation')}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </Button>
          )}
          {/* WhatsApp Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-[#25D366]/10"
            onClick={handleWhatsAppClick}
            aria-label={t('openWhatsApp')}
            title={t('whatsapp')}
          >
            <FaWhatsapp className="h-5 w-5 text-[#25D366]" aria-hidden="true" />
          </Button>
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-muted"
            onClick={onClose}
            aria-label={t('closeChat')}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {/* Connection Warning */}
      {showReconnectButton && (
        <div
          className="flex items-center justify-between bg-yellow-500/10 px-4 py-2 text-sm"
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
            <WifiOff className="h-4 w-4" aria-hidden="true" />
            <span>{t('connectionLost')}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 text-xs"
            onClick={handleManualReconnect}
          >
            <RotateCcw className="h-3 w-3" aria-hidden="true" />
            {t('reconnect')}
          </Button>
        </div>
      )}

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-background"
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
        aria-atomic="false"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <MessageCircle className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
            </div>
            <p className="mb-2 text-sm font-medium text-foreground">
              {t('startConversation')}
            </p>
            <p className="mb-6 text-xs text-muted-foreground">
              {t('askAnything')}
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
          <div
            className="flex items-center gap-2 text-muted-foreground"
            role="status"
            aria-label={t('typing')}
          >
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            <span className="text-sm">{t('thinking')}</span>
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
      <form
        onSubmit={handleSend}
        className="border-t bg-card p-4"
        aria-label={t('sendAriaLabel')}
      >
        <div className="flex gap-2">
          <label htmlFor="chat-input" className="sr-only">
            {t('messageLabel')}
          </label>
          <Input
            id="chat-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('placeholder')}
            disabled={isLoading}
            className="flex-1"
            aria-describedby="chat-title"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            size="icon"
            className="shrink-0"
            aria-label={t('sendAriaLabel')}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Send className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
