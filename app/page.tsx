import type { Metadata } from 'next';
import HomePageClient from './HomePageClient';
import { homeFaqs } from '@/lib/home-content';
import { getCanonicalSiteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title:
    'CareerThings AI — AI Cover Letters, Resumes & ATS Tools to Land Your Dream Job',
  description:
    'CareerThings AI generates tailored cover letters, ATS-optimized resumes, and interview prep in seconds. Trusted by 100,000+ professionals at Google, Tesla, Meta and more. Free forever plan available.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    title: 'CareerThings AI — Land Your Dream Job with AI',
    description:
      'AI-powered cover letters, ATS-optimized resumes, and interview prep. Trusted by 100,000+ professionals.',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CareerThings AI — Land Your Dream Job with AI',
    description:
      'AI-powered cover letters, ATS-optimized resumes, and interview prep. Trusted by 100,000+ professionals.',
  },
};

export default function HomePage() {
  const siteUrl = getCanonicalSiteUrl();

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: homeFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'CareerThings AI',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: siteUrl,
    description:
      'AI-powered cover letters, ATS-optimized resumes, interview prep, and job tracking — all in one platform.',
    offers: [
      {
        '@type': 'Offer',
        name: 'Free',
        price: '0',
        priceCurrency: 'USD',
      },
      {
        '@type': 'Offer',
        name: 'Professional',
        price: '20',
        priceCurrency: 'USD',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '20',
          priceCurrency: 'USD',
          unitCode: 'MON',
        },
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '10000',
      bestRating: '5',
      worstRating: '1',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <HomePageClient />
    </>
  );
}
