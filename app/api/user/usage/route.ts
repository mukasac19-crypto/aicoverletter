// app/api/user/usage/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/server-side-client';
import { getAllFeatureUsage } from '@/lib/subscription-enforcement';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    const { data: { session } } = await supabase.auth.getSession();
    
    const userId = user?.id;
    const accessToken = session?.access_token;
    
    console.log("============SERVER USER ID============", userId);
    console.log("============SERVER ACCESS TOKEN============", accessToken);
    
    if (!userId || !accessToken) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized: Missing user ID' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Get all feature usage for the user
    const allUsage = await getAllFeatureUsage(supabase, userId);
    
    // Log the usage data for debugging
    console.log("============USER USAGE DATA============", allUsage);
    console.log("User ID:", userId);
    console.log("Cover Letters:", allUsage.coverLetters);
    console.log("Resumes:", allUsage.resumes);
    console.log("ATS Scans:", allUsage.atsScans);
    console.log("Interview Sessions:", allUsage.interviewSessions);
    
    return NextResponse.json(allUsage);
    
  } catch (error: any) {
    console.error('Error fetching user usage:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error', details: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}