import { NextResponse } from "next/server";
import { ilike, or } from "drizzle-orm";
import { db } from "@/db";
import { blogPosts, chatConversations, leads, projects } from "@/db/schema";
import { getSession } from "@/lib/auth/server";
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

    // Check authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      const leadRows = await db
        .select({ id: leads.id, name: leads.name, email: leads.email, phone: leads.phone, source: leads.source })
        .from(leads)
        .where(or(ilike(leads.name, searchPattern), ilike(leads.email, searchPattern), ilike(leads.phone, searchPattern)))
        .limit(5)
        .catch(() => null);

      if (leadRows) {
        for (const lead of leadRows) {
          results.push({
            id: lead.id,
            type: "lead",
            title: lead.name || lead.email || lead.phone || "Unknown Lead",
            subtitle: lead.email || lead.phone || undefined,
            href: `/admin/leads?search=${encodeURIComponent(lead.email || lead.name || "")}`,
          });
        }
      }
    }

    // Search conversations
    if (!type || type === "all" || type === "conversations") {
      const conversations = await db
        .select({
          id: chatConversations.id,
          visitor_name: chatConversations.visitor_name,
          visitor_email: chatConversations.visitor_email,
          visitor_phone: chatConversations.visitor_phone,
          session_id: chatConversations.session_id,
        })
        .from(chatConversations)
        .where(
          or(
            ilike(chatConversations.visitor_name, searchPattern),
            ilike(chatConversations.visitor_email, searchPattern),
            ilike(chatConversations.visitor_phone, searchPattern),
            ilike(chatConversations.session_id, searchPattern)
          )
        )
        .limit(5)
        .catch(() => null);

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
      const projectRows = await db
        .select({ id: projects.id, title: projects.title, category: projects.category, description: projects.description })
        .from(projects)
        .where(or(ilike(projects.title, searchPattern), ilike(projects.category, searchPattern), ilike(projects.description, searchPattern)))
        .limit(5)
        .catch(() => null);

      if (projectRows) {
        for (const project of projectRows) {
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
      const posts = await db
        .select({ id: blogPosts.id, title: blogPosts.title, slug: blogPosts.slug, excerpt: blogPosts.excerpt, category: blogPosts.category })
        .from(blogPosts)
        .where(or(ilike(blogPosts.title, searchPattern), ilike(blogPosts.excerpt, searchPattern), ilike(blogPosts.category, searchPattern)))
        .limit(5)
        .catch(() => null);

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
