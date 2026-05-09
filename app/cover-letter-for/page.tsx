import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Sparkles, Building2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { COMPANY_COVER_LETTERS } from '@/lib/company-cover-letters-data';
import { getCanonicalSiteUrl } from '@/lib/seo';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Cover Letter Examples for Top Companies — Google, Tesla, Apple, Meta & More',
  description:
    'Free cover letter examples tailored to specific companies — Google, Tesla, Apple, Meta, Amazon, Netflix, and more. Each includes culture-specific tips, keywords, and FAQ.',
  alternates: { canonical: '/cover-letter-for' },
  openGraph: {
    type: 'website',
    title: 'Cover Letter Examples for Top Companies — CareerThings AI',
    description:
      'Free cover letter examples for Google, Tesla, Apple, Meta, Amazon, and more — with culture-specific tips that hiring managers screen for.',
    url: '/cover-letter-for',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cover Letter Examples for Top Companies — CareerThings AI',
    description:
      'Free cover letter examples for top companies, with culture-specific tips and AI-powered tailoring.',
  },
};

export default function CompanyCoverLettersIndexPage() {
  const siteUrl = getCanonicalSiteUrl();

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Cover Letter Examples for Top Companies',
    url: `${siteUrl}/cover-letter-for`,
    description:
      'A collection of cover letter examples tailored to specific companies, with culture-specific tips and keywords.',
    hasPart: COMPANY_COVER_LETTERS.map((c) => ({
      '@type': 'Article',
      headline: c.meta.title,
      url: `${siteUrl}/cover-letter-for/${c.slug}`,
      description: c.meta.description,
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Company Cover Letters',
        item: `${siteUrl}/cover-letter-for`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50/30 via-white to-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-800 mb-4">
            COMPANY-SPECIFIC COVER LETTERS
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Cover Letter Examples for Top Companies
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Tailored cover letter examples for the world&apos;s most competitive employers. Each one
            captures the company&apos;s culture, values, and the specific signals their hiring panels
            screen for.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-600 to-orange-600 hover:from-orange-700 hover:to-orange-700 text-white shadow-xl shadow-orange-500/25 px-8"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Tailor One in 30 Seconds
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMPANY_COVER_LETTERS.map((company) => (
              <Card
                key={company.slug}
                className="p-6 border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-gray-900">
                      <Link
                        href={`/cover-letter-for/${company.slug}`}
                        className="hover:text-purple-600 transition-colors"
                      >
                        Cover Letter for {company.companyName}
                      </Link>
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">{company.industry}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {company.shortDescription}
                </p>
                <Link
                  href={`/cover-letter-for/${company.slug}`}
                  className="text-purple-600 hover:text-purple-700 font-medium text-sm inline-flex items-center"
                >
                  View example
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-orange-600 to-orange-700 text-white py-16">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Don&apos;t see your target company? Generate one in 30 seconds.
          </h2>
          <p className="text-lg text-orange-50 mb-8">
            CareerThings AI tailors a cover letter to any specific company and any specific job
            posting. Paste the description, upload your resume, and get a polished letter in
            minutes.
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
