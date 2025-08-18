
import { createClient } from '@/utils/server-side-client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {

    const supabase = await createClient();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const searchTerm = searchParams.get('search') || '';

    const startIndex = (page - 1) * limit;

    let query = supabase
        .from('blogs')
        .select('*', { count: 'exact' })
        .order('published_at', { ascending: false })
        .range(startIndex, startIndex + limit - 1);

    if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
    }

    const { data, error, count } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ blogs: data, count });
}

export async function POST(request: NextRequest) {

    const supabase = await createClient();
    const { title, content, published_at, header_image_url } = await request.json();

    const { data: blogs } = await supabase.from('blogs').select('id, title, content');

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
        .insert([{ title, content, published_at, header_image_url, related_articles: related_articles || [] }])
        .select();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ blog: data?.[0] });
}
