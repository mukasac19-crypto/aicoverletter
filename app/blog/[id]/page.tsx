"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Share2, Copy } from 'lucide-react';
import TableOfContents from '@/components/TableOfContents';
import RelatedArticles from '@/components/RelatedArticles';
import Link from 'next/link';

interface BlogPost {
    id: string;
    title: string;
    content: string;
    published_at: string;
    header_image_url: string;
    related_articles: { id: string; title: string; }[];
    prevArticle?: { id: string; title: string; };
    nextArticle?: { id: string; title: string; };
}

const BlogPostPage = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState<BlogPost | null>(null);
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        if (id) {
            const fetchBlog = async () => {
                const response = await fetch(`/api/blogs/${id}`);
                const data = await response.json();
                setBlog(data.blog);
            };
            fetchBlog();
        }
    }, [id]);

    if (!blog) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: blog.title,
                    text: `Check out this article: ${blog.title}`,
                    url: window.location.href,
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <article>
                    <header className="mb-8 md:mb-12 text-center">
                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tighter mb-4">{blog.title}</h1>
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 text-gray-500 dark:text-gray-400">
                            <time dateTime={blog.published_at}>{new Date(blog.published_at).toLocaleDateString()}</time>
                        </div>
                    </header>
                    
                    <div className="relative h-64 sm:h-80 md:h-96 w-full mb-8 md:mb-12">
                        <img src={blog.header_image_url} alt={blog.title} className="absolute inset-0 w-full h-full object-cover rounded-2xl shadow-lg" />
                    </div>

                    <div className="grid lg:grid-cols-4 gap-8 md:gap-12">
                        <div className="lg:col-span-3">
                            <Card className="p-6 sm:p-8 rounded-2xl shadow-lg bg-white dark:bg-gray-900">
                                <div className="prose prose-base sm:prose-lg lg:prose-xl max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: blog.content }} />
                            </Card>
                        </div>
                        <aside className="lg:col-span-1">
                            <div className="sticky top-24">
                                <Card className="p-6 rounded-2xl shadow-lg mb-8 bg-white dark:bg-gray-900">
                                    <h3 className="text-lg sm:text-xl font-bold mb-4 border-l-4 border-blue-500 pl-4">Table of Contents</h3>
                                    <TableOfContents content={blog.content} />
                                </Card>
                            </div>
                        </aside>
                    </div>

                    <Separator className="my-12 md:my-16" />

                    <div className="text-center">
                        <Button
                            onClick={handleShare}
                            variant="default"
                            size="lg"
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-3 shadow-lg transition-transform transform hover:scale-105"
                        >
                            {isCopied ? (
                                <>
                                    <Copy className="mr-2 h-5 w-5" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Share2 className="mr-2 h-5 w-5" />
                                    Share this article
                                </>
                            )}
                        </Button>
                    </div>

                    <Separator className="my-12 md:my-16" />

                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 border-b-2 border-blue-200 pb-4">Further Reading</h2>
                        <RelatedArticles articles={blog.related_articles} />
                    </div>
                    
                    <Separator className="my-12 md:my-16" />

                    <section className="flex flex-col sm:flex-row justify-between items-center gap-8">
                        {blog.prevArticle ? (
                            <Link href={`/blog/${blog.prevArticle.id}`} className="group text-center sm:text-left w-full sm:w-auto">
                                <p className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-300">Previous</p>
                                <h4 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 transition-colors duration-300">{blog.prevArticle.title}</h4>
                            </Link>
                        ) : <div />}
                        {blog.nextArticle ? (
                            <Link href={`/blog/${blog.nextArticle.id}`} className="group text-center sm:text-right w-full sm:w-auto">
                                <p className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-300">Next</p>
                                <h4 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 transition-colors duration-300">{blog.nextArticle.title}</h4>
                            </Link>
                        ) : <div />}
                    </section>
                </article>
            </div>
        </div>
    );
};

export default BlogPostPage;
