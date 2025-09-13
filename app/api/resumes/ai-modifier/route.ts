// app/api/resumes/ai-modifier/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/api-helpers';
import openai from '@/lib/openai';
import { SupabaseClient } from '@supabase/supabase-js';

// Helper function to fetch the resume from the database
async function getResume(supabase: SupabaseClient, resumeId: string, userId: string) {
    const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', resumeId)
        .eq('user_id', userId)
        .single();
    
    if (error || !data) {
        console.error('AI Modifier: Resume fetch error:', error);
        throw new Error('Resume not found or access denied');
    }
    
    return data;
}

// The main handler for the POST request
export async function POST(request: NextRequest) {
  return withAuth(request, async ({ userId, supabase }) => {
    try {
      const { resumeId, analysis } = await request.json();

      if (!resumeId || !analysis) {
        return NextResponse.json(
          { error: 'Resume ID and analysis are required' },
          { status: 400 }
        );
      }

      // Step 1: Fetch the user's current resume from the database
      const currentResume = await getResume(supabase, resumeId, userId);

      // Step 2: Create a detailed prompt for the OpenAI API
      const systemPrompt = `You are an expert resume editor. Your task is to intelligently modify a user's resume based on the provided ATS scan analysis.

-   Carefully review the resume content and the ATS recommendations.
-   Incorporate the 'missing' and 'recommended' keywords naturally into the resume's summary, experience descriptions, and skills sections. Do not just list them.
-   Address formatting issues by restructuring the content as needed.
-   Implement the improvement recommendations.
-   Rewrite sections to be more impactful and concise, tailored to the job description implied by the ATS analysis.
-   Maintain the original JSON structure of the resume. Only modify the content of the fields. Do not add or remove fields from the original resume structure.

The goal is to significantly improve the resume's ATS score and overall quality while preserving the user's core experience and skills.`;
      
      const userPrompt = `Please modify the following resume based on the ATS analysis provided.

**Original Resume JSON:**
\`\`\`json
${JSON.stringify(currentResume, null, 2)}
\`\`\`

**ATS Analysis and Recommendations:**
\`\`\`json
${JSON.stringify(analysis, null, 2)}
\`\`\`

Return the complete, updated resume as a single JSON object, maintaining the exact original structure.`;

      // Step 3: Call the OpenAI API to get the modified resume
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.5,
        response_format: { type: "json_object" }
      });

      const responseContent = completion.choices[0].message?.content;
      if (!responseContent) {
        throw new Error('AI failed to generate a modified resume.');
      }

      const modifiedResume = JSON.parse(responseContent);

      // Step 4: Save the updated resume to the database
      const { id, user_id, created_at, ...updateData } = modifiedResume;

      const { data: updatedData, error: updateError } = await supabase
        .from('resumes')
        .update(updateData)
        .eq('id', resumeId)
        .eq('user_id', userId)
        .select()
        .single();
      
      if (updateError) {
        console.error('AI Modifier: Resume update error:', updateError);
        throw new Error('Failed to save the updated resume.');
      }

      // Step 5: Return a success response to the frontend
      return NextResponse.json({ 
        success: true, 
        message: 'Resume updated successfully!',
        updatedResume: updatedData
      });

    } catch (error: any) {
      console.error('AI Modifier Error:', {
        message: error.message,
        stack: error.stack,
      });
      
      return NextResponse.json(
        { error: 'Failed to modify resume', details: error.message },
        { status: 500 }
      );
    }
  });
}
