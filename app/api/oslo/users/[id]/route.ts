
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: adminData, error: adminError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', session.user.id)
      .single();

    if (adminError || !adminData?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', params.id)
      .single();

    if (userError) {
      throw userError;
    }

    const { data: subscriptionHistory, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', params.id);

    if (subscriptionError) {
      throw subscriptionError;
    }

    const { data: activityLog, error: activityError } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('user_id', params.id);

    if (activityError) {
      throw activityError;
    }

    const { data: auditLog, error: auditError } = await supabase
      .from('admin_audit_logs')
      .select('*')
      .eq('entity_id', params.id);

    if (auditError) {
      throw auditError;
    }

    return NextResponse.json({ user, subscriptionHistory, activityLog, auditLog });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
