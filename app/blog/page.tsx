import type { Metadata } from 'next';
import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowRight, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getServerClient } from '@/lib/supabase-server';
import { getCanonicalSiteUrl } from '@/lib/seo';
import BlogSearchInput from './BlogSearchInput';

export const revalidate = 600;

const PAGE_SIZE = 9;

export const metadata: Metadata = {
  title: 'Career Insights Blog — Resume, Cover Letter & Interview Tips',
  description:
    'Expert advice on writing winning resumes, cover letters, beating ATS, and acing interviews. Updated weekly by the CareerThings AI team.',
  alternates: { canonical: '/blog' },
  openGraph: {
    type: 'website',
    title: 'Career Insights Blog — CareerThings AI',
    description:
      'Expert advice on writing winning resumes, cover letters, beating ATS, and acing interviews.',
    url: '/blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Career Insights Blog — CareerThings AI',
    description:
      'Expert advice on writing winning resumes, cover letters, beating ATS, and acing interviews.',
  },
};

type BlogListItem = {
  id: string;
  slug: string | null;
  title: string;
  content: any;
  header_image_url: string | null;
  published_at: string;
};

function htmlExcerpt(content: any, max = 150) {
  const raw = typeof content === 'string' ? content : JSON.stringify(content ?? '');
  const text = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.length > max ? text.slice(0, max).trim() + '...' : text;
}

function blogPath(post: { id: string; slug?: string | null }) {
  return `/blog/${post.slug || post.id}`;
}

async function loadBlogs({
  page,
  search,
}: {
  page: number;
  search: string;
}) {
  const supabase = getServerClient();

  let query = supabase
    .from('blogs')
    .select('id, slug, title, content, header_image_url, published_at' as any, { count: 'exact' })
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false });

  if (search) {
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
  }

  const start = (page - 1) * PAGE_SIZE;
  query = query.range(start, start + PAGE_SIZE - 1);

  const { data, count } = await query;
  return {
    blogs: ((data as unknown as BlogListItem[]) || []),
    count: count || 0,
  };
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: { page?: string; search?: string };
}) {
  const page = Math.max(1, parseInt(searchParams?.page ?? '1', 10) || 1);
  const search = (searchParams?.search ?? '').trim();
  const { blogs, count } = await loadBlogs({ page, search });
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const siteUrl = getCanonicalSiteUrl();

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'CareerThings AI Career Insights Blog',
    url: `${siteUrl}/blog`,
    description:
      'Expert career advice on resumes, cover letters, ATS optimization, and interview prep.',
    publisher: {
      '@type': 'Organization',
      name: 'CareerThings AI',
      url: siteUrl,
      logo: { '@type': 'ImageObject', url: `${siteUrl}/careerthingslogo.png` },
    },
    blogPost: blogs.slice(0, 10).map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `${siteUrl}${blogPath(post)}`,
      datePublished: post.published_at,
      image: post.header_image_url || `${siteUrl}/careerthingslogo.png`,
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog` },
    ],
  };

  const buildHref = (targetPage: number) => {
    const sp = new URLSearchParams();
    if (search) sp.set('search', search);
    if (targetPage > 1) sp.set('page', String(targetPage));
    const q = sp.toString();
    return q ? `/blog?${q}` : '/blog';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-center mb-4">Career Insights Blog</h1>
          <p className="text-xl text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            Expert advice and insights to accelerate your career journey
          </p>

          <BlogSearchInput initial={search} />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {search ? `No articles found for "${search}".` : 'No articles yet — check back soon.'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => {
                const href = blogPath(blog);
                return (
                  <Card
                    key={blog.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <Link href={href}>
                      {blog.header_image_url ? (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={blog.header_image_url}
                            alt={blog.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                          <span className="text-white text-4xl font-bold opacity-20">
                            {blog.title.charAt(0)}
                          </span>
                        </div>
                      )}
                    </Link>
                    <CardHeader>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <Calendar className="h-4 w-4" />
                        <time dateTime={blog.published_at}>
                          {format(new Date(blog.published_at), 'MMMM d, yyyy')}
                        </time>
                      </div>
                      <h2 className="text-xl font-bold hover:text-orange-600 transition-colors">
                        <Link href={href}>{blog.title}</Link>
                      </h2>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{htmlExcerpt(blog.content)}</p>
                      <Link href={href}>
                        <Button variant="ghost" className="group pl-0">
                          Read more
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {totalPages > 1 && (
              <nav className="mt-12 flex justify-center items-center gap-2" aria-label="Pagination">
                <Link
                  href={buildHref(Math.max(1, page - 1))}
                  aria-disabled={page === 1}
                  className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                >
                  <Button variant="outline">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </Link>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    const show =
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= page - 1 && pageNum <= page + 1);
                    if (!show) {
                      if (pageNum === page - 2 || pageNum === page + 2) {
                        return <span key={pageNum}>...</span>;
                      }
                      return null;
                    }
                    return (
                      <Link key={pageNum} href={buildHref(pageNum)}>
                        <Button
                          variant={pageNum === page ? 'default' : 'outline'}
                          className="w-10"
                        >
                          {pageNum}
                        </Button>
                      </Link>
                    );
                  })}
                </div>

                <Link
                  href={buildHref(Math.min(totalPages, page + 1))}
                  aria-disabled={page === totalPages}
                  className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
                >
                  <Button variant="outline">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
}
