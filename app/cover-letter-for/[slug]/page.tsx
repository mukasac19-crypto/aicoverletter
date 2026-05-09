import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, CheckCircle2, Sparkles, FileText, Target, Lightbulb, Building2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  COMPANY_COVER_LETTERS,
  getCompanyCoverLetterBySlug,
  getCompanyCoverLetterSlugs,
  getRelatedCompanies,
} from '@/lib/company-cover-letters-data';
import { getCanonicalSiteUrl } from '@/lib/seo';

export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  return getCompanyCoverLetterSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const company = getCompanyCoverLetterBySlug(params.slug);
  if (!company) {
    return { title: 'Not Found', robots: { index: false, follow: false } };
  }

  const path = `/cover-letter-for/${company.slug}`;
  return {
    title: company.meta.title,
    description: company.meta.description,
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      title: company.meta.title,
      description: company.meta.description,
      url: path,
      siteName: 'CareerThings AI',
    },
    twitter: {
      card: 'summary_large_image',
      title: company.meta.title,
      description: company.meta.description,
    },
  };
}

const CURRENT_YEAR = new Date().getFullYear();

export default function CompanyCoverLetterPage({
  params,
}: {
  params: { slug: string };
}) {
  const company = getCompanyCoverLetterBySlug(params.slug);
  if (!company) notFound();

  const siteUrl = getCanonicalSiteUrl();
  const path = `/cover-letter-for/${company.slug}`;
  const url = `${siteUrl}${path}`;
  const related = getRelatedCompanies(company.slug);
  const headline = `Cover Letter for ${company.companyName} — Example & Writing Guide for ${CURRENT_YEAR}`;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description: company.meta.description,
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
    keywords: company.valueKeywords.join(', '),
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: company.faq.map((q) => ({
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
      { '@type': 'ListItem', position: 2, name: 'Company Cover Letters', item: `${siteUrl}/cover-letter-for` },
      { '@type': 'ListItem', position: 3, name: `Cover Letter for ${company.companyName}`, item: url },
    ],
  };

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <nav aria-label="Breadcrumb" className="container mx-auto px-4 pt-8">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li><Link href="/" className="hover:text-purple-600">Home</Link></li>
          <li>/</li>
          <li><Link href="/cover-letter-for" className="hover:text-purple-600">Company Cover Letters</Link></li>
          <li>/</li>
          <li className="text-gray-900 font-medium">{company.companyName}</li>
        </ol>
      </nav>

      <article className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="h-5 w-5 text-purple-600" />
            <span className="text-xs font-semibold text-purple-800 uppercase tracking-wide">
              {company.industry}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">{headline}</h1>
          <p className="text-xl text-gray-600 leading-relaxed">{company.intro}</p>
        </header>

        <section className="mb-12">
          <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-100 rounded-2xl p-6 md:p-8 mb-6">
            <div className="flex items-center gap-2 mb-3 text-orange-700">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-bold uppercase tracking-wide">Tailor This for Your Specific Role</span>
            </div>
            <p className="text-gray-700 mb-4">
              Paste the {company.companyName} job description and upload your resume — CareerThings AI will tailor this letter to the specific role with the right culture-fit signals.
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
            <FileText className="h-7 w-7 text-purple-600" />
            Sample Cover Letter for {company.companyName}
          </h2>
          <Card className="p-8 md:p-10 border border-gray-200 shadow-sm bg-white">
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700">{company.sampleLetter.greeting}</p>
              {company.sampleLetter.paragraphs.map((paragraph, i) => (
                <p key={i} className="text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
              <p className="text-gray-700">{company.sampleLetter.closing}</p>
              <p className="text-gray-700 font-medium">{company.sampleLetter.signature}</p>
            </div>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 flex items-center gap-2">
            <Target className="h-7 w-7 text-purple-600" />
            What {company.companyName} Hiring Panels Look For
          </h2>
          <ul className="space-y-3">
            {company.cultureSignals.map((signal, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{signal}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
            Keywords & Values for {company.companyName}
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            These are the cultural and technical keywords {company.companyName} hiring panels screen for. Mirror the ones that match your background.
          </p>
          <div className="flex flex-wrap gap-2">
            {company.valueKeywords.map((kw) => (
              <span key={kw} className="inline-block bg-purple-50 text-purple-800 border border-purple-200 rounded-full px-3 py-1 text-sm">
                {kw}
              </span>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 flex items-center gap-2">
            <Lightbulb className="h-7 w-7 text-purple-600" />
            Tips for Applying to {company.companyName}
          </h2>
          <ul className="space-y-3">
            {company.applicationTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-sm font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span className="text-gray-700 leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
            Frequently Asked Questions about {company.companyName} Cover Letters
          </h2>
          <div className="space-y-4">
            {company.faq.map((q, i) => (
              <Card key={i} className="p-6 border-gray-200">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">{q.question}</h3>
                <p className="text-gray-700 leading-relaxed">{q.answer}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12 bg-gradient-to-br from-orange-600 to-orange-700 text-white rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Apply to {company.companyName}?</h2>
          <p className="text-lg text-orange-50 mb-6 max-w-2xl mx-auto">
            CareerThings AI tailors this cover letter to your specific {company.companyName} role in seconds — with the right culture signals, keywords, and tone.
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
              Cover Letters for Similar Companies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {related.map((rel) => (
                <Link key={rel.slug} href={`/cover-letter-for/${rel.slug}`}>
                  <Card className="p-6 border-gray-200 hover:border-purple-300 hover:shadow-md transition-all">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1 hover:text-purple-600 transition-colors">
                      Cover Letter for {rel.companyName}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{rel.shortDescription}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900">More Company Cover Letters</h2>
          <div className="flex flex-wrap gap-2">
            {COMPANY_COVER_LETTERS.filter((c) => c.slug !== company.slug).map((other) => (
              <Link
                key={other.slug}
                href={`/cover-letter-for/${other.slug}`}
                className="inline-block bg-gray-50 hover:bg-purple-50 hover:text-purple-700 border border-gray-200 hover:border-purple-300 rounded-full px-3 py-1 text-sm text-gray-700 transition-colors"
              >
                {other.companyName}
              </Link>
            ))}
          </div>
        </section>

        <div className="border-t border-gray-200 pt-6">
          <Link href="/cover-letter-for" className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to all company cover letters
          </Link>
        </div>
      </article>
    </main>
  );
}
