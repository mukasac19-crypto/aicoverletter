"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, AlertCircle, Lock } from 'lucide-react';
import { compareForAts, detectFormattingIssues, type AtsResult } from '@/lib/text-analysis';

export default function AtsCheckerClient() {
  const [resume, setResume] = useState('');
  const [jd, setJd] = useState('');
  const [result, setResult] = useState<AtsResult | null>(null);
  const [issues, setIssues] = useState<string[]>([]);
  const [hasRun, setHasRun] = useState(false);

  const onCheck = () => {
    setResult(compareForAts(jd, resume));
    setIssues(detectFormattingIssues(resume));
    setHasRun(true);
    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(() => {
        document.getElementById('ats-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };

  const onClear = () => {
    setResume('');
    setJd('');
    setResult(null);
    setIssues([]);
    setHasRun(false);
  };

  const scoreColor =
    result == null ? 'text-gray-400' :
    result.score >= 70 ? 'text-green-600' :
    result.score >= 50 ? 'text-amber-600' :
    'text-red-600';

  const scoreLabel =
    result == null ? '—' :
    result.score >= 70 ? 'Strong match' :
    result.score >= 50 ? 'Decent match — improvements possible' :
    'Weak match — major gaps';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            1. Paste your resume text
          </label>
          <Textarea
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            placeholder="Paste the full text of your resume here..."
            rows={14}
            className="font-mono text-sm"
          />
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
            <Lock className="h-3 w-3" />
            Stays in your browser. Nothing is uploaded.
          </p>
        </Card>

        <Card className="p-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            2. Paste the job description
          </label>
          <Textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste the full job description here..."
            rows={14}
            className="font-mono text-sm"
          />
          <p className="text-xs text-gray-500 mt-2">
            Tip: copy the full posting including responsibilities and requirements.
          </p>
        </Card>
      </div>

      <div className="flex gap-3 justify-center">
        <Button
          onClick={onCheck}
          disabled={resume.trim().length < 50 || jd.trim().length < 50}
          size="lg"
          className="bg-orange-600 hover:bg-orange-700 text-white px-8"
        >
          Check My ATS Match
        </Button>
        {hasRun && (
          <Button onClick={onClear} variant="outline" size="lg">
            Reset
          </Button>
        )}
      </div>

      {result && (
        <div id="ats-results" className="space-y-6 pt-4">
          <Card className="p-8 border-gray-200">
            <div className="text-center">
              <div className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-2">
                ATS Match Score
              </div>
              <div className={`text-7xl font-bold ${scoreColor}`}>{result.score}%</div>
              <div className={`text-lg mt-2 font-medium ${scoreColor}`}>{scoreLabel}</div>
              <p className="text-sm text-gray-600 mt-3 max-w-md mx-auto">
                Of {result.jdKeywordCount} top keywords detected in the job description, {result.matched.length} appear in your resume.
              </p>
            </div>
          </Card>

          {result.missing.length > 0 && (
            <Card className="p-6 border-amber-200 bg-amber-50">
              <h3 className="font-bold text-lg text-amber-900 mb-2 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Missing keywords ({result.missing.length})
              </h3>
              <p className="text-sm text-amber-800 mb-3">
                These keywords appear in the JD but not in your resume. Mirror the relevant ones — but only if they actually match your experience.
              </p>
              <div className="flex flex-wrap gap-2">
                {result.missing.map((kw) => (
                  <span key={kw} className="bg-white border border-amber-300 text-amber-900 rounded-full px-3 py-1 text-sm">
                    {kw}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {result.matched.length > 0 && (
            <Card className="p-6 border-green-200 bg-green-50">
              <h3 className="font-bold text-lg text-green-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Matched keywords ({result.matched.length})
              </h3>
              <p className="text-sm text-green-800 mb-3">
                These keywords from the JD already appear in your resume.
              </p>
              <div className="flex flex-wrap gap-2">
                {result.matched.map((kw) => (
                  <span key={kw} className="bg-white border border-green-300 text-green-900 rounded-full px-3 py-1 text-sm">
                    {kw}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {issues.length > 0 && (
            <Card className="p-6 border-blue-200 bg-blue-50">
              <h3 className="font-bold text-lg text-blue-900 mb-3">Formatting suggestions</h3>
              <ul className="space-y-2">
                {issues.map((issue, i) => (
                  <li key={i} className="text-sm text-blue-900 flex items-start gap-2">
                    <span className="mt-1">•</span>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
