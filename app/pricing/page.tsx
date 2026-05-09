// app/pricing/page.tsx
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getServerClient } from '@/lib/supabase-server';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, CreditCard } from "lucide-react";
import Link from "next/link";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import PricingClient from './PricingClient';
import { getCanonicalSiteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Pricing — Free Forever or Go Pro for $20/mo',
  description:
    'Simple, transparent pricing for CareerThings AI. Start free with cover letters and resumes, or upgrade to Pro for unlimited generations, ATS scanning, and interview prep.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    type: 'website',
    title: 'CareerThings AI Pricing — Free Forever or $20/mo Pro',
    description:
      'Free forever plan plus a Pro tier with unlimited cover letters, ATS scanning, and interview prep.',
    url: '/pricing',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CareerThings AI Pricing',
    description:
      'Free forever plan plus a Pro tier with unlimited cover letters, ATS scanning, and interview prep.',
  },
};

export default async function PricingPage() {
  const supabase = getServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const siteUrl = getCanonicalSiteUrl();
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'CareerThings AI Professional',
    description:
      'Unlimited AI cover letters, ATS-optimized resumes, ATS scanning, and interview prep.',
    brand: { '@type': 'Brand', name: 'CareerThings AI' },
    url: `${siteUrl}/pricing`,
    offers: [
      {
        '@type': 'Offer',
        name: 'Free',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: `${siteUrl}/auth/register`,
      },
      {
        '@type': 'Offer',
        name: 'Professional (monthly)',
        price: '20',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: `${siteUrl}/pricing`,
      },
      {
        '@type': 'Offer',
        name: 'Professional (annual)',
        price: '200',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: `${siteUrl}/pricing`,
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '1200',
      bestRating: '5',
      worstRating: '1',
    },
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Pricing', item: `${siteUrl}/pricing` },
    ],
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-20 text-center max-w-5xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          Land Interviews Faster with <span className="text-orange-600">CareerThings Pro</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-3xl mx-auto">
          Write smarter cover letters, optimize your resumes, and prepare for interviews — all powered by AI.
        </p>
        <p className="text-sm text-orange-600 font-medium mb-12">
          Trusted by 1,200+ job seekers • Rated ★★★★★
        </p>

        <Suspense fallback={
          <div className="flex justify-center my-8">
            <LoadingSpinner className="h-8 w-8" />
          </div>
        }>
          <PricingClient />
        </Suspense>
      </section>

      {/* Social Proof Section */}
      <section className="container mx-auto px-4 py-12 max-w-4xl">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <Card className="p-6 bg-white shadow-md border-orange-100">
            <div className="text-amber-400 mb-4">★★★★★</div>
            <p className="italic text-gray-700 mb-4">"Worth every penny! The unlimited cover letters helped me customize every application. I landed my dream job within weeks."</p>
            <p className="font-semibold">Sarah J.</p>
            <p className="text-sm text-gray-500">Marketing Director</p>
          </Card>
          <Card className="p-6 bg-white shadow-md border-orange-100">
            <div className="text-amber-400 mb-4">★★★★★</div>
            <p className="italic text-gray-700 mb-4">"The AI feedback and templates are amazing. The Pro plan helped me polish my resume and I got 3 interviews in a week!"</p>
            <p className="font-semibold">Thomas K.</p>
            <p className="text-sm text-gray-500">Software Engineer</p>
          </Card>
          <Card className="p-6 bg-white shadow-md border-orange-100">
            <div className="text-amber-400 mb-4">★★★★★</div>
            <p className="italic text-gray-700 mb-4">"The interview prep feature gave me confidence I never had before. Pro is totally worth it."</p>
            <p className="font-semibold">Michael T.</p>
            <p className="text-sm text-gray-500">Product Manager</p>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div className="grid gap-8 text-left">
          <div>
            <h3 className="text-xl font-semibold mb-2">Can I cancel my subscription at any time?</h3>
            <p className="text-gray-600">Yes! You can cancel anytime — your plan remains active until the end of your billing cycle.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Is payment secure?</h3>
            <p className="text-gray-600">Absolutely. All payments are processed through <strong>Stripe</strong>, one of the world’s most trusted payment platforms.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">What if I don’t like it?</h3>
            <p className="text-gray-600">We offer a <strong>7-day money-back guarantee</strong> — no questions asked. Try Pro risk-free.</p>
          </div>
        </div>
      </section>

      {/* Sticky CTA Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-orange-600 text-white py-4 px-6 flex flex-col sm:flex-row justify-between items-center z-50 shadow-lg">
        <span className="font-medium text-center sm:text-left mb-2 sm:mb-0">
          Join 1,000+ job seekers upgrading to Pro today.
        </span>
        <Button size="sm" className="bg-white text-orange-700 hover:bg-orange-50" asChild>
          <Link href="/api/stripe/create-checkout?tier=PRO&interval=monthly">
            <CreditCard className="h-4 w-4 mr-2" /> Get Started Risk-Free
          </Link>
        </Button>
      </footer>
    </main>
  );
}
