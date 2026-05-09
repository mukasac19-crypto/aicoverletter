import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getServerClient } from '@/lib/supabase-server';
import { getCanonicalSiteUrl } from '@/lib/seo';
import ShareButton from './ShareButton';

export const revalidate = 3600;

type BlogPost = {
  id: string;
  slug: string | null;
  title: string;
  content: any;
  header_image_url: string | null;
  published_at: string;
  updated_at?: string | null;
};

type RelatedRef = { id: string; slug: string | null; title: string };

type FullBlog = BlogPost & {
  prevArticle: RelatedRef | null;
  nextArticle: RelatedRef | null;
  related_articles: RelatedRef[];
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function loadBlog(idOrSlug: string): Promise<FullBlog | null> {
  const supabase = getServerClient();

  // Try slug first (the canonical URL form). Fall back to id for back-compat
  // with any externally-indexed UUID URLs.
  let blog: any = null;
  const slugLookup = await supabase
    .from('blogs')
    .select('*')
    .eq('slug' as any, idOrSlug)
    .not('published_at', 'is', null)
    .maybeSingle();
  blog = slugLookup.data;

  if (!blog && UUID_RE.test(idOrSlug)) {
    const idLookup = await supabase
      .from('blogs')
      .select('*')
      .eq('id', idOrSlug)
      .not('published_at', 'is', null)
      .maybeSingle();
    blog = idLookup.data;
  }

  if (!blog) return null;

  const blogRow = blog as unknown as BlogPost;

  const [prevRes, nextRes, relatedRes] = await Promise.all([
    supabase
      .from('blogs')
      .select('id, slug, title' as any)
      .not('published_at', 'is', null)
      .lt('published_at', blogRow.published_at)
      .order('published_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('blogs')
      .select('id, slug, title' as any)
      .not('published_at', 'is', null)
      .gt('published_at', blogRow.published_at)
      .order('published_at', { ascending: true })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('blogs')
      .select('id, slug, title' as any)
      .not('published_at', 'is', null)
      .neq('id', blogRow.id)
      .order('published_at', { ascending: false })
      .limit(3),
  ]);

  return {
    ...blogRow,
    prevArticle: (prevRes.data as unknown as RelatedRef | null) ?? null,
    nextArticle: (nextRes.data as unknown as RelatedRef | null) ?? null,
    related_articles: ((relatedRes.data as unknown as RelatedRef[] | null) ?? []),
  };
}

function htmlToText(content: any): string {
  if (content == null) return '';
  const raw = typeof content === 'string' ? content : JSON.stringify(content);
  return raw
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function makeExcerpt(content: any, max = 160): string {
  const text = htmlToText(content);
  if (text.length <= max) return text;
  return text.slice(0, max - 1).trimEnd() + '…';
}

function blogContentHtml(content: any): string {
  if (typeof content === 'string') return content;
  if (content == null) return '';
  return String(content);
}

function blogPath(post: { id: string; slug?: string | null }) {
  return `/blog/${post.slug || post.id}`;
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const blog = await loadBlog(params.id);
  if (!blog) {
    return { title: 'Article not found', robots: { index: false, follow: false } };
  }

  const description = makeExcerpt(blog.content, 160) || `Read ${blog.title} on the CareerThings AI career insights blog.`;
  const canonicalPath = blogPath(blog);

  return {
    title: blog.title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: 'article',
      title: blog.title,
      description,
      url: canonicalPath,
      siteName: 'CareerThings AI',
      images: blog.header_image_url
        ? [{ url: blog.header_image_url, width: 1200, height: 630, alt: blog.title }]
        : undefined,
      publishedTime: blog.published_at,
      modifiedTime: blog.updated_at || blog.published_at,
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description,
      images: blog.header_image_url ? [blog.header_image_url] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { id: string };
}) {
  const blog = await loadBlog(params.id);
  if (!blog) notFound();

  // Canonical redirect: if visitor arrived via UUID but post has a slug,
  // 301 to the slug URL so search engines consolidate.
  if (blog.slug && params.id !== blog.slug) {
    redirect(`/blog/${blog.slug}`);
  }

  const siteUrl = getCanonicalSiteUrl();
  const path = blogPath(blog);
  const url = `${siteUrl}${path}`;
  const description = makeExcerpt(blog.content, 160);

  const blogPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description,
    image: blog.header_image_url ? [blog.header_image_url] : [`${siteUrl}/careerthingslogo.png`],
    datePublished: blog.published_at,
    dateModified: blog.updated_at || blog.published_at,
    author: { '@type': 'Organization', name: 'CareerThings AI', url: siteUrl },
    publisher: {
      '@type': 'Organization',
      name: 'CareerThings AI',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/careerthingslogo.png`,
      },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog` },
      { '@type': 'ListItem', position: 3, name: blog.title, item: url },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <article className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/blog">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>

        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
          <div className="flex items-center gap-4 text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime={blog.published_at}>
                {format(new Date(blog.published_at), 'MMMM d, yyyy')}
              </time>
            </div>
            <ShareButton title={blog.title} />
          </div>
        </header>

        {blog.header_image_url && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={blog.header_image_url}
              alt={blog.title}
              className="w-full h-auto"
              loading="eager"
            />
          </div>
        )}

        <div
          className="prose prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: blogContentHtml(blog.content) }}
        />

        <Separator className="my-12" />

        <div className="flex justify-between items-center mb-12">
          {blog.prevArticle ? (
            <Link href={blogPath(blog.prevArticle)} className="group">
              <div className="flex items-center gap-2 text-gray-500 group-hover:text-orange-600 transition-colors">
                <ChevronLeft className="h-5 w-5" />
                <div className="text-left">
                  <p className="text-sm">Previous</p>
                  <p className="font-semibold">{blog.prevArticle.title}</p>
                </div>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {blog.nextArticle ? (
            <Link href={blogPath(blog.nextArticle)} className="group">
              <div className="flex items-center gap-2 text-gray-500 group-hover:text-orange-600 transition-colors">
                <div className="text-right">
                  <p className="text-sm">Next</p>
                  <p className="font-semibold">{blog.nextArticle.title}</p>
                </div>
                <ChevronRight className="h-5 w-5" />
              </div>
            </Link>
          ) : (
            <div />
          )}
        </div>

        {blog.related_articles.length > 0 && (
          <>
            <Separator className="my-12" />
            <section>
              <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {blog.related_articles.map((article) => (
                  <Link key={article.id} href={blogPath(article)}>
                    <Card className="p-6 hover:shadow-lg transition-shadow">
                      <h3 className="font-semibold text-lg hover:text-orange-600 transition-colors">
                        {article.title}
                      </h3>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}
      </article>
    </div>
  );
}
