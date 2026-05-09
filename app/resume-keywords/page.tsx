import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Sparkles, Tag } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  RESUME_KEYWORDS,
  groupResumeKeywordsByCategory,
} from '@/lib/resume-keywords-data';
import { getCanonicalSiteUrl } from '@/lib/seo';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Resume Keywords by Job — ATS Keywords for Every Role (2026 Guide)',
  description:
    'Free resume keyword guides for every major job — software engineer, PM, nurse, teacher, accountant, and more. The exact ATS keywords to mirror, organized by category.',
  alternates: { canonical: '/resume-keywords' },
  openGraph: {
    type: 'website',
    title: 'Resume Keywords by Job — CareerThings AI',
    description:
      'The exact ATS keywords to mirror for every major job, organized by category.',
    url: '/resume-keywords',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resume Keywords by Job — CareerThings AI',
    description: 'The exact ATS keywords to mirror for every major job, organized by category.',
  },
};

export default function ResumeKeywordsIndexPage() {
  const grouped = groupResumeKeywordsByCategory();
  const siteUrl = getCanonicalSiteUrl();

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Resume Keywords by Job',
    url: `${siteUrl}/resume-keywords`,
    description:
      'A collection of resume-keyword guides organized by job title, with categorized ATS keywords and action verbs.',
    hasPart: RESUME_KEYWORDS.map((ex) => ({
      '@type': 'Article',
      headline: ex.meta.title,
      url: `${siteUrl}/resume-keywords/${ex.slug}`,
      description: ex.meta.description,
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Resume Keywords', item: `${siteUrl}/resume-keywords` },
    ],
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-cyan-50/30 via-white to-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-800 mb-4">
            ATS KEYWORDS
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Resume Keywords for Every Job
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            The exact ATS keywords to mirror on your resume — organized by hard skills, tools, methodologies, and the action verbs that make bullets land.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tools/keyword-extractor">
              <Button size="lg" variant="outline" className="px-8">
                Free JD Keyword Extractor
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="lg" className="bg-gradient-to-r from-orange-600 to-orange-600 hover:from-orange-700 hover:to-orange-700 text-white shadow-xl shadow-orange-500/25 px-8">
                <Sparkles className="mr-2 h-5 w-5" />
                Build an ATS-Optimized Resume
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-6xl mx-auto space-y-12">
          {Object.entries(grouped).map(([category, examples]) => (
            <div key={category}>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {examples.map((entry) => (
                  <Card key={entry.slug} className="p-6 border-gray-200 hover:border-cyan-300 hover:shadow-lg transition-all">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center flex-shrink-0">
                        <Tag className="h-5 w-5 text-cyan-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">
                          <Link href={`/resume-keywords/${entry.slug}`} className="hover:text-cyan-600 transition-colors">
                            {entry.jobTitle} Resume Keywords
                          </Link>
                        </h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">{entry.shortDescription}</p>
                    <Link href={`/resume-keywords/${entry.slug}`} className="text-cyan-700 hover:text-cyan-800 font-medium text-sm inline-flex items-center">
                      View keywords
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Match keywords to a specific job — automatically.</h2>
          <p className="text-lg text-orange-50 mb-8">
            CareerThings AI extracts keywords from any job description, builds a tailored resume around them, and runs an ATS check — all in one flow.
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
