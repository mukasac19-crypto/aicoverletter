
import { NextRequest, NextResponse } from 'next/server';

import { cookies } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { Database } from '@/types/supabase';
import { createAuditLog } from '@/lib/admin-audit-log';
import { createClient } from '@/utils/server-side-client';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
     const supabase = await createClient();

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if the user is an admin
    const { data: adminData, error: adminError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', session.user.id)
      .single();

    if (adminError || !adminData?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { customerId } = await request.json();

    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/oslo/users`,
    });

    // Create audit log
    await createAuditLog(supabase, {
      admin_id: session.user.id,
      action: 'access_stripe_portal',
      entity_type: 'user',
      details: { customerId },
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error('Error creating Stripe portal session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
