/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  
  // Use transpilePackages for Next.js 13.1+
  transpilePackages: ['undici'],
  
  // Add headers to prevent caching issues
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0'
          },
        ],
      },
    ];
  },
  
  // Add redirects configuration to handle trailing slashes consistently
  async redirects() {
    return [
      {
        source: '/dashboard/:path*/',
        destination: '/dashboard/:path*',
        permanent: true,
      },
    ];
  },
  
  // Ensure proper handling of runtime configuration
  experimental: {
    // Disable app directory if you're using pages directory
    appDir: false,
  },
};

export default nextConfig;