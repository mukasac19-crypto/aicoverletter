// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const TEMP_ADMIN_EMAIL = 'jennifernanyombi1@gmail.com';
const PROTECTED_API_ROUTES: Record<string, { feature?: string; tier?: string }> = {
  '/api/cover-letter/generate': { feature: 'coverLetters' },
  '/api/resume/create': { feature: 'resumes' },
  '/api/resume/ats-scan': { feature: 'atsScans' },
  '/api/interview/session': { feature: 'interviewSessions' },
  '/api/templates/premium': { tier: 'PRO' },
};

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          } catch (e) {
            console.warn('Middleware cookie set error:', e);
          }
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();


  // --- Standard User Authentication Checks ---
  const protectedRoutes = [
    '/dashboard',
    '/api/user',
  ];
  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));

  if (!user && isProtectedRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/';  // Redirect to home, not /auth/login
    redirectUrl.searchParams.set('returnTo', request.nextUrl.pathname);  // Use returnTo to match dashboard
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect to dashboard if logged in and on the root path
  if (user && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // --- Admin Route Checks ---
  const adminRoutes = ['/oslo'];
  const isAdminRoute = adminRoutes.some(route => request.nextUrl.pathname.startsWith(route)) && request.nextUrl.pathname !== '/oslo/auth/login';

  if (isAdminRoute) {
    if (!user) {
      const redirectUrl = new URL('/oslo/auth/login', request.url);
      return NextResponse.redirect(redirectUrl);
    }
    if (user.email === TEMP_ADMIN_EMAIL) {
      return response;
    }
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
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
  if (proFeatureRoutes.some(route => request.nextUrl.pathname.startsWith(route)) && user) {
    // Let these pass, check subscription in the component
  }

  // Add headers for subscription checks in API routes
  const protection = PROTECTED_API_ROUTES[request.nextUrl.pathname];
  if (protection && user) {
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