import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Sparkles, ScanSearch } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ATS_GUIDES } from '@/lib/ats-guides-data';
import { getCanonicalSiteUrl } from '@/lib/seo';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'ATS Guides — How to Beat Workday, Greenhouse, Lever, Taleo & More',
  description:
    'Practical guides to the most common Applicant Tracking Systems: Workday, Greenhouse, Lever, Taleo, iCIMS, BambooHR, Ashby. How each parses resumes, formatting rules, and pitfalls.',
  alternates: { canonical: '/ats-guide' },
  openGraph: {
    type: 'website',
    title: 'ATS Guides — CareerThings AI',
    description:
      'How to beat the major Applicant Tracking Systems: Workday, Greenhouse, Lever, Taleo, iCIMS, BambooHR, Ashby.',
    url: '/ats-guide',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ATS Guides — CareerThings AI',
    description: 'How to beat Workday, Greenhouse, Lever, Taleo, iCIMS, and other ATS systems.',
  },
};

export default function AtsGuidesIndexPage() {
  const siteUrl = getCanonicalSiteUrl();

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'ATS Guides',
    url: `${siteUrl}/ats-guide`,
    description: 'Practical guides to the major Applicant Tracking Systems and how to optimize applications for each.',
    hasPart: ATS_GUIDES.map((g) => ({
      '@type': 'Article',
      headline: g.meta.title,
      url: `${siteUrl}/ats-guide/${g.slug}`,
      description: g.meta.description,
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'ATS Guides', item: `${siteUrl}/ats-guide` },
    ],
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block rounded-full bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 mb-4">
            ATS GUIDES
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            How to beat the major ATS systems
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Practical, system-specific guides for Workday, Greenhouse, Lever, Taleo, iCIMS, BambooHR, and Ashby. How each parses resumes, the formatting rules that actually matter, and the pitfalls that get candidates filtered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tools/ats-checker">
              <Button size="lg" variant="outline" className="px-8">
                Free ATS Checker
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="lg" className="bg-gradient-to-r from-orange-600 to-orange-600 hover:from-orange-700 hover:to-orange-700 text-white shadow-xl px-8">
                <Sparkles className="mr-2 h-5 w-5" />
                Build an ATS-Optimized Resume
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {ATS_GUIDES.map((guide) => (
            <Card key={guide.slug} className="p-6 border-gray-200 hover:border-slate-400 hover:shadow-lg transition-all">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <ScanSearch className="h-5 w-5 text-slate-700" />
                </div>
                <div className="flex-1">
                  <h2 className="font-bold text-lg text-gray-900">
                    <Link href={`/ats-guide/${guide.slug}`} className="hover:text-slate-900 transition-colors">
                      {guide.systemName} ATS Guide
                    </Link>
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">{guide.vendor}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">{guide.shortDescription}</p>
              <Link href={`/ats-guide/${guide.slug}`} className="text-slate-700 hover:text-slate-900 font-medium text-sm inline-flex items-center">
                Read guide
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-orange-600 to-orange-700 text-white py-16">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Don&apos;t guess at ATS optimization.</h2>
          <p className="text-lg text-orange-50 mb-8">
            CareerThings AI builds ATS-optimized resumes that work across every major system — Workday, Greenhouse, Lever, and the rest. Pasted JD in, polished resume out.
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="bg-white text-orange-700 hover:bg-orange-50 shadow-xl px-8">
              <Sparkles className="mr-2 h-5 w-5" />
              Build My Resume Free
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
