"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Share2 } from 'lucide-react';

export default function ShareButton({ title }: { title: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      try {
        await (navigator as any).share({
          title,
          text: `Check out this article: ${title}`,
          url,
        });
        return;
      } catch {
        // fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // noop
    }
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleShare}>
      {isCopied ? (
        <>
          <Copy className="mr-2 h-4 w-4" />
          Copied!
        </>
      ) : (
        <>
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </>
      )}
    </Button>
  );
}
