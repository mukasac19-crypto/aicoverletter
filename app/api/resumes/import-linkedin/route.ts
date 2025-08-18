// app/api/resumes/import-linkedin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';
import { createResumeFromLinkedInData } from '@/lib/resumeUtils';
import {
  formatExperiences,
  formatEducations,
  formatSkills,
  formatCertifications,
  formatLanguages,
  formatProjects,
  getProfilePictureUrl,
} from '@/lib/formattingUtils';
import { createClient } from '@/utils/server-side-client';

const PROXYCURL_API_KEY = process.env.PROXYCURL_API_KEY;
const PROXYCURL_PERSON_ENDPOINT = 'https://nubela.co/proxycurl/api/v2/linkedin';

type LinkedInProfileInsert = Database['public']['Tables']['linkedin_profiles']['Insert'];

async function fetchAndFormatLinkedInData(targetLinkedInUrl: string): Promise<Omit<LinkedInProfileInsert, 'user_id'> | null> {
  if (!PROXYCURL_API_KEY) {
    console.error('Proxycurl API key is not set.');
    return null;
  }

  const params = new URLSearchParams({
    linkedin_profile_url: targetLinkedInUrl,
    skills: 'include',
    use_cache: 'if-present',
  });

  const proxycurlResponse = await fetch(`${PROXYCURL_PERSON_ENDPOINT}?${params.toString()}`, {
    headers: { Authorization: `Bearer ${PROXYCURL_API_KEY}` },
  });

  if (!proxycurlResponse.ok) {
    console.error(`Proxycurl API error: ${proxycurlResponse.statusText}`);
    return null;
  }

  const proxycurlData = await proxycurlResponse.json();
  const experience_json = formatExperiences(proxycurlData.experiences);
  const education_json = formatEducations(proxycurlData.education);
  const skills_json = formatSkills(proxycurlData.skills);
  const certifications_json = formatCertifications(proxycurlData.certifications);
  const languages_json = formatLanguages(proxycurlData.languages);
  const projects_json = formatProjects(proxycurlData.accomplishment_projects);
  const profile_picture_url = getProfilePictureUrl(proxycurlData);

  return {
    linkedin_id: proxycurlData.public_identifier,
    profile_url: targetLinkedInUrl,
    name: proxycurlData.full_name,
    headline: proxycurlData.headline,
    summary: proxycurlData.summary,
    profile_picture_url,
    location: `${proxycurlData.city}, ${proxycurlData.state || proxycurlData.country}`,
    position: proxycurlData.occupation,
    company: proxycurlData.experiences?.[0]?.company,
    experience_json: experience_json as any,
    education_json: education_json as any,
    skills_json: skills_json as any,
    certifications_json: certifications_json as any,
    languages_json: languages_json as any,
    projects_json: projects_json as any,
    last_synced: new Date().toISOString(),
    status: 'connected',
  };
}

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
   const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { targetLinkedInUrl } = await request.json();
  if (!targetLinkedInUrl) {
    return NextResponse.json({ error: 'LinkedIn profile URL is required' }, { status: 400 });
  }

  const linkedInData = await fetchAndFormatLinkedInData(targetLinkedInUrl);
  if (!linkedInData) {
    return NextResponse.json({ error: 'Failed to fetch LinkedIn data' }, { status: 500 });
  }

  const { data: existingProfile } = await supabase
    .from('linkedin_profiles')
    .select('id')
    .eq('user_id', session.user.id)
    .single();
    
  const profileData = { ...linkedInData, user_id: session.user.id };

  if (existingProfile) {
    await supabase
      .from('linkedin_profiles')
      .update(profileData)
      .eq('id', existingProfile.id);
  } else {
    await supabase.from('linkedin_profiles').insert(profileData);
  }

  const { data: storedProfile } = await supabase
    .from('linkedin_profiles')
    .select('*')
    .eq('user_id', session.user.id)
    .single();

  if (!storedProfile) {
    return NextResponse.json({ error: 'Failed to retrieve stored LinkedIn profile' }, { status: 500 });
  }

  const result = await createResumeFromLinkedInData(supabase, session.user.id, storedProfile);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ resumeId: result.resumeId });
}
