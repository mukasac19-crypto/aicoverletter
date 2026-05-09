import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Sparkles, BookOpen, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GUIDES, groupGuidesByCategory } from '@/lib/guides-data';
import { getCanonicalSiteUrl } from '@/lib/seo';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Career Guides — How to Write Cover Letters, Beat ATS, and Land Interviews',
  description:
    'Long-form career guides on writing cover letters, beating ATS, resume length, and resume summaries. Practical, evergreen, and fully tailored to 2026 hiring practices.',
  alternates: { canonical: '/guides' },
  openGraph: {
    type: 'website',
    title: 'Career Guides — CareerThings AI',
    description:
      'Long-form, practical career guides on cover letters, resumes, ATS optimization, and interview prep.',
    url: '/guides',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Career Guides — CareerThings AI',
    description: 'Long-form, practical career guides on cover letters, resumes, and ATS optimization.',
  },
};

export default function GuidesIndexPage() {
  const grouped = groupGuidesByCategory();
  const siteUrl = getCanonicalSiteUrl();

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'CareerThings AI Guides',
    url: `${siteUrl}/guides`,
    description: 'A collection of long-form career guides covering cover letters, resumes, and ATS optimization.',
    hasPart: GUIDES.map((g) => ({
      '@type': 'Article',
      headline: g.title,
      url: `${siteUrl}/guides/${g.slug}`,
      description: g.meta.description,
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: `${siteUrl}/guides` },
    ],
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50/30 via-white to-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800 mb-4">
            CAREER GUIDES
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Long-form guides for serious job seekers
          </h1>
          <p className="text-xl text-gray-600">
            Practical, evergreen guides on cover letters, resumes, ATS optimization, and what
            actually works in 2026 hiring. Written by the CareerThings AI team.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-5xl mx-auto space-y-12">
          {Object.entries(grouped).map(([category, guides]) => (
            <div key={category}>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {guides.map((guide) => (
                  <Card key={guide.slug} className="p-6 border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 leading-snug">
                          <Link href={`/guides/${guide.slug}`} className="hover:text-emerald-600 transition-colors">
                            {guide.title}
                          </Link>
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {guide.estimatedReadTime}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-3">{guide.intro}</p>
                    <Link
                      href={`/guides/${guide.slug}`}
                      className="text-emerald-600 hover:text-emerald-700 font-medium text-sm inline-flex items-center"
                    >
                      Read guide
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-orange-600 to-orange-700 text-white py-16">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Skip the writing.</h2>
          <p className="text-lg text-orange-50 mb-8">
            CareerThings AI applies every principle in these guides automatically — generating tailored cover letters and ATS-optimized resumes in seconds.
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="bg-white text-orange-700 hover:bg-orange-50 shadow-xl px-8">
              <Sparkles className="mr-2 h-5 w-5" />
              Try the AI Generator Free
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
