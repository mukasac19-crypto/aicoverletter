"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

export default function BlogPreview() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLatestBlogs();
    }, []);

    const fetchLatestBlogs = async () => {
        try {
            const response = await fetch('/api/blogs?limit=3');
            const data = await response.json();
            setBlogs(data.blogs);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || blogs.length === 0) return null;

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Latest from Our Blog</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Stay updated with the latest career insights and tips
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3 mb-8">
                    {blogs.map((blog: any) => (
                        <Card key={blog.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <Link href={`/blog/${blog.id}`}>
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
                                            {format(new Date(blog.published_at), 'MMM d, yyyy')}
                                        </time>
                                    </div>
                                    <h3 className="text-xl font-bold hover:text-orange-600 transition-colors">
                                        {blog.title}
                                    </h3>
                                </CardHeader>
                            </Link>
                        </Card>
                    ))}
                </div>

                <div className="text-center">
                    <Link href="/blog">
                        <Button variant="outline" size="lg">
                            View All Articles
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}