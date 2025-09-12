"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, Search, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

interface BlogPost {
    id: string;
    title: string;
    content: string;
    published_at: string;
    header_image_url: string;
    created_at: string;
}

export default function BlogPage() {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const limit = 9;

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

    const getExcerpt = (htmlContent: string, maxLength: number = 150) => {
        const text = htmlContent.replace(/<[^>]*>/g, '');
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-16">
                    <h1 className="text-5xl font-bold text-center mb-4">Career Insights Blog</h1>
                    <p className="text-xl text-center text-gray-600 mb-8 max-w-2xl mx-auto">
                        Expert advice and insights to accelerate your career journey
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
                                setPage(1);
                            }}
                            className="pl-10 pr-4 py-6 text-lg"
                        />
                    </div>
                </div>
            </div>

            {/* Blog Posts Grid */}
            <div className="container mx-auto px-4 py-12">
                {loading ? (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {[...Array(6)].map((_, i) => (
                            <Card key={i} className="overflow-hidden animate-pulse">
                                <div className="h-48 bg-gray-200" />
                                <CardHeader>
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                                    <div className="h-6 bg-gray-200 rounded" />
                                </CardHeader>
                                <CardContent>
                                    <div className="h-4 bg-gray-200 rounded mb-2" />
                                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No articles found.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {blogs.map((blog) => (
                                <Card key={blog.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                    <Link href={`/blog/${blog.id}`}>
                                        {blog.header_image_url ? (
                                            <div className="aspect-video overflow-hidden">
                                                <img 
                                                    src={blog.header_image_url} 
                                                    alt={blog.title}
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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
                                            <Link href={`/blog/${blog.id}`}>
                                                {blog.title}
                                            </Link>
                                        </h2>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 mb-4">
                                            {getExcerpt(blog.content)}
                                        </p>
                                        <Link href={`/blog/${blog.id}`}>
                                            <Button variant="ghost" className="group pl-0">
                                                Read more 
                                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-12 flex justify-center items-center gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setPage(page - 1)}
                                    disabled={page === 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                
                                <div className="flex gap-2">
                                    {[...Array(totalPages)].map((_, i) => {
                                        const pageNum = i + 1;
                                        if (
                                            pageNum === 1 ||
                                            pageNum === totalPages ||
                                            (pageNum >= page - 1 && pageNum <= page + 1)
                                        ) {
                                            return (
                                                <Button
                                                    key={pageNum}
                                                    variant={pageNum === page ? "default" : "outline"}
                                                    onClick={() => setPage(pageNum)}
                                                    className="w-10"
                                                >
                                                    {pageNum}
                                                </Button>
                                            );
                                        } else if (pageNum === page - 2 || pageNum === page + 2) {
                                            return <span key={pageNum}>...</span>;
                                        }
                                        return null;
                                    })}
                                </div>
                                
                                <Button
                                    variant="outline"
                                    onClick={() => setPage(page + 1)}
                                    disabled={page === totalPages}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}