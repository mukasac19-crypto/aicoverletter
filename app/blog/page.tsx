"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface BlogPost {
    id: string;
    title: string;
    content: string;
    published_at: string;
    header_image_url: string;
    category?: string; // Optional category for sorting
}

const BlogPage = () => {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchBlogs = async (page: number, searchTerm: string = '') => {
        const response = await fetch(`/api/blogs?page=${page}&limit=10&search=${searchTerm}`);
        const data = await response.json();
        setBlogs(prev => (page === 1 ? data.blogs : [...prev, ...data.blogs]));
        setHasMore(data.blogs.length === 10);
    };

    useEffect(() => {
        fetchBlogs(1, searchTerm);
    }, [searchTerm]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setPage(1);
    };

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchBlogs(nextPage, searchTerm);
    };

    // Function to strip HTML tags and get plain text
    const stripHtml = (html: string): string => {
        const tmp = document.createElement("div");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    };

    // Function to get clean excerpt from HTML content
    const getExcerpt = (htmlContent: string, maxLength: number): string => {
        const plainText = stripHtml(htmlContent);
        return plainText.length > maxLength 
            ? plainText.substring(0, maxLength).trim() + '...' 
            : plainText;
    };

    const heroPost = useMemo(() => blogs.length > 0 ? blogs[0] : null, [blogs]);
    const topStories = useMemo(() => blogs.length > 1 ? blogs.slice(1, 5) : [], [blogs]);
    const recentPosts = useMemo(() => blogs.length > 5 ? blogs.slice(5) : [], [blogs]);

    return (
        <div className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <header className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter text-gray-900 dark:text-white">Career News & Insights</h1>
                    <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">Actionable advice and expert tips to accelerate your career journey. Your go-to resource for resume building, interview prep, and job market trends.</p>
                </header>

                <div className="mb-12 max-w-lg mx-auto">
                    <Input
                        type="text"
                        placeholder="Search articles, topics, or keywords..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full text-base sm:text-lg px-6 py-3 sm:py-4 rounded-full shadow-md focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {heroPost && (
                    <section className="mb-12 md:mb-16">
                        <Card className="overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2">
                                <div className="relative h-64 md:h-auto">
                                    <img src={heroPost.header_image_url} alt={heroPost.title} className="absolute inset-0 w-full h-full object-cover" />
                                </div>
                                <div className="p-6 sm:p-8 flex flex-col justify-center">
                                    <Badge variant="secondary" className="w-fit mb-3 sm:mb-4">{heroPost.category || 'Featured'}</Badge>
                                    <Link href={`/blog/${heroPost.id}`}>
                                        <h2 className="text-2xl sm:text-3xl font-bold hover:text-blue-600 transition-colors duration-300 mb-3 sm:mb-4">{heroPost.title}</h2>
                                    </Link>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4">{new Date(heroPost.published_at).toLocaleDateString()}</p>
                                    {/* Fixed: Strip HTML from content */}
                                    <p className="text-base text-gray-700 dark:text-gray-300">{getExcerpt(heroPost.content, 150)}</p>
                                </div>
                            </div>
                        </Card>
                    </section>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                    <main className="lg:col-span-2">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 border-l-4 border-blue-500 pl-4">Essential Career Guides</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
                            {topStories.map(blog => (
                                <Card key={blog.id} className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                                    <Link href={`/blog/${blog.id}`} className="block">
                                        <img src={blog.header_image_url} alt={blog.title} className="w-full h-40 object-cover" />
                                        <CardContent className="p-4 sm:p-6">
                                            <Badge variant="outline" className="mb-2">{blog.category || 'News'}</Badge>
                                            <h3 className="text-lg sm:text-xl font-semibold mb-2">{blog.title}</h3>
                                            <p className="text-xs sm:text-sm text-gray-500">{new Date(blog.published_at).toLocaleDateString()}</p>
                                        </CardContent>
                                    </Link>
                                </Card>
                            ))}
                        </div>
                        
                        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 border-l-4 border-blue-500 pl-4">The Career-AI Blog</h2>
                        <div className="space-y-6 sm:space-y-8">
                             {recentPosts.map(blog => (
                                <Card key={blog.id} className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                                    <Link href={`/blog/${blog.id}`} className="block w-full sm:w-40 flex-shrink-0">
                                        <img src={blog.header_image_url} alt={blog.title} className="w-full h-48 sm:h-full object-cover rounded-md" />
                                    </Link>
                                    <div className="flex-grow">
                                        <Badge variant="outline" className="mb-2">{blog.category || 'General'}</Badge>
                                        <Link href={`/blog/${blog.id}`}><h3 className="text-xl sm:text-2xl font-bold hover:text-blue-600 transition-colors duration-300 mb-2">{blog.title}</h3></Link>
                                        <p className="text-sm text-gray-500 mb-2">{new Date(blog.published_at).toLocaleDateString()}</p>
                                        {/* Fixed: Strip HTML from content */}
                                        <p className="text-base text-gray-600 dark:text-gray-400">{getExcerpt(blog.content, 120)}</p>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {hasMore && (
                            <div className="text-center mt-8 sm:mt-12">
                                <Button onClick={loadMore} size="lg" variant="outline">Load More Articles</Button>
                            </div>
                        )}
                    </main>

                    <aside className="lg:col-span-1">
                        <div className="sticky top-24">
                            <Card className="p-6 rounded-2xl shadow-lg">
                                <h3 className="text-xl sm:text-2xl font-bold mb-6">Popular Categories</h3>
                                <div className="flex flex-wrap gap-2 sm:gap-3">
                                    <Badge variant="default" className="px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm">Resume Tips</Badge>
                                    <Badge variant="default" className="px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm">Interview Prep</Badge>
                                    <Badge variant="default" className="px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm">Cover Letters</Badge>
                                    <Badge variant="default" className="px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm">Job Market</Badge>
                                    <Badge variant="default" className="px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm">Career Growth</Badge>
                                </div>
                            </Card>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default BlogPage;