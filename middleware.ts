// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

const TEMP_ADMIN_EMAIL = 'jennifernanyombi1@gmail.com';
const PROTECTED_API_ROUTES: Record<string, { feature?: string; tier?: string }> = {
  '/api/cover-letter/generate': { feature: 'coverLetters' },
  '/api/resume/create': { feature: 'resumes' },
  '/api/resume/ats-scan': { feature: 'atsScans' },
  '/api/interview/session': { feature: 'interviewSessions' },
  '/api/templates/premium': { tier: 'PRO' },
};

// List of paths that should skip middleware entirely
const PUBLIC_PATHS = [
  '/_next',
  '/api/_',
  '/favicon.ico',
  '/public',
  '/auth/callback', // Important: Allow callback to process without interference
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip middleware for static assets and public paths
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path)) || pathname.includes('.')) {
    return NextResponse.next();
  }

  // CRITICAL: Update session first and get the response with proper cookies
  const supabaseResponse = await updateSession(request);
  
  // Extract user from the session update
  // We need to create a client with the updated cookies from supabaseResponse
  const { createServerClient } = await import('@supabase/ssr');
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // Get cookies from the response that has the updated session
          return supabaseResponse.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Set any additional cookies on the response
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Get user with the properly updated session
  const { data: { user } } = await supabase.auth.getUser();

  // Define protected routes
  const protectedRoutes = ['/dashboard', '/api/user'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Handle unauthenticated access to protected routes
  if (!user && isProtectedRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/auth/login'; // Changed from '/' to '/auth/login'
    redirectUrl.searchParams.set('returnTo', pathname);
    
    // Create redirect response and preserve cookies
    const redirectResponse = NextResponse.redirect(redirectUrl);
    
    // CRITICAL: Copy all cookies from supabaseResponse to redirectResponse
    supabaseResponse.cookies.getAll().forEach(cookie => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    
    return redirectResponse;
  }

  // Redirect authenticated users from home to dashboard
  if (user && pathname === '/') {
    const dashboardUrl = new URL('/dashboard', request.url);
    
    // Create redirect response and preserve cookies
    const redirectResponse = NextResponse.redirect(dashboardUrl);
    
    // CRITICAL: Copy all cookies from supabaseResponse to redirectResponse
    supabaseResponse.cookies.getAll().forEach(cookie => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    
    return redirectResponse;
  }

  // Admin route checks
  const adminRoutes = ['/oslo'];
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route)) && 
                       pathname !== '/oslo/auth/login';

  if (isAdminRoute) {
    if (!user) {
      const redirectUrl = new URL('/oslo/auth/login', request.url);
      const redirectResponse = NextResponse.redirect(redirectUrl);
      
      // Preserve cookies
      supabaseResponse.cookies.getAll().forEach(cookie => {
        redirectResponse.cookies.set(cookie.name, cookie.value);
      });
      
      return redirectResponse;
    }
    
    if (user.email === TEMP_ADMIN_EMAIL) {
      return supabaseResponse;
    }
    
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();
        
      if (!profile?.is_admin) {
        const redirectUrl = new URL('/oslo/auth/login', request.url);
        redirectUrl.searchParams.set('error', 'unauthorized');
        const redirectResponse = NextResponse.redirect(redirectUrl);
        
        // Preserve cookies
        supabaseResponse.cookies.getAll().forEach(cookie => {
          redirectResponse.cookies.set(cookie.name, cookie.value);
        });
        
        return redirectResponse;
      }
    } catch (error) {
      console.error('Profile check error:', error);
      const redirectUrl = new URL('/oslo/auth/login', request.url);
      const redirectResponse = NextResponse.redirect(redirectUrl);
      
      // Preserve cookies
      supabaseResponse.cookies.getAll().forEach(cookie => {
        redirectResponse.cookies.set(cookie.name, cookie.value);
      });
      
      return redirectResponse;
    }
  }

  // API route protection headers
  const protection = PROTECTED_API_ROUTES[pathname];
  if (protection && user) {
    supabaseResponse.headers.set('x-subscription-check-required', 'true');
    supabaseResponse.headers.set('x-subscription-feature', protection.feature || '');
    supabaseResponse.headers.set('x-subscription-tier', protection.tier || '');
  }

  // ALWAYS return the supabaseResponse that has the updated session
  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     * - images and other static files with extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.).*)',
  ],
};