import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, CheckCircle2, Sparkles, FileText, Target, Lightbulb } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  COVER_LETTER_EXAMPLES,
  getCoverLetterExampleBySlug,
  getRelatedExamples,
} from '@/lib/cover-letter-examples-data';
import {
  applyModifier,
  getAllSlugsForSitemap,
  isValidModifierSlug,
  parseSlug,
} from '@/lib/seniority-modifiers';
import { getCanonicalSiteUrl } from '@/lib/seo';

export const revalidate = 86400;
export const dynamicParams = false;

function resolveExample(rawSlug: string) {
  const { modifier, baseSlug } = parseSlug(rawSlug);
  if (modifier) {
    if (!isValidModifierSlug(rawSlug)) return null;
    const base = getCoverLetterExampleBySlug(baseSlug);
    if (!base) return null;
    return applyModifier(base, modifier);
  }
  return getCoverLetterExampleBySlug(rawSlug) || null;
}

export function generateStaticParams() {
  return getAllSlugsForSitemap(COVER_LETTER_EXAMPLES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const example = resolveExample(params.slug);
  if (!example) {
    return { title: 'Cover Letter Example Not Found', robots: { index: false, follow: false } };
  }

  const path = `/cover-letter-examples/${example.slug}`;
  return {
    title: example.meta.title,
    description: example.meta.description,
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      title: example.meta.title,
      description: example.meta.description,
      url: path,
      siteName: 'CareerThings AI',
    },
    twitter: {
      card: 'summary_large_image',
      title: example.meta.title,
      description: example.meta.description,
    },
  };
}

const CURRENT_YEAR = new Date().getFullYear();

export default function CoverLetterExamplePage({
  params,
}: {
  params: { slug: string };
}) {
  const example = resolveExample(params.slug);
  if (!example) notFound();

  const siteUrl = getCanonicalSiteUrl();
  const path = `/cover-letter-examples/${example.slug}`;
  const url = `${siteUrl}${path}`;
  const { baseSlug } = parseSlug(example.slug);
  const related = getRelatedExamples(baseSlug);
  const headline = `${example.jobTitle} Cover Letter Example & Writing Guide for ${CURRENT_YEAR}`;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description: example.meta.description,
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
    articleSection: example.category,
    keywords: example.commonKeywords.join(', '),
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: example.faq.map((q) => ({
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
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Cover Letter Examples',
        item: `${siteUrl}/cover-letter-examples`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${example.jobTitle} Cover Letter`,
        item: url,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <nav aria-label="Breadcrumb" className="container mx-auto px-4 pt-8">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li><Link href="/" className="hover:text-orange-600">Home</Link></li>
          <li>/</li>
          <li><Link href="/cover-letter-examples" className="hover:text-orange-600">Cover Letter Examples</Link></li>
          <li>/</li>
          <li className="text-gray-900 font-medium">{example.jobTitle}</li>
        </ol>
      </nav>

      <article className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <header className="mb-10">
          <span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-800 mb-4">
            {example.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">
            {headline}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">{example.intro}</p>
        </header>

        <section className="mb-12">
          <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-100 rounded-2xl p-6 md:p-8 mb-6">
            <div className="flex items-center gap-2 mb-3 text-orange-700">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-bold uppercase tracking-wide">Tailor This in 30 Seconds</span>
            </div>
            <p className="text-gray-700 mb-4">
              Paste your job description and upload your resume — CareerThings AI will personalize this {example.jobTitle.toLowerCase()} cover letter to the specific role, with the right keywords and tone.
            </p>
            <Link href="/auth/register">
              <Button className="bg-gradient-to-r from-orange-600 to-orange-600 hover:from-orange-700 hover:to-orange-700 text-white">
                Generate My Cover Letter Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 flex items-center gap-2">
            <FileText className="h-7 w-7 text-orange-600" />
            {example.jobTitle} Cover Letter Sample
          </h2>
          <Card className="p-8 md:p-10 border border-gray-200 shadow-sm bg-white">
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700">{example.sampleLetter.greeting}</p>
              {example.sampleLetter.paragraphs.map((paragraph, i) => (
                <p key={i} className="text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
              <p className="text-gray-700">{example.sampleLetter.closing}</p>
              <p className="text-gray-700 font-medium">{example.sampleLetter.signature}</p>
            </div>
          </Card>
          <p className="text-sm text-gray-500 mt-3">
            <span className="font-medium">Note:</span> Replace <code className="bg-gray-100 px-1 rounded">{'{{Company}}'}</code> with the actual employer name and tailor the second paragraph to match the specific job description.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 flex items-center gap-2">
            <Target className="h-7 w-7 text-orange-600" />
            What Hiring Managers Look For
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Before you send your {example.jobTitle.toLowerCase()} cover letter, make sure it hits these signals — every line should earn its place.
          </p>
          <ul className="space-y-3">
            {example.hiringSignals.map((signal, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{signal}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
            ATS Keywords for {example.jobTitle} Cover Letters
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Most companies screen applications with an Applicant Tracking System (ATS). To pass the screen, mirror 5-8 of these keywords from the actual job description — exact matches matter.
          </p>
          <div className="flex flex-wrap gap-2">
            {example.commonKeywords.map((kw) => (
              <span
                key={kw}
                className="inline-block bg-orange-50 text-orange-800 border border-orange-200 rounded-full px-3 py-1 text-sm"
              >
                {kw}
              </span>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 flex items-center gap-2">
            <Lightbulb className="h-7 w-7 text-orange-600" />
            Pro Tips for {example.jobTitle} Cover Letters
          </h2>
          <ul className="space-y-3">
            {example.proTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-700 text-sm font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span className="text-gray-700 leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {example.faq.map((q, i) => (
              <Card key={i} className="p-6 border-gray-200">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">{q.question}</h3>
                <p className="text-gray-700 leading-relaxed">{q.answer}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12 bg-gradient-to-br from-orange-600 to-orange-700 text-white rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Land Your {example.jobTitle} Role?
          </h2>
          <p className="text-lg text-orange-50 mb-6 max-w-2xl mx-auto">
            CareerThings AI tailors this cover letter to the specific job in seconds. Paste the description, upload your resume, and get a polished, ATS-optimized letter ready to send.
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="bg-white text-orange-700 hover:bg-orange-50 px-8">
              <Sparkles className="mr-2 h-5 w-5" />
              Generate My Cover Letter Free
            </Button>
          </Link>
        </section>

        {related.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
              Related Cover Letter Examples
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {related.map((rel) => (
                <Link key={rel.slug} href={`/cover-letter-examples/${rel.slug}`}>
                  <Card className="p-6 border-gray-200 hover:border-orange-300 hover:shadow-md transition-all">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1 hover:text-orange-600 transition-colors">
                      {rel.jobTitle} Cover Letter
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{rel.shortDescription}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900">More Cover Letter Examples</h2>
          <div className="flex flex-wrap gap-2">
            {COVER_LETTER_EXAMPLES.filter((e) => e.slug !== example.slug).map((other) => (
              <Link
                key={other.slug}
                href={`/cover-letter-examples/${other.slug}`}
                className="inline-block bg-gray-50 hover:bg-orange-50 hover:text-orange-700 border border-gray-200 hover:border-orange-300 rounded-full px-3 py-1 text-sm text-gray-700 transition-colors"
              >
                {other.jobTitle}
              </Link>
            ))}
          </div>
        </section>

        <div className="border-t border-gray-200 pt-6">
          <Link
            href="/cover-letter-examples"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all cover letter examples
          </Link>
        </div>
      </article>
    </main>
  );
}
