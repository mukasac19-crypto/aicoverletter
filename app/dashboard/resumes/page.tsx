// /app/dashboard/resumes/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { Database } from '@/types/supabase';
import { mapDatabaseToResumeData } from '@/types/resume';
import { getAllFeatureUsage } from '@/lib/subscription-enforcement';
import { ResumeData } from '@/types/resume';
import ResumeDashboardClient from './ResumeDashboardClient';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { createClient } from '@/utils/server-side-client';

const RESUMES_PER_PAGE = 8;

export default async function ResumeDashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const cookieStore = cookies();
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect('/');
  }

  const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;
  const searchTerm = typeof searchParams.q === 'string' ? searchParams.q : '';
  const filter = typeof searchParams.filter === 'string' ? searchParams.filter : 'all';

  const from = (page - 1) * RESUMES_PER_PAGE;
  const to = from + RESUMES_PER_PAGE - 1;

  async function getResumes() {
    let query = supabase
      .from('resumes')
      .select('*', { count: 'exact' })
      .eq('user_id', session!.user.id);

    if (searchTerm) {
      query = query.ilike('title', `%${searchTerm}%`);
    }

    if (filter === 'recent') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      query = query.gte('updated_at', sevenDaysAgo.toISOString());
    }

    query = query.order('updated_at', { ascending: false }).range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching resumes:', error);
      return { initialResumes: [], count: 0 };
    }

    const initialResumes = (data || [])
      .map(dbResume => mapDatabaseToResumeData(dbResume as any))
      .filter((r): r is ResumeData => r !== null);

    return { initialResumes, count: count ?? 0 };
  }

  async function getUsage() {
    const usage = await getAllFeatureUsage(supabase, session!.user.id);
    return usage;
  }

  const { initialResumes, count } = await getResumes();
  const usage = await getUsage();
  const pageCount = Math.ceil(count / RESUMES_PER_PAGE);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ResumeDashboardClient
        initialResumes={initialResumes}
        initialUsage={usage}
        pageCount={pageCount}
      />
    </Suspense>
  );
}