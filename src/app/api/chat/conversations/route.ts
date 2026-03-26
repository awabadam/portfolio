import { NextResponse } from "next/server";
import { createApiClient, createAuthenticatedClient, createAnonClient } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const supabase = createApiClient();
    
    // Check for Authorization header (Bearer token)
    const authHeader = request.headers.get("authorization");
    let user = null;
    let accessToken: string | null = null;
    
    if (authHeader?.startsWith("Bearer ")) {
      // If Bearer token is provided, verify it
      accessToken = authHeader.substring(7);
      const { data: { user: tokenUser }, error: tokenError } = await supabase.auth.getUser(accessToken);
      if (!tokenError && tokenUser) {
        user = tokenUser;
      }
    }
    
    // In development, allow local auth (check for local-auth header)
    const isLocalAuth = request.headers.get("x-local-auth") === "true";
    const isDevelopment = process.env.NODE_ENV === "development";
    
    // Check if user is authenticated (or using local auth in dev)
    if (!user && !(isLocalAuth && isDevelopment)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Use authenticated client with access token for RLS (admin can see all)
    // In dev with local auth, use anon client (RLS policies should be configured for this)
    const adminSupabase = accessToken 
      ? createAuthenticatedClient(accessToken)
      : createAnonClient(); // Fallback for local auth in dev
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = adminSupabase
      .from("chat_conversations")
      .select("*")
      .order("started_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq("status", status);
    }

    const { data: conversations, error } = await query;

    if (error) {
      console.error("Error fetching conversations:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      return NextResponse.json(
        { error: "Failed to fetch conversations", details: error.message },
        { status: 500 }
      );
    }

    // Get message counts for each conversation
    const conversationsWithCounts = await Promise.all(
      (conversations || []).map(async (conv) => {
        const { count } = await adminSupabase
          .from("chat_messages")
          .select("*", { count: "exact", head: true })
          .eq("conversation_id", conv.id);

        return {
          ...conv,
          message_count: count || 0,
        };
      })
    );

    // Group conversations by session_id and combine message counts
    const groupedBySession: Record<string, typeof conversationsWithCounts> = {};
    conversationsWithCounts.forEach((conv) => {
      const sessionId = conv.session_id;
      if (!groupedBySession[sessionId]) {
        groupedBySession[sessionId] = [];
      }
      groupedBySession[sessionId].push(conv);
    });

    // Create grouped conversations: use the most recent conversation as the primary one
    // but combine message counts and use the earliest start time
    const groupedConversations = Object.entries(groupedBySession).map(([sessionId, convs]) => {
      // Sort by started_at descending to get most recent first
      const sorted = [...convs].sort((a, b) => 
        new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
      );
      const primary = sorted[0];
      const totalMessages = convs.reduce((sum, c) => sum + (c.message_count || 0), 0);
      const earliestStart = sorted[sorted.length - 1].started_at;

      return {
        ...primary,
        message_count: totalMessages,
        started_at: earliestStart,
        conversation_ids: convs.map(c => c.id), // Keep track of all conversation IDs
        conversation_count: convs.length, // How many conversations were grouped
      };
    });

    // Sort grouped conversations by most recent start time
    groupedConversations.sort((a, b) => 
      new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
    );

    return NextResponse.json({ conversations: groupedConversations });
  } catch (error) {
    console.error("Error in conversations API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

