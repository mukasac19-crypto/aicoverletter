import { getServerClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerClient();
    
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    let query = supabase
      .from('blogs')
      .select('*', { count: 'exact' })
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false });

    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    const start = (page - 1) * limit;
    query = query.range(start, start + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      blogs: data || [],
      count: count || 0,
      page,
      limit,
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}
