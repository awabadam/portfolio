import { NextResponse } from "next/server";
import { createAppServerClient } from "@/lib/supabase";

// Check if Supabase is properly configured
function isSupabaseConfigured() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "your-supabase-url" &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "your-anon-key"
  );
}

// GET - Fetch all leads with filtering
export async function GET(request: Request) {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.warn("Supabase not configured, returning empty leads");
      return NextResponse.json({
        leads: [],
        total: 0,
        limit: 50,
        offset: 0,
        message: "Database not configured",
      });
    }

    const { searchParams } = new URL(request.url);
    const source = searchParams.get("source");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const supabase = createAppServerClient();

    let query = supabase
      .from("leads")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (source) {
      query = query.eq("source", source);
    }

    if (status) {
      query = query.eq("status", status);
    }

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
      );
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching leads:", error);
      // Return empty array instead of error for better UX
      return NextResponse.json({
        leads: [],
        total: 0,
        limit,
        offset,
        error: error.message,
      });
    }

    return NextResponse.json({
      leads: data || [],
      total: count || 0,
      limit,
      offset,
    });
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
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.warn("Supabase not configured, lead not saved");
      return NextResponse.json({ 
        success: true, 
        message: "Lead received but not saved (database not configured)" 
      });
    }

    const body = await request.json();
    const { source, name, email, phone, message, project_type, metadata } = body;

    if (!source) {
      return NextResponse.json({ error: "Source is required" }, { status: 400 });
    }

    const headers = request.headers;
    const ipAddress =
      headers.get("x-forwarded-for") ||
      headers.get("x-real-ip") ||
      "unknown";
    const userAgent = headers.get("user-agent") || "unknown";

    const supabase = createAppServerClient();

    const { data, error } = await supabase
      .from("leads")
      .insert({
        source,
        name,
        email,
        phone,
        message,
        project_type,
        ip_address: ipAddress,
        user_agent: userAgent,
        metadata,
        status: "new",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating lead:", error);
      // Return success anyway so the user experience isn't affected
      return NextResponse.json({ 
        success: true, 
        message: "Lead received but may not have been saved",
        error: error.message 
      });
    }

    return NextResponse.json({ lead: data, success: true });
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
