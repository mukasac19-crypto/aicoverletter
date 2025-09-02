
"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/client-side-client';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { renderResumeTemplate } from '@/lib/resume-template-renderer';
import { ArrowLeft, Download, Edit, Eye, ZoomIn, ZoomOut } from 'lucide-react';
import Link from 'next/link';
import { DEFAULT_RESUME_TEMPLATES } from '@/lib/default-resume-templates';
import { mapDatabaseToResumeData } from '@/lib/resume-mappers';
import ResumePreview from '@/components/ResumePreview';
import { useAuthStore } from '@/stores/authstore';
import html2canvas from 'html2canvas';

//pdf render
import { Page, Text, View, Document, StyleSheet, usePDF,PDFViewer } from '@react-pdf/renderer';

const validateResumeData = (resumeData: any) => {
  if (!resumeData) return null;
  
  console.log("Validating resume data:", resumeData);
  
  const validatedResume = { ...resumeData };
  
  if (validatedResume.personal_info && !validatedResume.personalInfo) {
    console.log("Converting personal_info to personalInfo");
    validatedResume.personalInfo = validatedResume.personal_info;
  }
  
  if (validatedResume.work_experience && !validatedResume.workExperience) {
    console.log("Converting work_experience to workExperience");
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
  } else if (!validatedResume.personalInfo.firstName || !validatedResume.personalInfo.lastName) {
    validatedResume.personalInfo = {
      ...validatedResume.personalInfo,
      firstName: validatedResume.personalInfo.firstName || validatedResume.title?.split(' ')[0] || 'First',
      lastName: validatedResume.personalInfo.lastName || validatedResume.title?.split(' ').slice(1).join(' ') || 'Last',
    };
  }
  
  if (!validatedResume.personalInfo.contact) {
    validatedResume.personalInfo.contact = { email: '', phone: '', location: '' };
  }
  
  if (!validatedResume.workExperience || !Array.isArray(validatedResume.workExperience)) {
    validatedResume.workExperience = [];
  }
  
  if (!validatedResume.education || !Array.isArray(validatedResume.education)) {
    validatedResume.education = [];
  }
  
  if (!validatedResume.skills || !Array.isArray(validatedResume.skills)) {
    validatedResume.skills = [];
  }
  
  if (!validatedResume.projects || !Array.isArray(validatedResume.projects)) {
    validatedResume.projects = [];
  }
  
  if (!validatedResume.languages || !Array.isArray(validatedResume.languages)) {
    validatedResume.languages = [];
  }
  
  if (!validatedResume.certifications || !Array.isArray(validatedResume.certifications)) {
    validatedResume.certifications = [];
  }
  
  if (!validatedResume.interests || !Array.isArray(validatedResume.interests)) {
    validatedResume.interests = [];
  }
  
  if (!validatedResume.internships || !Array.isArray(validatedResume.internships)) {
    validatedResume.internships = [];
  }
  
  if (!validatedResume.references || !Array.isArray(validatedResume.references)) {
    validatedResume.references = [];
  }
  
  if (!validatedResume.customSections || !Array.isArray(validatedResume.customSections)) {
    validatedResume.customSections = [];
  }
  
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

const getFallbackTemplate = () => {
  if (DEFAULT_RESUME_TEMPLATES && DEFAULT_RESUME_TEMPLATES.length > 0) {
    const defaultTemplate = DEFAULT_RESUME_TEMPLATES[0];

    return normalizeTemplate({
      id: defaultTemplate.id,
      name: defaultTemplate.name,
      description: defaultTemplate.description,
      htmlContent: defaultTemplate.htmlContent,
      cssContent: defaultTemplate.cssContent,
    });
  }
  
  return normalizeTemplate({
    id: 'fallback-template',
    name: 'Fallback Template',
    description: 'Basic fallback template',
    htmlContent: `
      <div class="container">
        <header>
          <h1>{{name}}</h1>
          <p>{{title}}</p>
          <div>
            <p>{{email}}</p>
            <p>{{phone}}</p>
            <p>{{address}}</p>
          </div>
        </header>
        
        {{professional-summary}}
        {{work-experience}}
        {{education}}
        {{skills}}
        {{projects}}
        {{certifications}}
        {{languages}}
        {{interests}}
        {{references}}
      </div>
    `,
    cssContent: `
      
    `
  });
};



export default function ResumePreviewPage() {



  const [resume, setResume] = useState<any | null>(null);
  const [template, setTemplate] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [html, setHtml] = useState<string>('');
  const [css, setCss] = useState<string>('');
  const [viewMode, setViewMode] = useState<'fit' | 'full'>('fit');
  const [zoomLevel, setZoomLevel] = useState<number>(75);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const  [pdfurl,setPdfurl] = useState<string | null >(null)
  
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const supabase = createClient();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const resumeId = params.id as string;
   
    // Create styles
const styles = StyleSheet.create({
  page: {
    width:"100%",
    height:"100%",
    backgroundColor: '#E4E4E4',
  },
  section: {
    width:"100%",
    margin: 10,
    padding: 10,
    backgroundColor:"green"
  },
});


    const MyDoc =(
       <Document>
            <Page size="A4" style={styles.page}>
            <View style={styles.section}>
              <div className='w-full h-full bg-yellow-500'>
                <style>{css}</style>
                <div dangerouslySetInnerHTML={{ __html: html }} />
              </div>
            </View>
            
          </Page>
         </Document>
    )

  const [instance, updateInstance] = usePDF({ document: MyDoc});

  useEffect(()=>{

    if(instance && instance.url){
        setPdfurl(instance.url)
    }

  },[instance])

  
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
        console.log("Mapped resume data for preview:", mappedResume);
        
        const validatedResume = validateResumeData(mappedResume);
        console.log('Validated resume data:', validatedResume);
        setResume(validatedResume);
        
        if (resumeData.template_id) {
          const { data: templateData, error: templateError } = await supabase
            .from('resume_templates')
            .select('*')
            .eq('id', resumeData.template_id)
            .maybeSingle();
          
          if (!templateError && templateData) {
            console.log('Found template in resume_templates table:', templateData.name);
            setTemplate(normalizeTemplate(templateData));
            return;
          }
          
          const { data: oldTemplateData, error: oldTemplateError } = await supabase
            .from('templates')
            .select('*')
            .eq('id', resumeData.template_id)
            .maybeSingle();
          
          if (!oldTemplateError && oldTemplateData) {
            console.log('Found template in templates table:', oldTemplateData.name);
            setTemplate(normalizeTemplate(oldTemplateData));
            return;
          }
        }
        
        const { data: anyTemplate, error: anyError } = await supabase
          .from('resume_templates')
          .select('*')
          .limit(1)
          .maybeSingle();
        
        if (!anyError && anyTemplate) {
          console.log('Using random template from resume_templates table');
          setTemplate(normalizeTemplate(anyTemplate));
          return;
        }
        
        const { data: anyOldTemplate, error: anyOldError } = await supabase
          .from('templates')
          .select('*')
          .limit(1)
          .maybeSingle();
        
        if (!anyOldError && anyOldTemplate) {
          console.log('Using random template from templates table');
          setTemplate(normalizeTemplate(anyOldTemplate));
          return;
        }
        
        console.log('Using fallback template');
        setTemplate(getFallbackTemplate());
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

  
  useEffect(() => {
    if (resume && template) {
      try {
        console.log('Rendering template with resume:', resume);
        console.log('Using template:', template);
        const renderedHtml = renderResumeTemplate(template, resume);
        
        const bodyContentMatch = renderedHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        const bodyContent = bodyContentMatch ? bodyContentMatch[1] : renderedHtml;
        
        const headStylesMatch = renderedHtml.match(/<head[^>]*>([\s\S]*)<\/head>/i);
        let headStyles = '';
        if (headStylesMatch) {
          const styleMatches = headStylesMatch[1].match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
          if (styleMatches) {
            headStyles = styleMatches.join('');
          }
        }
        
        setCss(`
          ${template.cssContent}
          ${headStyles.replace(/<style[^>]*>|<\/style>/gi, '')}
        `);
        
        setHtml(bodyContent);

      } catch (err: any) {
        console.error('Error rendering template:', err);
        setError(`Failed to render resume: ${err.message}`);
        
        setHtml(`
          <div style="padding: 20px; color: #e53e3e;">
            <h2>Error rendering resume template</h2>
            <p>${err.message}</p>
          </div>
        `);
      }
    }
  }, [resume, template]);
  
  const handleExport = async () => {
    try {
      setIsExporting(true);
      setError(null);

      if (!containerRef.current) return;

      const originalStyle = containerRef.current.style.cssText;
      containerRef.current.style.height = '297mm';
      containerRef.current.style.overflow = 'visible';
      containerRef.current.style.width = '210mm';

      const canvas = await html2canvas(containerRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      containerRef.current.style.cssText = originalStyle;

      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `${resume.personalInfo.firstName}-${resume.personalInfo.lastName}-Resume.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Successful",
        description: "Your resume has been exported as an image.",
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
  
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'fit' ? 'full' : 'fit');
  };
  
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 10, 150));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 10, 40));
  };
  
  const handleZoomReset = () => {
    setZoomLevel(75);
  };
  
  const handleFullscreen = () => {
    const container = containerRef.current;
    if (container) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if ((container as any).webkitRequestFullscreen) {
        (container as any).webkitRequestFullscreen();
      } else if ((container as any).msRequestFullscreen) {
        (container as any).msRequestFullscreen();
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="container py-8 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="flex justify-center mt-6">
          <Button asChild>
            <Link href="/dashboard/resumes">Back to Resumes</Link>
          </Button>
        </div>
      </div>
    );
  }


  


  
  const heightClass = viewMode === 'fit' 
    ? "h-screen sm:h-[600px] md:h-[700px] lg:h-[800px] xl:h-[900px]" 
    : "h-screen";
  
  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 md:px-6 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center flex-wrap gap-2">
          <Button variant="ghost" asChild className="mr-4">
            <Link href="/dashboard/resumes">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{resume.title}</h1>
            <p className="text-muted-foreground">Preview your resume</p>
          </div>
        </div>


        <div className="flex flex-wrap gap-2">
          {user && user.id === resume.userId && (
            <Button variant="outline" asChild>
              <Link href={`/dashboard/resumes/${resumeId}`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Resume
              </Link>
            </Button>
          )}
          <Button 
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? <LoadingSpinner className="h-4 w-4 mr-2" /> : <Download className="h-4 w-4 mr-2" />}
            {isExporting ? "Exporting..." : "Download Image"}
          </Button>
        </div>
      </div>

      {/* preview */}
      <div className='w-full h-[60vh] p-4 bg-pink-100 overflow-x-auto'>
        { pdfurl && 
          <iframe 
            src={pdfurl} 
            width="600px" 
            height="500px" 
            title="PDF Viewer"
          />
        }

        { pdfurl && <a href={pdfurl} download="test.pdf">
         Download Resume
        </a>}

        {/* <MyDoc/> */}
        {/* <PDFViewer style={{width:"600px",height:"600px"}}>
          <MyDoc/>
        </PDFViewer> */}

        

       
      </div>
      
     {/* <Card ref={containerRef} className="overflow-x-auto w-full">
        <style>{css}</style>
        <div className="resume-preview-content bg-pink-300 w-full" dangerouslySetInnerHTML={{ __html: html }} />
        <CardFooter className="flex flex-col md:flex-row justify-between bg-muted/20 border-t p-4 gap-2">
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={toggleViewMode}>
              {viewMode === 'fit' ? 'Full Height' : 'Fit to Screen'}
            </Button>
            <Button variant="outline" onClick={handleFullscreen}>
              <Eye className="h-4 w-4 mr-2" />
              Fullscreen
            </Button>
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <div className="flex space-x-1 mr-2">
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
                className="h-8 px-2"
              >
                <span className="text-xs">{zoomLevel}%</span>
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
            </div>
          </div>
        </CardFooter>
      </Card> */}
    </div>
  );
}





// .resume-preview-content {
//             font-family: Arial, sans-serif;
//             line-height: 1.5;
//             color: #333;
//             width: 210mm; /* A4 width */
//             min-height: 297mm; /* A4 height */
//             margin: 0 auto;
//             padding: 20mm;
//             box-sizing: border-box;
//             transform-origin: top left;
//           }
          
//           .resume-preview-content div, 
//           .resume-preview-content p, 
//           .resume-preview-content h1, 
//           .resume-preview-content h2, 
//           .resume-preview-content h3, 
//           .resume-preview-content h4, 
//           .resume-preview-content h5, 
//           .resume-preview-content h6, 
//           .resume-preview-content ul, 
//           .resume-preview-content ol, 
//           .resume-preview-content li {
//             margin: 0;
//             padding: 0;
//             box-sizing: border-box;
//           }
          
//           @media print {
//             body {
//               margin: 0;
//               padding: 0;
//             }
            
//             .resume-preview-content {
//               margin: 0;
//               padding: 0;
//               transform: none !important;
//             }
//           }
          
//           @media screen and (max-width: 768px) {
//             .resume-preview-content {
//               width: 80vw; /* Scale to 80% of viewport width */
//               min-height: auto; /* Allow height to adjust */
//               padding: 10mm;
//               transform: scale(0.7); /* Scale down to fit small screens */
//               transform-origin: top left;
//               background-color:blue;
//             }
//           }
          
//           @media screen and (max-width: 480px) {
//             .resume-preview-content {
//               width: 90vw;
//               height:60vh;
//               padding: 5mm;
//               transform: scale(0.5);
//               background-color:aqua;
//             }



// body {
//         font-family: Arial, sans-serif;
//         margin: 0;
//         padding: 0;
//         color: #333;
//       }
      
//       .container {
//         max-width: 210mm;
//         min-height: 297mm;
//         margin: 0 auto;
//         padding: 20mm;
//         box-sizing: border-box;
//         background-color:red;
//       }
      
//       h1, h2, h3 {
//         margin-top: 0;
//         color: #2c3e50;
//       }
      
//       .section-heading {
//         border-bottom: 1px solid #eee;
//         padding-bottom: 5px;
//         margin-top: 20px;
//         font-size: 18px;
//       }
      
//       .section-content {
//         margin-bottom: 20px;
//       }
