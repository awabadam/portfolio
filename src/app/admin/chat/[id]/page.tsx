"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSupabaseAuth } from "@/lib/hooks/useSupabase";
import Link from "next/link";
import { ArrowLeft, Archive, Trash2, Mail, Phone, User } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import MessageBubble from "@/components/chat/MessageBubble";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
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
  const { user, loading } = useSupabaseAuth();
  const params = useParams();
  const router = useRouter();
  const conversationId = params.id as string;
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && !loading && conversationId) {
      fetchConversation();
    }
  }, [user, loading, conversationId]);

  const fetchConversation = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/chat/conversations/${conversationId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load conversation");
      }

      setConversation(data.conversation);
      setMessages(data.messages || []);
    } catch (err) {
      console.error("Error fetching conversation:", err);
      setError("Failed to load conversation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchive = async () => {
    try {
      const response = await fetch(`/api/chat/conversations/${conversationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
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
      const response = await fetch(`/api/chat/conversations/${conversationId}`, {
        method: "DELETE",
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
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !conversation) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-500">
            {error || "Conversation not found"}
          </div>
          <Button asChild>
            <Link href="/admin/chat">Back to Chat Logs</Link>
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/chat">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Conversation Details
              </h1>
              <p className="text-muted-foreground">
                Session ID: {conversation.session_id}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {conversation.status === "active" && (
              <Button variant="outline" onClick={handleArchive}>
                <Archive className="mr-2 h-4 w-4" />
                Archive
              </Button>
            )}
            <Button variant="outline" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        {/* Visitor Info */}
        <Card>
          <CardHeader>
            <CardTitle>Visitor Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <User className="h-4 w-4" />
                  Name
                </div>
                <div className="text-muted-foreground">
                  {conversation.visitor_name || "Not provided"}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Mail className="h-4 w-4" />
                  Email
                </div>
                <div className="text-muted-foreground">
                  {conversation.visitor_email || "Not provided"}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Phone className="h-4 w-4" />
                  Phone
                </div>
                <div className="text-muted-foreground">
                  {conversation.visitor_phone || "Not provided"}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Status</div>
                <Badge
                  variant={
                    conversation.status === "active" ? "default" : "secondary"
                  }
                >
                  {conversation.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Started</div>
                <div className="text-muted-foreground">
                  {new Date(conversation.started_at).toLocaleString()}
                </div>
              </div>
              {conversation.ended_at && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Ended</div>
                  <div className="text-muted-foreground">
                    {new Date(conversation.ended_at).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        <Card>
          <CardHeader>
            <CardTitle>Conversation ({messages.length} messages)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  timestamp={new Date(message.created_at)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

