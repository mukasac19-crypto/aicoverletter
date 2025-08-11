//C:\Users\mukas\Downloads\project-bolt-sb1-guerg2d9\project\components\InterviewBuddyGenerator.tsx

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { createBrowserClient } from "@/lib/supabase";
import { Progress } from "@/components/ui/progress";
import InterviewQuestionList from "@/components/InterviewQuestionList";
import { cn } from "@/lib/utils";
import LimitedActionButton from "@/components/LimitedActionButton"; // Import for billing
import {
  FileText,
  Sparkles,
  Info,
  Save,
  Copy,
  Download,
  CheckCircle2,
  Briefcase,
  GraduationCap,
  Target,
  HelpCircle,
  RefreshCw
} from "lucide-react";
import { Json } from "@/types/supabase";

interface InterviewSession {
  id?: string;
  resumeId: string;
  jobTitle: string;
  jobDescription?: string;
  interviewType: 'technical' | 'behavioral' | 'mixed';
  difficulty: 'basic' | 'intermediate' | 'advanced';
  questions: InterviewQuestion[];
  generatedAt?: Date;
}

interface InterviewQuestion {
  id: string;
  question: string;
  suggestedAnswer: string;
  category: string;
  difficulty: string;
}

interface Resume {
    id: string;
    title: string;
}

interface InterviewBuddyGeneratorProps {
  resumes: Resume[];
  initialResumeId?: string;
  initialJobTitle?: string;
  initialJobId?: string;
}

