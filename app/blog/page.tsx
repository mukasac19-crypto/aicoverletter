"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

interface BlogPost {
    id: string;
    title: string;
    content: string;
    published_at: string;
    header_image_url: string;
}

const BlogPage = () => {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            const response = await fetch('/api/blogs');
            const data = await response.json();
            setBlogs(data.blogs);
        };

        fetchBlogs();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">Blog</h1>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {blogs.map((blog) => (
                    <Link href={`/blog/${blog.id}`} key={blog.id}>
                        <div className="block hover:bg-gray-100 p-4 rounded-lg">
                            {blog.header_image_url && (
                                <img src={blog.header_image_url} alt={blog.title} className="w-full h-48 object-cover mb-4 rounded-lg" />
                            )}
                            <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
                            <p className="text-gray-500 mb-4">
                                {new Date(blog.published_at).toLocaleDateString()}
                            </p>
                            <p className="text-gray-700">{blog.content.substring(0, 150)}...</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default BlogPage;
