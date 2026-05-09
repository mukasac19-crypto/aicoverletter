import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ScanSearch, FileText, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getCanonicalSiteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Free Career Tools — ATS Resume Checker & Job Description Keyword Extractor',
  description:
    'Free, no-signup tools to optimize your job search: ATS resume checker, job description keyword extractor, and more. Run them in your browser — your data never leaves your device.',
  alternates: { canonical: '/tools' },
  openGraph: {
    type: 'website',
    title: 'Free Career Tools — CareerThings AI',
    description:
      'Free ATS resume checker and keyword extractor. No signup, no upload, no waiting — runs entirely in your browser.',
    url: '/tools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Career Tools — CareerThings AI',
    description: 'Free ATS resume checker and keyword extractor. Runs in your browser.',
  },
};

const tools = [
  {
    slug: 'ats-checker',
    name: 'ATS Resume Checker',
    description:
      'Paste your resume and a job description — see your ATS keyword match score, exactly which keywords are missing, and formatting issues that could block parsing.',
    icon: ScanSearch,
    color: 'orange',
  },
  {
    slug: 'keyword-extractor',
    name: 'Job Description Keyword Extractor',
    description:
      'Paste any job description — instantly see the top keywords, with technical terms surfaced separately. Use them to optimize your resume and cover letter.',
    icon: FileText,
    color: 'blue',
  },
];

export default function ToolsIndexPage() {
  const siteUrl = getCanonicalSiteUrl();

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Free Career Tools',
    url: `${siteUrl}/tools`,
    hasPart: tools.map((t) => ({
      '@type': 'SoftwareApplication',
      name: t.name,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: `${siteUrl}/tools/${t.slug}`,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: `${siteUrl}/tools` },
    ],
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-800 mb-4">
            FREE — NO SIGNUP REQUIRED
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Free Career Tools That Actually Work
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Run them in your browser. Your data never leaves your device — nothing is stored, nothing is sent to a server.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card key={tool.slug} className="p-8 border-gray-200 hover:shadow-xl transition-all">
                <div className={`w-14 h-14 rounded-xl bg-${tool.color}-100 flex items-center justify-center mb-4`}>
                  <Icon className={`h-7 w-7 text-${tool.color}-600`} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  <Link href={`/tools/${tool.slug}`} className="hover:text-orange-600 transition-colors">
                    {tool.name}
                  </Link>
                </h2>
                <p className="text-gray-600 mb-5 leading-relaxed">{tool.description}</p>
                <Link href={`/tools/${tool.slug}`}>
                  <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                    Open Tool
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="bg-gradient-to-br from-orange-600 to-orange-700 text-white py-16">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Want the full power of AI?</h2>
          <p className="text-lg text-orange-50 mb-8">
            CareerThings AI builds tailored cover letters and ATS-optimized resumes for any specific job posting in seconds.
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
