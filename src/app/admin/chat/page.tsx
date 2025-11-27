"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useSupabaseAuth } from "@/lib/hooks/useSupabase";
import Link from "next/link";
import { Eye, Search, Archive, Trash2, RefreshCw } from "lucide-react";

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
}

export default function AdminChatPage() {
  const { user, loading } = useSupabaseAuth();
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

      const response = await fetch(url.toString());
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
      const response = await fetch(`/api/chat/conversations/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
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
      const response = await fetch(`/api/chat/conversations/${id}`, {
        method: "DELETE",
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Chat Logs</h1>
            <p className="text-muted-foreground">
              View and manage all chat conversations
            </p>
          </div>
          <Button onClick={fetchConversations} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Conversations</div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-2xl font-bold">{stats.active}</div>
            <div className="text-sm text-muted-foreground">Active</div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-2xl font-bold">{stats.archived}</div>
            <div className="text-sm text-muted-foreground">Archived</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, phone, or session ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("all")}
            >
              All
            </Button>
            <Button
              variant={statusFilter === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("active")}
            >
              Active
            </Button>
            <Button
              variant={statusFilter === "archived" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("archived")}
            >
              Archived
            </Button>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-500">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <h3 className="mb-2 text-lg font-medium">No conversations found</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery
                ? "Try adjusting your search query."
                : "No chat conversations yet."}
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Visitor</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Messages</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[200px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConversations.map((conversation) => (
                  <TableRow key={conversation.id}>
                    <TableCell className="font-medium">
                      {conversation.visitor_name || "Anonymous"}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        {conversation.visitor_email && (
                          <div>{conversation.visitor_email}</div>
                        )}
                        {conversation.visitor_phone && (
                          <div className="text-muted-foreground">
                            {conversation.visitor_phone}
                          </div>
                        )}
                        {!conversation.visitor_email &&
                          !conversation.visitor_phone && (
                            <div className="text-muted-foreground">
                              No contact info
                            </div>
                          )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(conversation.started_at).toLocaleString()}
                    </TableCell>
                    <TableCell>{conversation.message_count}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          conversation.status === "active"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {conversation.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/chat/${conversation.id}`}>
                            <Eye className="mr-1 h-4 w-4" />
                            View
                          </Link>
                        </Button>
                        {conversation.status === "active" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleArchive(conversation.id)}
                          >
                            <Archive className="mr-1 h-4 w-4" />
                            Archive
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(conversation.id)}
                        >
                          <Trash2 className="mr-1 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

