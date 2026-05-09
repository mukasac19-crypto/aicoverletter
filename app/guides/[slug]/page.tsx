import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Sparkles, BookOpen, Clock, Lightbulb, AlertTriangle, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  GUIDES,
  getGuideBySlug,
  getGuideSlugs,
  getRelatedGuides,
} from '@/lib/guides-data';
import { getCanonicalSiteUrl } from '@/lib/seo';

export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  return getGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const guide = getGuideBySlug(params.slug);
  if (!guide) {
    return { title: 'Guide Not Found', robots: { index: false, follow: false } };
  }
  const path = `/guides/${guide.slug}`;
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

const calloutStyles = {
  tip: { bg: 'bg-emerald-50 border-emerald-200', icon: Lightbulb, iconColor: 'text-emerald-600', titleColor: 'text-emerald-900' },
  warning: { bg: 'bg-amber-50 border-amber-200', icon: AlertTriangle, iconColor: 'text-amber-600', titleColor: 'text-amber-900' },
  example: { bg: 'bg-blue-50 border-blue-200', icon: FileText, iconColor: 'text-blue-600', titleColor: 'text-blue-900' },
} as const;

export default function GuidePage({ params }: { params: { slug: string } }) {
  const guide = getGuideBySlug(params.slug);
  if (!guide) notFound();

  const siteUrl = getCanonicalSiteUrl();
  const path = `/guides/${guide.slug}`;
  const url = `${siteUrl}${path}`;
  const related = getRelatedGuides(guide.slug);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
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
    articleSection: guide.category,
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
      { '@type': 'ListItem', position: 2, name: 'Guides', item: `${siteUrl}/guides` },
      { '@type': 'ListItem', position: 3, name: guide.title, item: url },
    ],
  };

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <nav aria-label="Breadcrumb" className="container mx-auto px-4 pt-8">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li><Link href="/" className="hover:text-emerald-600">Home</Link></li>
          <li>/</li>
          <li><Link href="/guides" className="hover:text-emerald-600">Guides</Link></li>
          <li>/</li>
          <li className="text-gray-900 font-medium truncate">{guide.title}</li>
        </ol>
      </nav>

      <article className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4 text-sm">
            <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
              {guide.category}
            </span>
            <span className="text-gray-500 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {guide.estimatedReadTime}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">{guide.title}</h1>
          <p className="text-xl text-gray-600 leading-relaxed">{guide.intro}</p>
        </header>

        <aside className="mb-12 p-6 bg-gray-50 border border-gray-200 rounded-xl">
          <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            What&apos;s in this guide
          </h2>
          <ol className="space-y-1.5">
            {guide.sections.map((section, i) => (
              <li key={section.id} className="text-sm">
                <a href={`#${section.id}`} className="text-gray-700 hover:text-emerald-600 transition-colors">
                  {i + 1}. {section.heading}
                </a>
              </li>
            ))}
            <li className="text-sm">
              <a href="#faq" className="text-gray-700 hover:text-emerald-600 transition-colors">
                {guide.sections.length + 1}. Frequently Asked Questions
              </a>
            </li>
          </ol>
        </aside>

        {guide.sections.map((section) => {
          const callout = section.callout;
          const Style = callout ? calloutStyles[callout.kind] : null;
          const CalloutIcon = Style?.icon;
          return (
            <section key={section.id} id={section.id} className="mb-10 scroll-mt-20">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">{section.heading}</h2>
              {section.paragraphs.map((p, i) => (
                <p key={i} className="text-gray-700 leading-relaxed mb-4">
                  {p}
                </p>
              ))}
              {section.bullets && (
                <ul className="space-y-2 mb-4">
                  {section.bullets.title && (
                    <p className="font-semibold text-gray-800 mb-2">{section.bullets.title}</p>
                  )}
                  {section.bullets.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700">
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2.5" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {callout && Style && CalloutIcon && (
                <div className={`my-6 p-5 ${Style.bg} border rounded-xl`}>
                  <div className={`flex items-center gap-2 mb-2 ${Style.titleColor}`}>
                    <CalloutIcon className={`h-5 w-5 ${Style.iconColor}`} />
                    <span className="font-semibold">{callout.title}</span>
                  </div>
                  <p className={`text-sm leading-relaxed whitespace-pre-line ${Style.titleColor}`}>{callout.body}</p>
                </div>
              )}
            </section>
          );
        })}

        <section id="faq" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">Frequently Asked Questions</h2>
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
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Apply this guide automatically.</h2>
          <p className="text-lg text-orange-50 mb-6 max-w-2xl mx-auto">
            CareerThings AI builds cover letters and resumes that follow every principle in this guide — tailored to any specific job posting in seconds.
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="bg-white text-orange-700 hover:bg-orange-50 px-8">
              <Sparkles className="mr-2 h-5 w-5" />
              Try the AI Generator Free
            </Button>
          </Link>
        </section>

        {related.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">Related Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {related.map((rel) => (
                <Link key={rel.slug} href={`/guides/${rel.slug}`}>
                  <Card className="p-6 border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1 hover:text-emerald-600 transition-colors">
                      {rel.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{rel.intro}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mb-8">
          <h3 className="text-xl font-bold mb-3 text-gray-900">All Guides</h3>
          <div className="flex flex-wrap gap-2">
            {GUIDES.filter((g) => g.slug !== guide.slug).map((other) => (
              <Link
                key={other.slug}
                href={`/guides/${other.slug}`}
                className="inline-block bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 border border-gray-200 hover:border-emerald-300 rounded-full px-3 py-1 text-sm text-gray-700 transition-colors"
              >
                {other.title}
              </Link>
            ))}
          </div>
        </section>

        <div className="border-t border-gray-200 pt-6">
          <Link href="/guides" className="inline-flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to all guides
          </Link>
        </div>
      </article>
    </main>
  );
}
