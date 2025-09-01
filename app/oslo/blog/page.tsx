// app/blog/page.tsx - Frontend blog display page

"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, Search, ArrowRight } from 'lucide-react';

interface BlogPost {
    id: string;
    title: string;
    content: string;
    published_at: string;
    header_image_url: string;
    related_articles?: { id: string; title: string; }[];
}

export default function BlogPage() {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const limit = 10;

    useEffect(() => {
        fetchBlogs();
    }, [page, searchTerm]);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/blogs?page=${page}&limit=${limit}&search=${searchTerm}`);
            const data = await response.json();
            setBlogs(data.blogs);
            setTotal(data.count);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    // Function to safely render HTML content
    const createMarkup = (html: string) => {
        // For basic safety, you can add some content sanitization here
        // For production, consider using DOMPurify
        return { __html: html };
    };

    // Function to extract excerpt from HTML content
    const getExcerpt = (htmlContent: string, maxLength: number = 150) => {
        // Strip HTML tags to get plain text
        const text = htmlContent.replace(/<[^>]*>/g, '');
        // Return truncated text
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero Section */}
            <div className="bg-white dark:bg-gray-800 border-b">
                <div className="container mx-auto px-4 py-16">
                    <h1 className="text-5xl font-bold text-center mb-4">The Career-AI Blog</h1>
                    <p className="text-xl text-center text-gray-600 dark:text-gray-400 mb-8">
                        Insights and tips for your career journey
                    </p>
                    
                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                            type="text"
                            placeholder="Search articles..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPage(1); // Reset to first page on search
                            }}
                            className="pl-10 pr-4 py-6 text-lg"
                        />
                    </div>
                </div>
            </div>

            {/* Blog Posts */}
            <div className="container mx-auto px-4 py-12">
                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Loading articles...</p>
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No articles found.</p>
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {blogs.map((blog) => (
                            <Card key={blog.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                {blog.header_image_url && (
                                    <div className="aspect-video overflow-hidden">
                                        <img 
                                            src={blog.header_image_url} 
                                            alt={blog.title}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                )}
                                <CardHeader>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                        <Calendar className="h-4 w-4" />
                                        <time dateTime={blog.published_at}>
                                            {new Date(blog.published_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </time>
                                    </div>
                                    <CardTitle className="text-xl hover:text-blue-600 transition-colors">
                                        <Link href={`/blog/${blog.id}`}>
                                            {blog.title}
                                        </Link>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        {getExcerpt(blog.content)}
                                    </p>
                                    <Link href={`/blog/${blog.id}`}>
                                        <Button variant="ghost" className="group">
                                            Read more 
                                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {total > limit && (
                    <div className="mt-12 flex justify-center items-center gap-4">
                        <Button
                            variant="outline"
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                        >
                            Previous
                        </Button>
                        <span className="text-sm text-gray-600">
                            Page {page} of {Math.ceil(total / limit)}
                        </span>
                        <Button
                            variant="outline"
                            onClick={() => setPage(page + 1)}
                            disabled={page * limit >= total}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

// If you need a separate component for individual blog post display:
// app/blog/[id]/page.tsx

/*
"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowLeft } from 'lucide-react';

interface BlogPost {
    id: string;
    title: string;
    content: string;
    published_at: string;
    header_image_url: string;
    related_articles?: { id: string; title: string; }[];
}

export default function BlogPostPage() {
    const params = useParams();
    const [blog, setBlog] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetchBlogPost();
        }
    }, [params.id]);

    const fetchBlogPost = async () => {
        try {
            const response = await fetch(`/api/blogs/${params.id}`);
            const data = await response.json();
            setBlog(data);
        } catch (error) {
            console.error('Error fetching blog post:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Blog post not found.</p>
            </div>
        );
    }

    return (
        <article className="min-h-screen bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <Link href="/blog">
                    <Button variant="ghost" className="mb-8">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Blog
                    </Button>
                </Link>

                {blog.header_image_url && (
                    <div className="aspect-video overflow-hidden rounded-lg mb-8">
                        <img 
                            src={blog.header_image_url} 
                            alt={blog.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <header className="mb-8">
                    <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
                    <div className="flex items-center gap-2 text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <time dateTime={blog.published_at}>
                            {new Date(blog.published_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </time>
                    </div>
                </header>

                <div 
                    className="prose prose-lg dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                {blog.related_articles && blog.related_articles.length > 0 && (
                    <div className="mt-12 pt-8 border-t">
                        <h2 className="text-2xl font-bold mb-4">Related Articles</h2>
                        <div className="space-y-2">
                            {blog.related_articles.map((article) => (
                                <Link 
                                    key={article.id} 
                                    href={`/blog/${article.id}`}
                                    className="block p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <h3 className="font-semibold text-blue-600 dark:text-blue-400">
                                        {article.title}
                                    </h3>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </article>
    );
}
*/