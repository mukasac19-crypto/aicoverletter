
import { createClient } from '@/utils/server-side-client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const supabase = await createClient();

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const filePath = `public/${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

    return NextResponse.json({ url: data.publicUrl });
}
