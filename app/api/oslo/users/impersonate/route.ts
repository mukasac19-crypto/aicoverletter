
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';
import crypto from 'crypto';
import { createAuditLog } from '@/lib/admin-audit-log';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });

    const { data: { session: adminSession } } = await supabase.auth.getSession();
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: adminData, error: adminError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', adminSession.user.id)
      .single();

    if (adminError || !adminData?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Get user's email
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Generate a secure, single-use token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    // Store the token in the database
    const { error: tokenError } = await supabase
      .from('impersonation_tokens')
      .insert({
        user_id: userId,
        email: userData.email,
        token,
        expires_at: expiresAt.toISOString(),
      });

    if (tokenError) {
      console.error('Error saving impersonation token:', tokenError);
      return NextResponse.json({ error: 'Failed to create impersonation token' }, { status: 500 });
    }

    // Create audit log
    await createAuditLog(supabase, {
      admin_id: adminSession.user.id,
      action: 'impersonate_user',
      entity_type: 'user',
      entity_id: userId,
    });

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error impersonating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
