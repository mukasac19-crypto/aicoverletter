import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import { AuthContextProvider } from '@/contexts/AuthContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import MainLayout from '@/components/MainLayout';
import Script from 'next/script';
import { getCanonicalSiteUrl } from '@/lib/seo';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

const siteUrl = getCanonicalSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      'CareerThings AI — AI Cover Letters, Resumes & ATS Tools to Land Your Dream Job',
    template: '%s | CareerThings AI',
  },
  description:
    'CareerThings AI helps job seekers land interviews faster with AI-powered cover letters, ATS-optimized resumes, interview prep, and job tracking. Free forever plan available.',
  applicationName: 'CareerThings AI',
  keywords: [
    'AI cover letter generator',
    'AI resume builder',
    'ATS resume checker',
    'cover letter examples',
    'resume examples',
    'interview prep AI',
    'job application tracker',
    'tailored cover letter',
    'tailored resume',
    'CareerThings AI',
  ],
  authors: [{ name: 'CareerThings AI' }],
  creator: 'CareerThings AI',
  publisher: 'CareerThings AI',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'CareerThings AI',
    title:
      'CareerThings AI — AI Cover Letters, Resumes & ATS Tools',
    description:
      'Generate tailored cover letters, ATS-optimized resumes, and ace interviews. Trusted by 100,000+ professionals.',
    url: siteUrl,
    locale: 'en_US',
    images: [
      {
        url: '/careerthingslogo.png',
        width: 1200,
        height: 630,
        alt: 'CareerThings AI — AI Cover Letters, Resumes & ATS Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CareerThings AI — AI Cover Letters, Resumes & ATS Tools',
    description:
      'Generate tailored cover letters, ATS-optimized resumes, and ace interviews. Trusted by 100,000+ professionals.',
    images: ['/careerthingslogo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: '/careerthingslogo.png',
    apple: '/careerthingslogo.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ea580c',
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'CareerThings AI',
  url: siteUrl,
  logo: `${siteUrl}/careerthingslogo.png`,
  description:
    'AI-powered cover letters, ATS-optimized resumes, interview prep, and job tracking — built to help job seekers land interviews faster.',
  sameAs: [
    'https://www.tiktok.com/@careerthingsai',
    'https://www.instagram.com/careerthingsai',
    'https://www.facebook.com/careerthingsai',
  ],
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'CareerThings AI',
  url: siteUrl,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${siteUrl}/blog?search={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className={inter.className}>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1LCZSXKHD4"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1LCZSXKHD4');
          `}
        </Script>

        {/* Meta Pixel Code */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '858083856879336');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=858083856879336&ev=PageView&noscript=1"
          />
        </noscript>
        {/* End Meta Pixel Code */}

        {/* TikTok Pixel Code */}
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;
              var ttq=w[t]=w[t]||[];
              ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
              ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
              for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
              ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
              ttq.load=function(e,n){
                var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;
                ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};
                n=document.createElement("script");
                n.type="text/javascript";n.async=!0;n.src=r+"?sdkid="+e+"&lib="+t;
                e=document.getElementsByTagName("script")[0];
                e.parentNode.insertBefore(n,e)
              };
              ttq.load('D3HUAQRC77UF12BA1B2G');
              ttq.page();
            }(window, document, 'ttq');
          `}
        </Script>
        {/* End TikTok Pixel Code */}

        <AuthContextProvider>
          <SubscriptionProvider>
            <MainLayout>
              {children}
            </MainLayout>
            <Toaster />
          </SubscriptionProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
