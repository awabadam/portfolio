import { NextResponse } from "next/server";
import { createAnonClient } from "@/lib/supabase/server-app";

export async function GET() {
  try {
    // Check configuration
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl) {
      return NextResponse.json(
        {
          error: "Supabase not configured",
          message: "NEXT_PUBLIC_SUPABASE_URL is not set",
          config: {
            hasUrl: false,
            hasAnonKey: !!anonKey,
          },
        },
        { status: 500 }
      );
    }

    if (!anonKey) {
      return NextResponse.json(
        {
          error: "Supabase not configured",
          message: "NEXT_PUBLIC_SUPABASE_ANON_KEY is not set",
          config: {
            hasUrl: true,
            hasAnonKey: false,
          },
        },
        { status: 500 }
      );
    }

    // Use anon client - this tests basic connectivity
    // Note: RLS policies may limit what anonymous users can see
    const supabase = createAnonClient();

    // Test connectivity by trying to count conversations
    // This will return 0 if RLS blocks anonymous users (which is expected)
    const { count: conversationCount, error: convError } = await supabase
      .from("chat_conversations")
      .select("*", { count: "exact", head: true });

    const { count: messageCount, error: msgError } = await supabase
      .from("chat_messages")
      .select("*", { count: "exact", head: true });

    // If we get "permission denied" errors, that's actually good - it means
    // RLS is working and the connection is fine
    const rlsWorking = 
      (convError?.code === "42501" || convError?.message?.includes("permission")) ||
      (msgError?.code === "42501" || msgError?.message?.includes("permission"));

    // Test INSERT capability (what anonymous users need)
    // We'll do a dry-run by checking if the table exists
    const { error: tableError } = await supabase
      .from("chat_conversations")
      .select("id")
      .limit(0);

    const connectionOk = !tableError || tableError.code === "42501" || rlsWorking;

    return NextResponse.json({
      success: connectionOk,
      connection: {
        status: connectionOk ? "connected" : "failed",
        rlsEnabled: rlsWorking || (!convError && conversationCount === 0),
      },
      counts: {
        conversations: conversationCount || 0,
        messages: messageCount || 0,
      },
      errors: {
        conversationCount: convError?.message || null,
        messageCount: msgError?.message || null,
      },
      notes: rlsWorking 
        ? "RLS is properly blocking anonymous SELECT - this is expected behavior"
        : conversationCount === 0 
          ? "No conversations yet, or RLS is blocking anonymous access"
          : null,
      config: {
        supabaseUrl: supabaseUrl ? `${supabaseUrl.substring(0, 25)}...` : "not set",
        hasAnonKey: !!anonKey,
      },
    });
  } catch (error) {
    console.error("Error verifying chat logs:", error);
    
    const errorDetails: Record<string, unknown> = {
      error: "Internal server error",
      message: error instanceof Error ? error.message : String(error),
    };
    
    // Check if it's a fetch error (network issue)
    if (error instanceof Error && error.message.includes("fetch")) {
      errorDetails.type = "Network/Connection Error";
      errorDetails.suggestions = [
        "Check if your Supabase project is paused (free tier pauses after 7 days of inactivity)",
        "Verify NEXT_PUBLIC_SUPABASE_URL is correct",
        "Check your internet connection",
      ];
    }
    
    return NextResponse.json(errorDetails, { status: 500 });
  }
}
