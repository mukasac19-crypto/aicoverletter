// app/api/resumes/ats-scanner/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/api-helpers';
import openai from '@/lib/openai';

export async function POST(request: NextRequest) {
  return withAuth(request, async ({ userId, isPro, supabase }) => {
    // PRO-only feature
    if (!isPro) {
      return NextResponse.json(
        { 
          error: 'PRO subscription required',
          message: 'ATS Scanner is available for PRO users only. Upgrade to analyze your resume for ATS compatibility.',
          features: [
            'Keyword matching analysis',
            'ATS formatting checks',
            'Score and recommendations',
            'Industry-specific optimization'
          ],
          upgradeUrl: '/pricing?feature=ats-scanner'
        },
        { status: 403 }
      );
    }
    
    try {
      const { resumeId, jobDescription } = await request.json();
      
      if (!resumeId || !jobDescription) {
        return NextResponse.json(
          { error: 'Resume ID and job description are required' },
          { status: 400 }
        );
      }
      
      // Fetch the resume
      const { data: resumeData, error: fetchError } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', resumeId)
        .eq('user_id', userId)
        .single();
      
      if (fetchError || !resumeData) {
        return NextResponse.json(
          { error: 'Resume not found or access denied' },
          { status: 404 }
        );
      }
      
      // Prepare resume for analysis
      const resumeContent = prepareResumeForAnalysis(resumeData);
      
      // Call OpenAI for ATS analysis
      const systemPrompt = `You are an expert ATS (Applicant Tracking System) analyzer.
Analyze the resume against the job description and provide:
1. Overall ATS compatibility score (0-100)
2. Keyword matches and missing keywords
3. Formatting issues that might cause ATS problems
4. Specific recommendations for improvement

Return as JSON with structure:
{
  "score": number,
  "keywordAnalysis": {
    "matched": string[],
    "missing": string[],
    "matchPercentage": number
  },
  "formattingIssues": string[],
  "recommendations": string[],
  "summary": string
}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: `Resume:\n${JSON.stringify(resumeContent)}\n\nJob Description:\n${jobDescription}`
          }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      });
      
      const analysis = JSON.parse(completion.choices[0].message?.content || '{}');
      
      // Save analysis to database
      const { data: savedAnalysis, error: saveError } = await supabase
        .from('ats_analyses')
        .insert({
          user_id: userId,
          resume_id: resumeId,
          job_description: jobDescription,
          score: analysis.score,
          analysis: analysis,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (saveError) {
        console.error('Error saving ATS analysis:', saveError);
      }
      
      return NextResponse.json({
        success: true,
        data: {
          id: savedAnalysis?.id,
          ...analysis,
          resumeId,
          analyzedAt: new Date().toISOString()
        }
      });
      
    } catch (error: any) {
      console.error('ATS Scanner error:', error);
      
      if (error.status === 429) {
        return NextResponse.json(
          { error: 'Analysis service is busy. Please try again in a few minutes.' },
          { status: 429 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to analyze resume', details: error.message },
        { status: 500 }
      );
    }
  });
}

function prepareResumeForAnalysis(resumeData: any) {
  return {
    personalInfo: {
      name: resumeData.personal_info?.name || '',
      email: resumeData.personal_info?.email || '',
      phone: resumeData.personal_info?.phone || '',
      title: resumeData.personal_info?.title || '',
      summary: resumeData.personal_info?.summary || ''
    },
    skills: resumeData.skills || [],
    experience: resumeData.work_experience || [],
    education: resumeData.education || [],
    certifications: resumeData.certifications || []
  };
}