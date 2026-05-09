// Seniority modifier system for the cover-letter-examples programmatic SEO matrix.
// Lets us 3-5x the number of indexable URLs (e.g. /cover-letter-examples/senior-software-engineer)
// from the same data, without writing 100+ duplicate entries by hand.
//
// To add seniority variants for a job: add the slug to MODIFIERS_BY_JOB below.
// To add a new modifier: add it to SENIORITY_MODIFIERS, plus an entry in
// MODIFIER_INTRO_OVERRIDES and MODIFIER_TIP_OVERRIDES.

import type { CoverLetterExample } from './cover-letter-examples-data';

export const SENIORITY_MODIFIERS = [
  'entry-level',
  'junior',
  'senior',
  'lead',
  'manager',
] as const;

export type SeniorityModifier = (typeof SENIORITY_MODIFIERS)[number];

const MODIFIER_LABELS: Record<SeniorityModifier, string> = {
  'entry-level': 'Entry-Level',
  junior: 'Junior',
  senior: 'Senior',
  lead: 'Lead',
  manager: 'Manager',
};

export const MODIFIERS_BY_JOB: Record<string, SeniorityModifier[]> = {
  'software-engineer': ['entry-level', 'junior', 'senior', 'lead', 'manager'],
  'product-manager': ['junior', 'senior', 'lead', 'manager'],
  'marketing-manager': ['junior', 'senior', 'lead'],
  'data-analyst': ['entry-level', 'junior', 'senior', 'lead'],
  'project-manager': ['junior', 'senior', 'lead'],
  'ux-designer': ['entry-level', 'junior', 'senior', 'lead'],
  'graphic-designer': ['entry-level', 'junior', 'senior'],
  'business-analyst': ['entry-level', 'junior', 'senior'],
  'sales-representative': ['entry-level', 'junior', 'senior', 'manager'],
  'accountant': ['entry-level', 'junior', 'senior'],
  'financial-analyst': ['entry-level', 'junior', 'senior'],
  'web-developer': ['entry-level', 'junior', 'senior', 'lead'],
  'devops-engineer': ['junior', 'senior', 'lead'],
  'hr-manager': ['senior', 'lead'],
  'recruiter': ['entry-level', 'junior', 'senior'],
  'content-writer': ['entry-level', 'junior', 'senior'],
  'customer-service-representative': ['entry-level', 'senior', 'manager'],
  'registered-nurse': ['entry-level', 'senior', 'manager'],
  'teacher': ['entry-level', 'senior', 'lead'],
  'executive-assistant': ['junior', 'senior'],
  'electrician': ['junior', 'senior', 'lead'],
  'plumber': ['junior', 'senior', 'lead'],
  'mechanical-engineer': ['entry-level', 'junior', 'senior', 'lead'],
  'electrical-engineer': ['entry-level', 'junior', 'senior', 'lead'],
  'operations-manager': ['senior', 'lead'],
  'copywriter': ['junior', 'senior'],
  'paralegal': ['junior', 'senior'],
  'pharmacist': ['senior'],
  'social-worker': ['senior', 'lead'],
  'physical-therapist': ['senior'],
  'real-estate-agent': ['senior'],
  'dental-hygienist': ['senior'],
};

const MODIFIER_INTRO_OVERRIDES: Record<SeniorityModifier, (jobTitle: string) => string> = {
  'entry-level': (job) =>
    `If you're applying to your first ${job.toLowerCase()} role, the cover letter is doing more work than for experienced candidates — it's making the case that you can do the job before you've done it. Lead with internships, projects, coursework, or open-source contributions. Show you've researched the company. Quantify what you can. The example below uses that exact playbook.`,
  junior: (job) =>
    `Junior ${job.toLowerCase()} roles sit in a tricky spot: you have one or two years of experience, but the JD often reads like it wants three. The strongest cover letters at this level lead with the most senior-feeling project you've shipped, then quantify the outcome. Don't apologize for the experience gap — translate every assignment into a result.`,
  senior: (job) =>
    `Senior ${job.toLowerCase()} hiring managers are screening for two things: depth in the role's core competencies, and the ability to operate without much oversight. The cover letter has to demonstrate both — and prove you'll raise the bar of the team you're joining. Lead with one specific win, then connect it to the company's stated priorities.`,
  lead: (job) =>
    `Lead ${job.toLowerCase()} roles are technical-leadership tracks: you're expected to set direction, mentor others, and own the hardest problems without becoming a people manager. The cover letter should demonstrate scope of influence, technical judgment, and the ability to get other senior folks to follow you. Specifics about who you've mentored and what you've architected matter.`,
  manager: (job) =>
    `${MODIFIER_LABELS.manager} ${job.toLowerCase()} cover letters need to show people leadership clearly: how big a team, what outcomes you've owned, how you develop the people who report to you. Lead with team size, business impact, and one specific story about a person you helped grow.`,
};

