"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getBrowserClient } from '@/lib/supabase-browser';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { DEFAULT_RESUME_TEMPLATES } from '@/lib/default-resume-templates';
import { mapDatabaseToResumeData } from '@/lib/resume-mappers';
import { EnhancedResumePreview } from '@/components/EnhancedResumePreview';

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
    validatedResume.customSections = validatedResume.custom_sections;
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

export default function ResumePreviewPage() {
  const [resume, setResume] = useState<any | null>(null);
  const [template, setTemplate] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const supabase = getBrowserClient();
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
    <EnhancedResumePreview
      resume={resume}
      template={template}
      mode="fullpage"
      showControls={true}
      allowExport={true}
    />
  );
}