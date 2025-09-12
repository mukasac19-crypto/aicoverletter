"use client";

import { useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link,
  Image,
  Heading2,
  Quote,
  Code,
  Undo,
  Redo,
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  onImageUpload?: (file: File) => Promise<string | null>;
}

export default function RichTextEditor({
  content,
  onChange,
  onImageUpload,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImageUpload) return;

    const url = await onImageUpload(file);
    if (url) {
      execCommand("insertImage", url);
    }
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      execCommand("createLink", url);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="border-b bg-gray-50 p-2 flex flex-wrap gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand("bold")}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand("italic")}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand("formatBlock", "h2")}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <div className="w-px bg-gray-300 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand("insertUnorderedList")}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand("insertOrderedList")}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand("formatBlock", "blockquote")}
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand("formatBlock", "pre")}
        >
          <Code className="h-4 w-4" />
        </Button>
        <div className="w-px bg-gray-300 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={insertLink}
        >
          <Link className="h-4 w-4" />
        </Button>
        {onImageUpload && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleImageClick}
            >
              <Image className="h-4 w-4" />
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </>
        )}
        <div className="w-px bg-gray-300 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand("undo")}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand("redo")}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[400px] p-4 focus:outline-none prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
      />
    </div>
  );
}