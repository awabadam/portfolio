"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useSupabaseAuth } from "@/lib/hooks/useSupabase";
import Link from "next/link";
import { Eye, Search, Archive, Trash2, RefreshCw, MessageSquare, Users, Clock, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  session_id: string;
  visitor_name?: string;
  visitor_email?: string;
  visitor_phone?: string;
  started_at: string;
  ended_at?: string;
  status: string;
  message_count: number;
  conversation_ids?: string[];
  conversation_count?: number;
}

export default function AdminChatPage() {
  const { user, loading, supabase, isLocalAuth } = useSupabaseAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    if (user && !loading) {
      fetchConversations();
    }
  }, [user, loading, statusFilter]);

  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const url = new URL("/api/chat/conversations", window.location.origin);
      if (statusFilter !== "all") {
        url.searchParams.set("status", statusFilter);
      }

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

      const response = await fetch(url.toString(), {
        method: "GET",
        headers,
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load conversations");
      }

      setConversations(data.conversations || []);
    } catch (err) {
      console.error("Error fetching conversations:", err);
      setError("Failed to load conversations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchive = async (id: string) => {
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

      const response = await fetch(`/api/chat/conversations/${id}`, {
        method: "PATCH",
        headers,
        credentials: "include",
        body: JSON.stringify({ status: "archived" }),
      });

      if (response.ok) {
        fetchConversations();
      }
    } catch (err) {
      console.error("Error archiving conversation:", err);
    }
  };

  const handleDelete = async (id: string) => {
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

      const response = await fetch(`/api/chat/conversations/${id}`, {
        method: "DELETE",
        headers,
        credentials: "include",
      });

      if (response.ok) {
        fetchConversations();
      }
    } catch (err) {
      console.error("Error deleting conversation:", err);
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      conv.visitor_name?.toLowerCase().includes(query) ||
      conv.visitor_email?.toLowerCase().includes(query) ||
      conv.visitor_phone?.toLowerCase().includes(query) ||
      conv.session_id.toLowerCase().includes(query)
    );
  });

  const stats = {
    total: conversations.length,
    active: conversations.filter((c) => c.status === "active").length,
    archived: conversations.filter((c) => c.status === "archived").length,
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <AdminLayout>
      <div className="space-y-8 pb-8">
        {/* Header Section */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Chat Logs</h1>
            <p className="text-base text-muted-foreground">
              Manage and review all customer conversations
            </p>
          </div>
          <Button
            onClick={fetchConversations}
            variant="outline"
            size="sm"
            className="shrink-0"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-card to-card/50 p-6 shadow-sm hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-3xl font-bold tracking-tight text-foreground">{stats.total}</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-2.5">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-card to-card/50 p-6 shadow-sm hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-3xl font-bold tracking-tight text-primary">{stats.active}</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-2.5">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-card to-card/50 p-6 shadow-sm hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Archived</p>
                <p className="text-3xl font-bold tracking-tight text-muted-foreground">{stats.archived}</p>
              </div>
              <div className="rounded-lg bg-muted p-2.5">
                <Archive className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 pl-10 border-border/50 bg-background/50 focus:border-primary/50 focus:bg-background"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground/60" />
            <div className="flex gap-1.5 rounded-lg border border-border/50 bg-muted/30 p-1">
              {(["all", "active", "archived"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                    statusFilter === filter
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-sm font-medium text-destructive">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex h-96 items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary"></div>
              <p className="text-sm text-muted-foreground">Loading conversations...</p>
            </div>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex h-96 flex-col items-center justify-center rounded-xl border border-dashed border-border/50 bg-muted/20 p-12 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery ? "No conversations found" : "No conversations yet"}
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {searchQuery
                ? "Try adjusting your search or filter criteria."
                : "Chat conversations will appear here when visitors interact with your chat widget."}
            </p>
          </div>
        ) : (
          /* Conversation Cards */
          <div className="grid gap-4">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-card to-card/50 p-6 shadow-sm hover:border-primary/30 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  {/* Main Content */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-foreground">
                            {conversation.visitor_name || "Anonymous Visitor"}
                          </h3>
                          <Badge
                            variant={conversation.status === "active" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {conversation.status}
                          </Badge>
                          {conversation.conversation_count && conversation.conversation_count > 1 && (
                            <Badge variant="outline" className="text-xs">
                              {conversation.conversation_count} grouped
                            </Badge>
                          )}
                        </div>
                        {(conversation.visitor_email || conversation.visitor_phone) && (
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            {conversation.visitor_email && (
                              <span className="flex items-center gap-1.5">
                                <span>{conversation.visitor_email}</span>
                              </span>
                            )}
                            {conversation.visitor_phone && (
                              <span>{conversation.visitor_phone}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        <span>{formatTimeAgo(conversation.started_at)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="h-4 w-4" />
                        <span className="font-medium text-foreground">
                          {conversation.message_count} {conversation.message_count === 1 ? "message" : "messages"}
                        </span>
                        {conversation.conversation_count && conversation.conversation_count > 1 && (
                          <span className="text-xs">(combined)</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                    <Button variant="outline" size="sm" asChild className="flex-1 sm:flex-none">
                      <Link href={`/admin/chat/${conversation.id}`}>
                        <Eye className="mr-1.5 h-4 w-4" />
                        View
                      </Link>
                    </Button>
                    <div className="flex gap-1">
                      {conversation.status === "active" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleArchive(conversation.id)}
                          className="h-9 w-9"
                          title="Archive"
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(conversation.id)}
                        className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
