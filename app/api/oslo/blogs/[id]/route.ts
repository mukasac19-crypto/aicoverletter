import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

interface RelatedArticle {
  id: string;
  title: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Get the blog post
    const { data: blog, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', params.id)
      .not('published_at', 'is', null) // Only show published blogs
      .single();

    if (error || !blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Get related articles if they exist
    let relatedArticles: RelatedArticle[] = [];
    if (blog.related_articles && Array.isArray(blog.related_articles)) {
      const relatedIds = blog.related_articles.map((article: any) => 
        typeof article === 'string' ? article : article.id
      );
      
      const { data: related } = await supabase
        .from('blogs')
        .select('id, title')
        .in('id', relatedIds)
        .not('published_at', 'is', null);
      
      relatedArticles = related || [];
    }

    // Get previous and next articles
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

    return NextResponse.json({
      blog: {
        ...blog,
        related_articles: relatedArticles,
        prevArticle,
        nextArticle
      }
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}