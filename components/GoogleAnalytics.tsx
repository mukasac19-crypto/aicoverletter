// components/GoogleAnalytics.tsx

"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Helper function to send pageview events
export const pageview = (url: string) => {
  if (typeof window.gtag !== "undefined") {
    window.gtag("config", process.env.NEXT_PUBLIC_GA_ID as string, {
      page_path: url,
    });
  }
};

const GoogleAnalytics = () => {
  const pathname = usePathname();

  // Send pageview event on route change
  useEffect(() => {
    if (pathname) {
      pageview(pathname);
    }
  }, [pathname]);

  // Don't render anything in development
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
};

export default GoogleAnalytics;