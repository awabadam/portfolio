import { NextResponse } from "next/server";
import { createAppServerClient } from "@/lib/supabase/server-app";
import { processMessage, ChatContext, ChatMessage } from "@/lib/chat/chatBot";
import { getOpenRouterResponse } from "@/lib/chat/openRouter";

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

    // Process message and get response
    // Try OpenRouter first if API key is available, fallback to rule-based system
    let response: string;
    let updatedContext: ChatContext = { ...context };
    let action: string | undefined;

    const hasOpenRouterKey = !!process.env.OPENROUTER_KEY;

    // Extract contact information from user message if present
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
    const phoneRegex = /(\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9})/g;
    
    const emailMatch = message.match(emailRegex);
    const phoneMatch = message.match(phoneRegex);
    
    // If we're collecting info, extract it from the message
    if (context.isCollectingInfo) {
      if (context.isCollectingInfo.type === "name" && !emailMatch && !phoneMatch) {
        // Assume the message is the name if it doesn't contain email/phone
        updatedContext.visitorName = message.trim();
        updatedContext.isCollectingInfo = { type: "email" };
      } else if (context.isCollectingInfo.type === "email" && emailMatch) {
        updatedContext.visitorEmail = emailMatch[0];
        updatedContext.isCollectingInfo = { type: "phone" };
      } else if (context.isCollectingInfo.type === "phone") {
        if (phoneMatch) {
          updatedContext.visitorPhone = phoneMatch[0];
        }
        // Mark as collected if we have email or phone
        if (updatedContext.visitorEmail || updatedContext.visitorPhone) {
          updatedContext.isCollectingInfo = undefined;
          action = "contact_collected";
        }
      }
    }

    if (hasOpenRouterKey) {
      try {
        // Use OpenRouter AI
        response = await getOpenRouterResponse(message, updatedContext);
        
        // Update conversation history for next request
        updatedContext.conversationHistory = [
          ...updatedContext.conversationHistory,
          { role: "user", content: message },
          { role: "assistant", content: response },
        ];
        
        // If we just collected contact info, ensure action is set
        if (updatedContext.visitorEmail && !action && !updatedContext.isCollectingInfo) {
          action = "contact_collected";
        }
      } catch (openRouterError) {
        console.warn("OpenRouter API failed, falling back to rule-based system:", openRouterError);
        // Fallback to rule-based system
        const result = processMessage(message, updatedContext);
        response = result.response;
        updatedContext = result.context;
        action = result.action;
      }
    } else {
      // Use rule-based system
      const result = processMessage(message, updatedContext);
      response = result.response;
      updatedContext = result.context;
      action = result.action;
    }

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

