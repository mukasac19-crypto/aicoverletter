import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles, Lightbulb, MessagesSquare, Target, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  INTERVIEW_QUESTIONS,
  applyInterviewModifier,
  getInterviewQuestionsBySlug,
  getRelatedInterviewQuestions,
} from '@/lib/interview-questions-data';
import {
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
    const base = getInterviewQuestionsBySlug(baseSlug);
    if (!base) return null;
    return applyInterviewModifier(base, modifier);
  }
  return getInterviewQuestionsBySlug(rawSlug) || null;
}

export function generateStaticParams() {
  return getAllSlugsForSitemap(INTERVIEW_QUESTIONS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const example = resolveExample(params.slug);
  if (!example) {
    return { title: 'Not Found', robots: { index: false, follow: false } };
  }
  const path = `/interview-questions/${example.slug}`;
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

const categoryLabels: Record<string, string> = {
  behavioral: 'Behavioral',
  technical: 'Technical',
  'role-specific': 'Role-Specific',
  situational: 'Situational',
  closing: 'Closing',
};

const categoryColors: Record<string, string> = {
  behavioral: 'bg-blue-50 text-blue-800 border-blue-200',
  technical: 'bg-purple-50 text-purple-800 border-purple-200',
  'role-specific': 'bg-emerald-50 text-emerald-800 border-emerald-200',
  situational: 'bg-amber-50 text-amber-800 border-amber-200',
  closing: 'bg-gray-50 text-gray-800 border-gray-200',
};

export default function InterviewQuestionsPage({
  params,
}: {
  params: { slug: string };
}) {
  const example = resolveExample(params.slug);
  if (!example) notFound();

  const siteUrl = getCanonicalSiteUrl();
  const path = `/interview-questions/${example.slug}`;
  const url = `${siteUrl}${path}`;
  const { baseSlug } = parseSlug(example.slug);
  const related = getRelatedInterviewQuestions(baseSlug);
  const headline = `${example.jobTitle} Interview Questions & Sample Answers (${CURRENT_YEAR})`;

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
  };

  // Use Question schema for first ~10 questions for rich results
  const qaJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      ...example.questions.slice(0, 10).map((q) => ({
        '@type': 'Question',
        name: q.question,
        acceptedAnswer: { '@type': 'Answer', text: q.howToAnswer },
      })),
      ...example.faq.map((q) => ({
        '@type': 'Question',
        name: q.question,
        acceptedAnswer: { '@type': 'Answer', text: q.answer },
      })),
    ],
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Interview Questions', item: `${siteUrl}/interview-questions` },
      { '@type': 'ListItem', position: 3, name: `${example.jobTitle} Interview Questions`, item: url },
    ],
  };

  // Group questions by category for rendering
  const grouped = example.questions.reduce<Record<string, typeof example.questions>>((acc, q) => {
    if (!acc[q.category]) acc[q.category] = [];
    acc[q.category].push(q);
    return acc;
  }, {});

  const categoryOrder = ['behavioral', 'technical', 'role-specific', 'situational', 'closing'];

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(qaJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <nav aria-label="Breadcrumb" className="container mx-auto px-4 pt-8">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li><Link href="/" className="hover:text-indigo-600">Home</Link></li>
          <li>/</li>
          <li><Link href="/interview-questions" className="hover:text-indigo-600">Interview Questions</Link></li>
          <li>/</li>
          <li className="text-gray-900 font-medium">{example.jobTitle}</li>
        </ol>
      </nav>

      <article className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <header className="mb-10">
          <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-800 mb-4">
            {example.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">{headline}</h1>
          <p className="text-xl text-gray-600 leading-relaxed">{example.intro}</p>
        </header>

        <section className="mb-12">
          <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-100 rounded-2xl p-6 md:p-8 mb-6">
            <div className="flex items-center gap-2 mb-3 text-orange-700">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-bold uppercase tracking-wide">Practice with AI Interview Buddy</span>
            </div>
            <p className="text-gray-700 mb-4">
              CareerThings AI generates role-specific questions, listens to your answers, and gives feedback on structure, content, and clarity. All tailored to your resume and target role.
            </p>
            <Link href="/auth/register">
              <Button className="bg-gradient-to-r from-orange-600 to-orange-600 hover:from-orange-700 hover:to-orange-700 text-white">
                Start Practicing Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 flex items-center gap-2">
            <Users className="h-7 w-7 text-indigo-600" />
            How {example.jobTitle} Interviews Are Structured
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">{example.hiringPanelStructure}</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 flex items-center gap-2">
            <Target className="h-7 w-7 text-indigo-600" />
            What Hiring Panels Screen For
          </h2>
          <ul className="space-y-3">
            {example.signalsScreened.map((signal, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{signal}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <Card className="p-6 bg-amber-50 border-amber-200">
            <div className="flex items-center gap-2 mb-2 text-amber-900">
              <Lightbulb className="h-5 w-5 text-amber-600" />
              <h3 className="font-semibold">The STAR Framework</h3>
            </div>
            <p className="text-amber-900 text-sm leading-relaxed">{example.starFrameworkNote}</p>
          </Card>
        </section>

        {categoryOrder.map((cat) => {
          const items = grouped[cat];
          if (!items || items.length === 0) return null;
          return (
            <section key={cat} className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                <MessagesSquare className="h-7 w-7 text-indigo-600" />
                {categoryLabels[cat]} Questions
                <span className="text-base font-medium text-gray-500">({items.length})</span>
              </h2>
              <div className="space-y-6">
                {items.map((q, i) => (
                  <Card key={i} className="p-6 md:p-8 border-gray-200">
                    <div className="flex items-start gap-3 mb-4">
                      <span className={`flex-shrink-0 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${categoryColors[q.category]}`}>
                        {categoryLabels[q.category]}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900">{q.question}</h3>

                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1">Why it&apos;s asked</p>
                      <p className="text-gray-700 leading-relaxed">{q.whyItsAsked}</p>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1">How to answer</p>
                      <p className="text-gray-700 leading-relaxed">{q.howToAnswer}</p>
                    </div>

                    {q.sampleAnswer && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">Sample answer</p>
                        <p className="text-gray-700 leading-relaxed italic">{q.sampleAnswer}</p>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </section>
          );
        })}

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">Frequently Asked Questions</h2>
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
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Practice your answers with AI feedback.</h2>
          <p className="text-lg text-orange-50 mb-6 max-w-2xl mx-auto">
            CareerThings AI Interview Buddy listens to your answers and gives feedback on structure, content, and clarity. Tailored to your resume and target role.
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="bg-white text-orange-700 hover:bg-orange-50 px-8">
              <Sparkles className="mr-2 h-5 w-5" />
              Try Interview Buddy Free
            </Button>
          </Link>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">Related Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Link href={`/cover-letter-examples/${example.slug}`}>
              <Card className="p-6 border-gray-200 hover:border-orange-300 hover:shadow-md transition-all">
                <h3 className="font-semibold text-lg text-gray-900 mb-1 hover:text-orange-600 transition-colors">
                  {example.jobTitle} Cover Letter Example
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Pair these answers with a tailored cover letter for the same role.
                </p>
              </Card>
            </Link>
            <Link href={`/resume-examples/${example.slug}`}>
              <Card className="p-6 border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                <h3 className="font-semibold text-lg text-gray-900 mb-1 hover:text-blue-600 transition-colors">
                  {example.jobTitle} Resume Example
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  See an ATS-friendly resume template for the same role.
                </p>
              </Card>
            </Link>
            {related.map((rel) => (
              <Link key={rel.slug} href={`/interview-questions/${rel.slug}`}>
                <Card className="p-6 border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1 hover:text-indigo-600 transition-colors">
                    {rel.jobTitle} Interview Questions
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{rel.shortDescription}</p>
                </Card>
              </Link>
            ))}
          </div>

          <h3 className="text-xl font-bold mb-3 text-gray-900">More Interview Question Guides</h3>
          <div className="flex flex-wrap gap-2">
            {INTERVIEW_QUESTIONS.filter((e) => e.slug !== example.slug).map((other) => (
              <Link
                key={other.slug}
                href={`/interview-questions/${other.slug}`}
                className="inline-block bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 border border-gray-200 hover:border-indigo-300 rounded-full px-3 py-1 text-sm text-gray-700 transition-colors"
              >
                {other.jobTitle}
              </Link>
            ))}
          </div>
        </section>

        <div className="border-t border-gray-200 pt-6">
          <Link href="/interview-questions" className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to all interview question guides
          </Link>
        </div>
      </article>
    </main>
  );
}
