"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { 
  ArrowLeft, Download, Edit, ZoomIn, ZoomOut, 
  Maximize2, Eye, AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { ResumeData, ResumeTemplate } from "@/types/resume";
import ResumePreview from '@/components/ResumePreview';
import { exportResumeWithProgress } from "@/lib/export-service";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface EnhancedResumePreviewProps {
  resume: ResumeData | null;
  template: ResumeTemplate | null;
  mode?: 'inline' | 'fullpage';
  height?: string;
  onTemplateSelect?: () => void;
  showControls?: boolean;
  defaultZoom?: number;
  allowExport?: boolean;
}

// Helper function to get initial zoom level based on mode and window size
const getInitialZoomLevel = (mode: 'inline' | 'fullpage') => {
  if (typeof window === 'undefined') return mode === 'inline' ? 65 : 75;
  
  if (mode === 'inline') {
    return 65; // Consistent zoom for inline mode
  }
  
  // Full page mode - responsive zoom
  if (window.innerWidth < 768) return 50;
  if (window.innerWidth < 1024) return 65;
  return 75;
};

export function EnhancedResumePreview({
  resume,
  template,
  mode = 'inline',
  height = mode === 'inline' ? '540px' : 'calc(100vh - 200px)',
  onTemplateSelect,
  showControls = true,
  defaultZoom,
  allowExport = true
}: EnhancedResumePreviewProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(
    defaultZoom || getInitialZoomLevel(mode)
  );
  const [isExporting, setIsExporting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  // Check mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Auto-adjust zoom on resize if no default zoom provided
      if (!defaultZoom && mode === 'fullpage') {
        if (mobile) setZoomLevel(50);
        else if (window.innerWidth < 1024) setZoomLevel(65);
        else setZoomLevel(75);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [defaultZoom, mode]);

  // Update zoom when defaultZoom changes (for inline mode)
  useEffect(() => {
    if (defaultZoom !== undefined) {
      setZoomLevel(defaultZoom);
    }
  }, [defaultZoom]);

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
        (progress, status) => {}, // Could add progress indicator here
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
  const handleZoomReset = () => setZoomLevel(getInitialZoomLevel(mode));

  const handleFullscreen = () => {
    if (mode === 'inline' && resume) {
      // Open in new tab for inline mode
      window.open(`/dashboard/resumes/${resume.id}/preview`, '_blank');
    } else {
      // Toggle fullscreen for fullpage mode
      if (!isFullscreen && containerRef.current) {
        containerRef.current.requestFullscreen?.();
        setIsFullscreen(true);
      } else if (isFullscreen) {
        document.exitFullscreen?.();
        setIsFullscreen(false);
      }
    }
  };

  // Handle no template selected
  if (!template && mode === 'inline') {
    return (
      <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-200 rounded-md w-full bg-white" style={{ height }}>
        <div className="text-center space-y-2 p-4">
          <AlertCircle className="h-8 w-8 text-gray-400 mx-auto" />
          <h3 className="font-medium text-gray-700 text-sm">No Template Selected</h3>
          <p className="text-xs text-gray-500">Choose a template to preview your resume</p>
          {onTemplateSelect && (
            <Button onClick={onTemplateSelect} size="sm" className="mt-2">
              Choose Template
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Handle no resume data
  if (!resume) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <Alert>
          <AlertDescription>No resume data available to preview.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const isOwner = user && user.id === resume.userId;

  return (
    <div className={mode === 'fullpage' ? 'min-h-screen bg-gray-100' : ''}>
      {/* Header - Only for fullpage mode */}
      {mode === 'fullpage' && (
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
                  <h1 className="text-base sm:text-xl font-semibold truncate">
                    {resume.title || 'Resume Preview'}
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                    Full page preview
                  </p>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                {isOwner && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="flex-1 sm:flex-none h-8 text-xs sm:text-sm"
                  >
                    <Link href={`/dashboard/resumes/${resume.id}`}>
                      <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Edit
                    </Link>
                  </Button>
                )}
                {allowExport && (
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
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={mode === 'fullpage' ? 'container mx-auto px-2 sm:px-4 py-4 sm:py-8' : ''}>
        {/* Zoom Controls */}
        {showControls && (
          <div className={`flex justify-center ${mode === 'fullpage' ? 'mb-4 sm:mb-6' : 'mb-3'}`}>
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
              {mode === 'inline' && (
                <>
                  <div className="w-px h-5 bg-border mx-1" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleFullscreen}
                    className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                    title="Open full preview"
                  >
                    <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </>
              )}
            </Card>
          </div>
        )}

        {/* Resume Preview Container */}
        <div 
          ref={containerRef}
          className={`flex justify-center overflow-x-auto ${mode === 'fullpage' ? 'pb-4' : ''}`}
        >
          <div
            className={`bg-white ${mode === 'fullpage' ? 'rounded-lg shadow-lg sm:shadow-2xl' : ''}`}
            style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: isMobile ? 'top left' : 'top center',
              transition: 'transform 0.2s ease-in-out',
              marginBottom: isMobile 
                ? `${(zoomLevel - 100) * 2}px` 
                : `${(zoomLevel - 100) * 5}px`,
              marginLeft: isMobile && zoomLevel < 100 ? '0' : 'auto',
              marginRight: isMobile && zoomLevel < 100 ? 'auto' : 'auto',
            }}
          >
            {/* A4 Page Container */}
            <div
              className="relative bg-white"
              style={{
                width: '210mm',
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

        {/* Page indicator - Only for fullpage mode */}
        {mode === 'fullpage' && (
          <div className={`text-center mt-4 sm:mt-6 text-xs sm:text-sm text-muted-foreground ${
            isMobile && zoomLevel < 60 ? 'hidden' : ''
          }`}>
            <p>A4 Page Format (210mm × 297mm)</p>
            {isMobile && (
              <p className="text-xs mt-1">Swipe to pan • Pinch to zoom</p>
            )}
          </div>
        )}
      </div>

      {/* Mobile Quick Actions - Only for fullpage mode */}
      {mode === 'fullpage' && isMobile && (
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
          {allowExport && (
            <Button
              variant="default"
              size="sm"
              onClick={() => handleExport('pdf')}
              disabled={isExporting}
              className="flex-1 h-9 text-xs bg-orange-600 hover:bg-orange-700"
            >
              {isExporting ? 'Exporting...' : 'Download'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}