export default function InterviewBuddyGenerator({ resumes, initialResumeId = '', initialJobTitle = '', initialJobId = '' }: InterviewBuddyGeneratorProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const supabase = createBrowserClient();
  
  const [resumeId, setResumeId] = useState<string>(initialResumeId);
  const [jobTitle, setJobTitle] = useState<string>(initialJobTitle);
  const [jobDescription, setJobDescription] = useState<string>("");
  const [interviewType, setInterviewType] = useState<'technical' | 'behavioral' | 'mixed'>('mixed');
  const [difficulty, setDifficulty] = useState<'basic' | 'intermediate' | 'advanced'>('intermediate');
  const [questionCount, setQuestionCount] = useState<number>(5);
  
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  
  const [interviewSession, setInterviewSession] = useState<InterviewSession | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!initialJobId) return;
      
      try {
        const response = await fetch(`/api/jobs/${initialJobId}`);
        if (!response.ok) throw new Error('Failed to fetch job details');
        const job = await response.json();
        setJobTitle(job.title || '');
        setJobDescription(job.description || '');
      } catch (error) {
        console.error('Error fetching job details:', error);
      }
    };
    
    if (initialJobId) {
      fetchJobDetails();
    }
  }, [initialJobId]);
  
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isGenerating) {
      setGenerationProgress(0);
      interval = setInterval(() => {
        setGenerationProgress((prev) => {
          const increment = Math.random() * 10 + 5;
          const newProgress = prev + increment;
          return newProgress > 95 ? 95 : newProgress;
        });
      }, 600);
    } else if (interviewSession) {
      setGenerationProgress(100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGenerating, interviewSession]);
  
  const handleGenerateInterview = async () => {
    try {
      if (!resumeId || (!jobTitle && !jobDescription)) {
        setError('Please select a resume and provide either a job title or description');
        return;
      }
      
      setError(null);
      setIsGenerating(true);
      
      const response = await fetch('/api/interview/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId, jobTitle, jobDescription, interviewType, difficulty, questionCount }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate interview questions');
      }
      
      const data = await response.json();
      
      setInterviewSession({
        resumeId, jobTitle, jobDescription, interviewType, difficulty,
        questions: data.questions,
        generatedAt: new Date()
      });
      
      toast({
        title: "Interview Generated",
        description: `${data.questions.length} interview questions have been generated.`,
      });
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        console.error('Error generating interview:', err);
        setError(errorMessage);
        toast({
            title: "Generation Failed",
            description: errorMessage,
            variant: "destructive",
        });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSaveInterview = async () => {
    if (!user || !interviewSession) return;
    
    try {
      setIsSaving(true);
      
      const questionsAsJson = JSON.stringify(interviewSession.questions) as unknown as Json;

      const { data, error } = await supabase
        .from('interview_sessions')
        .insert({
          user_id: user.id,
          resume_id: interviewSession.resumeId,
          job_title: interviewSession.jobTitle,
          job_description: interviewSession.jobDescription,
          interview_type: interviewSession.interviewType,
          difficulty: interviewSession.difficulty,
          questions_answers: questionsAsJson,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setIsSaved(true);
      setInterviewSession({
        ...interviewSession,
        id: data.id
      });
      
      toast({
        title: "Interview Saved",
        description: "Your interview session has been saved successfully.",
      });
      
      router.push(`/dashboard/interview-buddy/sessions/${data.id}`);
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        console.error('Error saving interview:', err);
        toast({
            title: "Save Failed",
            description: errorMessage,
            variant: "destructive",
        });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleCopyToClipboard = async () => {
    if (!interviewSession) return;
    try {
      let copyText = `# Interview Preparation: ${interviewSession.jobTitle}\n\n`;
      interviewSession.questions.forEach((q, index) => {
        copyText += `## Question ${index + 1} (${q.category})\n\n${q.question}\n\n### Suggested Answer:\n\n${q.suggestedAnswer}\n\n---\n\n`;
      });
      await navigator.clipboard.writeText(copyText);
      toast({ title: "Copied to Clipboard" });
    } catch (error) {
      toast({ title: "Copy Failed", variant: "destructive" });
    }
  };

  const handleDownload = () => {
    if (!interviewSession) return;
    try {
      let downloadText = `# Interview Preparation: ${interviewSession.jobTitle}\n\n`;
      if (interviewSession.jobDescription) {
        downloadText += `## Job Description\n\n${interviewSession.jobDescription}\n\n---\n\n`;
      }
      interviewSession.questions.forEach((q, index) => {
        downloadText += `## Question ${index + 1} (${q.category})\n\n${q.question}\n\n### Suggested Answer:\n\n${q.suggestedAnswer}\n\n---\n\n`;
      });
      
      const blob = new Blob([downloadText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Interview-Prep-${interviewSession.jobTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({ title: "Download Started" });
    } catch (error) {
      toast({ title: "Download Failed", variant: "destructive" });
    }
  };
  
  const handleRegenerate = () => {
    if (isGenerating) return;
    setInterviewSession(null);
    setIsSaved(false);
    handleGenerateInterview();
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {!interviewSession ? (
        <Card className="border-orange-100">
          <CardHeader className="bg-orange-50/50 pb-4 md:pb-6">
            <CardTitle className="flex items-center gap-2 text-gray-800 text-lg md:text-xl">
              <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />
              Generate Interview Questions
            </CardTitle>
            <CardDescription className="text-gray-600 text-sm md:text-base">
              Our AI will create tailored interview questions based on your resume and the job details
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4 md:space-y-6 pt-4 px-4 md:px-6">
            {error && (
              <Alert variant="destructive" className="mb-4 bg-red-50 border-red-200 text-red-800">
                <AlertDescription>{error}</AlertDescription>
            	</Alert>
          	)}
          	
          	<div className="space-y-1 md:space-y-2">
          		<Label htmlFor="resumeSelect" className="text-gray-700 text-sm md:text-base">Select Your Resume</Label>
          		<Select value={resumeId} onValueChange={setResumeId}>
          			<SelectTrigger id="resumeSelect" className="border-orange-200 focus:ring-orange-500">
          				<SelectValue placeholder="Choose a resume" />
          			</SelectTrigger>
          			<SelectContent className="border-orange-100">
          				{resumes.map((resume) => (
          					<SelectItem key={resume.id} value={resume.id}>
          						{resume.title}
          					</SelectItem>
          				))}
          			</SelectContent>
          		</Select>
          		<p className="text-xs text-gray-600">
          			Your resume helps our AI tailor questions to your background
          		</p>
          	</div>
          	
          	<div className="space-y-1 md:space-y-2">
          		<Label htmlFor="jobTitle" className="text-gray-700 text-sm md:text-base">Job Title</Label>
          		<Input
          			id="jobTitle"
          			value={jobTitle}
          			onChange={(e) => setJobTitle(e.target.value)}
          			placeholder="Software Engineer, Product Manager, etc."
          			className="border-orange-200 focus:ring-orange-500"
          		/>
          	</div>
          	
          	<div className="space-y-1 md:space-y-2">
          		<Label htmlFor="jobDescription" className="flex items-center gap-1 text-gray-700 text-sm md:text-base">
          			Job Description <span className="text-gray-500">(Optional)</span>
          		</Label>
          		<Textarea
          			id="jobDescription"
          			value={jobDescription}
          			onChange={(e) => setJobDescription(e.target.value)}
          			placeholder="Paste the job description for more tailored questions"
          			rows={4}
          			className="border-orange-200 focus:ring-orange-500"
          		/>
          		<p className="text-xs text-gray-600">
          			Adding a job description will result in more specific interview questions
          		</p>
          	</div>
          	
          	<div className="space-y-1 md:space-y-2">
          		<Label className="text-gray-700 text-sm md:text-base">Interview Type</Label>
          		<RadioGroup
          			value={interviewType}
          			onValueChange={(value) => setInterviewType(value as 'technical' | 'behavioral' | 'mixed')}
          			className="flex flex-wrap gap-2 md:gap-4"
          		>
          			<div className="flex items-center space-x-2">
          				<RadioGroupItem value="technical" id="technical" className="text-orange-600 border-orange-300 focus:ring-orange-500" />
          				<Label htmlFor="technical" className="cursor-pointer text-sm md:text-base text-gray-700">Technical</Label>
          			</div>
          			<div className="flex items-center space-x-2">
          				<RadioGroupItem value="behavioral" id="behavioral" className="text-orange-600 border-orange-300 focus:ring-orange-500" />
          				<Label htmlFor="behavioral" className="cursor-pointer text-sm md:text-base text-gray-700">Behavioral</Label>
          			</div>
          			<div className="flex items-center space-x-2">
          				<RadioGroupItem value="mixed" id="mixed" className="text-orange-600 border-orange-300 focus:ring-orange-500" />
          				<Label htmlFor="mixed" className="cursor-pointer text-sm md:text-base text-gray-700">Mixed (Both)</Label>
          			</div>
          		</RadioGroup>
          	</div>
          	
          	<div className="space-y-1 md:space-y-2">
          		<Label className="text-gray-700 text-sm md:text-base">Difficulty Level</Label>
          		<RadioGroup
          			value={difficulty}
          			onValueChange={(value) => setDifficulty(value as 'basic' | 'intermediate' | 'advanced')}
          			className="flex flex-wrap gap-2 md:gap-4"
          		>
          			<div className="flex items-center space-x-2">
          				<RadioGroupItem value="basic" id="basic" className="text-orange-600 border-orange-300 focus:ring-orange-500" />
          				<Label htmlFor="basic" className="cursor-pointer text-sm md:text-base text-gray-700">Basic</Label>
          			</div>
          			<div className="flex items-center space-x-2">
          				<RadioGroupItem value="intermediate" id="intermediate" className="text-orange-600 border-orange-300 focus:ring-orange-500" />
          				<Label htmlFor="intermediate" className="cursor-pointer text-sm md:text-base text-gray-700">Intermediate</Label>
          			</div>
          			<div className="flex items-center space-x-2">
          				<RadioGroupItem value="advanced" id="advanced" className="text-orange-600 border-orange-300 focus:ring-orange-500" />
          				<Label htmlFor="advanced" className="cursor-pointer text-sm md:text-base text-gray-700">Advanced</Label>
          			</div>
          		</RadioGroup>
          	</div>
          	
          	<div className="space-y-1 md:space-y-2">
          		<Label className="text-gray-700 text-sm md:text-base">Number of Questions</Label>
          		<div className="flex items-center gap-2">
          			<Button type="button" variant="outline" size="sm" onClick={() => setQuestionCount(Math.max(3, questionCount - 1))} disabled={questionCount <= 3} className="border-orange-200 hover:bg-orange-50 text-orange-700">-</Button>
          			<span className="w-8 text-center text-gray-800">{questionCount}</span>
          			<Button type="button" variant="outline" size="sm" onClick={() => setQuestionCount(Math.min(10, questionCount + 1))} disabled={questionCount >= 10} className="border-orange-200 hover:bg-orange-50 text-orange-700">+</Button>
          		</div>
          	</div>
        	</CardContent>
        	
        	<CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-3 px-4 md:px-6 pb-4 md:pb-6 border-t border-orange-100 pt-4">
        		<div className="text-xs md:text-sm text-gray-600 flex items-center">
        			<Info className="h-3 w-3 md:h-4 md:w-4 mr-1 text-orange-600" />
        			<span>Use specific job details for better results</span>
        		</div>
        		<LimitedActionButton 
        			feature="interviewSessions"
              featureName="Interview Session"
        			onAllowed={handleGenerateInterview} 
        			disabled={isGenerating || !resumeId || (!jobTitle && !jobDescription)}
        			className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white"
        		>
        			<Sparkles className="mr-2 h-3 w-3 md:h-4 md:w-4" />
        			<span className="text-sm md:text-base">Generate Interview</span>
        		</LimitedActionButton>
        	</CardFooter>
        	
        	{isGenerating && (
        		<div className="p-4 border-t border-orange-100">
        			<Progress value={generationProgress} className="h-2 [&>div]:bg-orange-600" />
        			<p className="text-xs text-center mt-2 text-gray-600">
        				Generating your interview questions...
        			</p>
        		</div>
        	)}
      	</Card>
    	) : (
    		<div className="space-y-4 md:space-y-6">
    			<Card className="border-orange-100">
    				<CardHeader className="bg-orange-50/50 pb-4 md:pb-6">
    					<div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
    						<div>
    							<CardTitle className="text-gray-800 text-lg md:text-xl">Interview Preparation</CardTitle>
    							<CardDescription className="text-gray-600 text-sm md:text-base">{jobTitle}</CardDescription>
    						</div>
    						
    						<div className="flex flex-wrap gap-2">
    							<Button 
        							variant="outline" 
        							size="sm" 
        							onClick={handleRegenerate} 
        							disabled={isGenerating}
        							className="text-xs md:text-sm border-orange-200 hover:bg-orange-50 text-orange-700"
        						>
        							{isGenerating ? (
        								<LoadingSpinner className="h-3 w-3 md:h-4 md:w-4" />
        							) : (
        								<RefreshCw className="h-3 w-3 md:h-4 md:w-4 mr-1" />
        							)}
        							<span className="hidden xs:inline">Regenerate</span>
        						</Button>
        						
        						<Button 
        							variant="outline" 
        							size="sm" 
        							onClick={handleCopyToClipboard}
        							className="text-xs md:text-sm border-orange-200 hover:bg-orange-50 text-orange-700"
        						>
        							<Copy className="h-3 w-3 md:h-4 md:w-4 mr-1" />
        							<span className="hidden xs:inline">Copy</span>
        						</Button>
        						
        						<Button 
        							variant="outline" 
        							size="sm" 
        							onClick={handleDownload}
        							className="text-xs md:text-sm border-orange-200 hover:bg-orange-50 text-orange-700"
        						>
        							<Download className="h-3 w-3 md:h-4 md:w-4 mr-1" />
        							<span className="hidden xs:inline">Download</span>
        						</Button>
        						
        						<Button 
        							size="sm" 
        							onClick={handleSaveInterview} 
        							disabled={isSaving || isSaved}
        							className={cn(
        								"text-xs md:text-sm",
        								isSaved 
        									? "bg-orange-100 text-orange-700 hover:bg-orange-100" 
        									: "bg-orange-600 hover:bg-orange-700 text-white"
        							)}
        						>
        							{isSaving ? (
        								<LoadingSpinner className="h-3 w-3 md:h-4 md:w-4 mr-1" />
        							) : isSaved ? (
        								<CheckCircle2 className="h-3 w-3 md:h-4 md:w-4 mr-1" />
        							) : (
        								<Save className="h-3 w-3 md:h-4 md:w-4 mr-1" />
        							)}
        							{isSaved ? "Saved" : "Save"}
        						</Button>
        					</div>
        				</div>
        			</CardHeader>
        		</Card>
        		
        		<InterviewQuestionList questions={interviewSession.questions} />
        		
        		<Card className="border-orange-100">
        			<CardHeader className="bg-orange-50/50 pb-4">
        				<CardTitle className="text-gray-800 text-base md:text-lg">Interview Tips</CardTitle>
        			</CardHeader>
        			<CardContent className="pt-4 px-4 md:px-6">
        				<div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        					<div className="border border-orange-100 rounded-lg p-3 md:p-4">
        						<div className="flex items-center gap-2 mb-2">
        							<Target className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />
        							<h3 className="font-medium text-gray-800 text-sm md:text-base">Preparation</h3>
        						</div>
        						<ul className="text-xs md:text-sm space-y-1 ml-5 md:ml-7 text-gray-700">
        							<li>Research the company thoroughly</li>
        							<li>Practice your answers out loud</li>
        							<li>Prepare your own questions to ask</li>
        							<li>Review the job description multiple times</li>
        						</ul>
        					</div>
        					
        					<div className="border border-orange-100 rounded-lg p-3 md:p-4">
        						<div className="flex items-center gap-2 mb-2">
        							<GraduationCap className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />
        							<h3 className="font-medium text-gray-800 text-sm md:text-base">During the Interview</h3>
        						</div>
        						<ul className="text-xs md:text-sm space-y-1 ml-5 md:ml-7 text-gray-700">
        							<li>Use the STAR method for behavioral questions</li>
        							<li>Take time to think before answering</li>
        							<li>Ask for clarification if needed</li>
        							<li>Show enthusiasm and positive body language</li>
        						</ul>
        					</div>
        					
        					<div className="border border-orange-100 rounded-lg p-3 md:p-4">
        						<div className="flex items-center gap-2 mb-2">
        							<Briefcase className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />
        							<h3 className="font-medium text-gray-800 text-sm md:text-base">Technical Questions</h3>
        						</div>
        						<ul className="text-xs md:text-sm space-y-1 ml-5 md:ml-7 text-gray-700">
        							<li>Be honest about your knowledge levels</li>
        							<li>Walk through your thought process</li>
        							<li>It&apos;s okay to say &quot;I don&apos;t know, but here&apos;s how I&apos;d find out&quot;</li>
        							<li>Provide specific examples from past work when possible</li>
        						</ul>
        					</div>
        					
        					<div className="border border-orange-100 rounded-lg p-3 md:p-4">
        						<div className="flex items-center gap-2 mb-2">
        							<HelpCircle className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />
        							<h3 className="font-medium text-gray-800 text-sm md:text-base">Follow-up</h3>
        						</div>
        						<ul className="text-xs md:text-sm space-y-1 ml-5 md:ml-7 text-gray-700">
        							<li>Send a thank-you email within 24 hours</li>
        							<li>Reference specific conversation topics</li>
        							<li>Express continued interest in the position</li>
        							<li>Follow up if you haven&apos;t heard back in a week</li>
        						</ul>
        					</div>
        				</div>
        			</CardContent>
        		</Card>
      	</div>
    	)}
  </div>
  );
}