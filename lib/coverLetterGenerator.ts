import { Database } from '@/types/supabase';
import { LinkedInCoverLetterData } from '@/lib/linkedInCoverLetterTransformer';
import type { SenderInfo, RecipientInfo } from '@/types/cover-letter';

type DbResume = Database['public']['Tables']['resumes']['Row'];
type Json = Database['public']['Tables']['resumes']['Row']['personal_info'];
interface CvFile { id: string; name: string; content?: string; }

interface ExperienceObject {
  id?: string; title?: string; company?: string; startDate?: string | null;
  endDate?: string | null; isOngoing?: boolean; description?: string;
  location?: string; achievements?: string[];
}
interface EducationObject {
  id?: string; institution?: string; studyType?: string; degree?: string;
  startDate?: string | null; endDate?: string | null; isOngoing?: boolean;
  description?: string;
}
interface SkillObject {
  id?: string; name?: string | null; level?: string; category?: string;
}
interface ResumePersonalInfo {
  firstName?: string | null; lastName?: string | null; title?: string | null;
  summary?: string | null; contact?: { phone?: string | null; location?: string | null;
  linkedIn?: string | null; website?: string | null; email?: string | null; } | null;
}

export interface CoverLetterGenerationParams {
  jobDescription: string;
  jobTitle?: string;
  companyName?: string;
  tone?: string;
  sender?: SenderInfo;
  recipient?: RecipientInfo;
  resumeData: DbResume | CvFile | LinkedInCoverLetterData | null;
  dataSource: 'cv' | 'linkedin' | 'both' | 'none';
  regenerate?: boolean;
}

interface UserProfilePayload {
  name?: string; title?: string; summary?: string; currentRole?: string;
  currentCompany?: string; yearsOfExperience?: number; skills?: string[];
  experience?: { role?: string; company?: string; highlights?: string[] }[];
  education?: { degree?: string; school?: string; fieldOfStudy?: string }[];
  accomplishments?: string[]; cvFilename?: string; linkedInProfileUrl?: string | null;
  id?: string;
  linkedin?: LinkedInCoverLetterData | null;
  resume?: DbResume | CvFile | null;
  cv?: CvFile | null;
  keyAttributes?: any;
}

// --- Helper functions ---
function calculateYearsFromResume(experience: any[]): number {
  if (!Array.isArray(experience) || experience.length === 0) return 0;
  let totalMonths = 0;
  const currentDate = new Date();
  experience.forEach((job: ExperienceObject) => {
      try {
          const startDate = job.startDate ? new Date(job.startDate) : null;
          const endDate = job.isOngoing ? currentDate : (job.endDate ? new Date(job.endDate) : null);
          if (startDate instanceof Date && !isNaN(startDate.getTime()) && endDate instanceof Date && !isNaN(endDate.getTime())) {
              let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
              months -= startDate.getMonth(); months += endDate.getMonth();
              totalMonths += months >= 0 ? (months + 1) : 0;
          }
      } catch (error) { console.warn('Error calculating experience duration:', error); }
  });
  return totalMonths > 0 ? Math.round((totalMonths / 12) * 10) / 10 : 0;
}

function extractTopAccomplishmentsFromResume(experience: ExperienceObject[]): string[] {
  if (!Array.isArray(experience)) return [];
  const allAchievements: string[] = [];
  experience.forEach((job: ExperienceObject) => {
      if (Array.isArray(job.achievements)) {
          allAchievements.push(...job.achievements.filter((ach): ach is string => typeof ach === 'string'));
      } else if (typeof job.description === 'string') {
          const bullets = job.description.match(/^[*-•]\s*(.*)/gm);
          if (bullets) allAchievements.push(...bullets.map(b => b.replace(/^[*-•]\s*/, '').trim()).filter(b => b.length > 10));
      }
  });
  return allAchievements
     .filter(achievement => achievement.length > 10)
     .sort((a: string, b: string) => {
          const aHasMetrics = /\d+%|\d+\s*%|\$\d+|\d+\+|\d+K|\d+M/i.test(a);
          const bHasMetrics = /\d+%|\d+\s*%|\$\d+|\d+\+|\d+K|\d+M/i.test(b);
          if (aHasMetrics && !bHasMetrics) return -1;
          if (!aHasMetrics && bHasMetrics) return 1;
          return b.length - a.length;
      })
     .slice(0, 5);
}

