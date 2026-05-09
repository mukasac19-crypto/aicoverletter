import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Sparkles, FileSpreadsheet } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  RESUME_EXAMPLES,
  groupResumeExamplesByCategory,
} from '@/lib/resume-examples-data';
import { getCanonicalSiteUrl } from '@/lib/seo';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Resume Examples for Every Job — 2026 ATS-Friendly Templates & Guides',
  description:
    'Free resume examples for software engineers, product managers, nurses, teachers, accountants, and more. Each example includes a writing guide, ATS keywords, FAQ, and one-click AI tailoring.',
  alternates: { canonical: '/resume-examples' },
  openGraph: {
    type: 'website',
    title: 'Resume Examples for Every Job — CareerThings AI',
    description:
      'Free, ATS-friendly resume examples by job title. Each one comes with a writing guide, keywords, and a way to tailor it to any specific posting.',
    url: '/resume-examples',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resume Examples for Every Job — CareerThings AI',
    description: 'Free ATS-friendly resume examples, writing guides, and AI-powered tailoring.',
  },
};

export default function ResumeExamplesIndexPage() {
  const grouped = groupResumeExamplesByCategory();
  const siteUrl = getCanonicalSiteUrl();

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Resume Examples',
    url: `${siteUrl}/resume-examples`,
    description: 'A collection of free, ATS-friendly resume examples for every job title.',
    hasPart: RESUME_EXAMPLES.map((ex) => ({
      '@type': 'Article',
      headline: ex.meta.title,
      url: `${siteUrl}/resume-examples/${ex.slug}`,
      description: ex.meta.description,
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
        name: 'Resume Examples',
        item: `${siteUrl}/resume-examples`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50/30 via-white to-white">
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
          <span className="inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-800 mb-4">
            FREE RESUME EXAMPLES
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Resume Examples for Every Job
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Real, ATS-friendly resume examples written by career experts, with section-by-section
            guides, keywords, and FAQs. Pick yours, copy it, and tailor it to any posting in
            seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-600 to-orange-600 hover:from-orange-700 hover:to-orange-700 text-white shadow-xl shadow-orange-500/25 px-8"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Tailor Mine in 30 Seconds
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
                {examples.map((example) => (
                  <Card
                    key={example.slug}
                    className="p-6 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">
                          <Link
                            href={`/resume-examples/${example.slug}`}
                            className="hover:text-blue-600 transition-colors"
                          >
                            {example.jobTitle} Resume
                          </Link>
                        </h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                      {example.shortDescription}
                    </p>
                    <Link
                      href={`/resume-examples/${example.slug}`}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm inline-flex items-center"
                    >
                      View example
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Don&apos;t see your job? Build one in minutes.
          </h2>
          <p className="text-lg text-orange-50 mb-8">
            CareerThings AI builds and tailors ATS-optimized resumes for any job title and any
            specific posting. Upload your existing resume or start from scratch.
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
