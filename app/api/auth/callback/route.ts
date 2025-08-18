// app/api/auth/callback/route.ts


import { createClient } from '@/utils/server-side-client';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  
   const supabase = await createClient();
 

  // Use the environment variable to get the correct URL
  const publicUrl = process.env.SUPABASE_REDIRECT_URL;

  // You can still use a fallback for local development if needed
  const redirectUrl = publicUrl || `${requestUrl.origin}/dashboard`;
  
  // The logs will now show the correct public URL during a Railway deployment
  console.log('Redirecting to:', redirectUrl);

  return NextResponse.redirect(redirectUrl);
}