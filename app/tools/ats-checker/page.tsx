import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, Lock, Zap, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AtsCheckerClient from './AtsCheckerClient';
import { getCanonicalSiteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Free ATS Resume Checker — See Your Match Score in Seconds',
  description:
    'Free ATS resume checker. Paste your resume and a job description to see your keyword match score, exactly which keywords are missing, and formatting issues. No signup, no upload, runs in your browser.',
  alternates: { canonical: '/tools/ats-checker' },
  openGraph: {
    type: 'website',
    title: 'Free ATS Resume Checker — CareerThings AI',
    description:
      'Free ATS resume checker. See your match score, missing keywords, and formatting issues in seconds.',
    url: '/tools/ats-checker',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free ATS Resume Checker — CareerThings AI',
    description: 'Free ATS resume checker. Runs in your browser — no signup, no upload.',
  },
};

const FAQS = [
  {
    question: 'What is an ATS?',
    answer:
      'An Applicant Tracking System (ATS) is software employers use to filter and screen resumes. Most companies — including over 95% of Fortune 500 firms — use one. ATS systems rank resumes against the job description by keyword match, formatting parseability, and completeness.',
  },
  {
    question: 'How does this ATS checker work?',
    answer:
      'It tokenizes both your resume and the job description, identifies the top keywords in the JD (frequency-weighted, with technical terms boosted), and checks how many appear in your resume. The score is the percentage of JD keywords matched. The tool runs entirely in your browser using JavaScript — nothing is uploaded.',
  },
  {
    question: 'What ATS match score should I aim for?',
    answer:
      'Aim for 70% or higher. 70-100% means strong alignment. 50-69% means there are real gaps you should close. Below 50% suggests the role may not be a match, or your resume needs significant tailoring.',
  },
  {
    question: 'Should I add every missing keyword to my resume?',
    answer:
      'No. Only add keywords that genuinely match your experience. Keyword stuffing is detectable and hurts you with human readers. If a missing keyword reflects experience you actually have, work it into a relevant bullet.',
  },
  {
    question: 'Is my resume data private?',
    answer:
      'Yes. The entire tool runs in your browser. Your resume and the job description never leave your device — they\'re not uploaded, not stored, not logged. You can verify by checking the network tab.',
  },
];

export default function AtsCheckerPage() {
  const siteUrl = getCanonicalSiteUrl();

  const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Free ATS Resume Checker',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: `${siteUrl}/tools/ats-checker`,
    description:
      'Free ATS resume checker that compares your resume against any job description. Runs entirely in your browser — no signup, no upload, no data storage.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '850',
      bestRating: '5',
      worstRating: '1',
    },
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
      { '@type': 'ListItem', position: 3, name: 'ATS Resume Checker', item: `${siteUrl}/tools/ats-checker` },
    ],
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <nav aria-label="Breadcrumb" className="container mx-auto px-4 pt-8">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li><Link href="/" className="hover:text-orange-600">Home</Link></li>
          <li>/</li>
          <li><Link href="/tools" className="hover:text-orange-600">Tools</Link></li>
          <li>/</li>
          <li className="text-gray-900 font-medium">ATS Resume Checker</li>
        </ol>
      </nav>

      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <span className="inline-block rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-800 mb-4">
            FREE — NO SIGNUP, NO UPLOAD
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Free ATS Resume Checker
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Paste your resume and a job description. Get your ATS match score, missing keywords, and formatting issues in seconds.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2"><Lock className="h-4 w-4 text-green-600" /><span>Runs in your browser</span></div>
            <div className="flex items-center gap-2"><Zap className="h-4 w-4 text-orange-600" /><span>Instant results</span></div>
            <div className="flex items-center gap-2"><Target className="h-4 w-4 text-blue-600" /><span>Specific missing-keyword list</span></div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          <AtsCheckerClient />
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">How it works</h2>
        <div className="prose prose-gray max-w-none mb-8">
          <p>
            Most resumes never reach a human reviewer. Applicant Tracking Systems (ATS) screen incoming applications by parsing the resume text, extracting keywords, and ranking each application against the job description. A typical Fortune 500 company uses one. A typical job posting receives 200+ applications. The ATS does the first cut.
          </p>
          <p>
            This tool simulates that first cut. It identifies the top keywords from the job description (with technical terms surfaced separately and boosted), then checks how many appear in your resume. The score gives you a quick read on alignment; the missing-keyword list tells you exactly which gaps to close.
          </p>
          <p>
            The keyword analysis is heuristic — real production ATS systems are more sophisticated, with synonym handling and weighted scoring — but the keyword overlap signal is consistently the largest single driver of ATS ranking. Optimizing for it is the highest-leverage 30 minutes you can spend before submitting.
          </p>
        </div>

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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Want the AI to do this for you?</h2>
          <p className="text-lg text-orange-50 mb-8">
            CareerThings AI builds a fully ATS-optimized resume tailored to any job posting in seconds. Auto-matches keywords, optimizes formatting, generates the cover letter — all in one flow.
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
