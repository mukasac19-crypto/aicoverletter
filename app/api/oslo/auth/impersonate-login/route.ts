
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // Verify the token
    const { data: tokenData, error: tokenError } = await supabase
      .from('impersonation_tokens')
      .select('*')
      .eq('token', token)
      .single();

    if (tokenError || !tokenData) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    if (tokenData.used_at) {
      return NextResponse.json({ error: 'Token has already been used' }, { status: 401 });
    }

    if (new Date(tokenData.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Token has expired' }, { status: 401 });
    }

    if (!tokenData.email) {
      return NextResponse.json({ error: 'Email not found for token' }, { status: 400 });
    }

    // Mark the token as used
    await supabase
      .from('impersonation_tokens')
      .update({ used_at: new Date().toISOString() })
      .eq('id', tokenData.id);

    // This is a critical step and requires a trusted setup.
    // We are creating a new client with the service role to generate a session for another user.
    const supabaseAdmin = createRouteHandlerClient<Database>({ cookies: () => cookieStore }, {
        supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
    });

    const { data, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: tokenData.email,
    });


    if (sessionError) {
      return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
    }

    return NextResponse.json({ user: data.user, properties: data.properties });
  } catch (error) {
    console.error('Error logging in with impersonation token:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
