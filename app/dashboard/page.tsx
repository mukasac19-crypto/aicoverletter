"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/lib/hooks/useProfile";
import { useSubscription } from "@/hooks/useSubscription";
import UsageLimits from "@/components/UsageLimits";
import LimitedActionButton from "@/components/LimitedActionButton";
import { 
  FileText, 
  History, 
  Star, 
  Plus, 
  Calendar, 
  ChevronRight, 
  Upload, 
  Linkedin, 
  CheckCircle2,
  FileBadge,
  FileIcon,
  ChevronDown,
  MailCheck,
  Rocket,
  Sparkles,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createBrowserClient } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistance } from 'date-fns';
import { useOnboarding } from '@/hooks/useOnboarding';
import OnboardingModal from '@/components/OnboardingModal';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define types for our data structures
interface CoverLetter {
  id: string;
  title: string;
  date: string;
  job_title?: string | null;
  company_name?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  content?: string | null;
}

interface Resume {
  id: string;
  title: string;
  updated_at: string | null;
  created_at?: string | null;
  user_id: string;
  personal_info?: any;
  work_experience?: any;
  source_cv?: string | null;
  [key: string]: any;
}

interface Stats {
  totalLetters: number;
  thisMonth: number;
  averageLength: number;
}

export default function DashboardPage() {
  const { profile, loading } = useProfile();
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  const { tier, getUsage, loading: subLoading } = useSubscription();
  const [hasCVUploaded, setHasCVUploaded] = useState(false);
  const [hasLinkedInConnected, setHasLinkedInConnected] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  
  // Onboarding modal state
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const { onboardingCompleted, isCheckingStatus } = useOnboarding();
  
  // State for cover letters, resumes, and follow-ups
  const [recentLetters, setRecentLetters] = useState<CoverLetter[]>([]);
  const [recentResumes, setRecentResumes] = useState<Resume[]>([]);
  const [recentFollowUps, setRecentFollowUps] = useState<any[]>([]);
  const [loadingLetters, setLoadingLetters] = useState(false);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [loadingFollowUps, setLoadingFollowUps] = useState(false);
  const [stats, setStats] = useState<Stats>({
    totalLetters: 0,
    thisMonth: 0,
    averageLength: 450
  });

  // Get usage data
  const resumeUsage = getUsage('resumes');
  const coverLetterUsage = getUsage('coverLetters');
  const atsUsage = getUsage('atsScans');

  // Check onboarding status on initial load
  useEffect(() => {
    if (!isCheckingStatus && onboardingCompleted === false) {
      setShowOnboardingModal(true);
    }
  }, [onboardingCompleted, isCheckingStatus]);

  // Load saved CV and LinkedIn information on mount
  useEffect(() => {
    const savedCV = localStorage.getItem('userCV');
    const savedLinkedIn = localStorage.getItem('userLinkedIn');
    
    if (savedCV) setHasCVUploaded(true);
    if (savedLinkedIn) setHasLinkedInConnected(true);
  }, []);

  // Fetch recent resumes from Supabase
  useEffect(() => {
    const fetchRecentResumes = async () => {
      if (!user) return;
      
      try {
        setLoadingResumes(true);
        const supabase = createBrowserClient();
        
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const startOfMonthISO = startOfMonth.toISOString();
        
        const { data, error } = await supabase
          .from('resumes')
          .select('*')
          .eq('user_id', user.id)
          .or(`created_at.gte.${startOfMonthISO},updated_at.gte.${startOfMonthISO}`)
          .order('updated_at', { ascending: false, nullsFirst: false })
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (error) throw error;
        
        const formattedResumes = (data || [])
          .filter((resume, index, array) => {
            return array.findIndex(r => r.id === resume.id) === index;
          })
          .map(resume => {
            const originalTitle = resume.title || 'Resume';
            const shortTitle = originalTitle.length > 25 ? originalTitle.substring(0, 25) + '...' : originalTitle;
            
            return {
              ...resume,
              title: shortTitle,
              original_title: originalTitle
            };
          })
          .slice(0, 2);
        
        setRecentResumes(formattedResumes);
      } catch (err) {
        console.error('Error fetching recent resumes:', err);
      } finally {
        setLoadingResumes(false);
      }
    };
    
    if (user) {
      fetchRecentResumes();
    }
  }, [user]);
  
  // Fetch recent cover letters from Supabase
  useEffect(() => {
    const fetchRecentCoverLetters = async () => {
      if (!user) return;
      
      try {
        setLoadingLetters(true);
        const supabase = createBrowserClient();
        
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const startOfMonthISO = startOfMonth.toISOString();
        
        const { data, error } = await supabase
          .from('cover_letters')
          .select('*')
          .eq('user_id', user.id)
          .or(`created_at.gte.${startOfMonthISO},updated_at.gte.${startOfMonthISO}`)
          .order('updated_at', { ascending: false, nullsFirst: false })
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (error) throw error;
        
        const formattedLetters: CoverLetter[] = (data || [])
          .filter((letter, index, array) => {
            return array.findIndex(l => l.id === letter.id) === index;
          })
          .map(letter => {
            const createdDate = letter.created_at ? new Date(letter.created_at) : null;
            const updatedDate = letter.updated_at ? new Date(letter.updated_at) : null;
            const mostRecentDate = updatedDate && createdDate 
              ? (updatedDate > createdDate ? updatedDate : createdDate)
              : createdDate || updatedDate || new Date();
            
            const jobTitle = letter.job_title || 'Position';
            const companyName = letter.company_name || 'Company';
            
            const shortJobTitle = jobTitle.length > 15 ? jobTitle.substring(0, 15) + '...' : jobTitle;
            const shortCompanyName = companyName.length > 12 ? companyName.substring(0, 12) + '...' : companyName;
            
            return {
              id: letter.id,
              title: `${shortJobTitle} at ${shortCompanyName}`,
              date: mostRecentDate.toISOString(),
              job_title: letter.job_title,
              company_name: letter.company_name,
              created_at: letter.created_at,
              updated_at: letter.updated_at,
              content: letter.content
            };
          })
          .slice(0, 2);
        
        setRecentLetters(formattedLetters);
        
        const { data: statsData, error: statsError } = await supabase
          .from('cover_letters')
          .select('id, created_at, content', { count: 'exact' })
          .eq('user_id', user.id);
        
        if (statsError) throw statsError;
        
        const total = statsData?.length || 0;
        
        const now = new Date();
        const thisMonth = statsData?.filter(letter => {
          const letterDate = new Date(letter.created_at || '');
          return letterDate.getMonth() === now.getMonth() && 
                 letterDate.getFullYear() === now.getFullYear();
        }).length || 0;
        
        const totalWords = statsData?.reduce((sum, letter) => {
          const wordCount = letter.content ? letter.content.split(/\s+/).length : 0;
          return sum + wordCount;
        }, 0) || 0;
        
        const averageLength = total > 0 ? Math.round(totalWords / total) : 450;
        
        setStats({
          totalLetters: total,
          thisMonth: thisMonth,
          averageLength: averageLength
        });
        
      } catch (err) {
        console.error('Error fetching recent cover letters:', err);
      } finally {
        setLoadingLetters(false);
      }
    };
    
    if (user) {
      fetchRecentCoverLetters();
    }
  }, [user]);

  // Fetch recent follow-up emails from Supabase
  useEffect(() => {
    const fetchRecentFollowUps = async () => {
      if (!user) return;
      try {
        setLoadingFollowUps(true);
        const supabase = createBrowserClient();
        
        const presentDate = new Date();
        const startOfMonth = new Date(presentDate.getFullYear(), presentDate.getMonth(), 1);
        const startOfMonthISO = startOfMonth.toISOString();
        
        const { data, error } = await supabase
          .from('follow_up_emails')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', startOfMonthISO)
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (error) throw error;
        
        const formattedFollowUps = (data || []).map(email => ({
          id: email.id,
          title: `Follow-Up for ${email.job_title || 'Position'} at ${email.company_name || 'Company'}`,
          date: email.created_at || new Date().toISOString(),
          timeAgo: formatDistance(new Date(email.created_at || new Date()), new Date(), { addSuffix: true }),
          job_title: email.job_title,
          company_name: email.company_name,
          contact_name: email.contact_name,
          subject: email.subject,
          body: email.body
        }));
        
        setRecentFollowUps(formattedFollowUps);
      } catch (err) {
        console.error('Error fetching recent follow-up emails:', err);
      } finally {
        setLoadingFollowUps(false);
      }
    };
    
    if (user) {
      fetchRecentFollowUps();
    }
  }, [user]);

  const handleCVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      setInProgress(true);
      
      setTimeout(() => {
        const cvData = {
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type,
          date: new Date().toISOString()
        };
        localStorage.setItem('userCV', JSON.stringify(cvData));
        
        setHasCVUploaded(true);
        setInProgress(false);
        
        toast({
          title: "CV uploaded successfully",
          description: `${selectedFile.name} has been uploaded and will be used for your cover letters.`,
        });
      }, 1500);
    }
  };

  // REMOVED THE BLOCKING LOADING STATE - This is the only change
  // The old code was:
  // if (loading || subLoading) {
  //   return (
  //     <div className="flex justify-center items-center min-h-[80vh]">
  //       <LoadingSpinner />
  //     </div>
  //   );
  // }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto py-4 px-4 sm:px-6 md:px-8 max-w-7xl">
        {/* Dashboard Header */}

        {/* Usage Overview Section - NEW */}
        <div className="mb-4 sm:mb-6">
          <UsageLimits showCard={true} />
        </div>

        <div className="mb-4 sm:mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Resumes Card */}
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center transition-transform hover:scale-[1.02]">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-orange-100">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 2v4M16 2v4M4 10h16"/></svg>
              </span>
            </div>
            <span className="text-3xl font-bold text-orange-600">{recentResumes.length}</span>
            <div className="text-sm font-medium text-gray-700 tracking-wide">Resumes</div>
            <div className="text-xs text-gray-400 mt-1">
              {resumeUsage && !resumeUsage.unlimited ? (
                <span>{resumeUsage.used} / {resumeUsage.limit} used</span>
              ) : (
                <span>Total uploaded or created</span>
              )}
            </div>
          </div>
          {/* Cover Letters Card */}
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center transition-transform hover:scale-[1.02]">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-orange-100">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><polyline points="3 7 12 13 21 7"/></svg>
              </span>
            </div>
            <span className="text-3xl font-bold text-orange-600">{stats.totalLetters}</span>
            <div className="text-sm font-medium text-gray-700 tracking-wide">Cover Letters</div>
            <div className="text-xs text-gray-400 mt-1">
              {coverLetterUsage && !coverLetterUsage.unlimited ? (
                <span>{coverLetterUsage.used} / {coverLetterUsage.limit} used</span>
              ) : (
                <span>Total created</span>
              )}
            </div>
          </div>
        </div>
        
        {/* Profile Status Alert */}
        {(hasCVUploaded || hasLinkedInConnected) && (
          <Alert className="mb-4 sm:mb-8 bg-orange-50 border-orange-200 shadow-sm text-xs sm:text-sm">
            <div className="flex items-center">
              <CheckCircle2 className="h-4 sm:h-5 w-4 sm:w-5 text-orange-500 mr-1 sm:mr-2 flex-shrink-0" />
              <AlertDescription className="text-orange-700 py-1">
                <span className="font-semibold">Profile data ready:</span>{' '}
                {hasCVUploaded && <span className="mr-2">✓ CV uploaded</span>}
                {hasLinkedInConnected && <span>✓ LinkedIn connected</span>}
              </AlertDescription>
            </div>
          </Alert>
        )}

        <section className="mb-4 sm:mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* recents */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-gray-800 text-xl font-bold">Recent Resume</h3>
              <Link href="/dashboard/resumes">
                <Button variant="ghost" size="sm" className="h-7 sm:h-8 w-7 sm:w-auto px-1 sm:px-2">
                  <span className="sr-only sm:not-sr-only sm:inline-block text-xs text-orange-600">View All</span>
                  <ChevronRight className="h-4 w-4 text-orange-600" />
                </Button>
              </Link>
            </div>
            
            <div className="h-[60px] w-full bg-white rounded-sm shadow-sm border border-gray-100 p-6 flex items-center transition-transform hover:scale-[1.02]">
              {loadingResumes ? (
                <LoadingSpinner className="h-4 w-4" />
              ) : recentResumes.length > 0 ? (
                <div className="w-full flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileBadge className="h-4 w-4 text-orange-500 flex-shrink-0" />
                    <span className="text-sm font-medium truncate">
                      {recentResumes[0].title}
                    </span>
                  </div>
                  <Link href={`/dashboard/resumes/${recentResumes[0].id}`} className="flex-shrink-0">
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                      Edit
                    </Button>
                  </Link>
                </div>
              ) : (
                <span className="text-sm text-gray-400 mx-auto">No recent resumes</span>
              )}
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <h3 className="text-gray-800 text-xl font-bold">Recent Cover Letter</h3>
              <Link href="/dashboard/cover-letters?tab=recent">
                <Button variant="ghost" size="sm" className="h-7 sm:h-8 w-7 sm:w-auto px-1 sm:px-2">
                  <span className="sr-only sm:not-sr-only sm:inline-block text-xs text-orange-600">View All</span>
                  <ChevronRight className="h-4 w-4 text-orange-600" />
                </Button>
              </Link>
            </div>
            
            <div className="h-[60px] w-full bg-white rounded-sm shadow-sm border border-gray-100 p-6 flex items-center transition-transform hover:scale-[1.02]">
              {loadingLetters ? (
                <LoadingSpinner className="h-4 w-4" />
              ) : recentLetters.length > 0 ? (
                <div className="w-full flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="h-4 w-4 text-orange-500 flex-shrink-0" />
                    <span className="text-sm font-medium truncate">
                      {recentLetters[0].title}
                    </span>
                  </div>
                  <Link href={`/dashboard/cover-letters?edit=${recentLetters[0].id}`} className="flex-shrink-0">
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                      Edit
                    </Button>
                  </Link>
                </div>
              ) : (
                <span className="text-sm text-gray-400 mx-auto">No recent cover letters</span>
              )}
            </div>
          </div>

          {/* quick actions */}
          <Card className="w-full border-t-4 border-t-orange-500 shadow-md overflow-hidden rounded-sm mt-4 md:mt-0">
            <CardHeader className="text-center py-2 sm:py-4">
              <div className="w-full flex justify-center items-center">
                <div className="w-[40px] h-[40px] bg-orange-600 rounded-full flex justify-center items-center p-2">
                  <Rocket size={30} color="white" />
                </div>
              </div>
              <CardTitle className="text-lg sm:text-2xl">Quick Actions</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Get started with your job application tools
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              <div className="flex justify-center">
                {/* Create Button with Dropdown */}
                <div className="w-full max-w-md">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="w-full h-auto py-2 sm:py-3 flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white transition-all shadow-sm hover:shadow-md text-sm sm:text-base">
                        <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="font-medium">Create New</span>
                        <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 ml-1 opacity-70" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-48 sm:w-56">
                      <DropdownMenuItem asChild className="cursor-pointer py-2 sm:py-3">
                        <LimitedActionButton
                          feature="coverLetters"
                          featureName="Cover Letter"
                          onAllowed={() => router.push('/dashboard/cover-letters?tab=create')}
                          variant="ghost"
                          className="w-full justify-start text-xs sm:text-sm"
                        >
                          <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-orange-500" />
                          <span>Cover Letter</span>
                          {coverLetterUsage && !coverLetterUsage.unlimited && (
                            <span className="ml-auto text-[10px] text-gray-500">
                              {coverLetterUsage.used}/{coverLetterUsage.limit}
                            </span>
                          )}
                        </LimitedActionButton>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer py-2 sm:py-3">
                        <LimitedActionButton
                          feature="resumes"
                          featureName="Resume"
                          onAllowed={() => router.push('/dashboard/resumes/new')}
                          variant="ghost"
                          className="w-full justify-start text-xs sm:text-sm"
                        >
                          <FileBadge className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-orange-500" />
                          <span>Resume</span>
                          {resumeUsage && !resumeUsage.unlimited && (
                            <span className="ml-auto text-[10px] text-gray-500">
                              {resumeUsage.used}/{resumeUsage.limit}
                            </span>
                          )}
                        </LimitedActionButton>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer py-2 sm:py-3 text-xs sm:text-sm">
                        <Link href="/dashboard/cover-letters?tab=follow-up" className="flex items-center w-full">
                          <MailCheck className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-orange-500" />
                          <span>Follow-Up Email</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              {tier === 'FREE' && (
                <div className="mt-3 text-center">
                  <Link href="/pricing">
                    <Button variant="link" size="sm" className="text-xs text-orange-600">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Upgrade for unlimited access
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Recent Follow-Up Emails Section */}
          <Card className="border-t-orange-400 shadow-sm h-[350px]">
            <CardHeader className="py-2 sm:py-4 border-b border-gray-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base sm:text-lg">Recent Follow-Ups</CardTitle>
                <CardDescription className="text-xs">Latest communications</CardDescription>
              </div>
              <Link href="/dashboard/cover-letters?tab=follow-up">
                <Button variant="ghost" size="sm" className="h-7 sm:h-8 w-7 sm:w-auto px-1 sm:px-2">
                  <span className="sr-only sm:not-sr-only sm:inline-block text-xs">View All</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>

            <CardContent className="p-2 sm:p-4">
              {loadingFollowUps ? (
                <div className="flex justify-center py-4">
                  <LoadingSpinner />
                </div>
              ) : recentFollowUps.length > 0 ? (
                <div className="space-y-2">
                  {recentFollowUps.slice(0, 2).map((followUp) => (
                    <div key={followUp.id} className="p-2 sm:p-3 rounded-md hover:bg-purple-50 transition-colors border border-gray-100">
                      <div className="flex items-start justify-between gap-1 sm:gap-2">
                        <div className="flex items-start flex-1 min-w-0">
                          <MailCheck className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 mt-0.5 mr-1 sm:mr-2 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium text-xs sm:text-sm truncate">{followUp.title}</p>
                            <p className="text-xs text-muted-foreground">{followUp.timeAgo}</p>
                          </div>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <Link href={`/dashboard/cover-letters?tab=follow-up&email=${followUp.id}`}>
                            <Button variant="ghost" size="sm" className="h-6 w-6 sm:h-7 sm:w-7 p-0">
                              <span className="sr-only">View</span>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 sm:h-4 sm:w-4"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm" className="h-6 w-6 sm:h-7 sm:w-7 p-0">
                            <span className="sr-only">Copy</span>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 sm:h-4 sm:w-4"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1"ry="1"></rect></svg>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 sm:py-8 bg-orange-50/50 rounded-lg border border-dashed border-orange-200">
                  <MailCheck className="h-8 w-8 sm:h-10 sm:w-10 text-orange-400 mx-auto mb-1 sm:mb-2" />
                  <h3 className="text-xs sm:text-sm font-medium mb-1">No follow-ups yet</h3>
                  <p className="text-xs text-gray-500 mb-2">No follow-up emails created this month</p>
                  <Link href="/dashboard/cover-letters?tab=follow-up">
                    <Button size="sm" className="mt-1 sm:mt-2 text-xs h-7 bg-orange-600 hover:bg-orange-700">
                      <Plus className="h-3 w-3 mr-1" />
                      Create Follow-Up
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Activity Stats Card */}
          <Card className="border-t-orange-400 shadow-sm h-[350px]">
            <CardHeader className="py-2 sm:py-4 border-b border-gray-100">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-orange-600" />
                Your Activity
              </CardTitle>
              <CardDescription className="text-xs">Application stats and metrics</CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col gap-3">
                <div className="bg-orange-50 border border-orange-100 p-3 rounded-lg transition-transform hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-bold text-orange-600">{stats.totalLetters}</p>
                      <p className="text-xs text-gray-600">Total Letters</p>
                    </div>
                    {coverLetterUsage && !coverLetterUsage.unlimited && (
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Monthly limit</p>
                        <p className="text-sm font-medium text-orange-600">
                          {coverLetterUsage.used} / {coverLetterUsage.limit}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-orange-50 border border-orange-100 p-3 rounded-lg transition-transform hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-bold text-orange-600">{recentResumes.length}</p>
                      <p className="text-xs text-gray-600">Total Resumes</p>
                    </div>
                    {resumeUsage && !resumeUsage.unlimited && (
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Monthly limit</p>
                        <p className="text-sm font-medium text-orange-600">
                          {resumeUsage.used} / {resumeUsage.limit}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-purple-50 border border-purple-100 p-3 rounded-lg transition-transform hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-bold text-orange-600">{recentFollowUps.length}</p>
                      <p className="text-xs text-gray-600">Total Follow-Ups</p>
                    </div>
                    {atsUsage && !atsUsage.unlimited && (
                      <div className="text-right">
                        <p className="text-xs text-gray-500">ATS Scans</p>
                        <p className="text-sm font-medium text-purple-600">
                          {atsUsage.used} / {atsUsage.limit}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Onboarding Modal */}
        <OnboardingModal
          open={showOnboardingModal}
          onOpenChange={setShowOnboardingModal}
        />
      </div>
    </div>
  );
}