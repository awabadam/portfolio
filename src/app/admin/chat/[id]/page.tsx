"use client";

import React, { useEffect, useState, useRef } from "react";
import AdminLayout from "@/components/admin/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSupabaseAuth } from "@/hooks/useSupabase";
import Link from "next/link";
import { ArrowLeft, Archive, Trash2, Mail, Phone, User, MessageSquare, Clock } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import MessageBubble from "@/components/chat/MessageBubble";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
  conversation_id: string;
  metadata?: any;
}

interface Conversation {
  id: string;
  session_id: string;
  visitor_name?: string;
  visitor_email?: string;
  visitor_phone?: string;
  ip_address?: string;
  user_agent?: string;
  started_at: string;
  ended_at?: string;
  status: string;
}

export default function ConversationDetailPage() {
  const { user, loading, supabase, isLocalAuth } = useSupabaseAuth();
  const params = useParams();
  const router = useRouter();
  const conversationId = params.id as string;
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [allConversations, setAllConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user && !loading && conversationId) {
      fetchConversation();
    }
  }, [user, loading, conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversation = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (isLocalAuth) {
        headers["x-local-auth"] = "true";
      } else if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          headers["Authorization"] = `Bearer ${session.access_token}`;
        }
      }

      const response = await fetch(`/api/chat/conversations/${conversationId}`, {
        method: "GET",
        headers,
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load conversation");
      }

      setConversation(data.conversation);
      setMessages(data.messages || []);
      setAllConversations(data.allConversations || [data.conversation]);
    } catch (err) {
      console.error("Error fetching conversation:", err);
      setError("Failed to load conversation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchive = async () => {
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (isLocalAuth) {
        headers["x-local-auth"] = "true";
      } else if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          headers["Authorization"] = `Bearer ${session.access_token}`;
        }
      }

      const response = await fetch(`/api/chat/conversations/${conversationId}`, {
        method: "PATCH",
        headers,
        credentials: "include",
        body: JSON.stringify({ status: "archived" }),
      });

      if (response.ok) {
        router.push("/admin/chat");
      }
    } catch (err) {
      console.error("Error archiving conversation:", err);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this conversation?")) {
      return;
    }

    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (isLocalAuth) {
        headers["x-local-auth"] = "true";
      } else if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          headers["Authorization"] = `Bearer ${session.access_token}`;
        }
      }

      const response = await fetch(`/api/chat/conversations/${conversationId}`, {
        method: "DELETE",
        headers,
        credentials: "include",
      });

      if (response.ok) {
        router.push("/admin/chat");
      }
    } catch (err) {
      console.error("Error deleting conversation:", err);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex h-[calc(100vh-200px)] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary"></div>
            <p className="text-sm text-muted-foreground">Loading conversation...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !conversation) {
    return (
      <AdminLayout>
        <div className="flex h-[calc(100vh-200px)] items-center justify-center">
          <div className="text-center space-y-4 max-w-md">
            <div className="rounded-full bg-destructive/10 p-4 mx-auto w-fit">
              <MessageSquare className="h-8 w-8 text-destructive" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">{error || "Conversation not found"}</h3>
              <p className="text-sm text-muted-foreground">
                {error || "The conversation you're looking for doesn't exist or has been deleted."}
              </p>
            </div>
            <Button asChild className="mt-4">
              <Link href="/admin/chat">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Chat Logs
              </Link>
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <AdminLayout>
      <div className="flex h-[calc(100vh-64px)] flex-col gap-6 pb-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border/50 pb-6">
          <div className="flex items-start gap-4">
            <Button variant="ghost" size="icon" asChild className="shrink-0">
              <Link href="/admin/chat">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  {conversation.visitor_name || "Anonymous Visitor"}
                </h1>
                <Badge
                  variant={conversation.status === "active" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {conversation.status}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {formatDate(conversation.started_at)}
                </span>
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4" />
                  {messages.length} {messages.length === 1 ? "message" : "messages"}
                  {allConversations.length > 1 && (
                    <span className="text-xs">• {allConversations.length} conversations</span>
                  )}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {conversation.status === "active" && (
              <Button variant="outline" size="sm" onClick={handleArchive}>
                <Archive className="mr-2 h-4 w-4" />
                Archive
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr] flex-1 overflow-hidden">
          {/* Sidebar - Visitor Info */}
          <aside className="space-y-6 lg:sticky lg:top-6 lg:h-fit">
            <div className="rounded-xl border border-border/50 bg-gradient-to-br from-card to-card/50 p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-foreground mb-4">Visitor Information</h2>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    <User className="h-3.5 w-3.5" />
                    Name
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {conversation.visitor_name || (
                      <span className="text-muted-foreground italic">Not provided</span>
                    )}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    Email
                  </div>
                  <p className="text-sm font-medium text-foreground break-all">
                    {conversation.visitor_email || (
                      <span className="text-muted-foreground italic">Not provided</span>
                    )}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    Phone
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {conversation.visitor_phone || (
                      <span className="text-muted-foreground italic">Not provided</span>
                    )}
                  </p>
                </div>

                <div className="pt-4 border-t border-border/50 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Started</span>
                    <span className="font-medium text-foreground">
                      {new Date(conversation.started_at).toLocaleDateString()}
                    </span>
                  </div>
                  {conversation.ended_at && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Ended</span>
                      <span className="font-medium text-foreground">
                        {new Date(conversation.ended_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Session ID</span>
                    <code className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      {conversation.session_id.slice(0, 8)}...
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content - Messages */}
          <main className="flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-foreground">Conversation</h2>
                {allConversations.length > 1 && (
                  <Badge variant="outline" className="text-xs">
                    {allConversations.length} conversations merged
                  </Badge>
                )}
              </div>
            </div>

            {messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center rounded-xl border border-dashed border-border/50 bg-muted/20 p-12">
                <div className="text-center space-y-3">
                  <div className="rounded-full bg-muted p-4 mx-auto w-fit">
                    <MessageSquare className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium mb-1">No messages found</h3>
                    <p className="text-sm text-muted-foreground">
                      This conversation doesn't have any messages yet.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto rounded-xl border border-border/50 bg-gradient-to-b from-card to-card/50 shadow-sm">
                <div className="p-6 space-y-6">
                  {messages.map((message, index) => (
                    <MessageBubble
                      key={message.id}
                      role={message.role}
                      content={message.content}
                      timestamp={new Date(message.created_at)}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </AdminLayout>
  );
}
