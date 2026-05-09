import type { MetadataRoute } from 'next';
import { getServerClient } from '@/lib/supabase-server';
import { getCanonicalSiteUrl } from '@/lib/seo';
import { COVER_LETTER_EXAMPLES } from '@/lib/cover-letter-examples-data';
import { RESUME_EXAMPLES } from '@/lib/resume-examples-data';
import { COMPANY_COVER_LETTERS } from '@/lib/company-cover-letters-data';
import { GUIDES } from '@/lib/guides-data';
import { INTERVIEW_QUESTIONS } from '@/lib/interview-questions-data';
import { ATS_GUIDES } from '@/lib/ats-guides-data';
import { RESUME_KEYWORDS } from '@/lib/resume-keywords-data';
import { getAllSlugsForSitemap } from '@/lib/seniority-modifiers';

export const revalidate = 3600;

type SitemapEntry = MetadataRoute.Sitemap[number];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getCanonicalSiteUrl();
  const now = new Date();

  const staticRoutes: SitemapEntry[] = [
    { url: `${siteUrl}/`,                          lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${siteUrl}/features`,                  lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/pricing`,                   lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${siteUrl}/about-us`,                  lastModified: now, changeFrequency: 'yearly',  priority: 0.5 },
    { url: `${siteUrl}/contact-us`,                lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${siteUrl}/blog`,                      lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${siteUrl}/cover-letter-examples`,     lastModified: now, changeFrequency: 'weekly',  priority: 0.95 },
    { url: `${siteUrl}/resume-examples`,           lastModified: now, changeFrequency: 'weekly',  priority: 0.95 },
    { url: `${siteUrl}/cover-letter-for`,          lastModified: now, changeFrequency: 'weekly',  priority: 0.9  },
    { url: `${siteUrl}/interview-questions`,       lastModified: now, changeFrequency: 'weekly',  priority: 0.9  },
    { url: `${siteUrl}/resume-keywords`,            lastModified: now, changeFrequency: 'weekly',  priority: 0.9  },
    { url: `${siteUrl}/ats-guide`,                 lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${siteUrl}/guides`,                    lastModified: now, changeFrequency: 'weekly',  priority: 0.9  },
    { url: `${siteUrl}/tools`,                     lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${siteUrl}/tools/ats-checker`,         lastModified: now, changeFrequency: 'monthly', priority: 0.9  },
    { url: `${siteUrl}/tools/keyword-extractor`,   lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${siteUrl}/landing/cover-letter`,      lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/legal/privacy-policy`,      lastModified: now, changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${siteUrl}/legal/terms-of-use`,        lastModified: now, changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${siteUrl}/legal/cookie-policy`,       lastModified: now, changeFrequency: 'yearly',  priority: 0.2 },
  ];

  const coverLetterSlugs = getAllSlugsForSitemap(COVER_LETTER_EXAMPLES);
  const programmaticRoutes: SitemapEntry[] = [
    ...coverLetterSlugs.map((slug) => ({
      url: `${siteUrl}/cover-letter-examples/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    })),
    ...getAllSlugsForSitemap(RESUME_EXAMPLES).map((slug) => ({
      url: `${siteUrl}/resume-examples/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    })),
    ...COMPANY_COVER_LETTERS.map((c) => ({
      url: `${siteUrl}/cover-letter-for/${c.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...GUIDES.map((g) => ({
      url: `${siteUrl}/guides/${g.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    })),
    ...getAllSlugsForSitemap(INTERVIEW_QUESTIONS).map((slug) => ({
      url: `${siteUrl}/interview-questions/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    })),
    ...ATS_GUIDES.map((g) => ({
      url: `${siteUrl}/ats-guide/${g.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...RESUME_KEYWORDS.map((k) => ({
      url: `${siteUrl}/resume-keywords/${k.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    })),
  ];

  let blogRoutes: SitemapEntry[] = [];
  try {
    const supabase = await getServerClient();
    const { data, error } = await supabase
      .from('blogs')
      .select('id, slug, updated_at, published_at' as any)
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false });

    if (error) throw error;

    if (data) {
      blogRoutes = data.map((post: any) => ({
        url: `${siteUrl}/blog/${post.slug || post.id}`,
        lastModified: new Date(post.updated_at || post.published_at || now),
        changeFrequency: 'monthly',
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error('[sitemap] Failed to load blog posts:', error);
  }

  return [...staticRoutes, ...programmaticRoutes, ...blogRoutes];
}
