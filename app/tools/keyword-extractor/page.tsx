import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, Lock, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import KeywordExtractorClient from './KeywordExtractorClient';
import { getCanonicalSiteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Free Job Description Keyword Extractor — See What ATS Systems Look For',
  description:
    'Free job description keyword extractor. Paste any JD to instantly see the top keywords, with technical terms surfaced separately. No signup, no upload, runs in your browser.',
  alternates: { canonical: '/tools/keyword-extractor' },
  openGraph: {
    type: 'website',
    title: 'Free Job Description Keyword Extractor — CareerThings AI',
    description:
      'Free keyword extractor. Paste any job description to instantly see the top keywords ATS systems look for.',
    url: '/tools/keyword-extractor',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Job Description Keyword Extractor — CareerThings AI',
    description: 'Free keyword extractor. Runs in your browser — no signup, no upload.',
  },
};

const FAQS = [
  {
    question: 'Why extract keywords from a job description?',
    answer:
      'ATS systems rank resumes by keyword overlap with the job description. Identifying the top JD keywords — and mirroring the relevant ones in your resume and cover letter — is the highest-leverage way to improve your application\'s ranking.',
  },
  {
    question: 'How does this extractor work?',
    answer:
      'It tokenizes the job description, removes common stopwords, computes term frequency, and surfaces technical/domain terms separately (those terms are weighted because ATS does exact matching on them). All processing runs in your browser — nothing is uploaded.',
  },
  {
    question: 'Should I include every keyword in my resume?',
    answer:
      'No. Only mirror keywords that genuinely match your experience. Keyword stuffing is detectable by both ATS and human reviewers. The right approach: identify keywords that match your background, then weave them naturally into your bullets.',
  },
  {
    question: 'How is this different from the ATS resume checker?',
    answer:
      'The keyword extractor pulls the top terms from a JD only. The ATS resume checker compares your resume against a JD and tells you which keywords are matched and which are missing. Use the extractor early in your application process; use the ATS checker before submitting.',
  },
];

export default function KeywordExtractorPage() {
  const siteUrl = getCanonicalSiteUrl();

  const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Free Job Description Keyword Extractor',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: `${siteUrl}/tools/keyword-extractor`,
    description:
      'Free tool to extract the top keywords from any job description. Surfaces technical and domain terms separately. Runs entirely in your browser.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((q) => ({
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
      { '@type': 'ListItem', position: 2, name: 'Tools', item: `${siteUrl}/tools` },
      { '@type': 'ListItem', position: 3, name: 'Keyword Extractor', item: `${siteUrl}/tools/keyword-extractor` },
    ],
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <nav aria-label="Breadcrumb" className="container mx-auto px-4 pt-8">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
          <li>/</li>
          <li><Link href="/tools" className="hover:text-blue-600">Tools</Link></li>
          <li>/</li>
          <li className="text-gray-900 font-medium">Keyword Extractor</li>
        </ol>
      </nav>

      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <span className="inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-800 mb-4">
            FREE — NO SIGNUP, NO UPLOAD
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Free Job Description Keyword Extractor
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Paste any job description. Instantly see the top keywords ATS systems look for, with technical terms surfaced separately.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2"><Lock className="h-4 w-4 text-green-600" /><span>Runs in your browser</span></div>
            <div className="flex items-center gap-2"><Zap className="h-4 w-4 text-orange-600" /><span>Instant results</span></div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <KeywordExtractorClient />
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {FAQS.map((q, i) => (
            <Card key={i} className="p-6 border-gray-200">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">{q.question}</h3>
              <p className="text-gray-700 leading-relaxed">{q.answer}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-orange-600 to-orange-700 text-white py-16">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Skip the manual work.</h2>
          <p className="text-lg text-orange-50 mb-8">
            CareerThings AI extracts JD keywords, tailors your resume around them, writes a custom cover letter, and runs an ATS check — all in one flow.
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
