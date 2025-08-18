
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/types/supabase';
import { createClient } from '@/utils/server-side-client';

export async function POST(request: NextRequest) {
    const cookieStore = cookies();
     const supabase = await createClient();

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
        .from('activity_logs')
        .insert({ 
            user_id: session.user.id, 
            event_type: 'user_active',
            details: { last_active: new Date().toISOString() } 
        });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
