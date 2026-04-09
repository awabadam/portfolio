import { NextResponse } from 'next/server';
import { createAppServerClient } from '@/lib/supabase';

// Cache featured projects aggressively — they change rarely and are
// used on the homepage which needs to avoid loading Supabase client-side.
const CACHE_CONTROL = 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';
    const limit = parseInt(searchParams.get('limit') || '0', 10);

    const supabase = createAppServerClient();

    let query = supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (featured) query = query.eq('featured', true);
    if (limit > 0) query = query.limit(limit);

    const { data: projects, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
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
    const supabase = createAppServerClient();
    
    // Get the current user session
    const { data: { session } } = await supabase.auth.getSession();
    
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
    const { data, error } = await supabase
      .from('projects')
      .insert([
        { 
          title: body.title,
          category: body.category,
          description: body.description,
          behance_url: body.behanceUrl,
          thumbnail_url: body.thumbnailUrl,
          featured: body.featured || false,
          user_id: session.user.id
        }
      ])
      .select();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
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
