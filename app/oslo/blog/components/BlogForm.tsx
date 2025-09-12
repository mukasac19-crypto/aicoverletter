"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Loader2, Upload, X } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";

// Dynamic import for rich text editor to avoid SSR issues
const RichTextEditor = dynamic(() => import("./RichTextEditor"), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 rounded-lg animate-pulse" />,
});

interface BlogFormProps {
  initialData?: {
    id?: string;
    title: string;
    content: string;
    header_image_url: string | null;
    published_at: string | null;
  };
  mode: "create" | "edit";
}

export default function BlogForm({ initialData, mode }: BlogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    content: initialData?.content || "",
    header_image_url: initialData?.header_image_url || "",
    isPublished: !!initialData?.published_at,
  });

  const handleImageUpload = useCallback(async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/oslo/blogs/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  }, []);

  const handleHeaderImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await handleImageUpload(file);
    if (url) {
      setFormData((prev) => ({ ...prev, header_image_url: url }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        content: formData.content,
        header_image_url: formData.header_image_url || null,
        published_at: formData.isPublished ? new Date().toISOString() : null,
      };

      const url = mode === "create" 
        ? "/api/oslo/blogs" 
        : `/api/oslo/blogs/${initialData?.id}`;
      
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save blog");

      toast({
        title: "Success",
        description: `Blog ${mode === "create" ? "created" : "updated"} successfully`,
      });

      router.push("/oslo/blog");
    } catch (error) {
      console.error("Error saving blog:", error);
      toast({
        title: "Error",
        description: `Failed to ${mode} blog`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          placeholder="Enter blog title"
        />
      </div>

      <div>
        <Label htmlFor="header-image">Header Image</Label>
        <div className="mt-2 space-y-4">
          {formData.header_image_url && (
            <div className="relative">
              <img
                src={formData.header_image_url}
                alt="Header"
                className="w-full h-64 object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => setFormData({ ...formData, header_image_url: "" })}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <div className="flex items-center gap-4">
            <Input
              id="header-image"
              type="file"
              accept="image/*"
              onChange={handleHeaderImageChange}
              disabled={uploading}
              className="hidden"
            />
            <Label
              htmlFor="header-image"
              className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              {uploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              {uploading ? "Uploading..." : "Upload Image"}
            </Label>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="content">Content</Label>
        <RichTextEditor
          content={formData.content}
          onChange={(content) => setFormData({ ...formData, content })}
          onImageUpload={handleImageUpload}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="publish"
          checked={formData.isPublished}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, isPublished: checked })
          }
        />
        <Label htmlFor="publish">Publish immediately</Label>
      </div>

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={loading}
          className="bg-orange-600 hover:bg-orange-700"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "create" ? "Create Blog" : "Update Blog"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/oslo/blog")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}