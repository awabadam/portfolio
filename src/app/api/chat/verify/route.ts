import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { chatConversations, chatMessages } from "@/db/schema";
import { getSession } from "@/lib/auth/server";

export async function GET() {
  try {
    // Check configuration
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          error: "Database not configured",
          message: "DATABASE_URL is not set",
          config: {
            hasDatabaseUrl: false,
          },
        },
        { status: 500 }
      );
    }

    // Test basic connectivity
    let connectionError: string | null = null;
    try {
      await db.execute(sql`select 1`);
    } catch (error) {
      connectionError = error instanceof Error ? error.message : String(error);
    }

    const connectionOk = !connectionError;

    // Counts are private data: only the signed-in admin gets them. Anonymous
    // callers see 0, the same thing RLS returned to them under Supabase.
    const session = await getSession();
    let conversationCount = 0;
    let messageCount = 0;
    let convError: string | null = null;
    let msgError: string | null = null;

    if (connectionOk && session) {
      [conversationCount, messageCount] = await Promise.all([
        db.$count(chatConversations).catch((error) => {
          convError = error instanceof Error ? error.message : String(error);
          return 0;
        }),
        db.$count(chatMessages).catch((error) => {
          msgError = error instanceof Error ? error.message : String(error);
          return 0;
        }),
      ]);
    }

    return NextResponse.json({
      success: connectionOk,
      connection: {
        status: connectionOk ? "connected" : "failed",
        // Access control is now enforced in the API routes, not via RLS
        rlsEnabled: false,
      },
      counts: {
        conversations: conversationCount,
        messages: messageCount,
      },
      errors: {
        connection: connectionError,
        conversationCount: convError,
        messageCount: msgError,
      },
      notes: session
        ? null
        : "Counts are only returned to the signed-in admin",
      config: {
        hasDatabaseUrl: true,
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
        "Check that the Neon database is reachable (free tier computes suspend when idle)",
        "Verify DATABASE_URL is correct",
        "Check your internet connection",
      ];
    }
    
    return NextResponse.json(errorDetails, { status: 500 });
  }
}
