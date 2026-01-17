import { NextResponse } from "next/server";
import { createAppServerClient } from "@/lib/supabase/server-app";
import { processMessage, ChatContext, ChatMessage } from "@/lib/chat/chatBot";

export async function POST(request: Request) {
  try {
    const { message, sessionId, conversationId } = await request.json();

    if (!message || !sessionId) {
      return NextResponse.json(
        { error: "Message and sessionId are required" },
        { status: 400 }
      );
    }

    // Initialize context - will be populated from DB if available
    let context: ChatContext = {
      conversationHistory: [],
      visitorName: undefined,
      visitorEmail: undefined,
      visitorPhone: undefined,
    };

    let currentConversationId = conversationId;
    let dbAvailable = true;

    // Try to use database, but gracefully handle if unavailable
    try {
      const supabase = createAppServerClient();

      // Get or create conversation
      if (!currentConversationId) {
        const headers = request.headers;
        const ipAddress =
          headers.get("x-forwarded-for") ||
          headers.get("x-real-ip") ||
          "unknown";
        const userAgent = headers.get("user-agent") || "unknown";

        const { data: conversation, error: convError } = await supabase
          .from("chat_conversations")
          .insert({
            session_id: sessionId,
            ip_address: ipAddress,
            user_agent: userAgent,
            status: "active",
          })
          .select()
          .single();

        if (convError) {
          console.warn("Database unavailable for chat storage:", convError.message);
          dbAvailable = false;
        } else {
          currentConversationId = conversation.id;
        }
      }

      // If DB is available, load context
      if (dbAvailable && currentConversationId) {
        const { data: conversation } = await supabase
          .from("chat_conversations")
          .select("*")
          .eq("id", currentConversationId)
          .single();

        const { data: existingMessages } = await supabase
          .from("chat_messages")
          .select("*")
          .eq("conversation_id", currentConversationId)
          .order("created_at", { ascending: true });

        context = {
          conversationHistory:
            existingMessages?.map((msg) => ({
              role: msg.role as "user" | "assistant" | "system",
              content: msg.content,
              metadata: msg.metadata,
            })) || [],
          visitorName: conversation?.visitor_name,
          visitorEmail: conversation?.visitor_email,
          visitorPhone: conversation?.visitor_phone,
        };
      }
    } catch (dbError) {
      console.warn("Database connection failed, chat will work without persistence:", dbError);
      dbAvailable = false;
    }

    // Process message and get response (always works, with or without DB)
    const { response, context: updatedContext, action } = processMessage(
      message,
      context
    );

    // Try to save to database if available
    if (dbAvailable && currentConversationId) {
      try {
        const supabase = createAppServerClient();

        // Save user message
        await supabase.from("chat_messages").insert({
          conversation_id: currentConversationId,
          role: "user",
          content: message,
        });

        // Save assistant response
        await supabase.from("chat_messages").insert({
          conversation_id: currentConversationId,
          role: "assistant",
          content: response,
          metadata: action ? { action } : null,
        });

        // Update conversation with visitor info if collected
        if (
          updatedContext.visitorName ||
          updatedContext.visitorEmail ||
          updatedContext.visitorPhone
        ) {
          const updateData: Record<string, string> = {};
          if (updatedContext.visitorName) {
            updateData.visitor_name = updatedContext.visitorName;
          }
          if (updatedContext.visitorEmail) {
            updateData.visitor_email = updatedContext.visitorEmail;
          }
          if (updatedContext.visitorPhone) {
            updateData.visitor_phone = updatedContext.visitorPhone;
          }

          await supabase
            .from("chat_conversations")
            .update(updateData)
            .eq("id", currentConversationId);

          if (action === "contact_collected" && updatedContext.visitorEmail) {
            console.log("Contact collected:", {
              name: updatedContext.visitorName,
              email: updatedContext.visitorEmail,
              phone: updatedContext.visitorPhone,
            });
          }
        }
      } catch (saveError) {
        console.warn("Failed to save chat messages to database:", saveError);
      }
    }

    return NextResponse.json({
      response,
      conversationId: currentConversationId || null,
      metadata: action ? { action } : null,
    });
  } catch (error) {
    console.error("Error processing chat message:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}

