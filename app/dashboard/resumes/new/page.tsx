// /app/dashboard/resumes/new/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ResumeBuilder from "@/components/ResumeBuilder";
import FeatureGate from "@/components/FeatureGate";
import { ResumeData } from "@/types/resume";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useSubscription } from "@/hooks/useSubscription";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// This helper function might be needed if you don't have one
const generateUUID = () => crypto.randomUUID();

export default function NewResumePage() {
    const { user, loading: authLoading } = useAuth();
    const { checkAndTrack, loading: subLoading } = useSubscription();
    const router = useRouter();

    // Check subscription limits when page loads
    useEffect(() => {
        const checkLimits = async () => {
            if (!authLoading && !subLoading && user) {
                // Check if user can create a new resume
                const { allowed, reason } = await checkAndTrack('resumes');
                
                if (!allowed) {
                    // If not allowed, we'll show the FeatureGate component
                    console.log('User cannot create more resumes:', reason);
                }
            }
        };

        checkLimits();
    }, [authLoading, subLoading, user, checkAndTrack]);

    // Show a loading spinner while checking for a logged-in user
    if (authLoading || subLoading) {
        return (
            <div className="flex justify-center items-center min-h-[80vh]">
                <LoadingSpinner />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container py-8">
                <Alert>
                    <AlertDescription>
                        You need to be logged in to create a resume.
                    </AlertDescription>
                </Alert>
                <div className="flex gap-3 mt-4">
                    <Button variant="outline" asChild>
                        <Link href="/dashboard/resumes">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Resumes
                        </Link>
                    </Button>
                    <Button asChild className="bg-orange-600 hover:bg-orange-700">
                        <Link href="/auth/login">
                            Log In
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    // Create a default empty structure for the new resume
    const newResumeData: ResumeData = {
        id: generateUUID(),
        userId: user?.id || '',
        title: 'Untitled Resume',
        templateId: '', // Will be set when user chooses a template
        isPublic: false,
        personalInfo: {
            firstName: '',
            lastName: '',
            title: '',
            summary: '',
            image: '',
            contact: {
                email: user?.email || '',
                phone: '',
                website: '',
                linkedIn: '',
                github: '',
            }
        },
        workExperience: [],
        education: [],
        skills: [],
        projects: [],
        languages: [],
        certifications: [],
        interests: [],
        internships: [],
        references: [],
        referenceText: "References available upon request",
        customSections: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_imported: false,
    };

    return (
        <div className="w-full">
            <FeatureGate
                feature="resumes"
                featureName="Resume Creation"
                featureDescription="You've reached your resume limit. Upgrade to create more resumes."
            >
                {/* Pass the default data to the builder */}
                <ResumeBuilder initialData={newResumeData} />
            </FeatureGate>
        </div>
    );
}