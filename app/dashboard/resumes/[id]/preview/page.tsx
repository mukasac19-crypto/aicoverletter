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

const validateResumeData = (resumeData: any) => {
  if (!resumeData) return null;
  
  const validatedResume = { ...resumeData };
  
  // Convert snake_case to camelCase
  if (validatedResume.personal_info && !validatedResume.personalInfo) {
    validatedResume.personalInfo = validatedResume.personal_info;
  }
  
  if (validatedResume.work_experience && !validatedResume.workExperience) {
    validatedResume.workExperience = validatedResume.work_experience;
  }
  
  if (validatedResume.custom_sections && !validatedResume.customSections) {
    validatedResume.customSections = validatedResume.custom_sections;
  }
  
  // Ensure required fields exist
  if (!validatedResume.personalInfo) {
    validatedResume.personalInfo = {
      firstName: validatedResume.title?.split(' ')[0] || 'First',
      lastName: validatedResume.title?.split(' ').slice(1).join(' ') || 'Last',
      title: validatedResume.title || 'Resume',
      contact: { email: '', phone: '', location: '' }
    };
  }
  
  // Initialize arrays
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

export default function ResumePreviewPage() {
  const [resume, setResume] = useState<any | null>(null);
  const [template, setTemplate] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(75);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const supabase = createClient();
  
  const resumeId = params.id as string;

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
        
        // Fetch template
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
        
        // Fallback to first available template
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
        (progress, status) => {
          // Progress callback if needed
        },
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
  const handleZoomReset = () => setZoomLevel(75);
  
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
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/resumes">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-semibold">{resume?.title || 'Resume Preview'}</h1>
                <p className="text-sm text-muted-foreground">Full page preview</p>
              </div>
            </div>

            <div className="flex gap-2">
              {user && user.id === resume?.userId && (
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/resumes/${resumeId}`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Resume
                  </Link>
                </Button>
              )}
              <Button 
                onClick={() => handleExport('pdf')}
                disabled={isExporting}
              >
                {isExporting ? (
                  <>
                    <LoadingSpinner className="h-4 w-4 mr-2" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Zoom Controls */}
        <div className="flex justify-center mb-6">
          <Card className="inline-flex items-center gap-2 p-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 40}
              className="h-8 w-8 p-0"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomReset}
              className="h-8 px-3"
            >
              <span className="text-sm font-medium">{zoomLevel}%</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 150}
              className="h-8 w-8 p-0"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </Card>
        </div>

        {/* Resume Preview Container */}
        <div className="flex justify-center">
          <div 
            className="bg-white rounded-lg shadow-2xl overflow-hidden"
            style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center',
              transition: 'transform 0.2s ease-in-out',
              marginBottom: `${(zoomLevel - 100) * 5}px` // Adjust margin based on zoom
            }}
          >
            {/* A4 Page Container */}
            <div 
              className="relative"
              style={{
                width: '210mm',
                minHeight: '297mm',
                maxWidth: '100vw',
                backgroundColor: 'white',
              }}
            >
              {resume && template ? (
                <ResumePreview
                  resume={resume}
                  template={template}
                  height="auto"
                  defaultZoom={100}
                  removeCard={true}
                  responsiveHeight={true}
                />
              ) : (
                <div className="flex items-center justify-center h-full p-8">
                  <Alert>
                    <AlertDescription>
                      Unable to load resume preview. Please try again.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page indicator */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>A4 Page Format (210mm × 297mm)</p>
        </div>
      </div>
    </div>
  );
}