export function prepareUserProfilePayload(
  sourceData: DbResume | CvFile | LinkedInCoverLetterData | null,
  dataSource: 'cv' | 'linkedin' | 'both' | 'none'
): UserProfilePayload {
    const payload: UserProfilePayload = {};
    if (!sourceData) return payload;

    if ((dataSource === 'cv' || dataSource === 'both') && 'personal_info' in sourceData) {
        const resume = sourceData as DbResume;
        const personalInfo = resume.personal_info as ResumePersonalInfo;
        
        if (personalInfo?.firstName || personalInfo?.lastName) {
            payload.name = `${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`.trim();
        }
        payload.title = personalInfo?.title || undefined;
        payload.summary = personalInfo?.summary || undefined;
        
        // Fix: Use 'work_experience' instead of 'experience'
        const experience = resume.work_experience as ExperienceObject[];
        if (Array.isArray(experience) && experience.length > 0) {
            const currentJob = experience.find(job => job.isOngoing) || experience[0];
            if (currentJob) {
                payload.currentRole = currentJob.title;
                payload.currentCompany = currentJob.company;
            }
            
            payload.yearsOfExperience = calculateYearsFromResume(experience);
            payload.accomplishments = extractTopAccomplishmentsFromResume(experience);
            
            payload.experience = experience.slice(0, 3).map(job => ({
                role: job.title || '',
                company: job.company || '',
                highlights: Array.isArray(job.achievements) ? job.achievements.slice(0, 3) : []
            }));
        }
        
        const skills = resume.skills as SkillObject[];
        if (Array.isArray(skills)) {
            payload.skills = skills
                .filter(skill => skill.name && skill.name.trim() !== '')
                .map(skill => skill.name as string)
                .slice(0, 10);
        }
        
        const education = resume.education as EducationObject[];
        if (Array.isArray(education)) {
            payload.education = education.slice(0, 2).map(edu => ({
                degree: edu.degree || edu.studyType || '',
                school: edu.institution || '',
                fieldOfStudy: edu.degree || ''
            }));
        }
        
        payload.id = resume.id;
        payload.resume = resume;
    } else if ((dataSource === 'cv' || dataSource === 'both') && 'name' in sourceData && 'size' in sourceData) {
        const cvFile = sourceData as CvFile;
        payload.cvFilename = cvFile.name;
        payload.cv = cvFile;
    } else if ((dataSource === 'linkedin' || dataSource === 'both') && 'profileUrl' in sourceData) {
        const linkedInData = sourceData as any; // Use 'any' for LinkedIn data since the structure varies
        
        // Handle various LinkedIn data structures
        payload.name = linkedInData.name || linkedInData.fullName || 
                      (linkedInData.firstName && linkedInData.lastName ? 
                       `${linkedInData.firstName} ${linkedInData.lastName}`.trim() : undefined);
        payload.title = linkedInData.title || linkedInData.headline || undefined;
        payload.summary = linkedInData.summary || undefined;
        payload.linkedInProfileUrl = linkedInData.profileUrl;
        
        // Check various possible property names for experience
        const experiences = linkedInData.experiences || linkedInData.experience || 
                          linkedInData.workExperience || linkedInData.positions || [];
        
        if (Array.isArray(experiences) && experiences.length > 0) {
            const currentJob = experiences[0];
            payload.currentRole = currentJob.title;
            payload.currentCompany = currentJob.company || currentJob.companyName;
            payload.yearsOfExperience = linkedInData.yearsOfExperience;
        }
        
        // Check various possible property names for skills
        payload.skills = (linkedInData.skills || linkedInData.extractedSkills || [])
                        ?.slice(0, 10)
                        ?.map((skill: any) => typeof skill === 'string' ? skill : skill.name)
                        ?.filter(Boolean) || [];
        
        payload.accomplishments = linkedInData.accomplishments?.slice(0, 5) || [];
        
        payload.experience = experiences?.slice(0, 3).map((exp: any) => ({
            role: exp.title,
            company: exp.company || exp.companyName,
            highlights: exp.description ? [exp.description] : []
        })) || [];
        
        // Check various possible property names for education
        const educations = linkedInData.educations || linkedInData.education || [];
        payload.education = educations?.slice(0, 2).map((edu: any) => ({
            degree: edu.degree || '',
            school: edu.school || edu.schoolName || edu.institution || '',
            fieldOfStudy: edu.fieldOfStudy || edu.field || ''
        })) || [];
        
        payload.linkedin = linkedInData as LinkedInCoverLetterData;
    }

    console.log("Prepared user profile payload:", payload);
    return payload;
}

