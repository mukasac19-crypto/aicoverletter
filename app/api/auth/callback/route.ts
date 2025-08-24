// app/api/auth/callback/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/server-side-client';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/dashboard';
  const error = requestUrl.searchParams.get('error');

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error);
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent(error)}`, requestUrl.origin)
    );
  }

  if (!code) {
    console.error('No authorization code provided');
    return NextResponse.redirect(
      new URL('/auth/login?error=no_code', requestUrl.origin)
    );
  }

  try {
    const supabase = await createClient();
    
    // Exchange the code for a session
    const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (sessionError) {
      console.error('Session exchange error:', sessionError);
      return NextResponse.redirect(
        new URL(`/auth/login?error=${encodeURIComponent(sessionError.message)}`, requestUrl.origin)
      );
    }

    // Successful authentication
    // For production, ensure we're using the correct URL
    const redirectUrl = new URL(next, requestUrl.origin);
    
    // Important: Don't use x-forwarded-host on Railway as it can cause issues
    // Railway handles HTTPS termination properly
    return NextResponse.redirect(redirectUrl);
    
  } catch (error) {
    console.error('Unexpected error during auth callback:', error);
    return NextResponse.redirect(
      new URL('/auth/login?error=unexpected_error', requestUrl.origin)
    );
  }
}