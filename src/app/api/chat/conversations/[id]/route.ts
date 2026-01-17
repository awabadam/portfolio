import { NextResponse } from "next/server";
import { createApiClient, createAuthenticatedClient, createAnonClient } from "@/lib/supabase/server-app";

// Helper function to get authenticated client
async function getAdminClient(request: Request) {
  const supabase = createApiClient();
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
    return { authorized: false, client: null };
  }
  
  const client = accessToken 
    ? createAuthenticatedClient(accessToken)
    : createAnonClient();
    
  return { authorized: true, client };
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { authorized, client: adminSupabase } = await getAdminClient(request);
    
    if (!authorized || !adminSupabase) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const conversationId = params.id;

    // Get conversation
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

    // Get messages
    const { data: messages, error: messagesError } = await adminSupabase
      .from("chat_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (messagesError) {
      console.error("Error fetching messages:", messagesError);
      return NextResponse.json(
        { error: "Failed to fetch messages" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      conversation,
      messages: messages || [],
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
  { params }: { params: { id: string } }
) {
  try {
    const { authorized, client: adminSupabase } = await getAdminClient(request);
    
    if (!authorized || !adminSupabase) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const conversationId = params.id;
    const body = await request.json();

    const { data, error } = await adminSupabase
      .from("chat_conversations")
      .update(body)
      .eq("id", conversationId)
      .select()
      .single();

    if (error) {
      console.error("Error updating conversation:", error);
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
  { params }: { params: { id: string } }
) {
  try {
    const { authorized, client: adminSupabase } = await getAdminClient(request);
    
    if (!authorized || !adminSupabase) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const conversationId = params.id;

    const { error } = await adminSupabase
      .from("chat_conversations")
      .delete()
      .eq("id", conversationId);

    if (error) {
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

