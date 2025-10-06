//C:\Users\mukas\OneDrive\Desktop\Coverletter\aicoverletter\app\landing\cover-letter-demo\page.tsx

"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Sparkles,
  CheckCircle2,
  Loader2,
  Lock,
  ArrowRight,
  Star,
} from "lucide-react";

// --- Supabase Thumbnails ---
const coverLetterTemplates = [
  {
    id: 1,
    name: "Modern Professional",
    description: "Clean modern design perfect for any industry",
    image:
      "https://fweaogysitcigfzncvtu.supabase.co/storage/v1/object/public/cover-letter-templates/modern%20receptionist%20cover.png",
    category: "Modern",
    matchRate: "95%",
  },
  {
    id: 2,
    name: "Executive Blue",
    description: "Professional navy header design for senior roles",
    image:
      "https://fweaogysitcigfzncvtu.supabase.co/storage/v1/object/public/cover-letter-templates/navy%20header%20sidebar%20cover.png",
    category: "Executive",
    matchRate: "92%",
  },
  {
    id: 3,
    name: "Navy Sidebar",
    description: "Elegant left sidebar layout with navy accents",
    image:
      "https://fweaogysitcigfzncvtu.supabase.co/storage/v1/object/public/cover-letter-templates/navy%20left%20sidebar%20cover.png",
    category: "Professional",
    matchRate: "94%",
  },
  {
    id: 4,
    name: "Classic Format",
    description: "Traditional layout for conservative industries",
    image:
      "https://fweaogysitcigfzncvtu.supabase.co/storage/v1/object/public/cover-letter-templates/modern%20receptionist%20cover.png",
    category: "Traditional",
    matchRate: "91%",
  },
];

type Sample = { id: number; title: string; body: string };
const fallbackRole = "Marketing Manager";

function makeSamples(role: string, jd?: string): { main: string } {
  const r = role.trim() || fallbackRole;
  const context =
    (jd?.trim()?.length ?? 0) > 0
      ? " based on the job description you provided"
      : "";

  const main = `Dear Hiring Manager,

I’m excited to apply for the ${r} role${context}. Over the last few years I’ve led projects that combined data-driven strategy with creative execution, increasing campaign ROI while improving cross-functional collaboration. I enjoy turning ambiguous problems into structured plans, and I’m comfortable owning outcomes end-to-end.

Your team’s focus on measurable impact and high-quality user experiences resonates with me. I’d love to bring my experience in stakeholder management, content testing, and analytics to help you accelerate outcomes this quarter.

Sincerely,
Jane Doe`;

  return { main };
}

export default function CoverLetterDemoPage() {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState<{ main: string } | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setTimeout(() => {
      setGenerated(makeSamples(role, jd));
      setLoading(false);
      if (typeof window !== "undefined") {
        document
          .getElementById("results")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 900);
  };

  const unlock = (where: string) => {
    const q = new URLSearchParams({
      intent: `cover-letter-demo-${where}`,
      role: role || fallbackRole,
    }).toString();
    router.push(`/auth/register?${q}`);
  };

  const skills = useMemo(() => {
    const r = (role || fallbackRole).toLowerCase();
    const base = ["Ownership", "Writing", "Measurement", "Stakeholder comms", "Iteration"];
    if (r.includes("engineer")) return ["Systems thinking", "Code quality", "Shipping", "DX/UX", ...base];
    if (r.includes("designer")) return ["Problem framing", "Interaction design", "Prototyping", "Usability", ...base];
    if (r.includes("product")) return ["Strategy", "Prioritization", "Experiments", "Alignment", ...base];
    if (r.includes("marketing")) return ["Lifecycle", "Paid & SEO", "Attribution", "Testing", ...base];
    return base;
  }, [role]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 relative">
      {/* Sticky Unlock Banner */}
      {generated && !loading && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-white shadow-lg border border-orange-200 px-6 py-3 rounded-full flex items-center gap-3 animate-fade-in">
            <Sparkles className="text-orange-600 h-4 w-4" />
            <span className="text-sm font-medium text-gray-800">
              Want to use your letter with our professional templates?
            </span>
            <Button
              size="sm"
              className="bg-orange-600 hover:bg-orange-700 text-white"
              onClick={() => unlock("main")}
            >
              Unlock & Continue
            </Button>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="px-4">
        <div className="max-w-5xl mx-auto pt-16 pb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 text-orange-700 px-3 py-1 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            Try it free — no card required
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mt-4 text-gray-900">
            Get a job-ready cover letter in 60 seconds
          </h1>
          <p className="text-gray-600 mt-3 text-lg">
            Type a role, drop in a job description (optional), and see how your letter will read.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Input
                placeholder="Target role (e.g., Product Designer)"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="h-12 max-w-md mx-auto sm:mx-0"
              />
              <Button
                onClick={handleGenerate}
                disabled={loading || (role.trim().length === 0 && jd.trim().length === 0)}
                className="h-12 px-5 bg-orange-600 hover:bg-orange-700"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                {loading ? "Generating…" : "Generate Demo"}
              </Button>
            </div>
            <div className="max-w-2xl mx-auto w-full">
              <Textarea
                placeholder="Paste a job description (optional)"
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                className="min-h-[110px] resize-y"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section id="results" className="px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          {generated && !loading && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Preview */}
              <Card className="p-6 col-span-2 relative overflow-hidden">
                <h3 className="font-semibold text-lg">
                  Preview for {role.trim() || fallbackRole}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  This is your AI-generated letter preview — blurred for privacy.
                </p>

                <div className="relative mt-3 border rounded-lg bg-white/90 shadow-inner p-4 overflow-hidden">
                  <pre className="whitespace-pre-wrap text-[15px] leading-7 text-gray-800">
                    {generated.main}
                  </pre>

                  {/* blur lower half */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white via-white/80 to-transparent backdrop-blur-[3px]" />

                  {/* overlay CTA */}
                  <div className="absolute bottom-4 inset-x-0 flex justify-center">
                    <Button
                      onClick={() => unlock("main")}
                      className="bg-orange-600 hover:bg-orange-700 shadow-lg"
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Unlock Full Letter & Customize
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Right side: skills */}
              <Card className="p-6">
                <h3 className="font-semibold text-lg">What we’ll highlight</h3>
                <ul className="mt-3 space-y-2">
                  {skills.map((s, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-700">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      {s}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 rounded-lg border bg-white p-4">
                  <p className="text-sm text-gray-700 font-medium">Social proof</p>
                  <div className="mt-2 flex items-center gap-1 text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    “The letter read like me, just better. I got interviews within a week.”
                  </p>
                  <p className="mt-1 text-xs text-gray-500">— Sarah, PRO user</p>
                </div>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* Templates CTA Section */}
      <section className="px-4 pb-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">
            Make Your Cover Letter Stand Out
          </h2>
          <p className="text-gray-600">
            Apply your AI-generated content to stunning, recruiter-tested templates below.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {coverLetterTemplates.map((template) => (
            <Card
              key={template.id}
              className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white"
            >
              <div className="relative aspect-[8.5/11] overflow-hidden">
                <img
                  src={template.image}
                  alt={template.name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                  {template.matchRate} Match
                </div>
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold text-gray-800">{template.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                <Button
                  onClick={() => unlock("template")}
                  className="mt-4 bg-orange-600 hover:bg-orange-700 text-white w-full"
                >
                  <Lock className="w-4 h-4 mr-1" />
                  Use This Template
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
