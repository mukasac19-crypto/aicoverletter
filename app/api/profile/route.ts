//C:\Users\mukas\Downloads\project-bolt-sb1-guerg2d9\project\app\api\profile\route.ts
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server';

import { cookies } from 'next/headers';
import { createClient } from '@/utils/server-side-client';

export async function GET(request: Request) {
  const cookieStore = cookies();
   const supabase = await createClient();
  
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(profile);
}

export async function PUT(request: Request) {
  const cookieStore = cookies();
   const supabase = await createClient();
  
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profileData = await request.json();

  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: session.user.id,
      ...profileData,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}