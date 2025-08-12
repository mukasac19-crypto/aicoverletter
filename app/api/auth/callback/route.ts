// app/api/auth/callback/route.ts
// This is the essential server-side handler for Supabase OAuth.

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Log the start of the request
  console.log('Received callback request for URL:', request.url);

  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    console.log('Found an authorization code. Exchanging it for a session...');
    const supabase = createRouteHandlerClient({ cookies });
    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code);
    console.log('Successfully exchanged code for a session.');
  } else {
    // Log if no code was found
    console.warn('No authorization code found in the callback URL.');
  }

  // URL to redirect to after sign in process completes
  // This will be the dashboard for existing users or an onboarding page for new ones.
  const redirectUrl = `${requestUrl.origin}/dashboard`;
  console.log('Redirecting to:', redirectUrl);

  return NextResponse.redirect(redirectUrl);
}