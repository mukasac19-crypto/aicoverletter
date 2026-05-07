import { redirect } from 'next/navigation';
import { getServerClient } from '@/lib/supabase-server';

export default async function CoverLetterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // In server components, we need to use Supabase directly instead of useAuth hook
  const supabase = await getServerClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return redirect('/login');
  }

  // Await the params to get the id
  const { id } = await params;

  // Redirect to the preview page
  return redirect(`/dashboard/cover-letters/${id}/preview`);
}

// This ensures the page is dynamic and not statically generated
export const dynamic = 'force-dynamic';