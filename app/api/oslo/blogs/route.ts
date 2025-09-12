import { getServerClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerClient();
    
    // Check if user is authenticated and is admin
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all'; // all, published, draft

    let query = supabase
      .from('blogs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Apply filters
    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    if (status === 'published') {
      query = query.not('published_at', 'is', null);
    } else if (status === 'draft') {
      query = query.is('published_at', null);
    }

    // Pagination
    const start = (page - 1) * limit;
    query = query.range(start, start + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      blogs: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerClient();
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      content,
      header_image_url,
      published_at,
      related_articles
    } = body;

    const { data, error } = await supabase
      .from('blogs')
      .insert({
        title,
        content,
        header_image_url,
        published_at,
        related_articles: related_articles || [],
        author_id: session.user.id
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    );
  }
}