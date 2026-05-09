import type { Metadata } from 'next';
import ContactUsPageClient from './ContactUsPageClient';
import { getCanonicalSiteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Contact Us — Get Help with CareerThings AI',
  description:
    'Get support from the CareerThings AI team. Email support@careerthings.co for help with cover letters, resumes, ATS scanning, billing, and account questions.',
  alternates: { canonical: '/contact-us' },
  openGraph: {
    type: 'website',
    title: 'Contact CareerThings AI',
    description: 'Get support from the CareerThings AI team — we reply within 24 business hours.',
    url: '/contact-us',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact CareerThings AI',
    description: 'Get support from the CareerThings AI team — we reply within 24 business hours.',
  },
};

export default function ContactUsPage() {
  const siteUrl = getCanonicalSiteUrl();

  const contactJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact CareerThings AI',
    url: `${siteUrl}/contact-us`,
    publisher: {
      '@type': 'Organization',
      name: 'CareerThings AI',
      url: siteUrl,
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: 'support@careerthings.co',
        availableLanguage: ['English'],
        hoursAvailable: 'Mo-Fr 09:00-17:00',
      },
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Contact Us', item: `${siteUrl}/contact-us` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ContactUsPageClient />
    </>
  );
}
