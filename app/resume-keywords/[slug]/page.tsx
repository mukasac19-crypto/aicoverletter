import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles, Tag, Lightbulb, Target, Users, ScanSearch } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  RESUME_KEYWORDS,
  getResumeKeywordsBySlug,
  getResumeKeywordsSlugs,
  getRelatedResumeKeywords,
} from '@/lib/resume-keywords-data';
import { getCanonicalSiteUrl } from '@/lib/seo';

export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  return getResumeKeywordsSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const entry = getResumeKeywordsBySlug(params.slug);
  if (!entry) return { title: 'Not Found', robots: { index: false, follow: false } };
  const path = `/resume-keywords/${entry.slug}`;
  return {
    title: entry.meta.title,
    description: entry.meta.description,
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      title: entry.meta.title,
      description: entry.meta.description,
      url: path,
      siteName: 'CareerThings AI',
    },
    twitter: {
      card: 'summary_large_image',
      title: entry.meta.title,
      description: entry.meta.description,
    },
  };
}

const CURRENT_YEAR = new Date().getFullYear();

export default function ResumeKeywordsPage({
  params,
}: {
  params: { slug: string };
}) {
  const entry = getResumeKeywordsBySlug(params.slug);
  if (!entry) notFound();

  const siteUrl = getCanonicalSiteUrl();
  const path = `/resume-keywords/${entry.slug}`;
  const url = `${siteUrl}${path}`;
  const related = getRelatedResumeKeywords(entry.slug);
  const headline = `${entry.jobTitle} Resume Keywords (${CURRENT_YEAR} ATS Guide)`;

  const allKeywords = entry.groups.flatMap((g) => g.keywords);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description: entry.meta.description,
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
    keywords: allKeywords.slice(0, 25).join(', '),
    articleSection: entry.category,
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entry.faq.map((q) => ({
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
      { '@type': 'ListItem', position: 2, name: 'Resume Keywords', item: `${siteUrl}/resume-keywords` },
      { '@type': 'ListItem', position: 3, name: `${entry.jobTitle} Resume Keywords`, item: url },
    ],
  };

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <nav aria-label="Breadcrumb" className="container mx-auto px-4 pt-8">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li><Link href="/" className="hover:text-cyan-600">Home</Link></li>
          <li>/</li>
          <li><Link href="/resume-keywords" className="hover:text-cyan-600">Resume Keywords</Link></li>
          <li>/</li>
          <li className="text-gray-900 font-medium">{entry.jobTitle}</li>
        </ol>
      </nav>

      <article className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <header className="mb-10">
          <span className="inline-block rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-800 mb-4">
            {entry.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">{headline}</h1>
          <p className="text-xl text-gray-600 leading-relaxed">{entry.intro}</p>
        </header>

        <section className="mb-12">
          <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-100 rounded-2xl p-6 md:p-8 mb-6">
            <div className="flex items-center gap-2 mb-3 text-orange-700">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-bold uppercase tracking-wide">Tailor a resume around these keywords</span>
            </div>
            <p className="text-gray-700 mb-4">
              Paste the actual job description and your resume — CareerThings AI mirrors the right keywords (only the ones that match your real experience), distributes them naturally, and ships an ATS-optimized resume.
            </p>
            <Link href="/auth/register">
              <Button className="bg-gradient-to-r from-orange-600 to-orange-600 hover:from-orange-700 hover:to-orange-700 text-white">
                Build My Resume Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {entry.groups.map((group, i) => (
          <section key={i} className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900 flex items-center gap-2">
              <Tag className="h-6 w-6 text-cyan-600" />
              {group.category}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">{group.description}</p>
            <div className="flex flex-wrap gap-2">
              {group.keywords.map((kw) => (
                <span key={kw} className="inline-block bg-cyan-50 text-cyan-900 border border-cyan-200 rounded-full px-3 py-1 text-sm">
                  {kw}
                </span>
              ))}
            </div>
          </section>
        ))}

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 flex items-center gap-2">
            <Target className="h-7 w-7 text-cyan-600" />
            Action Verbs for {entry.jobTitle} Resumes
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Lead every bullet with one of these verbs. They land harder than passive constructions and make outcomes feel earned.
          </p>
          <div className="flex flex-wrap gap-2">
            {entry.actionVerbs.map((v) => (
              <span key={v} className="inline-block bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-full px-3 py-1 text-sm font-medium">
                {v}
              </span>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 flex items-center gap-2">
            <Users className="h-7 w-7 text-cyan-600" />
            Soft Skills That Matter
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Soft skills are real signals — but list them only when you can back them with a specific bullet elsewhere on the resume.
          </p>
          <div className="flex flex-wrap gap-2">
            {entry.softSkills.map((s) => (
              <span key={s} className="inline-block bg-purple-50 text-purple-900 border border-purple-200 rounded-full px-3 py-1 text-sm">
                {s}
              </span>
            ))}
          </div>
        </section>

        {entry.certifications && entry.certifications.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">Certifications to Consider</h2>
            <ul className="space-y-2">
              {entry.certifications.map((c) => (
                <li key={c} className="flex items-start gap-3 text-gray-700">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 flex items-center gap-2">
            <Lightbulb className="h-7 w-7 text-cyan-600" />
            How to Use These Keywords on Your Resume
          </h2>
          <ul className="space-y-3">
            {entry.howToUse.map((tip, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 text-sm font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span className="text-gray-700 leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <Card className="p-6 bg-blue-50 border-blue-200">
            <div className="flex items-center gap-2 mb-2 text-blue-900">
              <ScanSearch className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold">Test your match score</h3>
            </div>
            <p className="text-blue-900 text-sm leading-relaxed mb-3">
              Use our free ATS Resume Checker to see how many of these keywords already appear in your resume against any specific job description.
            </p>
            <Link href="/tools/ats-checker">
              <Button variant="outline" size="sm" className="border-blue-300 text-blue-900 hover:bg-blue-100">
                Open the Free ATS Checker
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {entry.faq.map((q, i) => (
              <Card key={i} className="p-6 border-gray-200">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">{q.question}</h3>
                <p className="text-gray-700 leading-relaxed">{q.answer}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12 bg-gradient-to-br from-orange-600 to-orange-700 text-white rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Apply these keywords to a real job posting.</h2>
          <p className="text-lg text-orange-50 mb-6 max-w-2xl mx-auto">
            CareerThings AI matches the keywords from any specific JD to your real experience, then writes a tailored, ATS-optimized resume around them.
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
            <Link href={`/resume-examples/${entry.slug}`}>
              <Card className="p-6 border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                <h3 className="font-semibold text-lg text-gray-900 mb-1 hover:text-blue-600 transition-colors">
                  {entry.jobTitle} Resume Example
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">See an ATS-friendly resume that uses these keywords in context.</p>
              </Card>
            </Link>
            <Link href={`/cover-letter-examples/${entry.slug}`}>
              <Card className="p-6 border-gray-200 hover:border-orange-300 hover:shadow-md transition-all">
                <h3 className="font-semibold text-lg text-gray-900 mb-1 hover:text-orange-600 transition-colors">
                  {entry.jobTitle} Cover Letter Example
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">Pair these keywords with a tailored cover letter for the same role.</p>
              </Card>
            </Link>
            {related.map((rel) => (
              <Link key={rel.slug} href={`/resume-keywords/${rel.slug}`}>
                <Card className="p-6 border-gray-200 hover:border-cyan-300 hover:shadow-md transition-all">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1 hover:text-cyan-600 transition-colors">
                    {rel.jobTitle} Resume Keywords
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{rel.shortDescription}</p>
                </Card>
              </Link>
            ))}
          </div>

          <h3 className="text-xl font-bold mb-3 text-gray-900">More Keyword Guides</h3>
          <div className="flex flex-wrap gap-2">
            {RESUME_KEYWORDS.filter((e) => e.slug !== entry.slug).map((other) => (
              <Link
                key={other.slug}
                href={`/resume-keywords/${other.slug}`}
                className="inline-block bg-gray-50 hover:bg-cyan-50 hover:text-cyan-700 border border-gray-200 hover:border-cyan-300 rounded-full px-3 py-1 text-sm text-gray-700 transition-colors"
              >
                {other.jobTitle}
              </Link>
            ))}
          </div>
        </section>

        <div className="border-t border-gray-200 pt-6">
          <Link href="/resume-keywords" className="inline-flex items-center gap-2 text-gray-500 hover:text-cyan-600 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to all keyword guides
          </Link>
        </div>
      </article>
    </main>
  );
}