// Define the shape of the expected response object
export interface GenerationResult {
  coverLetter: string;
  jobTitle: string;
  companyName: string;
}

/**
 * Generate a cover letter by calling the backend API.
 * Now returns an object with extracted data.
 */
export async function generateCoverLetter(
  params: CoverLetterGenerationParams
): Promise<GenerationResult> {
  console.log("generateCoverLetter: Preparing payload...");
  const userProfilePayload = prepareUserProfilePayload(
    params.resumeData,
    params.dataSource
  );

  console.log(
    `generateCoverLetter: Calling /api/generate with dataSource: ${params.dataSource}`
  );
  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobDescription: params.jobDescription,
        tone: params.tone,
        userProfile: userProfilePayload,
        dataSource: params.dataSource,
        regenerate: params.regenerate,
      }),
    });

    console.log("coverLetter generated response", response);
    const data = await response.json();
    console.log("coverLetter generated data", data);

    if (!response.ok) {
      throw new Error(data.error || `Generation API failed (Status: ${response.status})`);
    }
    
    // Fix: Check for 'content' instead of 'coverLetter' in the API response
    if (!data.data || !data.data.content || !data.data.jobTitle || !data.data.companyName) {
      throw new Error("Generation API returned incomplete data. It must include content, jobTitle, and companyName.");
    }

    console.log("generateCoverLetter: Success.");
    
    // Fix: Map 'content' to 'coverLetter' in the return object
    return {
      coverLetter: data.data.content,
      jobTitle: data.data.jobTitle,
      companyName: data.data.companyName
    };
  } catch (error) {
    console.error("Error calling /api/generate:", error);
    throw error;
  }
}

/**
 * Save a generated cover letter VIA THE BACKEND API.
 * This function remains unchanged.
 */
export async function saveCoverLetter(params: {
  jobDescription?: string;
  jobTitle?: string | null;
  companyName?: string | null;
  tone?: string | "professional";
  content?: string;
  sender?: SenderInfo;
  recipient?: RecipientInfo;
  resumeData?: { id?: string | null } | DbResume | CvFile | LinkedInCoverLetterData | null;
  dataSource: string;
  template_id?: string;
  id?: string;
}): Promise<string> {
  console.log("Calling API to save cover letter...", params);

  try {
    const endpoint = "/api/cover-letters/save";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    const result = await response.json();
    console.log("the save result", result);

    if (!response.ok) {
      throw new Error(
        result.error || `Failed to save cover letter (Status: ${response.status})`
      );
    }
    if (!result.id) {
      throw new Error(`Failed to save cover letter (API did not return ID).`);
    }
    console.log(`Cover letter ${result.updated ? "updated" : "created"} via API, received ID:`, result.id);
    return result.id;
  } catch (error) {
    console.error(`Error calling save API:`, error);
    throw error;
  }
}