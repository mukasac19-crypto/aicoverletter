// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
// Use createServerClient directly from @supabase/ssr for middleware
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
  // 1. Initialize the response object that will be returned.
  // This is crucial for Supabase's client to set cookies on it.
  const response = NextResponse.next({
    request: request,
  });

  // 2. Create the Supabase server client directly within the middleware.
  // This client will handle reading cookies from `request` and setting
  // updated cookies onto the `response` object via the `setAll` method.
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
            // Apply the cookies to the `response` object
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          } catch (e) {
            // This error can occur if `setAll` is called from a Server Component.
            // It can be ignored in middleware if you have a middleware refreshing sessions.
            console.warn('Middleware cookie set error:', e);
          }
        },
      },
    }
  );

  // 3. IMPORTANT: Call supabase.auth.getUser()
  // This call will trigger the session refresh mechanism and ensure
  // that any updated session tokens are set on the `response` object's cookies.
  const {
    data: { user },
  } = await supabase.auth.getUser();


  console.log('Request pathname:', request.nextUrl.pathname);

  // --- Standard User Authentication Checks ---
  const protectedRoutes = [
    '/dashboard',
    '/api/user',
  ];
  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));

  if (!user && isProtectedRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/';
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
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
      return response; // Return the response with updated cookies
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
    // Let these pass, check subscription in the component (or ideally, in server actions)
  }

  // NEW: Add headers for subscription checks in API routes
  const protection = PROTECTED_API_ROUTES[request.nextUrl.pathname];
  if (protection && user) {
    response.headers.set('x-subscription-check-required', 'true');
    response.headers.set('x-subscription-feature', protection.feature || '');
    response.headers.set('x-subscription-tier', protection.tier || '');
  }

  // 4. Return the `response` object. This response now correctly carries any refreshed session cookies.
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
