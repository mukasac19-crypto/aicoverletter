import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import { createClient } from './utils/server-side-client';
import { createClient } from '@supabase/supabase-js';

const TEMP_ADMIN_EMAIL = 'jennifernanyombi1@gmail.com';
const PROTECTED_API_ROUTES: Record<string, { feature?: string; tier?: string }> = {
  '/api/cover-letter/generate': { feature: 'coverLetters' },
  '/api/resume/create': { feature: 'resumes' },
  '/api/resume/ats-scan': { feature: 'atsScans' },
  '/api/interview/session': { feature: 'interviewSessions' },
  '/api/templates/premium': { tier: 'PRO' },
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
    if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Supabase URL or Anon Key is not set');
        return response;
    }
  const match = supabaseUrl.match(/https:\/\/(.*?)\.supabase\.co/);
  console.log('Supabase URL%%%%%%%%%5%:', supabaseUrl);
  const projectRef = match ? match[1] : '';
  const cookie = request.cookies.get(`sb-${projectRef}-auth-token`);

  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession:false,
      autoRefreshToken: false,
    },
  });

  // Set session if cookie exists
  let session = null;
  if (cookie?.value) {
    const { data } = await supabase.auth.setSession({ access_token: cookie.value, refresh_token: '' });
    session = data.session;
  }

  const { pathname } = request.nextUrl;

  console.log('Middleware session!!!!!!!!!!!!!!!!!!:', session);
  console.log('Request pathname!!!!!!!!!!!:', pathname);

  // --- Standard User Authentication Checks ---
  const protectedRoutes = [
    '/dashboard',
    '/api/user',
  ];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  if (!session && isProtectedRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/auth/login';
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }
  if (session && (pathname === '/auth/login' || pathname === '/auth/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // --- Admin Route Checks ---
  const adminRoutes = ['/oslo'];
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route)) && pathname !== '/oslo/auth/login';
  if (isAdminRoute) {
    if (!session) {
      const redirectUrl = new URL('/oslo/auth/login', request.url);
      return NextResponse.redirect(redirectUrl);
    }
    if (session.user.email === TEMP_ADMIN_EMAIL) {
      return response;
    }
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single();
      if (profileError || !profile?.is_admin) {
        const redirectUrl = new URL('/oslo/auth/login', request.url);
        redirectUrl.searchParams.set('error', 'unauthorized');
        return NextResponse.redirect(redirectUrl);
      }
    } catch (error) {
      const redirectUrl = new URL('/oslo/auth/login', request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // --- Pro Feature Subscription Checks ---
  const proFeatureRoutes = [
    '/dashboard/resumes/ats-scanner',
    '/dashboard/interview-buddy',
  ];
  if (proFeatureRoutes.some(route => pathname.startsWith(route)) && session) {
    // Let these pass, check subscription in the component
  }

  // NEW: Check API routes for subscription limits
  const protection = PROTECTED_API_ROUTES[pathname];
  if (protection && session) {
    response.headers.set('x-subscription-check-required', 'true');
    response.headers.set('x-subscription-feature', protection.feature || '');
    response.headers.set('x-subscription-tier', protection.tier || '');
  }
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};