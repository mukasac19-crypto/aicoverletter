"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/client-side-client';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ArrowLeft, Download, Edit, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import Link from 'next/link';
import { DEFAULT_RESUME_TEMPLATES } from '@/lib/default-resume-templates';
import { mapDatabaseToResumeData } from '@/lib/resume-mappers';
import ResumePreview from '@/components/ResumePreview';
import { useAuthStore } from '@/stores/authstore';
import { exportResumeWithProgress } from "@/lib/export-service";

// Utility functions
const validateResumeData = (resumeData: any) => {
  if (!resumeData) return null;
  const validatedResume = { ...resumeData };
  if (validatedResume.personal_info && !validatedResume.personalInfo) {
    validatedResume.personalInfo = validatedResume.personal_info;
  }
  if (validatedResume.work_experience && !validatedResume.workExperience) {
    validatedResume.workExperience = validatedResume.work_experience;
  }
  if (validatedResume.custom_sections && !validatedResume.customSections) {
    validatedResume.customSections = validated-resume.custom_sections;
  }
  if (!validatedResume.personalInfo) {
    validatedResume.personalInfo = {
      firstName: validatedResume.title?.split(' ')[0] || 'First',
      lastName: validatedResume.title?.split(' ').slice(1).join(' ') || 'Last',
      title: validatedResume.title || 'Resume',
      contact: { email: '', phone: '', location: '' }
    };
  }
  const arrayFields = ['workExperience', 'education', 'skills', 'projects',
    'languages', 'certifications', 'interests', 'internships', 'references', 'customSections'];
  arrayFields.forEach(field => {
    if (!validatedResume[field] || !Array.isArray(validatedResume[field])) {
      validatedResume[field] = [];
    }
  });
  return validatedResume;
};

const normalizeTemplate = (template: any): any => {
  if (!template) return null;
  return {
    ...template,
    htmlContent: template.htmlContent || template.html_content || '',
    cssContent: template.cssContent || template.css_content || '',
    id: template.id || 'fallback-template',
    name: template.name || 'Fallback Template',
    description: template.description || 'Basic resume template',
  };
};

// Helper function to get initial zoom level based on window size
const getInitialZoomLevel = () => {
  if (typeof window === 'undefined') return 75; // Server-side
  if (window.innerWidth < 768) return 50;
  if (window.innerWidth < 1024) return 65;
  return 75;
};