const MODIFIER_TIP_PREPENDS: Record<SeniorityModifier, string[]> = {
  'entry-level': [
    'Translate coursework, internships, and side projects into resume-style outcomes. "Built a real-time dashboard for 40 classmates" beats "Studied React in CS 320."',
    'Reference the company\'s mission or product specifically. Generic cover letters at the entry level get filtered first.',
  ],
  junior: [
    'Lead with the most ambitious project you\'ve shipped, even if it was scoped down. Show the upper bound of your capability.',
    'Don\'t apologize for years-of-experience gaps. Translate every assignment into a measurable outcome.',
  ],
  senior: [
    'Demonstrate scope: cross-team work, ambiguous problems, owning the hardest part of a launch.',
    'Skip the basics — at senior level the JD assumes them. Lean on judgment calls and trade-offs.',
  ],
  lead: [
    'Reference who you\'ve mentored and how. Lead roles screen heavily on developing the people around you.',
    'Show one architectural or strategic decision you made that shaped the team\'s direction.',
  ],
  manager: [
    'State team size and reporting structure clearly. "I manage a team of 7 engineers across 2 squads" is the right shape.',
    'Show one growth story: someone you promoted, hired, or helped through a hard performance conversation.',
  ],
};

export function parseSlug(rawSlug: string): {
  modifier: SeniorityModifier | null;
  baseSlug: string;
} {
  for (const mod of SENIORITY_MODIFIERS) {
    const prefix = `${mod}-`;
    if (rawSlug.startsWith(prefix)) {
      return { modifier: mod, baseSlug: rawSlug.slice(prefix.length) };
    }
  }
  return { modifier: null, baseSlug: rawSlug };
}

export function applyModifier(
  example: CoverLetterExample,
  modifier: SeniorityModifier,
): CoverLetterExample {
  const label = MODIFIER_LABELS[modifier];
  const labeledTitle = `${label} ${example.jobTitle}`;
  const prependTips = MODIFIER_TIP_PREPENDS[modifier];

  return {
    ...example,
    slug: `${modifier}-${example.slug}`,
    jobTitle: labeledTitle,
    meta: {
      title: `${labeledTitle} Cover Letter Example & Writing Guide`,
      description: `A ${label.toLowerCase()} ${example.jobTitle.toLowerCase()} cover letter example, with section-by-section writing guide, ATS keywords, and FAQ. Tailor it to your specific role in minutes with CareerThings AI.`,
    },
    shortDescription: `A ${label.toLowerCase()} ${example.jobTitle.toLowerCase()} cover letter example with seniority-specific tips, keywords, and a tailored sample letter.`,
    intro: MODIFIER_INTRO_OVERRIDES[modifier](example.jobTitle),
    proTips: [...prependTips, ...example.proTips],
  };
}

export function getAllSlugsForSitemap<T extends { slug: string }>(
  examples: T[],
): string[] {
  const slugs: string[] = [];
  for (const example of examples) {
    slugs.push(example.slug);
    const mods = MODIFIERS_BY_JOB[example.slug] || [];
    for (const mod of mods) {
      slugs.push(`${mod}-${example.slug}`);
    }
  }
  return slugs;
}

export function isValidModifierSlug(rawSlug: string): boolean {
  const { modifier, baseSlug } = parseSlug(rawSlug);
  if (!modifier) return false;
  const allowed = MODIFIERS_BY_JOB[baseSlug];
  return Boolean(allowed && allowed.includes(modifier));
}
