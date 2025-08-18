
import { createClient } from '@/utils/server-side-client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
   
     const supabase = await createClient();

    const { id } = params;

    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: allBlogs } = await supabase.from('blogs').select('id, title, published_at').order('published_at', { ascending: false });

    let prevArticle = null;
    let nextArticle = null;

    if (allBlogs) {
        const currentIndex = allBlogs.findIndex(b => b.id === id);
        if (currentIndex > 0) {
            prevArticle = allBlogs[currentIndex - 1];
        }
        if (currentIndex !== -1 && currentIndex < allBlogs.length - 1) {
            nextArticle = allBlogs[currentIndex + 1];
        }
    }

    return NextResponse.json({ blog: { ...data, prevArticle, nextArticle } });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
     const supabase = await createClient();
    const { id } = params;
    const { title, content, header_image_url } = await request.json();

    const { data: blogs } = await supabase.from('blogs').select('id, title, content').neq('id', id);

    const related_articles = blogs
        ?.map(blog => {
            const score = content.split(' ').filter((word: string) => blog.content.includes(word)).length;
            return { id: blog.id, title: blog.title, score };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(({ id, title }) => ({ id, title }));

    const { data, error } = await supabase
        .from('blogs')
        .update({ title, content, header_image_url, related_articles: related_articles || [], updated_at: new Date().toISOString() })
        .eq('id', id)
        .select();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ blog: data?.[0] });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
     const supabase = await createClient();
    const { id } = params;

    const { error } = await supabase.from('blogs').delete().eq('id', id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Blog post deleted successfully' });
}
