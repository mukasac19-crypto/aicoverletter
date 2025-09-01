"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/client-side-client';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  ScanSearch,
  FileSpreadsheet,
  AlertCircle,
  ArrowRight,
  BarChart2,
  CheckCircle2,
  Calendar,
  Clock,
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useSubscription } from '@/lib/hooks/useSubscription';
import FeatureUsageIndicator from '@/components/FeatureUsageIndicator';
import { useAuthStore } from '@/stores/authstore';

export default function ATSScannerPage() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [recentAnalyses, setRecentAnalyses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuthStore();
  const { toast } = useToast();
  const supabase = createClient();
  const { usageStats, loading: usageLoading } = useSubscription();

  const atsUsage = usageStats?.atsScans;

  // Fetch user's resumes and recent analyses
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch resumes
        const { data: resumeData, error: resumeError } = await supabase
          .from('resumes')
          .select('id, title, updated_at')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });

        if (resumeError) throw resumeError;

        setResumes(resumeData || []);

        // Fetch recent analyses
        const { data: analysesData, error: analysesError } = await supabase
          .from('resume_ats_analyses')
          .select(`
            id,
            created_at,
            resume_id,
            analysis_result,
            resumes(title)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (analysesError) throw analysesError;

        setRecentAnalyses(analysesData || []);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to load data');
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, supabase, toast]);

  // Get score color class based on score
  const getScoreColor = (score: number) => {
    // Assuming score is 0-1, converting to 0-100 for consistency
    const percentage = score * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Get progress bar color class based on score
  const getProgressBarColor = (score: number) => {
    // Assuming score is 0-1, converting to 0-100 for consistency
    const percentage = score * 100;
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner className="h-8 w-8 mb-4" />
          <p className="text-muted-foreground">Loading ATS Scanner...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 sm:p-6 md:p-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3">
          <ScanSearch className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
          ATS Scanner
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          Analyze your resumes against job descriptions to improve your chances with Applicant Tracking Systems
        </p>
      </div>

      {(!user || error) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || "You need to be logged in to access this feature."}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-2 border-orange-100">
            <CardHeader className="border-b bg-orange-50/50">
              <CardTitle className="flex items-center text-orange-800">
                <FileSpreadsheet className="h-5 w-5 mr-2 text-orange-600" />
                Your Resumes
              </CardTitle>
              <CardDescription>
                Select a resume to scan for ATS compatibility
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {resumes.length === 0 ? (
                <div className="text-center py-8 space-y-4">
                  <FileSpreadsheet className="h-16 w-16 mx-auto text-muted-foreground opacity-20" />
                  <h3 className="text-lg font-medium">No resumes found</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Create a resume first to use the ATS Scanner.
                  </p>
                  <Button asChild className="mt-4">
                    <Link href="/dashboard/resumes/create">
                      Create Your First Resume
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {resumes.slice(0, 5).map((resume) => (
                    <div key={resume.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between border rounded-lg p-4 hover:border-orange-200 hover:bg-orange-50/30 transition-colors gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium truncate">{resume.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Last updated: {formatDate(resume.updated_at)}
                        </p>
                      </div>
                      <Button asChild className="w-full sm:w-auto">
                        <Link href={`/dashboard/resumes/${resume.id}/ats-scanner`}>
                          <ScanSearch className="h-4 w-4 mr-2" />
                          Scan Now
                        </Link>
                      </Button>
                    </div>
                  ))}
                  
                  {resumes.length > 5 && (
                    <div className="text-center mt-6">
                      <Button variant="outline" asChild>
                        <Link href="/dashboard/resumes">
                          View All Resumes
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* This is the fully corrected "Recent Analyses" card block */}
          {recentAnalyses.length > 0 && (
            <Card className="border-2 border-blue-100">
              <CardHeader className="border-b bg-blue-50/50">
                <CardTitle className="flex items-center text-blue-800">
                  <Clock className="h-5 w-5 mr-2 text-blue-600" />
                  Recent ATS Analyses
                </CardTitle>
                <CardDescription>
                  Your most recent ATS scan results
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  {recentAnalyses.map((analysis) => (
                    <div key={analysis.id} className="border rounded-lg p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium truncate">{analysis.resumes?.title || "Untitled Resume"}</h3>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3 mr-1.5" />
                            {formatDate(analysis.created_at)}
                          </div>
                        </div>
                        {analysis.analysis_result?.overall?.score !== undefined && (
                          <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-0">
                            <div className={`font-bold text-lg ${getScoreColor(analysis.analysis_result.overall.score)}`}>
                              {Math.round(analysis.analysis_result.overall.score * 100)}%
                            </div>
                            <Progress
                              value={Math.round(analysis.analysis_result.overall.score * 100)}
                              className={`h-1.5 w-20 sm:mt-1 ${getProgressBarColor(analysis.analysis_result.overall.score)}`}
                            />
                          </div>
                        )}
                      </div>
                      <div className="mt-4 pt-4 border-t flex justify-center sm:justify-end">
                        <Button asChild size="sm" className="w-full sm:w-auto">
                          <Link href={`/dashboard/resumes/${analysis.resume_id}/ats-scanner?load=${analysis.id}`}>
                            <ScanSearch className="h-4 w-4 mr-2" />
                            Rescan & View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t bg-blue-50/30 p-4">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/dashboard/ats-history">
                    View All Analysis History
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {usageLoading ? (
            <Card>
              <CardContent className="p-4 sm:p-6 flex justify-center items-center">
                <LoadingSpinner />
              </CardContent>
            </Card>
          ) : atsUsage ? (
            <>
              {/* Mobile: Compact inline version */}
              <div className="md:hidden bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-orange-800">ATS Scans</span>
                  {atsUsage.unlimited ? (
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                      Unlimited
                    </Badge>
                  ) : (
                    <span className="text-sm font-bold text-orange-700">
                      {atsUsage.limit - atsUsage.used} left
                    </span>
                  )}
                </div>
                {!atsUsage.unlimited && (
                  <div className="space-y-1">
                    <Progress 
                      value={(atsUsage.used / atsUsage.limit) * 100} 
                      className="h-1.5"
                    />
                    <div className="flex justify-between text-xs text-orange-600">
                      <span>{atsUsage.used} used</span>
                      <span>of {atsUsage.limit}</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Desktop: Full detailed card */}
              <div className="hidden md:block">
                <FeatureUsageIndicator
                  variant="detailed"
                  feature="ATS Scans"
                  used={atsUsage.used}
                  limit={atsUsage.limit}
                  unlimited={atsUsage.unlimited}
                />
              </div>
            </>
          ) : null}

          <Card className="border-2 border-emerald-100">
            <CardHeader className="border-b bg-emerald-50/50">
              <CardTitle className="flex items-center text-emerald-800 text-base sm:text-lg">
                <ScanSearch className="h-5 w-5 mr-2 text-emerald-600" />
                About ATS Scanning
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
                <div className="space-y-4 text-sm">
                    <p>
                        <strong>Applicant Tracking Systems (ATS)</strong> are software used by employers to manage job applications. They scan resumes for keywords and formatting before a human ever sees them.
                    </p>
                    
                    <p>
                        <strong>70-75%</strong> of resumes are rejected by ATS before reaching a hiring manager. Our scanner helps you optimize your resume to get past these systems.
                    </p>
                    
                    <h4 className="font-medium mt-4">The Scanner Checks For:</h4>
                    <ul className="space-y-2">
                        {[
                            "Keyword matches with job description",
                            "Proper formatting that ATS can parse",
                            "Missing important sections",
                            "Overall compatibility score"
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                    
                    <p className="pt-2">
                        For best results, paste the exact job description for a specific position you are applying to.
                    </p>
                </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-100">
            <CardHeader className="border-b bg-purple-50/50">
              <CardTitle className="flex items-center text-purple-800 text-base sm:text-lg">
                <BarChart2 className="h-5 w-5 mr-2 text-purple-600" />
                Tips to Improve ATS Score
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4 text-sm">
                {[
                  {
                    title: "Use a clean, simple format",
                    desc: "Avoid tables, columns, headers/footers, and graphics"
                  },
                  {
                    title: "Include keywords from the job description",
                    desc: "Mirror the exact phrases and skills listed"
                  },
                  {
                    title: "Use standard section headings",
                    desc: "Experience, Education, Skills, etc."
                  },
                  {
                    title: "Submit in the right format",
                    desc: "Use PDF format unless otherwise specified"
                  },
                  {
                    title: "Keep formatting consistent",
                    desc: "Use the same date format, bullet style, etc."
                  }
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-purple-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-purple-800">{tip.title}</p>
                      <p className="text-muted-foreground text-xs mt-0.5">{tip.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}