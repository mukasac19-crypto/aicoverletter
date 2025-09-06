
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase';
import { useAuth } from '@/lib/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import ResumeBuilder from '@/components/ResumeBuilder';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import Link from 'next/link';
import { mapDatabaseToResumeData } from '@/lib/resume-mappers';
import {
  Edit,
  ArrowLeft,
  ScanSearch,
  FileSpreadsheet,
  Sparkles
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function EditResumePage() {
  const [resume, setResume] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'edit' | 'tailor'>('edit');

  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const supabase = createBrowserClient();

  const resumeId = params.id as string;

  useEffect(() => {
    if (user) {
      const fetchResume = async () => {
        try {
          setIsLoading(true);
          setError(null);

          if (!resumeId) {
            setError('Invalid resume ID');
            return;
          }

          const { data, error: dbError } = await supabase
            .from('resumes')
            .select('*')
            .eq('id', resumeId)
            .single();

          if (dbError) throw dbError;

          if (data.user_id !== user.id) {
            setError('You do not have permission to edit this resume');
            return;
          }

          const mappedResume = mapDatabaseToResumeData(data);
          console.log("Mapped resume data for editing:", mappedResume);

          setResume(mappedResume);
        } catch (err: any) {
          console.error('Error fetching resume:', err);
          setError(err.message || 'Failed to load resume data');
          toast({
            title: "Error",
            description: "Failed to load resume data. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchResume();
    }
  }, [resumeId, user, supabase, toast]);

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center w-full">
        <div className="text-center space-y-2">
          <LoadingSpinner className="h-8 w-8 mx-auto text-orange-600" />
          <p className="text-sm text-gray-600">Loading Resume...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Alert variant="destructive" className="border-red-200">
          <AlertDescription className="text-sm text-red-700">{error}</AlertDescription>
        </Alert>
        <div className="flex justify-center mt-6">
          <Button
            asChild
            variant="outline"
            className="h-10 px-4 border-gray-300 text-gray-700 hover:bg-gray-50"
            aria-label="Return to resumes list"
          >
            <Link href="/dashboard/resumes">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Resumes
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Skip to Content Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:bg-orange-600 focus:text-white focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

            {/* title shown on small screens */}
            <h1 className="md:hidden text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-gray-900 flex items-center gap-2 truncate max-w-[60%] sm:max-w-[70%]">
                <FileSpreadsheet className="h-5 w-5 text-orange-600 flex-shrink-0" />
                {resume?.title || 'Resume'}
            </h1>

            <div className="flex items-center gap-3 w-full">
              <Button
                variant="ghost"
                asChild
                className="h-10 px-4 min-w-[44px] text-gray-700 hover:bg-gray-50"
                aria-label="Return to resumes list"
              >
                <Link href="/dashboard/resumes">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Back</span>
                </Link>
              </Button>
              <h1 className="hidden text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-gray-900 md:flex items-center gap-2 truncate max-w-[60%] sm:max-w-[70%]">
                <FileSpreadsheet className="h-5 w-5 text-orange-600 flex-shrink-0" />
                {resume?.title || 'Resume'}
              </h1>
              <Button
                variant="default"
                size="sm"
                onClick={() => router.push(`/dashboard/resumes/${resumeId}/ats-scanner`)}
                className="ml-auto h-10 px-4 min-w-[120px] bg-gradient-to-r from-violet-500 to-purple-600 text-white border-0 hover:from-violet-600 hover:to-purple-700 shadow-sm hover:shadow-md transition-all duration-200 sm:hover:scale-105 disabled:sm:hover:scale-100"
                aria-label="Scan resume for ATS compatibility"
              >
                <ScanSearch className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">ATS Scan</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className=" mx-auto">
        <Card className="border-2 border-orange-100 mb-6">
          <CardHeader className="border-b bg-orange-50/50 py-3 sm:py-4">
            <CardTitle className="text-sm sm:text-base md:text-lg text-orange-800">Resume Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                variant={activeTab === 'edit' ? 'default' : 'outline'}
                className={`
                  h-12 px-4 flex items-center justify-start
                  ${activeTab === 'edit' ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'border-2 border-orange-200 text-orange-700 hover:bg-orange-50'}
                  min-w-[120px] text-sm font-semibold transition-all duration-200
                `}
                onClick={() => setActiveTab('edit')}
                aria-current={activeTab === 'edit' ? 'true' : 'false'}
                aria-label="Edit resume content"
              >
                <Edit className="h-4 w-4 mr-3 flex-shrink-0" />
                Edit
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push(`/dashboard/resumes/${resumeId}/tailor`)}
                className="h-12 px-4 flex items-center justify-start border-2 border-orange-200 text-orange-700 hover:bg-orange-50 min-w-[120px] text-sm font-semibold transition-all duration-200"
                aria-label="Tailor resume to a specific job"
              >
                <Sparkles className="h-4 w-4 mr-3 flex-shrink-0 text-orange-600" />
                Tailor to Job
              </Button>
            </div>
          </CardContent>
        </Card>

        {activeTab === 'edit' && resume && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 w-full">
            {/* ResumeBuilder is assumed to be responsive; constrained here to prevent overflow */}
            <ResumeBuilder initialData={resume} resumeId={resumeId} />
          </div>
        )}
      </main>
    </div>
  );
}
