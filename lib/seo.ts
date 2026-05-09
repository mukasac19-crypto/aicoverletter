// Canonical SEO helpers. Anything that emits absolute URLs (sitemap, robots,
// metadata openGraph/twitter, JSON-LD) should resolve the site URL through
// getCanonicalSiteUrl so we never leak localhost or a Railway/Vercel preview
// host into production indexing.

const HARDCODED_PROD_FALLBACK = 'https://careerthings.ai';

export function getCanonicalSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return normalize(explicit);

  const railway =
    process.env.RAILWAY_PUBLIC_DOMAIN || process.env.RAILWAY_STATIC_URL;
  if (railway) return normalize(railway);

  const vercel = process.env.VERCEL_URL;
  if (vercel) return normalize(vercel);

  if (process.env.NODE_ENV === 'production') return HARDCODED_PROD_FALLBACK;
  return 'http://localhost:3000';
}

export function absoluteUrl(path: string): string {
  const base = getCanonicalSiteUrl();
  if (!path) return base;
  return path.startsWith('http')
    ? path
    : `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

function normalize(url: string): string {
  const withProtocol =
    url.startsWith('http://') || url.startsWith('https://')
      ? url
      : `https://${url}`;
  return withProtocol.endsWith('/') ? withProtocol.slice(0, -1) : withProtocol;
}
