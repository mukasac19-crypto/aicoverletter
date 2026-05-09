"use client";

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function BlogSearchInput({ initial }: { initial: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState(initial);
  const [, startTransition] = useTransition();

  const submit = (next: string) => {
    const sp = new URLSearchParams(params?.toString());
    if (next) sp.set('search', next);
    else sp.delete('search');
    sp.delete('page');
    startTransition(() => {
      router.push(`/blog${sp.toString() ? `?${sp.toString()}` : ''}`);
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit(value);
      }}
      className="max-w-2xl mx-auto relative"
    >
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      <Input
        type="search"
        name="search"
        placeholder="Search articles..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-10 pr-4 py-6 text-lg"
      />
    </form>
  );
}
