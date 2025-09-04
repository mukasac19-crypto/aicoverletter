// app/api/generate/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { QueueEvents, Job } from 'bullmq';
import { openaiQueue } from '@/lib/queues/openaiQueue';
import { Database } from '@/types/supabase';
import redisConnection from '@/lib/redis';
import { rateLimitApiRoute } from '@/lib/simple-rate-limiter';
import { checkFeatureUsage } from '@/lib/api-helpers';

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check rate limit
    const rateLimitResult = await rateLimitApiRoute(
      session.user.id,
      '/api/generate'
    );

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          error: "Too Many Requests",
          message: rateLimitResult.error?.message,
          retryAfter: rateLimitResult.headers['Retry-After']
        },
        { 
          status: 429,
          headers: rateLimitResult.headers 
        }
      );
    }

    // Check if user is PRO
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('status', 'active')
      .maybeSingle();
    
    const isPro = !!subscription;

    // Check feature usage for cover letters
    const usageCheck = await checkFeatureUsage(
      session.user.id,
      'coverLetters',
      isPro,
      supabase
    );

    if (!usageCheck.allowed) {
      return NextResponse.json(
        { 
          error: 'Usage Limit Exceeded',
          message: usageCheck.error,
          upgradeUrl: '/pricing'
        },
        { 
          status: 403,
          headers: rateLimitResult.headers 
        }
      );
    }

    const {
      jobDescription,
      userProfile,
      tone = "professional",
      regenerate = false,
      dataSource = "none",
      coverLetterId = crypto.randomUUID(),
    } = await request.json();

    if (!jobDescription) {
      return NextResponse.json(
        { error: "Job description is required" },
        { 
          status: 400,
          headers: rateLimitResult.headers
        }
      );
    }

    const jobId = `cl_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    try {
      const job: Job = await openaiQueue.add(
        "openai-requests",
        {
          name: "generate-cover-letter",
          data: {
            jobId,
            jobDescription,
            userProfile,
            tone,
            userId: session.user.id,
            coverLetterId,
            webhookUrl: process.env.WEBHOOK_URL,
            webhookToken: process.env.WEBHOOK_TOKEN,
            metadata: {
              regenerate,
              dataSource,
              timestamp: new Date().toISOString(),
              isPro, // Include tier info for potential premium features
            },
          },
        },
        {
          jobId: `generate-coverLetter-${Date.now()}`,
          removeOnComplete: true,
          removeOnFail: 5,
        }
      );

      const queueEvents = new QueueEvents("openai-requests", { connection: redisConnection });

      let result: any;
      try {
        result = await job.waitUntilFinished(queueEvents);
        console.log("generated cover letter result", result);

        if (
          !result ||
          !result.success ||
          !result.data?.content ||
          !result.data?.jobTitle ||
          !result.data?.companyName
        ) {
          const errorMessage =
            result?.error?.message ||
            "Failed to generate cover letter: Incomplete data received from worker.";
          
          return NextResponse.json(
            { 
              error: errorMessage,
              jobId: job.id 
            },
            { 
              status: 500,
              headers: rateLimitResult.headers
            }
          );
        }

        const { content, jobTitle, companyName } = result.data;

        // Save to database
        const { data: savedCoverLetter, error: dbError } = await supabase
          .from("cover_letters")
          .upsert([
            {
              id: coverLetterId,
              user_id: session.user.id,
              job_title: jobTitle,
              company_name: companyName,
              job_description: jobDescription,
              content: content,
              tone: tone,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ])
          .select()
          .single();

        if (dbError) {
          console.error("Failed to save cover letter:", dbError);
          return NextResponse.json(
            { 
              error: "Failed to save cover letter",
              details: dbError.message 
            },
            { 
              status: 500,
              headers: rateLimitResult.headers
            }
          );
        }

        // Return successful response with rate limit headers
        return NextResponse.json(
          {
            success: true,
            data: {
              id: savedCoverLetter.id,
              content: savedCoverLetter.content,
              jobTitle: savedCoverLetter.job_title,
              companyName: savedCoverLetter.company_name,
              tone: savedCoverLetter.tone,
              createdAt: savedCoverLetter.created_at,
              isPro,
            },
          },
          { 
            headers: rateLimitResult.headers
          }
        );

      } catch (jobError: any) {
        console.error("Job processing error:", jobError);
        
        if (jobError.message?.includes("Job wait")) {
          return NextResponse.json(
            { 
              error: "Job processing timeout. Please try again.",
              jobId: job.id 
            },
            { 
              status: 504,
              headers: rateLimitResult.headers
            }
          );
        }
        
        return NextResponse.json(
          { 
            error: "Failed to process job",
            details: jobError.message,
            jobId: job.id 
          },
          { 
            status: 500,
            headers: rateLimitResult.headers
          }
        );
      }

    } catch (queueError: any) {
      console.error("Queue error:", queueError);
      return NextResponse.json(
        { 
          error: "Failed to queue job",
          details: queueError.message 
        },
        { 
          status: 500,
          headers: rateLimitResult.headers
        }
      );
    }

  } catch (error: any) {
    console.error("Unexpected error in generate route:", error);
    return NextResponse.json(
      { 
        error: "An unexpected error occurred",
        details: error.message 
      },
      { status: 500 }
    );
  }
}