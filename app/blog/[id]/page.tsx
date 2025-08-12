"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import TableOfContents from '@/components/TableOfContents';
import RelatedArticles from '@/components/RelatedArticles';

interface BlogPost {
    id: string;
    title: string;
    content: string;
    published_at: string;
    header_image_url: string;
    related_articles: { id: string; title: string; }[];
}

const BlogPostPage = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState<BlogPost | null>(null);

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
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="p-8">
                {blog.header_image_url && (
                    <img src={blog.header_image_url} alt={blog.title} className="w-full h-auto mb-8 rounded-lg" />
                )}
                <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
                <p className="text-gray-500 mb-8">
                    Published on {new Date(blog.published_at).toLocaleDateString()}
                </p>
                <TableOfContents content={blog.content} />
                <div className="prose lg:prose-xl max-w-none mt-8" dangerouslySetInnerHTML={{ __html: blog.content }}>
                </div>
                <RelatedArticles articles={blog.related_articles} />
            </Card>
        </div>
    );
};

export default BlogPostPage;
