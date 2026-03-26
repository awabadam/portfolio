import { NextResponse } from "next/server";
import { createApiClient, createAuthenticatedClient, createAnonClient } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const supabase = createApiClient();

    // Check authentication
    const authHeader = request.headers.get("authorization");
    let user = null;
    let accessToken: string | null = null;

    if (authHeader?.startsWith("Bearer ")) {
      accessToken = authHeader.substring(7);
      const { data: { user: tokenUser }, error: tokenError } = await supabase.auth.getUser(accessToken);
      if (!tokenError && tokenUser) {
        user = tokenUser;
      }
    }

    const isLocalAuth = request.headers.get("x-local-auth") === "true";
    const isDevelopment = process.env.NODE_ENV === "development";

    if (!user && !(isLocalAuth && isDevelopment)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminSupabase = accessToken
      ? createAuthenticatedClient(accessToken)
      : createAnonClient();

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");
    const format = searchParams.get("format") || "json";

    if (conversationId) {
      // Export single conversation
      const { data: conversation, error: convError } = await adminSupabase
        .from("chat_conversations")
        .select("*")
        .eq("id", conversationId)
        .single();

      if (convError || !conversation) {
        return NextResponse.json(
          { error: "Conversation not found" },
          { status: 404 }
        );
      }

      const { data: messages, error: msgError } = await adminSupabase
        .from("chat_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (msgError) {
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
          started_at: conversation.started_at,
          ended_at: conversation.ended_at,
        },
        messages: (messages || []).map((m) => ({
          role: m.role,
          content: m.content,
          created_at: m.created_at,
        })),
        exported_at: new Date().toISOString(),
      };

      if (format === "csv") {
        // Convert to CSV format
        const rows = (messages || []).map((m) => ({
          conversation_id: conversation.id,
          visitor_name: conversation.visitor_name || "",
          visitor_email: conversation.visitor_email || "",
          role: m.role,
          content: m.content.replace(/"/g, '""').replace(/\n/g, " "),
          created_at: m.created_at,
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
      const { data: conversations, error } = await adminSupabase
        .from("chat_conversations")
        .select(`
          *,
          chat_messages(count)
        `)
        .order("started_at", { ascending: false });

      if (error) {
        return NextResponse.json(
          { error: "Failed to fetch conversations" },
          { status: 500 }
        );
      }

      const exportData = (conversations || []).map((c: any) => ({
        id: c.id,
        session_id: c.session_id,
        visitor_name: c.visitor_name,
        visitor_email: c.visitor_email,
        visitor_phone: c.visitor_phone,
        status: c.status,
        message_count: c.chat_messages?.[0]?.count || 0,
        started_at: c.started_at,
        ended_at: c.ended_at,
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
