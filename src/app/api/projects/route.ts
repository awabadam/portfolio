import { NextResponse } from 'next/server';
import { desc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { projects as projectsTable } from '@/db/schema';
import { getSession } from '@/lib/auth/server';

// Cache featured projects aggressively — they change rarely and are
// used on the homepage which needs to avoid loading Supabase client-side.
const CACHE_CONTROL = 'public, max-age=30, s-maxage=60, stale-while-revalidate=300';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';
    const limit = parseInt(searchParams.get('limit') || '0', 10);

    // Featured projects first, then most-recent — so a `limit` without the
    // `featured` filter surfaces the curated ones and backfills with the
    // newest work to fill out the grid.
    const query = db
      .select()
      .from(projectsTable)
      .where(featured ? eq(projectsTable.featured, true) : undefined)
      .orderBy(desc(projectsTable.featured), desc(projectsTable.created_at));

    let projects;
    try {
      projects = limit > 0 ? await query.limit(limit) : await query;
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to fetch projects' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { projects },
      { headers: { 'Cache-Control': CACHE_CONTROL } }
    );
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Get the current user session
    const session = await getSession();
    
    // Check if user is authenticated
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get request body
    const body = await request.json();
    
    // Insert new project
    let data;
    try {
      data = await db
        .insert(projectsTable)
        .values({
          // projects.id is a text PK with no database default
          id: crypto.randomUUID(),
          title: body.title,
          category: body.category,
          description: body.description,
          behance_url: body.behanceUrl,
          thumbnail_url: body.thumbnailUrl,
          featured: body.featured || false,
          user_id: session.user.id
        })
        .returning();
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to create project' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ project: data[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
