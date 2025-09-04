// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

// Special admin email that will bypass checks
const TEMP_ADMIN_EMAIL = 'jennifernanyombi1@gmail.com';

// Subscription cookie configuration
const SUBSCRIPTION_COOKIE = {
  name: 'sb-subscription',
  maxAge: 300, // 5 minutes in seconds
};

// Free tier route limits
const ROUTE_LIMITS = {
  '/dashboard/resumes/ats-scanner': ['PROFESSIONAL', 'PREMIUM'],
  '/dashboard/interview-buddy': ['PREMIUM'],
  '/dashboard/templates/premium': ['PROFESSIONAL', 'PREMIUM'],
  '/api/export/bulk': ['PROFESSIONAL', 'PREMIUM'],
};

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res: response });
  
  // Get the user session
  const { data: { session } } = await supabase.auth.getSession();
  
  // Protected routes - requiring authentication
  const authRoutes = [
    '/dashboard',
    '/api/user',
  ];
  
  // Admin routes - requiring admin privileges
  const adminRoutes = [
    '/oslo'
  ];

  const { pathname } = request.nextUrl;
  
  // Check if the route requires authentication
  const requiresAuth = authRoutes.some(route => pathname.startsWith(route));
  
  // Check if the route is an admin route (excluding login)
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route)) && 
                      pathname !== '/oslo/auth/login';
  
  // If the route requires auth and the user is not authenticated, redirect to login
  if (requiresAuth && !session) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/auth/login';
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }
  
  // Handle admin routes
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
  
  // Handle subscription-gated routes
  if (session) {
    // Check if route requires specific subscription tier
    const requiredTiers = Object.entries(ROUTE_LIMITS).find(([route]) => 
      pathname.startsWith(route)
    )?.[1];
    
    if (requiredTiers) {
      // Try to get subscription from cookie first
      const subscriptionCookie = request.cookies.get(SUBSCRIPTION_COOKIE.name);
      let userTier = 'FREE';
      
      if (subscriptionCookie) {
        try {
          const cookieData = JSON.parse(subscriptionCookie.value);
          if (cookieData.userId === session.user.id && 
              Date.now() - cookieData.timestamp < SUBSCRIPTION_COOKIE.maxAge * 1000) {
            userTier = cookieData.tier;
          }
        } catch {
          // Invalid cookie, will fetch from DB
        }
      }
      
      // If no valid cookie, fetch from database
      if (userTier === 'FREE' && !subscriptionCookie) {
        try {
          const { data: subscription } = await supabase
            .from('subscriptions')
            .select('plan_id, status')
            .eq('user_id', session.user.id)
            .eq('status', 'active')
            .single();
          
          if (subscription) {
            // Map plan_id to tier
            userTier = subscription.plan_id.toUpperCase();
            
            // Set cookie for future requests
            response.cookies.set(SUBSCRIPTION_COOKIE.name, JSON.stringify({
              userId: session.user.id,
              tier: userTier,
              timestamp: Date.now(),
            }), {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              maxAge: SUBSCRIPTION_COOKIE.maxAge,
            });
          }
        } catch {
          // Error fetching subscription, assume FREE tier
        }
      }
      
      // Check if user has access
      if (!requiredTiers.includes(userTier)) {
        // Redirect to upgrade page with return URL
        const upgradeUrl = new URL('/dashboard/billing', request.url);
        upgradeUrl.searchParams.set('upgrade', 'true');
        upgradeUrl.searchParams.set('feature', pathname);
        upgradeUrl.searchParams.set('required', requiredTiers[0]);
        
        return NextResponse.redirect(upgradeUrl);
      }
    }
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api/stripe/webhooks (webhook endpoints should not be blocked)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api/stripe/webhooks).*)',
  ],
};