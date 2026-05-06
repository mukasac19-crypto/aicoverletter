import { getServerClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getServerClient();
    const { id } = params;

    const { data: blog, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .not('published_at', 'is', null)
      .single<Record<string, any> & { published_at: string }>();

    if (error || !blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // Fetch previous and next articles
    const { data: prevArticle } = await supabase
      .from('blogs')
      .select('id, title')
      .not('published_at', 'is', null)
      .lt('published_at', blog.published_at)
      .order('published_at', { ascending: false })
      .limit(1)
      .single();

    const { data: nextArticle } = await supabase
      .from('blogs')
      .select('id, title')
      .not('published_at', 'is', null)
      .gt('published_at', blog.published_at)
      .order('published_at', { ascending: true })
      .limit(1)
      .single();

    // Fetch related articles (simple implementation: 3 most recent)
    const { data: related_articles } = await supabase
      .from('blogs')
      .select('id, title')
      .not('published_at', 'is', null)
      .neq('id', id)
      .order('published_at', { ascending: false })
      .limit(3);

    return NextResponse.json({
      blog: {
        ...blog,
        prevArticle: prevArticle || null,
        nextArticle: nextArticle || null,
        related_articles: related_articles || [],
      },
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}