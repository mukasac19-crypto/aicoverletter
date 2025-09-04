"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Sparkles, FileText, Linkedin, Loader2, Lock } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import JobDescriptionInput from "@/components/JobDescriptionInput";
import DataSourcesManager from "./DataSourcesManager";
import { ResumeSourceSelector } from "@/components/ResumeSourceSelector"; 
import GenerationProcess from "./GenerationProcess";
import CoverLetterEditor from "./CoverLetterEditor";
import TemplateSelection from "./TemplateSelection";
import { generateCoverLetter, GenerationResult } from "@/lib/coverLetterGenerator";
import { SupabaseClient } from "@supabase/supabase-js";
import type { CoverLetter as CoverLetterType } from "@/types/cover-letter";
import { Database } from "@/types/supabase";
import type { CvFile as ImportedCvFile } from '@/lib/cv-helpers';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { UsageLimit } from '@/components/FeatureGate';
import { useTemplates } from "@/lib/hooks/useTemplates";

// --- Helper Component & Type Definitions ---

const LoadingSpinner = ({ className }: { className?: string }) => (
  <Loader2 className={`animate-spin ${className}`} />
);

// FIX: Define types to perfectly match the props of the child components
interface CVFileForManager {
  name: string;
  isSelected: boolean;
}

interface LinkedInProfileForManager {
  name: string;
}

interface Template {
  id: string;
  name: string;
}

interface ToastArgs {
  title: string;
  description: string;
  variant?: "default" | "destructive";
}

// Props for the main component
interface CreateCoverLetterTabProps {
  user: { id: string; [key: string]: any } | null;
  supabase: SupabaseClient;
  templates?: Template[]; // Make optional since we'll use hook
  toast: (args: ToastArgs) => void;
  onTabChange: (tab: string) => void;
}

