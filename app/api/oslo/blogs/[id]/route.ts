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

// Add this DELETE handler
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Optional: Check if user is authenticated/authorized
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Delete the blog post
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Error deleting blog:', error);
      return NextResponse.json(
        { error: 'Failed to delete blog' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Blog deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE handler:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}