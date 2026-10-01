import { NextResponse } from "next/server";
import { asc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { chatConversations, chatMessages, type ChatMessage } from "@/db/schema";
import { getSession } from "@/lib/auth/server";

// These endpoints are admin-only (the admin chat pages). Anonymous visitors
// never read conversations through them.
async function isAuthorized() {
  const session = await getSession();
  return !!session;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAuthorized())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { id: conversationId } = await params;

    // Get conversation
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

    // Get all conversations for this session (also gives us their IDs)
    // This ensures we show all messages from the same session, even if they were split into different conversations
    const allConversations = await db
      .select()
      .from(chatConversations)
      .where(eq(chatConversations.session_id, conversation.session_id))
      .orderBy(asc(chatConversations.started_at))
      .catch((error) => {
        console.error("Error fetching session conversations:", error);
        return null;
      });

    // Get all messages for all conversations in this session
    const conversationIds = allConversations?.map(c => c.id) || [conversationId];
    let allMessages: ChatMessage[];
    try {
      allMessages = await db
        .select()
        .from(chatMessages)
        .where(inArray(chatMessages.conversation_id, conversationIds))
        .orderBy(asc(chatMessages.created_at));
    } catch (messagesError) {
      console.error("Error fetching messages:", messagesError);
      return NextResponse.json(
        { error: "Failed to fetch messages" },
        { status: 500 }
      );
    }

    // Group messages by conversation_id
    const messagesByConversation: Record<string, ChatMessage[]> = {};
    allMessages.forEach((message) => {
      const convId = message.conversation_id;
      if (!convId) return;
      if (!messagesByConversation[convId]) {
        messagesByConversation[convId] = [];
      }
      messagesByConversation[convId].push(message);
    });

    return NextResponse.json({
      conversation,
      messages: allMessages,
      messagesByConversation,
      allConversations: allConversations || [],
    });
  } catch (error) {
    console.error("Error in conversation detail API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAuthorized())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { id: conversationId } = await params;
    const body = await request.json();

    // Only allow updating editable fields (never id / session_id)
    const updateData: Partial<typeof chatConversations.$inferInsert> = {};
    if (body.status !== undefined) updateData.status = body.status;
    if (body.visitor_name !== undefined) updateData.visitor_name = body.visitor_name;
    if (body.visitor_email !== undefined) updateData.visitor_email = body.visitor_email;
    if (body.visitor_phone !== undefined) updateData.visitor_phone = body.visitor_phone;
    if (body.ended_at !== undefined) {
      updateData.ended_at = body.ended_at ? new Date(body.ended_at) : null;
    }

    let data;
    try {
      [data] = await db
        .update(chatConversations)
        .set(updateData)
        .where(eq(chatConversations.id, conversationId))
        .returning();
    } catch (error) {
      console.error("Error updating conversation:", error);
    }

    if (!data) {
      return NextResponse.json(
        { error: "Failed to update conversation" },
        { status: 500 }
      );
    }

    return NextResponse.json({ conversation: data });
  } catch (error) {
    console.error("Error in conversation update API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAuthorized())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { id: conversationId } = await params;

    try {
      await db
        .delete(chatConversations)
        .where(eq(chatConversations.id, conversationId));
    } catch (error) {
      console.error("Error deleting conversation:", error);
      return NextResponse.json(
        { error: "Failed to delete conversation" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in conversation delete API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
