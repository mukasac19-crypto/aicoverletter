import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, CheckCircle2, Sparkles, Target, Lightbulb, FileSpreadsheet, Mail, Phone, MapPin, Linkedin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  RESUME_EXAMPLES,
  applyResumeModifier,
  getResumeExampleBySlug,
  getRelatedResumeExamples,
} from '@/lib/resume-examples-data';
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
    const base = getResumeExampleBySlug(baseSlug);
    if (!base) return null;
    return applyResumeModifier(base, modifier);
  }
  return getResumeExampleBySlug(rawSlug) || null;
}

export function generateStaticParams() {
  return getAllSlugsForSitemap(RESUME_EXAMPLES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const example = resolveExample(params.slug);
  if (!example) {
    return { title: 'Resume Example Not Found', robots: { index: false, follow: false } };
  }

  const path = `/resume-examples/${example.slug}`;
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

export default function ResumeExamplePage({
  params,
}: {
  params: { slug: string };
}) {
  const example = resolveExample(params.slug);
  if (!example) notFound();

  const siteUrl = getCanonicalSiteUrl();
  const path = `/resume-examples/${example.slug}`;
  const url = `${siteUrl}${path}`;
  const { baseSlug } = parseSlug(example.slug);
  const related = getRelatedResumeExamples(baseSlug);
  const headline = `${example.jobTitle} Resume Example & Writing Guide for ${CURRENT_YEAR}`;

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
    keywords: example.atsKeywords.join(', '),
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
      { '@type': 'ListItem', position: 2, name: 'Resume Examples', item: `${siteUrl}/resume-examples` },
      { '@type': 'ListItem', position: 3, name: `${example.jobTitle} Resume`, item: url },
    ],
  };

  const sample = example.sample;

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <nav aria-label="Breadcrumb" className="container mx-auto px-4 pt-8">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
          <li>/</li>
          <li><Link href="/resume-examples" className="hover:text-blue-600">Resume Examples</Link></li>
          <li>/</li>
          <li className="text-gray-900 font-medium">{example.jobTitle}</li>
        </ol>
      </nav>

      <article className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <header className="mb-10">
          <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 mb-4">
            {example.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">{headline}</h1>
          <p className="text-xl text-gray-600 leading-relaxed">{example.intro}</p>
        </header>

        <section className="mb-12">
          <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-100 rounded-2xl p-6 md:p-8 mb-6">
            <div className="flex items-center gap-2 mb-3 text-orange-700">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-bold uppercase tracking-wide">Build & Tailor Yours in Minutes</span>
            </div>
            <p className="text-gray-700 mb-4">
              Upload your existing resume or build from scratch — CareerThings AI will tailor an ATS-optimized {example.jobTitle.toLowerCase()} resume to any specific job posting.
            </p>
            <Link href="/auth/register">
              <Button className="bg-gradient-to-r from-orange-600 to-orange-600 hover:from-orange-700 hover:to-orange-700 text-white">
                Build My Resume Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 flex items-center gap-2">
            <FileSpreadsheet className="h-7 w-7 text-blue-600" />
            {example.jobTitle} Resume Sample
          </h2>
          <Card className="p-8 md:p-10 border border-gray-200 shadow-sm bg-white">
            <header className="border-b border-gray-200 pb-5 mb-6">
              <h3 className="text-3xl font-bold text-gray-900">{sample.name}</h3>
              <p className="text-lg text-gray-700 mt-1">{sample.title}</p>
              <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-600 mt-3">
                <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{sample.contact.email}</span>
                <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{sample.contact.phone}</span>
                <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{sample.contact.location}</span>
                <span className="flex items-center gap-1.5"><Linkedin className="h-3.5 w-3.5" />{sample.contact.linkedIn}</span>
              </div>
            </header>

            <section className="mb-6">
              <h4 className="text-sm font-bold uppercase tracking-wide text-gray-700 mb-2">Summary</h4>
              <p className="text-gray-700 leading-relaxed">{sample.summary}</p>
            </section>

            <section className="mb-6">
              <h4 className="text-sm font-bold uppercase tracking-wide text-gray-700 mb-2">Skills</h4>
              <dl className="space-y-1.5">
                {sample.skills.map((sk, i) => (
                  <div key={i} className="text-sm">
                    <dt className="inline font-semibold text-gray-900">{sk.category}: </dt>
                    <dd className="inline text-gray-700">{sk.items.join(', ')}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="mb-6">
              <h4 className="text-sm font-bold uppercase tracking-wide text-gray-700 mb-3">Experience</h4>
              <div className="space-y-5">
                {sample.experience.map((exp, i) => (
                  <div key={i}>
                    <div className="flex flex-wrap justify-between items-baseline gap-x-4">
                      <h5 className="font-bold text-gray-900">{exp.title}</h5>
                      <span className="text-sm text-gray-600">{exp.dates}</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      {exp.company} — {exp.location}
                    </p>
                    <ul className="mt-2 space-y-1 list-disc pl-5 text-gray-700 text-sm">
                      {exp.bullets.map((b, j) => (
                        <li key={j}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-6">
              <h4 className="text-sm font-bold uppercase tracking-wide text-gray-700 mb-2">Education</h4>
              {sample.education.map((ed, i) => (
                <p key={i} className="text-sm text-gray-700">
                  <span className="font-semibold">{ed.degree}</span> — {ed.school} ({ed.graduated})
                </p>
              ))}
            </section>

            {sample.certifications && sample.certifications.length > 0 && (
              <section>
                <h4 className="text-sm font-bold uppercase tracking-wide text-gray-700 mb-2">
                  Certifications
                </h4>
                <ul className="text-sm text-gray-700 list-disc pl-5">
                  {sample.certifications.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </section>
            )}
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 flex items-center gap-2">
            <Target className="h-7 w-7 text-blue-600" />
            What Recruiters Look For
          </h2>
          <ul className="space-y-3">
            {example.recruiterSignals.map((signal, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{signal}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
            ATS Keywords for {example.jobTitle} Resumes
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            ATS systems screen resumes by keyword match. Mirror 8-10 of these terms verbatim from the actual job description for the best match rate.
          </p>
          <div className="flex flex-wrap gap-2">
            {example.atsKeywords.map((kw) => (
              <span key={kw} className="inline-block bg-blue-50 text-blue-800 border border-blue-200 rounded-full px-3 py-1 text-sm">
                {kw}
              </span>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 flex items-center gap-2">
            <Lightbulb className="h-7 w-7 text-blue-600" />
            Pro Tips for {example.jobTitle} Resumes
          </h2>
          <ul className="space-y-3">
            {example.proTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-sm font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span className="text-gray-700 leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </section>

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
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Land Your {example.jobTitle} Role?</h2>
          <p className="text-lg text-orange-50 mb-6 max-w-2xl mx-auto">
            CareerThings AI builds an ATS-optimized {example.jobTitle.toLowerCase()} resume tailored to any specific job posting in minutes.
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="bg-white text-orange-700 hover:bg-orange-50 px-8">
              <Sparkles className="mr-2 h-5 w-5" />
              Build My Resume Free
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
                  Pair this resume with a tailored cover letter for the same role.
                </p>
              </Card>
            </Link>
            {related.map((rel) => (
              <Link key={rel.slug} href={`/resume-examples/${rel.slug}`}>
                <Card className="p-6 border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1 hover:text-blue-600 transition-colors">
                    {rel.jobTitle} Resume
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{rel.shortDescription}</p>
                </Card>
              </Link>
            ))}
          </div>

          <h3 className="text-xl font-bold mb-3 text-gray-900">More Resume Examples</h3>
          <div className="flex flex-wrap gap-2">
            {RESUME_EXAMPLES.filter((e) => e.slug !== example.slug).map((other) => (
              <Link
                key={other.slug}
                href={`/resume-examples/${other.slug}`}
                className="inline-block bg-gray-50 hover:bg-blue-50 hover:text-blue-700 border border-gray-200 hover:border-blue-300 rounded-full px-3 py-1 text-sm text-gray-700 transition-colors"
              >
                {other.jobTitle}
              </Link>
            ))}
          </div>
        </section>

        <div className="border-t border-gray-200 pt-6">
          <Link href="/resume-examples" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to all resume examples
          </Link>
        </div>
      </article>
    </main>
  );
}