export default function ResumePreviewPage() {
  const [resume, setResume] = useState<any | null>(null);
  const [template, setTemplate] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Initialize zoom level based on a helper function
  const [zoomLevel, setZoomLevel] = useState<number>(getInitialZoomLevel());
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const supabase = createClient();
  const resumeId = params.id as string;

  // Use a single useEffect for data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        if (!resumeId) {
          setError('Invalid resume ID');
          return;
        }

        const { data: resumeData, error: resumeError } = await supabase
          .from('resumes')
          .select('*')
          .eq('id', resumeId)
          .single();

        if (resumeError) throw resumeError;
        if (user && user.id !== resumeData.user_id && !resumeData.is_public) {
          setError('You do not have permission to view this resume');
          return;
        }

        const mappedResume = mapDatabaseToResumeData(resumeData);
        const validatedResume = validateResumeData(mappedResume);
        setResume(validatedResume);

        if (resumeData.template_id) {
          const { data: templateData, error: templateError } = await supabase
            .from('resume_templates')
            .select('*')
            .eq('id', resumeData.template_id)
            .maybeSingle();

          if (!templateError && templateData) {
            setTemplate(normalizeTemplate(templateData));
            return;
          }
        }

        const { data: anyTemplate } = await supabase
          .from('resume_templates')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (anyTemplate) {
          setTemplate(normalizeTemplate(anyTemplate));
        } else if (DEFAULT_RESUME_TEMPLATES?.length > 0) {
          setTemplate(normalizeTemplate(DEFAULT_RESUME_TEMPLATES[0]));
        }
      } catch (err: any) {
        console.error('Error fetching data:', err);
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
    fetchData();
  }, [resumeId, user, supabase, toast]);

  // Use a separate useEffect for window-related side effects
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setZoomLevel(50);
      } else if (window.innerWidth < 1024) {
        setZoomLevel(65);
      } else {
        setZoomLevel(75);
      }
    };
    // Initial check
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []); // Empty dependency array to run only once

  const handleExport = async (format: 'pdf' | 'docx' = 'pdf') => {
    if (!resume || !template) {
      toast({
        title: "Error",
        description: "Resume data not available for export.",
        variant: "destructive",
      });
      return;
    }
    try {
      setIsExporting(true);
      const result = await exportResumeWithProgress(
        resume,
        template,
        format,
        (progress, status) => {},
        `${resume.personalInfo?.firstName || 'Resume'}-${resume.personalInfo?.lastName || ''}-Resume`.replace(/ /g, '_')
      );
      if (!result.success) {
        throw new Error(result.error || 'Export failed');
      }
      toast({
        title: "Export Successful",
        description: `Your resume has been exported as ${format.toUpperCase()}.`,
      });
    } catch (err: any) {
      console.error('Error exporting resume:', err);
      toast({
        title: "Export Failed",
        description: err.message || "Failed to export resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 10, 150));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 10, 40));
  const handleZoomReset = () => setZoomLevel(getInitialZoomLevel());

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner className="h-8 w-8 mb-4 mx-auto" />
          <p className="text-muted-foreground">Loading resume preview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="flex justify-center">
            <Button asChild>
              <Link href="/dashboard/resumes">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Resumes
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <Button variant="ghost" size="sm" asChild className="h-8 px-2 sm:px-3">
                <Link href="/dashboard/resumes">
                  <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Back</span>
                </Link>
              </Button>
              <div className="flex-1 sm:flex-none">
                <h1 className="text-base sm:text-xl font-semibold truncate">{resume?.title || 'Resume Preview'}</h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Full page preview</p>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              {user && user.id === resume?.userId && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="flex-1 sm:flex-none h-8 text-xs sm:text-sm"
                >
                  <Link href={`/dashboard/resumes/${resumeId}`}>
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Edit
                  </Link>
                </Button>
              )}
              <Button
                onClick={() => handleExport('pdf')}
                disabled={isExporting}
                size="sm"
                className="flex-1 sm:flex-none h-8 text-xs sm:text-sm"
              >
                {isExporting ? (
                  <>
                    <LoadingSpinner className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Exporting...</span>
                    <span className="sm:hidden">Export...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Download PDF</span>
                    <span className="sm:hidden">PDF</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Zoom Controls */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <Card className="inline-flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 40}
              className="h-7 w-7 sm:h-8 sm:w-8 p-0"
            >
              <ZoomOut className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomReset}
              className="h-7 px-2 sm:h-8 sm:px-3"
            >
              <span className="text-xs sm:text-sm font-medium">{zoomLevel}%</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 150}
              className="h-7 w-7 sm:h-8 sm:w-8 p-0"
            >
              <ZoomIn className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </Card>
        </div>

        {/* Resume Preview Container - Responsive */}
        <div className="flex justify-center overflow-x-auto pb-4">
          <div
            className="bg-white rounded-lg shadow-lg sm:shadow-2xl"
            style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: isMobile ? 'top left' : 'top center',
              transition: 'transform 0.2s ease-in-out',
              marginBottom: isMobile ? `${(zoomLevel - 100) * 2}px` : `${(zoomLevel - 100) * 5}px`,
              marginLeft: isMobile && zoomLevel < 100 ? '0' : 'auto',
              marginRight: isMobile && zoomLevel < 100 ? 'auto' : 'auto',
            }}
          >
            {/* A4 Page Container with mobile optimization */}
            <div
              className="relative bg-white"
              style={{
                width: isMobile ? '210mm' : '210mm',
                minHeight: '297mm',
                maxWidth: isMobile ? 'none' : '100vw',
              }}
            >
              {resume && template ? (
                <div className="w-full h-full">
                  <ResumePreview
                    resume={resume}
                    template={template}
                    height="auto"
                    defaultZoom={100}
                    removeCard={true}
                    responsiveHeight={true}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full p-4 sm:p-8">
                  <Alert className="max-w-sm">
                    <AlertDescription className="text-xs sm:text-sm">
                      Unable to load resume preview. Please try again.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page indicator - Hidden on mobile when zoomed out */}
        <div className={`text-center mt-4 sm:mt-6 text-xs sm:text-sm text-muted-foreground ${isMobile && zoomLevel < 60 ? 'hidden' : ''}`}>
          <p>A4 Page Format (210mm × 297mm)</p>
          {isMobile && (
            <p className="text-xs mt-1">Swipe to pan • Pinch to zoom</p>
          )}
        </div>
      </div>

      {/* Mobile Quick Actions - Fixed bottom bar */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-2 flex gap-2 z-40">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoomLevel(50)}
            className="flex-1 h-9 text-xs"
          >
            Fit Width
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoomLevel(100)}
            className="flex-1 h-9 text-xs"
          >
            Actual Size
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
            className="flex-1 h-9 text-xs bg-orange-600 hover:bg-orange-700"
          >
            {isExporting ? 'Exporting...' : 'Download'}
          </Button>
        </div>
      )}
    </div>
  );
}