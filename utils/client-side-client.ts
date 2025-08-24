// utils/client-side-client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookies = document.cookie.split('; ');
          const cookie = cookies.find(c => c.startsWith(`${name}=`));
          return cookie ? decodeURIComponent(cookie.split('=')[1]) : undefined;
        },
        set(name: string, value: string, options?: any) {
          let cookieString = `${name}=${encodeURIComponent(value)}`;
          
          if (options?.maxAge) {
            cookieString += `; max-age=${options.maxAge}`;
          }
          if (options?.expires) {
            cookieString += `; expires=${options.expires.toUTCString()}`;
          }
          if (options?.path) {
            cookieString += `; path=${options.path}`;
          }
          if (options?.domain) {
            cookieString += `; domain=${options.domain}`;
          }
          
          // Force secure cookies in production
          if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
            cookieString += '; secure';
          }
          
          if (options?.sameSite) {
            cookieString += `; samesite=${options.sameSite}`;
          } else {
            cookieString += '; samesite=lax';
          }
          
          document.cookie = cookieString;
        },
        remove(name: string, options?: any) {
          let cookieString = `${name}=; max-age=0`;
          
          if (options?.path) {
            cookieString += `; path=${options.path}`;
          }
          if (options?.domain) {
            cookieString += `; domain=${options.domain}`;
          }
          
          document.cookie = cookieString;
        },
      },
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      },
    }
  );
}