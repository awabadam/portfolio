import { NextResponse } from "next/server";
import { createAppServerClient } from "@/lib/supabase/server-app";
import { processMessage, generateSessionId } from "@/lib/chat/chatBot";

export async function POST(request: Request) {
  try {
    const { message, sessionId, conversationId } = await request.json();

    if (!message || !sessionId) {
      return NextResponse.json(
        { error: "Message and sessionId are required" },
        { status: 400 }
      );
    }

    const supabase = createAppServerClient();
    let currentConversationId = conversationId;

    // Get or create conversation
    if (!currentConversationId) {
      // Get visitor info from headers
      const headers = request.headers;
      const ipAddress =
        headers.get("x-forwarded-for") ||
        headers.get("x-real-ip") ||
        "unknown";
      const userAgent = headers.get("user-agent") || "unknown";

      // Create new conversation
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
        console.error("Error creating conversation:", convError);
        return NextResponse.json(
          { error: "Failed to create conversation" },
          { status: 500 }
        );
      }

      currentConversationId = conversation.id;
    }

    // Get conversation to retrieve context
    const { data: conversation } = await supabase
      .from("chat_conversations")
      .select("*")
      .eq("id", currentConversationId)
      .single();

    // Get existing messages for context
    const { data: existingMessages } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("conversation_id", currentConversationId)
      .order("created_at", { ascending: true });

    // Build context from conversation history
    const context = {
      conversationHistory:
        existingMessages?.map((msg) => ({
          role: msg.role,
          content: msg.content,
          metadata: msg.metadata,
        })) || [],
      visitorName: conversation?.visitor_name,
      visitorEmail: conversation?.visitor_email,
      visitorPhone: conversation?.visitor_phone,
    };

    // Process message and get response
    const { response, context: updatedContext, action } = processMessage(
      message,
      context
    );

    // Save user message
    const { error: userMsgError } = await supabase
      .from("chat_messages")
      .insert({
        conversation_id: currentConversationId,
        role: "user",
        content: message,
      });

    if (userMsgError) {
      console.error("Error saving user message:", userMsgError);
    }

    // Save assistant response
    const { error: assistantMsgError } = await supabase
      .from("chat_messages")
      .insert({
        conversation_id: currentConversationId,
        role: "assistant",
        content: response,
        metadata: action ? { action } : null,
      });

    if (assistantMsgError) {
      console.error("Error saving assistant message:", assistantMsgError);
    }

    // Update conversation with visitor info if collected
    if (
      updatedContext.visitorName ||
      updatedContext.visitorEmail ||
      updatedContext.visitorPhone
    ) {
      const updateData: any = {};
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

      // If contact info was collected, send notification email
      if (action === "contact_collected" && updatedContext.visitorEmail) {
        // You can add email notification here
        console.log("Contact collected:", {
          name: updatedContext.visitorName,
          email: updatedContext.visitorEmail,
          phone: updatedContext.visitorPhone,
        });
      }
    }

    return NextResponse.json({
      response,
      conversationId: currentConversationId,
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

