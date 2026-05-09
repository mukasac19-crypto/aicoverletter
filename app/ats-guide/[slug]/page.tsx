import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, Sparkles, Building2, Search, ScanSearch } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ATS_GUIDES,
  getAtsGuideBySlug,
  getAtsGuideSlugs,
  getRelatedAtsGuides,
} from '@/lib/ats-guides-data';
import { getCanonicalSiteUrl } from '@/lib/seo';

export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  return getAtsGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const guide = getAtsGuideBySlug(params.slug);
  if (!guide) return { title: 'Not Found', robots: { index: false, follow: false } };
  const path = `/ats-guide/${guide.slug}`;
  return {
    title: guide.meta.title,
    description: guide.meta.description,
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      title: guide.meta.title,
      description: guide.meta.description,
      url: path,
      siteName: 'CareerThings AI',
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.meta.title,
      description: guide.meta.description,
    },
  };
}

const CURRENT_YEAR = new Date().getFullYear();

export default function AtsGuidePage({
  params,
}: {
  params: { slug: string };
}) {
  const guide = getAtsGuideBySlug(params.slug);
  if (!guide) notFound();

  const siteUrl = getCanonicalSiteUrl();
  const path = `/ats-guide/${guide.slug}`;
  const url = `${siteUrl}${path}`;
  const related = getRelatedAtsGuides(guide.slug);
  const headline = `${guide.systemName} ATS Guide: How to Beat It in ${CURRENT_YEAR}`;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description: guide.meta.description,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: { '@type': 'Organization', name: 'CareerThings AI', url: siteUrl },
    publisher: {
      '@type': 'Organization',
      name: 'CareerThings AI',
      url: siteUrl,
      logo: { '@type': 'ImageObject', url: `${siteUrl}/careerthingslogo.png` },
    },
    image: [`${siteUrl}/careerthingslogo.png`],
    datePublished: '2026-01-01',
    dateModified: new Date().toISOString().split('T')[0],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: guide.faq.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: { '@type': 'Answer', text: q.answer },
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'ATS Guides', item: `${siteUrl}/ats-guide` },
      { '@type': 'ListItem', position: 3, name: `${guide.systemName} Guide`, item: url },
    ],
  };

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <nav aria-label="Breadcrumb" className="container mx-auto px-4 pt-8">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li><Link href="/" className="hover:text-slate-900">Home</Link></li>
          <li>/</li>
          <li><Link href="/ats-guide" className="hover:text-slate-900">ATS Guides</Link></li>
          <li>/</li>
          <li className="text-gray-900 font-medium">{guide.systemName}</li>
        </ol>
      </nav>

      <article className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="h-5 w-5 text-slate-600" />
            <span className="text-sm font-semibold text-slate-700">{guide.vendor}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">{headline}</h1>
          <p className="text-xl text-gray-600 leading-relaxed">{guide.intro}</p>
        </header>

        <section className="mb-10">
          <Card className="p-6 bg-slate-50 border-slate-200">
            <h2 className="font-semibold text-gray-900 mb-2 text-sm uppercase tracking-wide">Market Position</h2>
            <p className="text-gray-700 mb-4">{guide.marketShare}</p>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm uppercase tracking-wide">Who Uses {guide.systemName}</h3>
            <ul className="space-y-1.5">
              {guide.whoUsesIt.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-500 flex-shrink-0" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        <section className="mb-12">
          <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-100 rounded-2xl p-6 md:p-8 mb-6">
            <div className="flex items-center gap-2 mb-3 text-orange-700">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-bold uppercase tracking-wide">Test Your Resume Free</span>
            </div>
            <p className="text-gray-700 mb-4">
              Use our free ATS Resume Checker to see your keyword match score, missing keywords, and formatting issues — runs in your browser, no signup required.
            </p>
            <Link href="/tools/ats-checker">
              <Button className="bg-gradient-to-r from-orange-600 to-orange-600 hover:from-orange-700 hover:to-orange-700 text-white">
                Try the Free ATS Checker
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 flex items-center gap-2">
            <Search className="h-7 w-7 text-slate-600" />
            How {guide.systemName} Works
          </h2>
          <ul className="space-y-3">
            {guide.howItWorks.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-sm font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                <span className="text-gray-700 leading-relaxed">{step}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 flex items-center gap-2">
            <CheckCircle2 className="h-7 w-7 text-emerald-600" />
            Formatting Rules That Matter
          </h2>
          <ul className="space-y-3">
            {guide.formattingRules.map((rule, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 leading-relaxed">{rule}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 flex items-center gap-2">
            <ScanSearch className="h-7 w-7 text-blue-600" />
            Keyword Strategy for {guide.systemName}
          </h2>
          <Card className="p-6 bg-blue-50 border-blue-200">
            <p className="text-blue-900 leading-relaxed">{guide.keywordStrategy}</p>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 flex items-center gap-2">
            <AlertTriangle className="h-7 w-7 text-amber-600" />
            Common Pitfalls to Avoid
          </h2>
          <ul className="space-y-3">
            {guide.pitfalls.map((pitfall, i) => (
              <li key={i} className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 leading-relaxed">{pitfall}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
            Frequently Asked Questions about {guide.systemName}
          </h2>
          <div className="space-y-4">
            {guide.faq.map((q, i) => (
              <Card key={i} className="p-6 border-gray-200">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">{q.question}</h3>
                <p className="text-gray-700 leading-relaxed">{q.answer}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12 bg-gradient-to-br from-orange-600 to-orange-700 text-white rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Build a resume that works across every ATS.</h2>
          <p className="text-lg text-orange-50 mb-6 max-w-2xl mx-auto">
            CareerThings AI builds ATS-optimized resumes that parse cleanly across {guide.systemName} and every other major system — with the keywords, structure, and formatting they all reward.
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="bg-white text-orange-700 hover:bg-orange-50 px-8">
              <Sparkles className="mr-2 h-5 w-5" />
              Build My Resume Free
            </Button>
          </Link>
        </section>

        {related.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">Related ATS Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {related.map((rel) => (
                <Link key={rel.slug} href={`/ats-guide/${rel.slug}`}>
                  <Card className="p-6 border-gray-200 hover:border-slate-400 hover:shadow-md transition-all">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1 hover:text-slate-900 transition-colors">
                      {rel.systemName} ATS Guide
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{rel.shortDescription}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mb-8">
          <h3 className="text-xl font-bold mb-3 text-gray-900">All ATS Guides</h3>
          <div className="flex flex-wrap gap-2">
            {ATS_GUIDES.filter((g) => g.slug !== guide.slug).map((other) => (
              <Link
                key={other.slug}
                href={`/ats-guide/${other.slug}`}
                className="inline-block bg-gray-50 hover:bg-slate-100 hover:text-slate-900 border border-gray-200 hover:border-slate-400 rounded-full px-3 py-1 text-sm text-gray-700 transition-colors"
              >
                {other.systemName}
              </Link>
            ))}
          </div>
        </section>

        <div className="border-t border-gray-200 pt-6">
          <Link href="/ats-guide" className="inline-flex items-center gap-2 text-gray-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to all ATS guides
          </Link>
        </div>
      </article>
    </main>
  );
}
