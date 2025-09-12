"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Calendar, Share2, Copy, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

interface BlogPost {
    id: string;
    title: string;
    content: string;
    published_at: string;
    header_image_url: string;
    related_articles?: { id: string; title: string; }[];
    prevArticle?: { id: string; title: string; };
    nextArticle?: { id: string; title: string; };
}

export default function BlogPostPage() {
    const { id } = useParams();
    const [blog, setBlog] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        if (id) {
            fetchBlog();
        }
    }, [id]);

    const fetchBlog = async () => {
        try {
            const response = await fetch(`/api/blogs/${id}`);
            const data = await response.json();
            setBlog(data.blog);
        } catch (error) {
            console.error('Error fetching blog:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleShare = async () => {
        const url = window.location.href;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: blog?.title,
                    text: `Check out this article: ${blog?.title}`,
                    url: url,
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            navigator.clipboard.writeText(url);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Article not found</h2>
                    <Link href="/blog">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Blog
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
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
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleShare}
                        >
                            {isCopied ? (
                                <>
                                    <Copy className="mr-2 h-4 w-4" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Share2 className="mr-2 h-4 w-4" />
                                    Share
                                </>
                            )}
                        </Button>
                    </div>
                </header>

                {blog.header_image_url && (
                    <div className="mb-8 rounded-lg overflow-hidden">
                        <img 
                            src={blog.header_image_url} 
                            alt={blog.title}
                            className="w-full h-auto"
                        />
                    </div>
                )}

                <div 
                    className="prose prose-lg max-w-none mb-12"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                <Separator className="my-12" />

                {/* Navigation */}
                <div className="flex justify-between items-center mb-12">
                    {blog.prevArticle ? (
                        <Link href={`/blog/${blog.prevArticle.id}`} className="group">
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
                        <Link href={`/blog/${blog.nextArticle.id}`} className="group">
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

                {/* Related Articles */}
                {blog.related_articles && blog.related_articles.length > 0 && (
                    <>
                        <Separator className="my-12" />
                        <section>
                            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
                            <div className="grid gap-4 md:grid-cols-2">
                                {blog.related_articles.map((article) => (
                                    <Link key={article.id} href={`/blog/${article.id}`}>
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