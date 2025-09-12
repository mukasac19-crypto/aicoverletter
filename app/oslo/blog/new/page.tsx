"use client";

import BlogForm from "../components/BlogForm";

export default function NewBlogPage() {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create New Blog Post</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <BlogForm mode="create" />
        </div>
      </div>
    </div>
  );
}