
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';
import { createAuditLog } from '@/lib/admin-audit-log';

export async function POST(request: NextRequest) {
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

    const { userIds, action } = await request.json();

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ error: 'User IDs are required' }, { status: 400 });
    }

    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 });
    }

    let error = null;

    switch (action) {
      case 'suspend':
        ({ error } = await supabase
          .from('profiles')
          .update({ status: 'suspended' })
          .in('id', userIds));
        break;
      case 'reactivate':
        ({ error } = await supabase
          .from('profiles')
          .update({ status: 'active' })
          .in('id', userIds));
        break;
      case 'delete':
        // This is a destructive action. Be careful!
        for (const userId of userIds) {
          const { error: deleteError } = await supabase.auth.admin.deleteUser(
            userId
          );
          if (deleteError) {
            error = deleteError;
            break;
          }
        }
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (error) {
      console.error('Error performing bulk action:', error);
      return NextResponse.json({ error: 'Failed to perform bulk action' }, { status: 500 });
    }

    // Create audit log
    await createAuditLog(supabase, {
      admin_id: session.user.id,
      action: `bulk_${action}`,
      entity_type: 'user',
      details: { userIds },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error performing bulk action:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
