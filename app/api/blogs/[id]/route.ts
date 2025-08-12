import { getServerClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const supabase = getServerClient();
    const { id } = params;

    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ blog: data });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const supabase = getServerClient();
    const { id } = params;
    const { title, content } = await request.json();

    const { data, error } = await supabase
        .from('blogs')
        .update({ title, content, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ blog: data?.[0] });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const supabase = getServerClient();
    const { id } = params;

    const { error } = await supabase.from('blogs').delete().eq('id', id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Blog post deleted successfully' });
}
