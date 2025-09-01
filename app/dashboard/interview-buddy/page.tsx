"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/client-side-client";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { 
  FileText, 
  MessagesSquare, 
  Sparkles,
  FileSpreadsheet
} from 'lucide-react';
import Link from "next/link";
import InterviewBuddyGenerator from "@/components/InterviewBuddyGenerator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSubscription } from "@/lib/hooks/useSubscription";
import FeatureUsageIndicator from "@/components/FeatureUsageIndicator";
import { useAuthStore } from "@/stores/authstore";

export default function InterviewBuddyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const supabase = createClient();
  
  const [resumes, setResumes] = useState<any[]>([]);
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState("generate");

  // Get subscription and usage data
  const { usageStats, loading: usageLoading } = useSubscription();
  const interviewUsage = usageStats?.interviewSessions;
  
  const resumeId = searchParams.get("resumeId");
  const jobTitle = searchParams.get("jobTitle");
  const jobId = searchParams.get("jobId");
  
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        
        const resumePromise = supabase
          .from('resumes')
          .select('id, title, updated_at')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });

        const sessionPromise = supabase
          .from('interview_sessions')
          .select('id, job_title, resume_id, created_at, resumes(title)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        const [resumeResult, sessionResult] = await Promise.all([resumePromise, sessionPromise]);
        
        if (resumeResult.error) throw resumeResult.error;
        setResumes(resumeResult.data || []);
        
        if (sessionResult.error) {
          console.error('Error fetching interview sessions:', sessionResult.error);
        } else {
          setRecentSessions(sessionResult.data || []);
        }

      } catch (err: any) {
        console.error('Error fetching data:', err);
        toast({
          title: "Error",
          description: "Failed to load page data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user, supabase, toast]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.push(`/dashboard/interview-buddy?${params.toString()}`, { scroll: false });
  };
  
  return (
    <div className="bg-white min-h-screen p-4 sm:p-6 md:p-10">
      <header className="mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Interview Buddy</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Prepare for your job interviews with AI-generated questions and answers</p>
      </header>

      {/* Subscription and Usage Indicator - Mobile optimized */}
      <div className="mb-6">
        {!usageLoading && interviewUsage && (
          <>
            {/* Mobile: Compact inline version */}
            <div className="md:hidden bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-800">Interview Sessions</span>
                {interviewUsage.unlimited ? (
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    Unlimited
                  </Badge>
                ) : (
                  <span className="text-sm font-bold text-blue-700">
                    {interviewUsage.limit - interviewUsage.used} left
                  </span>
                )}
              </div>
              {!interviewUsage.unlimited && (
                <div className="space-y-1">
                  <Progress 
                    value={(interviewUsage.used / interviewUsage.limit) * 100} 
                    className="h-1.5"
                  />
                  <div className="flex justify-between text-xs text-blue-600">
                    <span>{interviewUsage.used} used</span>
                    <span>of {interviewUsage.limit}</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Desktop: Full detailed card */}
            <div className="hidden md:block">
              <FeatureUsageIndicator
                feature="Interview Sessions"
                used={interviewUsage.used}
                limit={interviewUsage.limit}
                unlimited={interviewUsage.unlimited}
                variant="detailed"
              />
            </div>
          </>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="mb-6 w-full grid grid-cols-2 bg-muted/50 rounded-lg p-1 gap-1">
          <TabsTrigger 
            value="generate" 
            className="flex items-center justify-center px-2 sm:px-4 py-2 rounded-md font-medium transition-colors data-[state=active]:bg-orange-600 data-[state=active]:text-white data-[state=active]:shadow data-[state=inactive]:text-gray-900 data-[state=inactive]:bg-muted/50 focus-visible:ring-2 focus-visible:ring-orange-400"
          >
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="text-xs sm:text-sm">Generate</span>
          </TabsTrigger>
          <TabsTrigger 
            value="history"
            className="flex items-center justify-center px-2 sm:px-4 py-2 rounded-md font-medium transition-colors data-[state=active]:bg-orange-600 data-[state=active]:text-white data-[state=active]:shadow data-[state=inactive]:text-gray-900 data-[state=inactive]:bg-muted/50 focus-visible:ring-2 focus-visible:ring-orange-400"
          >
            <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="text-xs sm:text-sm">History</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate">
          {isLoading ? (
            <div className="flex justify-center py-8 md:py-12">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {resumes.length === 0 ? (
                <Card className="border-gray-100">
                  <CardContent className="pt-6 flex flex-col items-center text-center py-6 md:py-10">
                    <FileSpreadsheet className="h-12 w-12 md:h-16 md:w-16 text-orange-500 opacity-30 mb-3 md:mb-4" />
                    <h3 className="text-lg md:text-xl font-medium mb-2 text-gray-800">No Resumes Found</h3>
                    <p className="text-sm md:text-base text-gray-600 max-w-md mb-4 md:mb-6">
                      You need to create or upload a resume before generating interview questions.
                      Your resume helps tailor the questions to your specific experience.
                    </p>
                    <Button asChild className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700">
                      <Link href="/dashboard/resumes/create">
                      	Create Your First Resume
                    	</Link>
                  	</Button>
                	</CardContent>
            	</Card>
          	) : (
          		<div>
          			<InterviewBuddyGenerator
          				resumes={resumes}
          				initialResumeId={resumeId || ''}
          				initialJobTitle={jobTitle || ''}
          				initialJobId={jobId || ''}
          			/>
          		</div>
          	)}
        	</>
      	)}
    	</TabsContent>

    	<TabsContent value="history">
    		<Card className="border-orange-100">
    			<CardHeader className="bg-orange-50/50 p-4 sm:p-6">
    				<CardTitle className="text-gray-800 text-lg sm:text-xl">Interview History</CardTitle>
    				<CardDescription className="text-gray-600 text-sm sm:text-base">
    					Your previous interview practice sessions
    				</CardDescription>
    			</CardHeader>
    			<CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
    				{recentSessions.length > 0 ? (
    					<div className="divide-y divide-orange-100">
    						{recentSessions.map((session) => (
    							<div key={session.id} className="py-3 sm:py-4 flex flex-col sm:flex-row sm:justify-between gap-3">
    								<div className="flex items-start flex-1 min-w-0">
    									<div className="bg-orange-100/50 p-1.5 sm:p-2 rounded mr-2 sm:mr-3 mt-0.5 flex-shrink-0">
    										<MessagesSquare className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
    									</div>
    									<div className="min-w-0 flex-1">
    										<p className="font-medium text-gray-800 text-sm sm:text-base truncate">{session.job_title || 'Interview Session'}</p>
    										<p className="text-xs sm:text-sm text-gray-600 truncate">
    											Resume: {session.resumes?.title || 'Unnamed Resume'}
    										</p>
    										<p className="text-xs text-gray-500">
    											{new Date(session.created_at).toLocaleDateString()}
    										</p>
    									</div>
    								</div>
    								<div className="ml-7 sm:ml-0">
    									<Button variant="outline" size="sm" asChild className="w-full sm:w-auto border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-700 text-xs sm:text-sm">
    										<Link href={`/dashboard/interview-buddy/sessions/${session.id}`}>
    											View Session
    										</Link>
    									</Button>
    								</div>
    							</div>
    						))}
    					</div>
    				) : (
    					<div className="text-center py-6 sm:py-8">
    						<MessagesSquare className="h-10 w-10 sm:h-12 sm:w-12 text-orange-500 mx-auto mb-3 sm:mb-4 opacity-60" />
    						<h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2 text-gray-800">No interview sessions yet</h3>
    						<p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
    							You haven&apos;t created any interview practice sessions.
    						</p>
    						<Button 
    							onClick={() => handleTabChange("generate")}
    							className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700"
    						>
    							<span>Create Your First Practice Session</span>
    						</Button>
    					</div>
    				)}
    			</CardContent>
    		</Card>
    	</TabsContent>
    </Tabs>
  </div>
  );
}