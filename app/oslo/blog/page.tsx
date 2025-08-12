"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/lib/hooks/useAuth';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface BlogPost {
    id: string;
    title: string;
    content: string;
    published_at: string;
    header_image_url: string;
    related_articles: { id: string; title: string; }[];
}

const OsloBlogPage = () => {
    const { user } = useAuth();
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [editingBlog, setEditingBlog] = useState<Partial<BlogPost> | null>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [headerImageUrl, setHeaderImageUrl] = useState('');
    const [relatedArticles, setRelatedArticles] = useState('');

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        const response = await fetch('/api/blogs');
        const data = await response.json();
        setBlogs(data.blogs);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        if (editingBlog) {
            // Update existing blog
            const response = await fetch(`/api/blogs/${editingBlog.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, header_image_url: headerImageUrl, related_articles: JSON.parse(relatedArticles) }),
            });
            const updatedBlog = await response.json();
            setBlogs(blogs.map(b => b.id === editingBlog.id ? updatedBlog.blog : b));
        } else {
            // Create new blog
            const response = await fetch('/api/blogs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, header_image_url: headerImageUrl, related_articles: JSON.parse(relatedArticles), published_at: new Date().toISOString() }),
            });
            const newBlog = await response.json();
            setBlogs([...blogs, newBlog.blog]);
        }
        setEditingBlog(null);
        setTitle('');
        setContent('');
        setHeaderImageUrl('');
        setRelatedArticles('');
    };

    const handleEdit = (blog: BlogPost) => {
        setEditingBlog(blog);
        setTitle(blog.title);
        setContent(blog.content);
        setHeaderImageUrl(blog.header_image_url || '');
        setRelatedArticles(JSON.stringify(blog.related_articles || []));
    };

    const handleDelete = async (id: string) => {
        await fetch(`/api/blogs/${id}`, {
            method: 'DELETE',
        });
        fetchBlogs();
    };

    const resetForm = () => {
        setTitle('');
        setContent('');
        setEditingBlog(null);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-4">Blog Management</h1>

            <Card className="p-6 mb-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <Textarea
                        placeholder="Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <Input
                        placeholder="Header Image URL"
                        value={headerImageUrl}
                        onChange={(e) => setHeaderImageUrl(e.target.value)}
                    />
                    <Textarea
                        placeholder="Related Articles (JSON)"
                        value={relatedArticles}
                        onChange={(e) => setRelatedArticles(e.target.value)}
                    />
                    <Button type="submit">{editingBlog ? 'Update' : 'Create'}</Button>
                    {editingBlog && (
                        <Button type="button" variant="secondary" onClick={() => {
                            setEditingBlog(null);
                            setTitle('');
                            setContent('');
                            setHeaderImageUrl('');
                            setRelatedArticles('');
                        }}>
                            Cancel
                        </Button>
                    )}
                </form>
            </Card>

            <div>
                <h2 className="text-2xl font-bold mb-4">Existing Posts</h2>
                <div className="space-y-4">
                    {blogs.map((blog) => (
                        <Card key={blog.id} className="p-4 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold">{blog.title}</h3>
                            </div>
                            <div className="flex gap-4">
                                <Button variant="outline" onClick={() => handleEdit(blog)}>Edit</Button>
                                <Button variant="destructive" onClick={() => handleDelete(blog.id)}>Delete</Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OsloBlogPage;
