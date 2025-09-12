"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BlogForm from "../../components/BlogForm";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function EditBlogPage() {
  const params = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
  }, [params.id]);

  const fetchBlog = async () => {
    try {
      const response = await fetch(`/api/oslo/blogs/${params.id}`);
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);
      
      setBlog(data.blog);
    } catch (error) {
      console.error("Error fetching blog:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="p-6">
        <p>Blog not found</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Edit Blog Post</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <BlogForm mode="edit" initialData={blog} />
        </div>
      </div>
    </div>
  );
}