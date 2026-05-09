import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Sparkles, MessagesSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  INTERVIEW_QUESTIONS,
  groupInterviewQuestionsByCategory,
} from '@/lib/interview-questions-data';
import { getCanonicalSiteUrl } from '@/lib/seo';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Interview Questions by Job — Software Engineer, PM, Nurse, Teacher & More',
  description:
    'The most common interview questions for every major role, with sample answers, hiring-panel insights, and FAQ. Practice with CareerThings AI Interview Buddy.',
  alternates: { canonical: '/interview-questions' },
  openGraph: {
    type: 'website',
    title: 'Interview Questions by Job — CareerThings AI',
    description:
      'Common interview questions for every major role, with sample answers and hiring-panel insights.',
    url: '/interview-questions',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Interview Questions by Job — CareerThings AI',
    description: 'Common interview questions, sample answers, and hiring-panel insights.',
  },
};

export default function InterviewQuestionsIndexPage() {
  const grouped = groupInterviewQuestionsByCategory();
  const siteUrl = getCanonicalSiteUrl();

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Interview Questions by Job',
    url: `${siteUrl}/interview-questions`,
    description:
      'A collection of interview-question guides organized by job title, with sample answers and hiring-panel insights.',
    hasPart: INTERVIEW_QUESTIONS.map((ex) => ({
      '@type': 'Article',
      headline: ex.meta.title,
      url: `${siteUrl}/interview-questions/${ex.slug}`,
      description: ex.meta.description,
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Interview Questions', item: `${siteUrl}/interview-questions` },
    ],
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50/30 via-white to-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-800 mb-4">
            INTERVIEW QUESTIONS
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Interview Questions for Every Job
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            The most common interview questions by role, with sample answers, hiring-panel
            structure, and what each interviewer is actually screening for.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="bg-gradient-to-r from-orange-600 to-orange-600 hover:from-orange-700 hover:to-orange-700 text-white shadow-xl shadow-orange-500/25 px-8">
                <Sparkles className="mr-2 h-5 w-5" />
                Practice with AI Interview Buddy
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-6xl mx-auto space-y-12">
          {Object.entries(grouped).map(([category, examples]) => (
            <div key={category}>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {examples.map((example) => (
                  <Card key={example.slug} className="p-6 border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <MessagesSquare className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">
                          <Link href={`/interview-questions/${example.slug}`} className="hover:text-indigo-600 transition-colors">
                            {example.jobTitle} Interview Questions
                          </Link>
                        </h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">{example.shortDescription}</p>
                    <Link href={`/interview-questions/${example.slug}`} className="text-indigo-600 hover:text-indigo-700 font-medium text-sm inline-flex items-center">
                      View questions
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-orange-600 to-orange-700 text-white py-16">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Practice with the AI that adapts to you.
          </h2>
          <p className="text-lg text-orange-50 mb-8">
            CareerThings AI Interview Buddy generates role-specific questions, listens to your answers, and gives feedback on structure, content, and clarity — all tailored to your resume and the job you’re targeting.
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="bg-white text-orange-700 hover:bg-orange-50 shadow-xl px-8">
              <Sparkles className="mr-2 h-5 w-5" />
              Try Interview Buddy Free
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