const CreateCoverLetterTab = ({ user, supabase, toast, onTabChange }: CreateCoverLetterTabProps) => {
  const { isPro, usage, canUseFeature } = useSubscription();
  const { fetchTemplates, templates, isLoading: templatesLoading } = useTemplates();
  
  const [step, setStep] = useState(1);
  
  const [isDataSourcesOpen, setIsDataSourcesOpen] = useState(false);
  const [cvFiles, setCvFiles] = useState<ImportedCvFile[]>([]); 
  const [linkedInProfile, setLinkedInProfile] = useState<Database['public']['Tables']['linkedin_profiles']['Row'] | null>(null);
  const [dataSource, setDataSource] = useState<'none' | 'cv' | 'linkedin' | 'both'>('none');
  const [resumeData, setResumeData] = useState<any>(null);
  
  const [jobDescription, setJobDescription] = useState("");
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  const [coverLetterForEditor, setCoverLetterForEditor] = useState<(CoverLetterType & { dataSource: any }) | null>(null);
  
  const [showTemplateSelection, setShowTemplateSelection] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [generatingLetter, setGeneratingLetter] = useState(false);

  // Check if user can create cover letters
  const canCreateCoverLetter = canUseFeature('coverLetters');

  // Fetch templates on component mount
  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  // Set default template when templates are loaded
  useEffect(() => {
    if (templates.length > 0 && !selectedTemplate) {
      setSelectedTemplate(templates[0].id);
    }
  }, [templates, selectedTemplate]);

  const loadCvFiles = useCallback(async () => {
    // Mock implementation - replace with actual implementation
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("user_cvs")
        .select("*")
        .eq("user_id", user.id)
        .order("uploaded_at", { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        const formattedCvs: ImportedCvFile[] = data.map((cv: any) => ({
          id: cv.id,
          name: cv.filename,
          size: cv.filesize,
          type: cv.filetype,
          uploadDate: cv.uploaded_at,
          isSelected: cv.is_selected || false,
        }));
        setCvFiles(formattedCvs);
      }
    } catch (error) {
      console.error("Error loading CV files:", error);
    }
  }, [user, supabase]);
  
  const loadLinkedInProfile = useCallback(async () => {
    // Mock implementation - replace with actual implementation
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("linkedin_profiles")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "connected")
        .single();
      
      if (error && error.code !== "PGRST116") throw error;
      
      if (data) {
        setLinkedInProfile(data);
      }
    } catch (error) {
      console.error("Error loading LinkedIn profile:", error);
    }
  }, [user, supabase]);
  
  useEffect(() => {
    if (user) {
      loadCvFiles();
      loadLinkedInProfile();
    }
  }, [user, loadCvFiles, loadLinkedInProfile]);
  
  const handleJobDescriptionSubmit = (description: string, tone: string) => {
    setJobDescription(description);
    setStep(2);
  };
  
  const handleDataSourceSelected = useCallback((sourceType: 'cv' | 'linkedin' | 'both' | 'none', data: any) => {
    setDataSource(sourceType);
    setResumeData(data);
  }, []);
  
  const handleGenerateCoverLetter = useCallback(async (selectedData: any, selectedDataSource: 'cv' | 'linkedin' | 'both') => {
    if (!user) {
        toast({ title: "User not found", description: "You must be logged in to generate a letter.", variant: "destructive" });
        return;
    }
    
    if (!canCreateCoverLetter) {
      toast({
        title: "Cover letter limit reached",
        description: "Upgrade to PRO for unlimited cover letters",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedTemplate) {
      toast({ 
        title: "Templates still loading", 
        description: "Please wait a moment for templates to load and try again.", 
        variant: "destructive" 
      });
      return;
    }
    
    setGeneratingLetter(true);
    setIsRegenerating(false);
    setGenerationProgress(0);
    
    try {
      const result: GenerationResult = await generateCoverLetter({
        jobDescription,
        tone: "professional",
        resumeData: selectedData,
        dataSource: selectedDataSource
      });
      
      const newCoverLetter: CoverLetterType = {
          userId: user.id,
          jobDescription: jobDescription,
          content: result.coverLetter,
          tone: "professional",
          created_at: new Date(),
          jobTitle: result.jobTitle,
          companyName: result.companyName,
          data_source: selectedDataSource,
      };

      setCoverLetterForEditor({
          ...newCoverLetter,
          dataSource: selectedDataSource 
      });
      
      setStep(3);
      setShowTemplateSelection(true);
    } catch (error) {
      console.error('Error generating cover letter:', error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setGeneratingLetter(false);
    }
  }, [jobDescription, user, toast, canCreateCoverLetter, selectedTemplate]);
  
  const handleRegenerateCoverLetter = useCallback(async (letter: CoverLetterType) => {
      if (!letter) return;
      setIsRegenerating(true);
      try {
        const result = await generateCoverLetter({
            jobDescription: letter.jobDescription,
            tone: letter.tone,
            resumeData: resumeData,
            dataSource: letter.data_source,
            regenerate: true,
        });
        setCoverLetterForEditor(prev => prev ? { ...prev, content: result.coverLetter } : null);
        toast({ title: "Success", description: "Cover letter has been regenerated." });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        toast({ title: "Regeneration Failed", description: errorMessage, variant: "destructive" });
      } finally {
        setIsRegenerating(false);
      }
  }, [resumeData, toast]);
  
  const handleApplyTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    setCoverLetterForEditor(prev => prev ? { ...prev, templateId: templateId } : null);
    setShowTemplateSelection(false);
    toast({
      title: "Template Applied",
      description: "Your cover letter has been formatted with the selected template.",
    });
  };
  
  const handleSkipTemplateSelection = () => {
    setShowTemplateSelection(false);
    toast({
      title: "No Template Selected",
      description: "Your cover letter will use the default format.",
      variant: "default"
    });
  };
  
  // Get cover letter usage stats
  const coverLetterUsage = usage.coverLetters;
  
  if (step === 1) {
    return (
      <Card className="max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle>Job Description</CardTitle>
          <CardDescription>Enter the job posting information to create a tailored cover letter</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Usage limit display for free users */}
          {!isPro && coverLetterUsage && (
            <div className="mb-6">
              <UsageLimit feature="coverLetters" />
            </div>
          )}
          
          {!isPro && !canCreateCoverLetter && (
            <Alert className="mb-6 border-destructive">
              <Lock className="h-4 w-4" />
              <AlertTitle>Cover Letter Limit Reached</AlertTitle>
              <AlertDescription>
                You've reached your monthly limit of {coverLetterUsage?.limit} cover letters. Upgrade to PRO for unlimited access.
              </AlertDescription>
            </Alert>
          )}
          
          <JobDescriptionInput
            onSubmit={handleJobDescriptionSubmit}
            user={user}
            initialJobDescription={jobDescription}
            disabled={!canCreateCoverLetter}
          />
        </CardContent>
      </Card>
    );
  }
  
  if (step === 2) {
    // Adapter: Convert full CvFile type to the simpler CVFileForManager type expected by DataSourcesManager
    const cvFilesForManager: CVFileForManager[] = cvFiles.map(cv => ({
      name: cv.name,
      isSelected: cv.isSelected ?? false,
    }));
    
    const linkedInProfileForManager: LinkedInProfileForManager | null = linkedInProfile
      ? { name: linkedInProfile.name || 'LinkedIn Profile' }
      : null;

    const selectedData = dataSource === 'cv' ? cvFiles.find(cv => cv.isSelected) : 
                         dataSource === 'linkedin' ? linkedInProfile : 
                         dataSource === 'both' ? { cv: cvFiles.find(cv => cv.isSelected), linkedin: linkedInProfile } :
                         null;

    return (
      <div className="max-w-3xl mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Data Source</CardTitle>
            <CardDescription>
              Choose which source to use for your cover letter. This will help personalize your letter.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ResumeSourceSelector
              cvFiles={cvFiles}
              linkedInProfile={linkedInProfile}
              onDataSourceSelected={handleDataSourceSelected}
            />
            
            <Collapsible
              open={isDataSourcesOpen}
              onOpenChange={setIsDataSourcesOpen}
              className="w-full space-y-2"
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center justify-between w-full p-4 text-left"
                >
                  <span className="text-sm font-medium">
                    {isDataSourcesOpen ? "Hide" : "Show"} data source details
                  </span>
                  {isDataSourcesOpen ? <ArrowLeft className="h-4 w-4"/> : <ArrowRight className="h-4 w-4"/>}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <DataSourcesManager
                  isOpen={isDataSourcesOpen}
                  setIsOpen={setIsDataSourcesOpen}
                  hasCV={cvFiles.length > 0}
                  hasLinkedIn={linkedInProfile !== null}
                  cvFiles={cvFilesForManager}
                  linkedInProfile={linkedInProfileForManager}
                />
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
        
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => setStep(1)}>
            <ArrowLeft className="mr-2 h-4 w-4"/>
            Back
          </Button>
          <Button
            onClick={() => {
              if (dataSource === 'none') {
                handleGenerateCoverLetter(resumeData, 'none' as any);
              } else {
                if (selectedData) {
                  handleGenerateCoverLetter(selectedData, dataSource as 'cv' | 'linkedin' | 'both');
                } else {
                  toast({
                    title: "No source selected",
                    description: "Please select a data source to proceed.",
                    variant: "destructive"
                  });
                }
              }
            }}
            disabled={
              dataSource === 'none' || 
              !resumeData || 
              generatingLetter || 
              !canCreateCoverLetter ||
              templatesLoading || // Check if templates are loading
              templates.length === 0 // Check if no templates available
            }
          >
            {templatesLoading ? (
              <>
                <LoadingSpinner className="mr-2"/> 
                Loading templates...
              </>
            ) : generatingLetter ? (
              <>
                <LoadingSpinner className="mr-2"/> 
                Generating...
              </>
            ) : (
              <>
                Generate Cover Letter
                <ArrowRight className="ml-2 h-4 w-4"/>
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }
  
  if (step === 3 && coverLetterForEditor) {
    return (
      <div>
        {showTemplateSelection && (
          <TemplateSelection
            selectedTemplate={selectedTemplate}
            onApplyTemplate={handleApplyTemplate}
            onSkipSelection={handleSkipTemplateSelection}
          />
        )}
        <CoverLetterEditor
          coverLetter={coverLetterForEditor}
          onBack={() => setStep(2)}
          onTabChange={onTabChange}
          onRegenerateLetter={handleRegenerateCoverLetter}
        />
      </div>
    );
  }

  return null;
};

export default CreateCoverLetterTab;