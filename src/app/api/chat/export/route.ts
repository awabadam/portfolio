import { NextResponse } from "next/server";
import { asc, desc, eq, getTableColumns } from "drizzle-orm";
import { db } from "@/db";
import { chatConversations, chatMessages } from "@/db/schema";
import { getSession } from "@/lib/auth/server";

// Timestamps come back as Date objects; serialize them as ISO strings (like
// Supabase did) so CSV cells don't get Date#toString() output.
function iso(value: Date | null) {
  return value ? value.toISOString() : null;
}

export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");
    const format = searchParams.get("format") || "json";

    if (conversationId) {
      // Export single conversation
      const [conversation] = await db
        .select()
        .from(chatConversations)
        .where(eq(chatConversations.id, conversationId))
        .limit(1)
        .catch(() => []);

      if (!conversation) {
        return NextResponse.json(
          { error: "Conversation not found" },
          { status: 404 }
        );
      }

      const messages = await db
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.conversation_id, conversationId))
        .orderBy(asc(chatMessages.created_at))
        .catch(() => null);

      if (!messages) {
        return NextResponse.json(
          { error: "Failed to fetch messages" },
          { status: 500 }
        );
      }

      const exportData = {
        conversation: {
          id: conversation.id,
          session_id: conversation.session_id,
          visitor_name: conversation.visitor_name,
          visitor_email: conversation.visitor_email,
          visitor_phone: conversation.visitor_phone,
          status: conversation.status,
          started_at: iso(conversation.started_at),
          ended_at: iso(conversation.ended_at),
        },
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
          created_at: iso(m.created_at),
        })),
        exported_at: new Date().toISOString(),
      };

      if (format === "csv") {
        // Convert to CSV format
        const rows = messages.map((m) => ({
          conversation_id: conversation.id,
          visitor_name: conversation.visitor_name || "",
          visitor_email: conversation.visitor_email || "",
          role: m.role,
          content: m.content.replace(/"/g, '""').replace(/\n/g, " "),
          created_at: iso(m.created_at),
        }));

        const headers = ["conversation_id", "visitor_name", "visitor_email", "role", "content", "created_at"];
        const csvContent = [
          headers.join(","),
          ...rows.map((r) =>
            headers.map((h) => `"${r[h as keyof typeof r] || ""}"`).join(",")
          ),
        ].join("\n");

        return new NextResponse(csvContent, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="conversation_${conversationId.slice(0, 8)}.csv"`,
          },
        });
      }

      return NextResponse.json(exportData);
    } else {
      // Export all conversations
      const conversations = await db
        .select({
          ...getTableColumns(chatConversations),
          message_count: db.$count(chatMessages, eq(chatMessages.conversation_id, chatConversations.id)),
        })
        .from(chatConversations)
        .orderBy(desc(chatConversations.started_at))
        .catch(() => null);

      if (!conversations) {
        return NextResponse.json(
          { error: "Failed to fetch conversations" },
          { status: 500 }
        );
      }

      const exportData = conversations.map((c) => ({
        id: c.id,
        session_id: c.session_id,
        visitor_name: c.visitor_name,
        visitor_email: c.visitor_email,
        visitor_phone: c.visitor_phone,
        status: c.status,
        message_count: c.message_count || 0,
        started_at: iso(c.started_at),
        ended_at: iso(c.ended_at),
      }));

      if (format === "csv") {
        const headers = [
          "id",
          "session_id",
          "visitor_name",
          "visitor_email",
          "visitor_phone",
          "status",
          "message_count",
          "started_at",
          "ended_at",
        ];
        const csvContent = [
          headers.join(","),
          ...exportData.map((r) =>
            headers.map((h) => `"${r[h as keyof typeof r] || ""}"`).join(",")
          ),
        ].join("\n");

        return new NextResponse(csvContent, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="conversations_${new Date().toISOString().slice(0, 10)}.csv"`,
          },
        });
      }

      return NextResponse.json({
        conversations: exportData,
        exported_at: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Export failed" },
      { status: 500 }
    );
  }
}
