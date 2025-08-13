"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const modules = {
    toolbar: [
        [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
        [{size: []}],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, 
         {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image', 'video'],
        ['clean']
    ],
};

const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
];

interface BlogPost {
    id: string;
    title: string;
    content: string;
    published_at: string;
    header_image_url: string;
    related_articles: { id: string; title: string; }[];
}

const OsloBlogPage = () => {
    const { toast } = useToast();
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [editingBlog, setEditingBlog] = useState<Partial<BlogPost> | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 10;
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchBlogs = async () => {
        const response = await fetch(`/api/blogs?page=${page}&limit=${limit}&search=${searchTerm}`);
        const data = await response.json();
        setBlogs(data.blogs);
        setTotal(data.count);
    };

    useEffect(() => {
        fetchBlogs();
    }, [page, searchTerm]);

    const handleFormSubmit = async (values: { title: string; content: string; header_image_url: string; }) => {
        try {
            if (editingBlog) {
                const response = await fetch(`/api/blogs/${editingBlog.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(values),
                });
                if (!response.ok) throw new Error("Failed to update blog post.");
                toast({ title: "Success", description: "Blog post updated successfully." });
            } else {
                const response = await fetch('/api/blogs', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...values, published_at: new Date().toISOString() }),
                });
                if (!response.ok) throw new Error("Failed to create blog post.");
                toast({ title: "Success", description: "Blog post created successfully." });
            }
            fetchBlogs();
            setIsSheetOpen(false);
            setEditingBlog(null);
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };
    
    const handleEdit = (blog: BlogPost) => {
        setEditingBlog(blog);
        setIsSheetOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error("Failed to delete blog post.");
            toast({ title: "Success", description: "Blog post deleted successfully." });
            fetchBlogs();
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    const handleDeleteClick = (id: string) => {
        setDeletingId(id);
        setIsAlertOpen(true);
    };

    const confirmDelete = () => {
        if (deletingId) {
            handleDelete(deletingId);
        }
        setIsAlertOpen(false);
        setDeletingId(null);
    };
    
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold">Blog Management</h1>
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Button onClick={() => setEditingBlog(null)}>Create New Post</Button>
                    </SheetTrigger>
                    <SheetContent className="sm:max-w-[48rem] overflow-y-auto">
                        <SheetHeader>
                            <SheetTitle>{editingBlog ? 'Edit' : 'Create'} Blog Post</SheetTitle>
                        </SheetHeader>
                        <BlogPostForm
                            onSubmit={handleFormSubmit}
                            initialData={editingBlog}
                            onCancel={() => setIsSheetOpen(false)}
                        />
                    </SheetContent>
                </Sheet>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Existing Posts</CardTitle>
                    <div className="mt-4">
                        <Input
                            placeholder="Search by title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Published</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {blogs.map((blog) => (
                                <TableRow key={blog.id}>
                                    <TableCell className="font-medium">{blog.title}</TableCell>
                                    <TableCell>{new Date(blog.published_at).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEdit(blog)}>
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDeleteClick(blog.id)} className="text-red-600">
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
                <CardFooter>
                    <div className="flex justify-between items-center w-full">
                        <p className="text-sm text-gray-500">
                            Showing {Math.min((page - 1) * limit + 1, total)} to {Math.min(page * limit, total)} of {total} entries
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setPage(page + 1)}
                                disabled={page * limit >= total}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </CardFooter>
            </Card>
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the blog post.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

interface BlogPostFormProps {
    onSubmit: (values: { title: string; content: string; header_image_url: string; }) => void;
    initialData?: Partial<BlogPost> | null;
    onCancel: () => void;
}

const BlogPostForm = ({ onSubmit, initialData, onCancel }: BlogPostFormProps) => {
    const [title, setTitle] = useState(initialData?.title || '');
    const [content, setContent] = useState(initialData?.content || '');
    const [headerImageUrl, setHeaderImageUrl] = useState(initialData?.header_image_url || '');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setHeaderImageUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageUpload = async () => {
        if (!imageFile) return headerImageUrl;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', imageFile);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Image upload failed');
            }

            const data = await response.json();
            return data.url;
        } catch (error) {
            console.error('Upload error:', error);
            // Handle error appropriately
            return headerImageUrl;
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const finalImageUrl = await handleImageUpload();
        onSubmit({ title, content, header_image_url: finalImageUrl });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="flex-grow space-y-6 mt-6 overflow-y-auto pr-6">
                <Input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="text-lg"
                />
                <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    formats={formats}
                    style={{ minHeight: '300px' }}
                    className="flex-grow"
                />
                <div className="space-y-2">
                    <label htmlFor="header-image" className="block text-sm font-medium text-gray-700">Header Image</label>
                    <Input
                        id="header-image"
                        type="file"
                        onChange={handleImageChange}
                        accept="image/*"
                        className="text-base"
                    />
                    {headerImageUrl && (
                        <div className="mt-4">
                            <img src={headerImageUrl} alt="Header preview" className="w-full h-auto rounded-md" />
                        </div>
                    )}
                </div>
            </div>
            <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-gray-200 sticky bottom-0 bg-white dark:bg-gray-800 py-4">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit" disabled={isUploading}>
                    {isUploading ? 'Uploading...' : 'Save'}
                </Button>
            </div>
        </form>
    );
}

export default OsloBlogPage;
