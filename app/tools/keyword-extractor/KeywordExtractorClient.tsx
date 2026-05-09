"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Lock, Copy, Check } from 'lucide-react';
import { topKeywords } from '@/lib/text-analysis';

export default function KeywordExtractorClient() {
  const [jd, setJd] = useState('');
  const [results, setResults] = useState<ReturnType<typeof topKeywords>>([]);
  const [hasRun, setHasRun] = useState(false);
  const [copied, setCopied] = useState(false);

  const onExtract = () => {
    setResults(topKeywords(jd, 30));
    setHasRun(true);
    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(() => {
        document.getElementById('keyword-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };

  const onClear = () => {
    setJd('');
    setResults([]);
    setHasRun(false);
  };

  const technical = results.filter((r) => r.isTechnical);
  const general = results.filter((r) => !r.isTechnical);

  const copyAll = () => {
    const all = results.map((r) => r.term).join(', ');
    navigator.clipboard?.writeText(all);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Paste any job description
        </label>
        <Textarea
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          placeholder="Paste the full job description here..."
          rows={14}
          className="font-mono text-sm"
        />
        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
          <Lock className="h-3 w-3" />
          Runs in your browser. The text never leaves your device.
        </p>

        <div className="flex gap-3 justify-center mt-6">
          <Button
            onClick={onExtract}
            disabled={jd.trim().length < 50}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
          >
            Extract Keywords
          </Button>
          {hasRun && (
            <Button onClick={onClear} variant="outline" size="lg">
              Reset
            </Button>
          )}
        </div>
      </Card>

      {results.length > 0 && (
        <div id="keyword-results" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Top {results.length} Keywords
            </h2>
            <Button onClick={copyAll} variant="outline" size="sm">
              {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy all'}
            </Button>
          </div>

          {technical.length > 0 && (
            <Card className="p-6 border-blue-200 bg-blue-50/40">
              <h3 className="font-bold text-lg text-blue-900 mb-2">Technical & domain keywords</h3>
              <p className="text-sm text-blue-800 mb-4">
                These are the highest-priority terms to mirror verbatim in your resume and cover letter — ATS systems do exact matching on technical terms.
              </p>
              <div className="flex flex-wrap gap-2">
                {technical.map((k) => (
                  <span key={k.term} className="bg-white border border-blue-300 text-blue-900 rounded-full px-3 py-1 text-sm">
                    {k.term}
                    <span className="ml-1.5 text-xs text-blue-600">×{k.count}</span>
                  </span>
                ))}
              </div>
            </Card>
          )}

          {general.length > 0 && (
            <Card className="p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-2">General keywords</h3>
              <p className="text-sm text-gray-600 mb-4">
                Frequency-ranked terms from the JD. Look for ones describing responsibilities, methodologies, or soft skills relevant to your background.
              </p>
              <div className="flex flex-wrap gap-2">
                {general.map((k) => (
                  <span key={k.term} className="bg-gray-50 border border-gray-300 text-gray-800 rounded-full px-3 py-1 text-sm">
                    {k.term}
                    <span className="ml-1.5 text-xs text-gray-500">×{k.count}</span>
                  </span>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
