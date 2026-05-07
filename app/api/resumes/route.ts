// app/api/resumes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerClient } from '@/lib/supabase-server';
import { withAuth, checkFeatureUsage } from '@/lib/api-helpers';

export async function GET(request: NextRequest) {
  return withAuth(request, async ({ userId, isPro, supabase }) => {
    const { searchParams } = new URL(request.url);
    const includeDeleted = searchParams.get('includeDeleted') === 'true';
    
    let query = supabase
      .from('resumes')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    
    if (!includeDeleted) {
      query = query.is('deleted_at', null);
    }
    
    const { data, error } = await query;
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ data });
  });
}

export async function POST(request: NextRequest) {
  return withAuth(request, async ({ userId, isPro, supabase }) => {
    const resumeData = await request.json();
    
    // Check if updating or creating new
    const isUpdate = !!resumeData.id;
    
    if (!isUpdate) {
      // Check resume limit for new resumes
      const usageCheck = await checkFeatureUsage(userId, 'resumes', isPro, supabase);
      if (!usageCheck.allowed) {
        return NextResponse.json(
          { 
            error: 'Resume Limit Reached',
            message: usageCheck.error,
            upgradeUrl: '/pricing'
          }, 
          { status: 403 }
        );
      }
    }
    
    // Prepare data for insert/update
    const dataToSave = {
      ...resumeData,
      user_id: userId,
      updated_at: new Date().toISOString(),
      is_pro: isPro, // Track if created with PRO account
    };
    
    // Remove id for new resumes
    if (!isUpdate) {
      delete dataToSave.id;
      dataToSave.created_at = new Date().toISOString();
    }
    
    // Create or update resume
    const { data, error } = isUpdate
      ? await supabase
          .from('resumes')
          .update(dataToSave)
          .eq('id', resumeData.id)
          .eq('user_id', userId) // Ensure user owns the resume
          .select()
          .single()
      : await supabase
          .from('resumes')
          .insert(dataToSave)
          .select()
          .single();
    
    if (error) {
      console.error('Resume save error:', error);
      return NextResponse.json(
        { error: 'Failed to save resume', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data,
      message: isUpdate ? 'Resume updated successfully' : 'Resume created successfully'
    });
  });
}