// Seed data for the /ats-guide/[slug] programmatic SEO surface.
// One indexable page per major ATS — Workday, Greenhouse, Lever, Taleo, iCIMS,
// BambooHR, Ashby. These are high-intent searches ("how does Workday work,"
// "Greenhouse ATS tips"). Jobscan owns this cluster today; this surface goes
// directly after it.

export type AtsGuideFaq = { question: string; answer: string };

export type AtsGuide = {
  slug: string;
  systemName: string;
  shortDescription: string;
  meta: { title: string; description: string };
  vendor: string;
  marketShare: string;
  whoUsesIt: string[];
  intro: string;
  howItWorks: string[];
  formattingRules: string[];
  keywordStrategy: string;
  pitfalls: string[];
  faq: AtsGuideFaq[];
  relatedSlugs: string[];
};

export const ATS_GUIDES: AtsGuide[] = [
  {
    slug: 'workday',
    systemName: 'Workday',
    shortDescription:
      'How Workday parses resumes, what its rankings actually weight, and the formatting rules that matter at large enterprises using Workday Recruiting.',
    meta: {
      title: 'Workday ATS Guide — How to Beat It in 2026',
      description:
        'Practical guide to applying through Workday: how the ATS parses resumes, formatting rules that matter, keyword strategy, and the most common application pitfalls.',
    },
    vendor: 'Workday Inc.',
    marketShare: 'One of the dominant enterprise ATS systems globally — used by ~50%+ of Fortune 500 companies for HCM and recruiting.',
    whoUsesIt: [
      'Salesforce, Netflix, Visa, Bank of America, Target',
      'Most Fortune 500 enterprises with global HR operations',
      'Many large healthcare systems, universities, and government agencies',
    ],
    intro:
      'Workday is the dominant enterprise ATS — and one of the most opaque from the candidate side. Application flows are long, parsing can be aggressive, and the system favors structured data extraction over free-form resume text. This guide covers what actually matters when applying through Workday, and the mistakes that get candidates filtered.',
    howItWorks: [
      'Workday parses your uploaded resume into structured fields (work history, education, skills) and asks you to validate or correct each parsed entry. The cleaner the parse, the less manual entry you do.',
      'After resume parsing, Workday will often ask you to manually fill in additional fields — sometimes re-typing your entire work history. This is normal; it\'s not a parsing failure.',
      'Recruiters then search the candidate database using filters: skills, locations, years of experience, education. The match between your structured data and the JD\'s requirements drives surfacing.',
      'For most Workday-using companies, recruiters do not search by free-text keyword — they filter by the structured fields. So the structured fields matter more than keyword density in the prose.',
    ],
    formattingRules: [
      'Use a single-column layout. Multi-column resumes break Workday\'s parser more than any other ATS.',
      'Standard section headings: "Experience," "Education," "Skills." Don\'t use creative names.',
      'Reverse-chronological work history. Don\'t use functional or hybrid formats — they parse poorly.',
      'PDF or Word both work. PDF is usually cleaner. Avoid scanned PDFs (which are images).',
      'Avoid headers/footers for important info. Workday sometimes skips them.',
      'Don\'t use tables for layout. Workday\'s table parser is unreliable.',
      'Skill section should be a comma-separated or single-column list, not a graphic chart.',
    ],
    keywordStrategy:
      'Workday weights structured fields more than free-text. Make sure your Skills section explicitly lists the keywords from the JD — this is what Workday surfaces in recruiter filters. Don\'t just rely on burying keywords in bullet points.',
    pitfalls: [
      'Skipping the manual data entry — leaving parsed fields incomplete tanks your structured-search match.',
      'Using a multi-column resume — the most common single cause of Workday parsing failures.',
      'Dropping the resume into the Skills field as plain text — losing structured data.',
      'Inconsistent date formats across roles — Workday\'s date parser is strict.',
      'Submitting to too many roles at the same company — Workday flags this and recruiters notice.',
    ],
    faq: [
      {
        question: 'Does Workday auto-reject resumes?',
        answer: 'No, Workday itself doesn\'t auto-reject — recruiters do, after Workday surfaces candidates. But poor parsing can mean you never surface in the recruiter\'s search results, which is functionally the same.',
      },
      {
        question: 'Why does Workday make me re-enter my work history after uploading my resume?',
        answer: 'Workday wants validated structured data. Even when parsing succeeds, the system asks you to confirm and complete fields manually so recruiter filters work reliably. It\'s tedious but skipping it hurts your visibility.',
      },
      {
        question: 'Should I customize my resume for each Workday application?',
        answer: 'Yes. Update your Skills section to mirror the JD\'s exact keywords. The Skills section is the highest-leverage field in Workday\'s structured search.',
      },
    ],
    relatedSlugs: ['greenhouse', 'taleo', 'icims'],
  },
  {
    slug: 'greenhouse',
    systemName: 'Greenhouse',
    shortDescription:
      'How Greenhouse organizes applications, what hiring teams actually see, and the application strategies that work for the tech companies most likely to use it.',
    meta: {
      title: 'Greenhouse ATS Guide — How to Beat It in 2026',
      description:
        'Practical guide to applying through Greenhouse: how it organizes applications, what hiring panels see, formatting rules, keyword strategy, and pitfalls.',
    },
    vendor: 'Greenhouse Software',
    marketShare: 'Dominant ATS for venture-backed tech companies and high-growth startups; widely adopted in B2B SaaS.',
    whoUsesIt: [
      'Stripe, Airbnb, Pinterest, Lyft, Asana',
      'Most Series B-and-later venture-backed tech companies',
      'Companies that prioritize structured hiring (scorecards, panel interviews)',
    ],
    intro:
      'Greenhouse is the ATS most candidates encounter at modern tech companies. It\'s lighter on parsing than Workday and heavier on the application form itself — short-answer questions, demographic surveys, and panel-driven scorecards. Optimizing for Greenhouse is mostly about a clean resume + thoughtful answers to short-answer questions.',
    howItWorks: [
      'Greenhouse parses your resume into a candidate profile but doesn\'t require manual re-entry like Workday.',
      'After parsing, you typically face 3-8 short-answer questions: "Why this role?" "Why this company?" "Tell us about a relevant project."',
      'Hiring managers and panelists see your resume, your short-answer responses, and a scorecard structure for each interview round.',
      'Greenhouse weights interview scorecards heavily — the resume gets you to the phone screen, but the structured interview is where decisions are made.',
    ],
    formattingRules: [
      'Single-column, standard headings — same as any modern ATS.',
      'Greenhouse\'s parser is generally good. Most reasonable PDF resumes parse cleanly.',
      'Make sure your contact info (email, phone) is in plain text, not in an image.',
      'Standard date formats. "MMM YYYY" (e.g., "Jul 2022") is safest.',
      'PDF is the standard format for Greenhouse uploads.',
    ],
    keywordStrategy:
      'Greenhouse parsing is strong, so keywords in resume bullets are surfaced cleanly. Mirror 5-8 verbatim from the JD across your Summary, Skills, and Experience sections. Greenhouse also makes your short-answer responses fully visible to interviewers — those are a second keyword surface; mirror the JD language there too.',
    pitfalls: [
      'Skipping or rushing the short-answer questions. They\'re scored as part of the application; phoned-in answers signal low investment.',
      'Mismatching the JD\'s language. Greenhouse hiring panels are typically calibrated against specific keywords.',
      'Ignoring the demographic survey. It\'s anonymous and optional; skipping doesn\'t hurt you, but answering helps the company\'s DEI reporting and is generally good practice.',
      'Applying to multiple roles simultaneously. Greenhouse flags this prominently to recruiters, and the spam-applicant signal hurts.',
    ],
    faq: [
      {
        question: 'Does Greenhouse use AI to score resumes?',
        answer: 'Some Greenhouse customers use the optional Greenhouse AI Sourcing or third-party integrations that do AI scoring — but core Greenhouse does not auto-score or auto-reject. The hiring manager and recruiter make the call.',
      },
      {
        question: 'Are Greenhouse short-answer questions important?',
        answer: 'Yes. Hiring managers see them in the same view as your resume. Short, specific, JD-aligned answers signal investment. Generic copy-paste signals the opposite.',
      },
      {
        question: 'Should I apply to multiple roles at the same company on Greenhouse?',
        answer: 'No. Pick the most relevant role and apply once. Recruiters see the multi-application flag and it reads as scattershot.',
      },
    ],
    relatedSlugs: ['lever', 'ashby', 'workday'],
  },
  {
    slug: 'lever',
    systemName: 'Lever',
    shortDescription:
      'How Lever\'s candidate-relationship-first ATS works, what hiring teams see, and how to optimize for the high-touch tech companies that use it.',
    meta: {
      title: 'Lever ATS Guide — How to Beat It in 2026',
      description:
        'Practical guide to applying through Lever: how it organizes applications, hiring-team workflow, formatting rules, keyword strategy, and pitfalls.',
    },
    vendor: 'Employ Inc. (Lever was acquired in 2022)',
    marketShare: 'Common at mid-market and growth-stage tech companies; positioned as a CRM + ATS hybrid.',
    whoUsesIt: [
      'Netflix (in some divisions), Eventbrite, KPMG (US recruiting)',
      'Mid-market tech companies that prioritize candidate experience',
      'Companies that source heavily and want CRM-style nurturing alongside ATS',
    ],
    intro:
      'Lever positions itself as a CRM + ATS — meaning recruiters often source candidates directly, then move them through the pipeline. The implication for applicants: a clean resume matters, but so does being findable in Lever\'s candidate database for inbound recruiter searches.',
    howItWorks: [
      'Lever parses your resume into a profile and adds you to the candidate database.',
      'Hiring teams move candidates through customizable pipeline stages (typically: New → Phone Screen → Onsite → Offer → Hired).',
      'Recruiters often source proactively from Lever\'s candidate database for similar future roles, which means a polished profile pays off across multiple openings.',
      'Interview feedback is captured in structured forms tied to the candidate profile.',
    ],
    formattingRules: [
      'Single-column, standard headings.',
      'Lever\'s parser is reasonably forgiving. Most clean PDF resumes parse fine.',
      'Make sure LinkedIn URL is plain text — Lever tries to enrich profiles by linking to LinkedIn.',
      'Standard date formats.',
    ],
    keywordStrategy:
      'Mirror keywords from the JD across Summary, Skills, and Experience. Lever\'s candidate-search feature is keyword-based, so a resume with keywords spread naturally across sections will surface in more recruiter searches.',
    pitfalls: [
      'Submitting a generic resume — Lever recruiters search for very specific terms, and a generic resume rarely surfaces.',
      'Missing LinkedIn URL — Lever auto-enriches profiles when LinkedIn is linked. Without it, your profile is thinner.',
      'Ignoring the cover letter field when one is offered. In Lever, cover letters are visible to the hiring team alongside the resume.',
    ],
    faq: [
      {
        question: 'Will Lever recruiters find me for other roles after I apply?',
        answer: 'Often yes. Lever\'s database persists across roles, and recruiters frequently search it for new openings. A well-written profile is a multi-role investment.',
      },
      {
        question: 'Is Lever stricter than Greenhouse on resume parsing?',
        answer: 'Roughly equivalent. Both are forgiving on standard resume formats and unforgiving on multi-column or graphic-heavy designs.',
      },
    ],
    relatedSlugs: ['greenhouse', 'ashby', 'workday'],
  },
  {
    slug: 'taleo',
    systemName: 'Taleo',
    shortDescription:
      'How Oracle Taleo\'s legacy enterprise ATS works, the formatting rules that matter most, and why this is one of the strictest parsers candidates encounter.',
    meta: {
      title: 'Taleo ATS Guide — How to Beat It in 2026',
      description:
        'Practical guide to applying through Oracle Taleo: how the legacy parser works, strict formatting rules, keyword strategy, and the most common pitfalls.',
    },
    vendor: 'Oracle (Taleo Recruiting Cloud)',
    marketShare: 'Legacy enterprise ATS — still widely used at large multinationals, government agencies, and traditional industries.',
    whoUsesIt: [
      'Many Fortune 500 financial services and healthcare companies',
      'Most US federal government recruiting',
      'Large industrial and energy companies',
    ],
    intro:
      'Taleo is the strictest mainstream ATS parser candidates regularly encounter. Long application forms, aggressive resume parsing, and unforgiving formatting rules make it easy to get filtered for technical reasons before a human reads anything. This guide covers the rules that actually matter.',
    howItWorks: [
      'Taleo parses your resume into structured fields (work history, education, skills) and often asks you to manually validate every parsed line.',
      'Application forms are long — expect to spend 30-60 minutes per application, including re-typing work history.',
      'Recruiters search Taleo\'s candidate database with strict keyword filters. Exact-match terms are the dominant signal.',
      'Many Taleo customers also use third-party scoring tools layered on top of Taleo\'s base capabilities.',
    ],
    formattingRules: [
      'Single-column, single-page (when possible). Taleo\'s parser struggles with anything fancier.',
      'Reverse-chronological work history. No functional resumes.',
      'Plain text only — no graphics, icons, or images of text.',
      '.docx is generally safer than PDF for Taleo. Some Taleo configurations parse DOCX more reliably.',
      'Avoid headers/footers entirely. Put everything in the main body.',
      'No tables for layout. Taleo\'s table parser is the worst of any major ATS.',
      'Stick to standard fonts: Calibri, Arial, Times. Avoid creative fonts.',
    ],
    keywordStrategy:
      'Taleo does heavy exact-match keyword filtering. Mirror keywords from the JD verbatim — same case, same form. If the JD says "Project Management Professional (PMP)," put exactly that string in your Skills or Certifications section, not just "PMP."',
    pitfalls: [
      'Submitting a creative or designer resume — almost guaranteed parsing failure.',
      'Skipping any of the long manual data-entry steps — the structured fields are what recruiters search.',
      'Submitting in PDF when the system warns about DOCX preference — sometimes Taleo specifies a format.',
      'Applying to many roles in one session — some Taleo configurations rate-limit or flag bulk applications.',
    ],
    faq: [
      {
        question: 'Why is Taleo so much harder than other ATS?',
        answer: 'Taleo is older and more rigid by design. Many enterprise customers still rely on its strict rule-based filtering rather than newer ML-based approaches. The formatting requirements reflect that legacy.',
      },
      {
        question: 'Should I use a different resume version specifically for Taleo?',
        answer: 'For most candidates, yes — keep an "ultra-plain" version specifically for Taleo and other strict parsers. A separate version for Greenhouse-style modern ATS where some formatting variance is fine.',
      },
      {
        question: 'Will Taleo reject me for formatting alone?',
        answer: 'Not directly — but if parsing fails badly enough, your candidate profile is incomplete and you won\'t surface in recruiter searches. The functional outcome is the same as a rejection.',
      },
    ],
    relatedSlugs: ['workday', 'icims', 'greenhouse'],
  },
  {
    slug: 'icims',
    systemName: 'iCIMS',
    shortDescription:
      'How iCIMS Talent Cloud works for high-volume hiring, the formatting rules for its parser, and how to optimize for retail and frontline-employer applications.',
    meta: {
      title: 'iCIMS ATS Guide — How to Beat It in 2026',
      description:
        'Practical guide to applying through iCIMS: how the high-volume ATS works, formatting rules, keyword strategy, and the application pitfalls to avoid.',
    },
    vendor: 'iCIMS',
    marketShare: 'Major enterprise ATS, especially strong in retail, healthcare, hospitality, and high-volume frontline hiring.',
    whoUsesIt: [
      'Retail giants (Walmart historically, Target, Home Depot in some divisions)',
      'Major healthcare systems (HCA, Tenet)',
      'Hospitality (Marriott, Hilton properties)',
      'Logistics and warehousing employers',
    ],
    intro:
      'iCIMS is built for high-volume hiring — companies receiving thousands of applications per week. That shapes everything about the candidate experience: short application flows, mobile-first, and aggressive automation around screening. Optimizing for iCIMS means making your structured fields perfect and your prose tight.',
    howItWorks: [
      'iCIMS parses your resume into a profile but typically uses a shorter manual-entry flow than Taleo or Workday.',
      'Many iCIMS customers add knock-out questions: legal-eligibility-to-work, willingness-to-relocate, certification confirmations. Get these right or you\'re filtered immediately.',
      'iCIMS pipelines are often automated — candidates who pass knock-outs auto-advance to phone screens or assessments.',
      'For high-volume frontline roles, iCIMS may direct candidates to assessment platforms (Harver, HireVue, Pymetrics) before a human review.',
    ],
    formattingRules: [
      'Single-column, standard headings.',
      'Mobile-friendly upload: iCIMS is heavily used on mobile, so PDFs that render cleanly on phones do well.',
      'Standard date formats. iCIMS is stricter than Greenhouse on date parsing.',
      'Plain text contact info — no images or graphics for email/phone.',
    ],
    keywordStrategy:
      'iCIMS uses keyword matching but with relaxed exactness compared to Taleo. Mirror 5-8 keywords from the JD, distributed across Summary and Skills sections. For frontline roles, the certifications and skills section matters more than for desk-job ATS systems.',
    pitfalls: [
      'Failing knock-out questions due to misreading. Read each carefully — "Are you legally authorized to work in [country]?" is a yes-or-no with no second chances.',
      'Skipping certifications or licenses. For healthcare, manufacturing, and trade roles, these are heavily weighted.',
      'Submitting through a non-mobile-friendly resume PDF when applying from a phone. Some PDFs render badly on mobile, and iCIMS sees a high mobile share.',
    ],
    faq: [
      {
        question: 'What is a knock-out question in iCIMS?',
        answer: 'A pre-screen question with binary answers that automatically advances or rejects you. Examples: legal authorization to work, willingness to work specific shifts, possession of required certifications. Failing a knock-out is a hard reject — there\'s no human review.',
      },
      {
        question: 'Why do iCIMS applications sometimes ask me to take an assessment?',
        answer: 'High-volume employers using iCIMS often integrate with assessment platforms (Harver, HireVue, etc.) for early screening. Take these seriously — they\'re scored and weighted in the next decision step.',
      },
    ],
    relatedSlugs: ['taleo', 'workday', 'bamboohr'],
  },
  {
    slug: 'bamboohr',
    systemName: 'BambooHR',
    shortDescription:
      'How BambooHR works for SMB recruiting, the lighter formatting rules, and how to make a SMB-employer application stand out.',
    meta: {
      title: 'BambooHR ATS Guide — How to Beat It in 2026',
      description:
        'Practical guide to applying through BambooHR: how the SMB-focused ATS works, formatting rules, keyword strategy, and pitfalls.',
    },
    vendor: 'BambooHR',
    marketShare: 'Dominant ATS for small and mid-market employers (under ~1,000 employees); lighter-weight than enterprise systems.',
    whoUsesIt: [
      'Small businesses (under 100 employees)',
      'Mid-market companies (100-1,000 employees)',
      'Many local and regional companies, professional services firms, smaller agencies',
    ],
    intro:
      'BambooHR is the ATS small and mid-market employers most commonly use. It\'s lighter, less rigid, and more candidate-friendly than enterprise systems. The implication: applications get a more human review than at large companies, so the cover letter and other qualitative signals matter more than at Workday-driven enterprises.',
    howItWorks: [
      'BambooHR parses your resume into a basic profile.',
      'Application flows are short — typically a resume upload, basic contact info, and 1-3 short-answer questions.',
      'Hiring managers (often the actual person you\'d work for) review applications directly. There\'s less recruiter-as-gatekeeper layering than at large companies.',
      'Decision turnaround is often faster — small companies move quickly when they like a candidate.',
    ],
    formattingRules: [
      'Standard formatting works fine. BambooHR\'s parser is forgiving.',
      'Single-column is still recommended.',
      'PDF is standard.',
      'Some visual personality is fine — small employers often appreciate signs that a candidate took care with their materials.',
    ],
    keywordStrategy:
      'Less aggressive keyword optimization is needed than for enterprise ATS. Focus on a clean, well-written resume that an actual human will read. Cover letters carry more weight here than at large enterprises.',
    pitfalls: [
      'Treating a BambooHR application like an enterprise application. The hiring manager often reads the whole thing — generic copy-paste content is more visible.',
      'Skipping the cover letter when offered. Small employers heavily weight motivation and fit.',
      'Over-formatting for ATS. The system handles modern formats fine, and over-formatting can read as impersonal at smaller companies.',
    ],
    faq: [
      {
        question: 'Are SMB applications easier to win than enterprise?',
        answer: 'Different, not easier. Smaller companies have fewer applicants per role but also fewer roles. The bar for fit and motivation is often higher because the hiring manager is hiring directly into their team.',
      },
      {
        question: 'Should I write a longer cover letter for a BambooHR application?',
        answer: '300-450 words is the sweet spot for SMB applications — slightly longer than for enterprise, but still tight. Hiring managers read the whole thing.',
      },
    ],
    relatedSlugs: ['greenhouse', 'lever', 'ashby'],
  },
  {
    slug: 'ashby',
    systemName: 'Ashby',
    shortDescription:
      'How Ashby\'s modern, data-rich ATS works, what its analytical hiring teams screen for, and how to optimize for the AI-forward startups using it.',
    meta: {
      title: 'Ashby ATS Guide — How to Beat It in 2026',
      description:
        'Practical guide to applying through Ashby: how the modern ATS works, what analytical hiring teams screen for, formatting rules, and pitfalls.',
    },
    vendor: 'Ashby',
    marketShare: 'Fast-growing ATS used by AI-forward and analytical startups; positioned as the analytics-first alternative to Greenhouse.',
    whoUsesIt: [
      'Many AI/ML startups (Anthropic, Hugging Face have used Ashby)',
      'Newer Series B-C tech companies that prioritize hiring analytics',
      'Companies with a strong data culture',
    ],
    intro:
      'Ashby is the ATS that analytical hiring teams pick. It surfaces detailed metrics on every step of the funnel and pushes hiring teams toward calibrated, data-driven decisions. For candidates, the implication is that hiring panels often have rigorous scorecards and consistent feedback loops — a strong resume gets you in, but interview performance is heavily weighted.',
    howItWorks: [
      'Ashby parses your resume into a candidate profile efficiently.',
      'Application flows are typically short and well-designed — a sign of the company\'s investment in candidate experience.',
      'Hiring teams use Ashby\'s scorecard system to capture interview feedback in structured rubrics.',
      'Ashby provides hiring teams with analytics on funnel stages, time-to-hire, and source-of-hire — meaning teams calibrate aggressively.',
    ],
    formattingRules: [
      'Single-column, standard headings.',
      'Ashby\'s parser is among the best in market — most modern resume formats parse cleanly.',
      'PDF is standard.',
      'Make sure LinkedIn URL is plain text. Ashby integrates with LinkedIn for profile enrichment.',
    ],
    keywordStrategy:
      'Ashby parses resumes well and surfaces structured data cleanly to hiring teams. Mirror 5-8 keywords from the JD across Summary, Skills, and Experience. Companies using Ashby often have analytical hiring cultures, so quantified outcomes in your bullets matter more than generic claims.',
    pitfalls: [
      'Submitting a non-quantified resume to a company using Ashby. The analytical hiring culture screens hard for measurable outcomes.',
      'Skipping short-answer questions. They\'re visible to the panel and signal investment.',
      'Submitting through a non-current LinkedIn. Ashby enriches profiles from LinkedIn — a mismatch hurts.',
    ],
    faq: [
      {
        question: 'Are companies on Ashby harder to interview at?',
        answer: 'Often yes — not because the ATS is harder, but because companies that invest in Ashby tend to have rigorous, calibrated interview processes. The bar is high but consistent.',
      },
      {
        question: 'How is Ashby different from Greenhouse for candidates?',
        answer: 'Ashby has slightly cleaner UX, better analytics on the recruiter side, and tends to be used by more analytically-inclined hiring teams. From a pure-applicant standpoint they\'re very similar to optimize for.',
      },
    ],
    relatedSlugs: ['greenhouse', 'lever', 'workday'],
  },
];

export function getAtsGuideBySlug(slug: string): AtsGuide | undefined {
  return ATS_GUIDES.find((g) => g.slug === slug);
}

export function getAtsGuideSlugs(): string[] {
  return ATS_GUIDES.map((g) => g.slug);
}

export function getRelatedAtsGuides(slug: string): AtsGuide[] {
  const current = getAtsGuideBySlug(slug);
  if (!current) return [];
  return current.relatedSlugs
    .map((s) => getAtsGuideBySlug(s))
    .filter((g): g is AtsGuide => Boolean(g));
}
