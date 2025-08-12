import { getServerClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const supabase = getServerClient();
    const { data, error } = await supabase.from('blogs').select('*');

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ blogs: data });
}

export async function POST(request: NextRequest) {
    const supabase = getServerClient();
    const { title, content, published_at, header_image_url, related_articles } = await request.json();

    const { data, error } = await supabase
        .from('blogs')
        .insert([{ title, content, published_at, header_image_url, related_articles }])
        .select();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ blog: data?.[0] });
}
