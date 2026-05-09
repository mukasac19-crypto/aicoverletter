import type { Metadata } from 'next';
import FeaturesPageClient from './FeaturesPageClient';
import { getCanonicalSiteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Features — AI Cover Letters, Resume Builder, ATS Scanner & Interview Prep',
  description:
    'Explore every CareerThings AI feature: AI cover letter generator, ATS-optimized resume builder, ATS scanner, interview prep, smart job search, and follow-up email generator.',
  alternates: { canonical: '/features' },
  openGraph: {
    type: 'website',
    title: 'CareerThings AI Features — AI-Powered Job Application Tools',
    description:
      'AI cover letter generator, ATS-optimized resume builder, ATS scanner, interview prep, and more.',
    url: '/features',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CareerThings AI Features',
    description:
      'AI cover letter generator, ATS-optimized resume builder, ATS scanner, interview prep, and more.',
  },
};

export default function FeaturesPage() {
  const siteUrl = getCanonicalSiteUrl();

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Features', item: `${siteUrl}/features` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <FeaturesPageClient />
    </>
  );
}
