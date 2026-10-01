import { NextResponse } from "next/server";
import { desc, eq, getTableColumns } from "drizzle-orm";
import { db } from "@/db";
import { chatConversations, chatMessages } from "@/db/schema";
import { getSession } from "@/lib/auth/server";

export async function GET(request: Request) {
  try {
    // Only the signed-in admin can list conversations
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build query with message counts using a single query
    // (correlated count subquery, avoids the N+1 problem)
    let conversationsWithCounts;
    try {
      conversationsWithCounts = await db
        .select({
          ...getTableColumns(chatConversations),
          message_count: db.$count(chatMessages, eq(chatMessages.conversation_id, chatConversations.id)),
        })
        .from(chatConversations)
        .where(status ? eq(chatConversations.status, status) : undefined)
        .orderBy(desc(chatConversations.started_at))
        .limit(limit)
        .offset(offset);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("Error fetching conversations:", { message });
      return NextResponse.json(
        { error: "Failed to fetch conversations", details: message },
        { status: 500 }
      );
    }

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
        (b.started_at?.getTime() ?? 0) - (a.started_at?.getTime() ?? 0)
      );
      const primary = sorted[0];
      const totalMessages = convs.reduce((sum, c) => sum + (c.message_count || 0), 0);
      const earliestStart = sorted[sorted.length - 1].started_at;

      return {
        ...primary,
        message_count: totalMessages,
        started_at: earliestStart,
        conversation_ids: convs.map((c) => c.id), // Keep track of all conversation IDs
        conversation_count: convs.length, // How many conversations were grouped
      };
    });

    // Sort grouped conversations by most recent start time
    groupedConversations.sort((a, b) =>
      (b.started_at?.getTime() ?? 0) - (a.started_at?.getTime() ?? 0)
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
