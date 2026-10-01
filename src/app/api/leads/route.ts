import { NextResponse } from "next/server";
import { and, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { getSession } from "@/lib/auth/server";
import { checkRateLimit, getIdentifier, getRateLimitHeaders, rateLimiters } from "@/lib/rateLimit";

// GET - Fetch all leads with filtering
export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const source = searchParams.get("source");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const conditions: (SQL | undefined)[] = [];

    if (source) {
      conditions.push(eq(leads.source, source));
    }

    if (status) {
      conditions.push(eq(leads.status, status));
    }

    if (search) {
      const pattern = `%${search}%`;
      conditions.push(
        or(
          ilike(leads.name, pattern),
          ilike(leads.email, pattern),
          ilike(leads.phone, pattern)
        )
      );
    }

    const where = and(...conditions);

    try {
      const [data, count] = await Promise.all([
        db
          .select()
          .from(leads)
          .where(where)
          .orderBy(desc(leads.created_at))
          .limit(limit)
          .offset(offset),
        db.$count(leads, where),
      ]);

      return NextResponse.json({
        leads: data,
        total: count || 0,
        limit,
        offset,
      });
    } catch (error) {
      console.error("Error fetching leads:", error);
      // Return empty array instead of error for better UX
      return NextResponse.json({
        leads: [],
        total: 0,
        limit,
        offset,
        error: error instanceof Error ? error.message : "Failed to fetch leads",
      });
    }
  } catch (error) {
    console.error("Error in leads API:", error);
    // Return empty array instead of 500 error
    return NextResponse.json({
      leads: [],
      total: 0,
      limit: 50,
      offset: 0,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}

// POST - Create a new lead
export async function POST(request: Request) {
  try {
    // Rate limiting
    const identifier = getIdentifier(request);
    const rateLimitResult = checkRateLimit(identifier, rateLimiters.leads);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult)
        }
      );
    }

    const body = await request.json();
    const { source, name, email, phone, message, project_type, metadata } = body;

    // Lazy-import to avoid isomorphic-dompurify crashing module load on Vercel
    const { sanitizeText } = await import("@/lib/sanitize");
    const sanitizedName = name ? sanitizeText(name) : undefined;
    const sanitizedMessage = message ? sanitizeText(message) : undefined;

    if (!source) {
      return NextResponse.json({ error: "Source is required" }, { status: 400 });
    }

    const headers = request.headers;
    const ipAddress =
      headers.get("x-forwarded-for") ||
      headers.get("x-real-ip") ||
      "unknown";
    const userAgent = headers.get("user-agent") || "unknown";

    let data;
    try {
      [data] = await db
        .insert(leads)
        .values({
          source,
          name: sanitizedName,
          email,
          phone,
          message: sanitizedMessage,
          project_type,
          ip_address: ipAddress,
          user_agent: userAgent,
          metadata,
          status: "new",
        })
        .returning();
    } catch (error) {
      console.error("Error creating lead:", error);
      // Return success anyway so the user experience isn't affected
      return NextResponse.json({ 
        success: true, 
        message: "Lead received but may not have been saved",
      });
    }

    return NextResponse.json({ lead: { id: data.id }, success: true });
  } catch (error) {
    console.error("Error in leads API:", error);
    // Return success anyway so the user experience isn't affected
    return NextResponse.json({ 
      success: true,
      message: "Lead received but may not have been saved",
      error: error instanceof Error ? error.message : "Internal server error"
    });
  }
}
