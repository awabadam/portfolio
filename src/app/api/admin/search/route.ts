import { NextResponse } from "next/server";
import { createApiClient, createAuthenticatedClient, createAnonClient } from "@/lib/supabase";
import { checkRateLimit, getIdentifier, getRateLimitHeaders, rateLimiters } from "@/lib/rateLimit";

interface SearchResult {
  id: string;
  type: "lead" | "conversation" | "project" | "blog";
  title: string;
  subtitle?: string;
  href: string;
}

export async function GET(request: Request) {
  try {
    // Rate limiting
    const identifier = getIdentifier(request);
    const rateLimitResult = checkRateLimit(identifier, rateLimiters.search);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    const supabase = createApiClient();

    // Check authentication
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminSupabase = accessToken
      ? createAuthenticatedClient(accessToken)
      : createAnonClient();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();
    const type = searchParams.get("type"); // Optional filter by type

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const results: SearchResult[] = [];
    const searchPattern = `%${query}%`;

    // Search leads
    if (!type || type === "all" || type === "leads") {
      const { data: leads } = await adminSupabase
        .from("leads")
        .select("id, name, email, phone, source")
        .or(`name.ilike.${searchPattern},email.ilike.${searchPattern},phone.ilike.${searchPattern}`)
        .limit(5);

      if (leads) {
        for (const lead of leads) {
          results.push({
            id: lead.id,
            type: "lead",
            title: lead.name || lead.email || lead.phone || "Unknown Lead",
            subtitle: lead.email || lead.phone,
            href: `/admin/leads?search=${encodeURIComponent(lead.email || lead.name || "")}`,
          });
        }
      }
    }

    // Search conversations
    if (!type || type === "all" || type === "conversations") {
      const { data: conversations } = await adminSupabase
        .from("chat_conversations")
        .select("id, visitor_name, visitor_email, visitor_phone, session_id")
        .or(`visitor_name.ilike.${searchPattern},visitor_email.ilike.${searchPattern},visitor_phone.ilike.${searchPattern},session_id.ilike.${searchPattern}`)
        .limit(5);

      if (conversations) {
        for (const conv of conversations) {
          results.push({
            id: conv.id,
            type: "conversation",
            title: conv.visitor_name || conv.visitor_email || "Anonymous Visitor",
            subtitle: conv.visitor_email || conv.visitor_phone || conv.session_id.slice(0, 8),
            href: `/admin/chat/${conv.id}`,
          });
        }
      }
    }

    // Search projects
    if (!type || type === "all" || type === "projects") {
      const { data: projects } = await adminSupabase
        .from("projects")
        .select("id, title, category, description")
        .or(`title.ilike.${searchPattern},category.ilike.${searchPattern},description.ilike.${searchPattern}`)
        .limit(5);

      if (projects) {
        for (const project of projects) {
          results.push({
            id: project.id,
            type: "project",
            title: project.title,
            subtitle: project.category,
            href: `/admin/projects/${project.id}`,
          });
        }
      }
    }

    // Search blog posts
    if (!type || type === "all" || type === "blog") {
      const { data: posts } = await adminSupabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, category")
        .or(`title.ilike.${searchPattern},excerpt.ilike.${searchPattern},category.ilike.${searchPattern}`)
        .limit(5);

      if (posts) {
        for (const post of posts) {
          results.push({
            id: post.id,
            type: "blog",
            title: post.title,
            subtitle: post.category,
            href: `/admin/blog?edit=${post.id}`,
          });
        }
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
