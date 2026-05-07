// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { Database } from '@/types/supabase';

const TEMP_ADMIN_EMAIL = 'jennifernanyombi1@gmail.com';

const SUBSCRIPTION_COOKIE = {
  name: 'sb-subscription',
  maxAge: 300,
};

const ROUTE_LIMITS: Record<string, string[]> = {
  '/dashboard/resumes/ats-scanner': ['PRO'],
  '/dashboard/interview-buddy': ['PRO'],
  '/dashboard/templates/premium': ['PRO'],
  '/api/export/bulk': ['PRO'],
};

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: getUser() refreshes the session — do not remove this call
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const authRoutes = ['/dashboard', '/api/user'];
  const adminRoutes = ['/oslo'];

  const requiresAuth = authRoutes.some((route) => pathname.startsWith(route));
  const isAdminRoute =
    adminRoutes.some((route) => pathname.startsWith(route)) &&
    pathname !== '/oslo/auth/login';

  if (requiresAuth && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/auth/login';
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAdminRoute) {
    if (!user) {
      return NextResponse.redirect(new URL('/oslo/auth/login', request.url));
    }
    if (user.email !== TEMP_ADMIN_EMAIL) {
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
    }
  }

  if (user) {
    const requiredTiers = Object.entries(ROUTE_LIMITS).find(([route]) =>
      pathname.startsWith(route)
    )?.[1];

    if (requiredTiers) {
      const subscriptionCookie = request.cookies.get(SUBSCRIPTION_COOKIE.name);
      let userTier = 'FREE';

      if (subscriptionCookie) {
        try {
          const cookieData = JSON.parse(subscriptionCookie.value);
          if (
            cookieData.userId === user.id &&
            Date.now() - cookieData.timestamp < SUBSCRIPTION_COOKIE.maxAge * 1000
          ) {
            userTier = cookieData.tier;
          }
        } catch {
          /* invalid cookie */
        }
      }

      if (userTier === 'FREE' && !subscriptionCookie) {
        try {
          const { data: subscription } = await supabase
            .from('subscriptions')
            .select('plan_id, status')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .single();

          if (subscription) {
            userTier = 'PRO';
            response.cookies.set(
              SUBSCRIPTION_COOKIE.name,
              JSON.stringify({
                userId: user.id,
                tier: userTier,
                timestamp: Date.now(),
              }),
              {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: SUBSCRIPTION_COOKIE.maxAge,
              }
            );
          }
        } catch {
          /* assume FREE */
        }
      }

      if (!requiredTiers.includes(userTier)) {
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
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public|api/stripe/webhooks).*)'],
};