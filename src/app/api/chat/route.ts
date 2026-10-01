import { NextResponse } from "next/server";
import { and, asc, desc, eq } from "drizzle-orm";
import { chatConversations, chatMessages } from "@/db/schema";
import { processMessage, ChatContext, ChatMessage } from "@/lib/chat/chatBot";
import { getOpenRouterResponse } from "@/lib/chat/openRouter";
import { checkRateLimit, getIdentifier, getRateLimitHeaders, rateLimiters } from "@/lib/rateLimit";

export async function POST(request: Request) {
  try {
    // Rate limiting
    const identifier = getIdentifier(request);
    const rateLimitResult = checkRateLimit(identifier, rateLimiters.chat);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many messages. Please wait a moment before sending more." },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult)
        }
      );
    }

    const { message, sessionId, conversationId, locale } = await request.json();

    if (!message || !sessionId) {
      return NextResponse.json(
        { error: "Message and sessionId are required" },
        { status: 400 }
      );
    }

    // Basic sanitization — strip HTML tags
    const sanitizedMessage = message.replace(/<[^>]*>/g, '').trim().slice(0, 1000);

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
      // Skip DB if it is not configured
      if (!process.env.DATABASE_URL) {
        throw new Error('Database not configured');
      }

      const { db } = await import("@/db");

      // Anonymous callers may only access conversations belonging to their session ID
      if (currentConversationId) {
        const [owned] = await db
          .select({ id: chatConversations.id })
          .from(chatConversations)
          .where(
            and(
              eq(chatConversations.id, currentConversationId),
              eq(chatConversations.session_id, sessionId)
            )
          )
          .limit(1);

        if (!owned) {
          currentConversationId = undefined;
        }
      }

      // Get or create conversation
      if (!currentConversationId) {
        // First, check if there's an existing active conversation for this session
        const [existingConversation] = await db
          .select({ id: chatConversations.id })
          .from(chatConversations)
          .where(
            and(
              eq(chatConversations.session_id, sessionId),
              eq(chatConversations.status, "active")
            )
          )
          .orderBy(desc(chatConversations.started_at))
          .limit(1);

        if (existingConversation) {
          currentConversationId = existingConversation.id;
        } else {
          // No existing conversation, create a new one
          const headers = request.headers;
          const ipAddress =
            headers.get("x-forwarded-for") ||
            headers.get("x-real-ip") ||
            "unknown";
          const userAgent = headers.get("user-agent") || "unknown";

          try {
            const [conversation] = await db
              .insert(chatConversations)
              .values({
                session_id: sessionId,
                ip_address: ipAddress,
                user_agent: userAgent,
                status: "active",
              })
              .returning();
            currentConversationId = conversation.id;
          } catch (convError) {
            console.warn("Database unavailable for chat storage:", convError instanceof Error ? convError.message : convError);
            dbAvailable = false;
          }
        }
      }

      // If DB is available, load context
      if (dbAvailable && currentConversationId) {
        const [conversation] = await db
          .select()
          .from(chatConversations)
          .where(eq(chatConversations.id, currentConversationId))
          .limit(1);

        const existingMessages = await db
          .select()
          .from(chatMessages)
          .where(eq(chatMessages.conversation_id, currentConversationId))
          .orderBy(asc(chatMessages.created_at));

        context = {
          conversationHistory: existingMessages.map((msg) => ({
            role: msg.role as "user" | "assistant" | "system",
            content: msg.content,
            metadata: msg.metadata as ChatMessage["metadata"],
          })),
          visitorName: conversation?.visitor_name ?? undefined,
          visitorEmail: conversation?.visitor_email ?? undefined,
          visitorPhone: conversation?.visitor_phone ?? undefined,
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
    
    const emailMatch = sanitizedMessage.match(emailRegex);
    const phoneMatch = sanitizedMessage.match(phoneRegex);

    // If we're collecting info, extract it from the message
    if (context.isCollectingInfo) {
      if (context.isCollectingInfo.type === "name" && !emailMatch && !phoneMatch) {
        // Assume the message is the name if it doesn't contain email/phone
        updatedContext.visitorName = sanitizedMessage.trim();
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
        response = await getOpenRouterResponse(sanitizedMessage, updatedContext, locale);

        // Update conversation history for next request
        updatedContext.conversationHistory = [
          ...updatedContext.conversationHistory,
          { role: "user", content: sanitizedMessage },
          { role: "assistant", content: response },
        ];
        
        // If we just collected contact info, ensure action is set
        if (updatedContext.visitorEmail && !action && !updatedContext.isCollectingInfo) {
          action = "contact_collected";
        }
      } catch (openRouterError) {
        console.warn("OpenRouter API failed, falling back to rule-based system:", openRouterError);
        // Fallback to rule-based system
        const result = processMessage(sanitizedMessage, updatedContext);
        response = result.response;
        updatedContext = result.context;
        action = result.action;
      }
    } else {
      // Use rule-based system
      const result = processMessage(sanitizedMessage, updatedContext);
      response = result.response;
      updatedContext = result.context;
      action = result.action;
    }

    // Try to save to database if available
    if (dbAvailable && currentConversationId && process.env.DATABASE_URL) {
      try {
        const { db } = await import("@/db");

        // Save user message
        try {
          await db.insert(chatMessages).values({
            conversation_id: currentConversationId,
            role: "user",
            content: sanitizedMessage,
          });
        } catch (userMsgError) {
          console.error("Error saving user message:", userMsgError);
        }

        // Save assistant response
        try {
          await db.insert(chatMessages).values({
            conversation_id: currentConversationId,
            role: "assistant",
            content: response,
            metadata: action ? { action } : null,
          });
        } catch (assistantMsgError) {
          console.error("Error saving assistant message:", assistantMsgError);
        }

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

          try {
            await db
              .update(chatConversations)
              .set(updateData)
              .where(
                and(
                  eq(chatConversations.id, currentConversationId),
                  eq(chatConversations.session_id, sessionId)
                )
              );
          } catch (updateError) {
            console.error("Error updating conversation:", updateError);
          }

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

