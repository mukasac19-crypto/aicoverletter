// Pillar content guides — long-form, high-search-volume, evergreen.
// Renders to /guides/[slug]. Each guide is structured for SEO: clear H2
// hierarchy (Google reads it for outline), short paragraphs, examples,
// pull quotes, FAQ, internal links.

export type GuideSection = {
  id: string; // anchor slug
  heading: string;
  paragraphs: string[];
  bullets?: { title?: string; items: string[] };
  callout?: { kind: 'tip' | 'warning' | 'example'; title: string; body: string };
};

export type GuideFaq = { question: string; answer: string };

export type Guide = {
  slug: string;
  title: string;
  category: string;
  meta: { title: string; description: string };
  intro: string;
  estimatedReadTime: string;
  sections: GuideSection[];
  faq: GuideFaq[];
  relatedSlugs: string[];
};

export const GUIDES: Guide[] = [
  {
    slug: 'how-to-write-a-cover-letter',
    title: 'How to Write a Cover Letter (That Actually Gets You an Interview)',
    category: 'Cover Letters',
    meta: {
      title: 'How to Write a Cover Letter in 2026 — A Step-by-Step Guide',
      description:
        'A complete guide to writing a cover letter that gets interviews in 2026: structure, opening lines, examples by experience level, common mistakes, and FAQ. Use the included template.',
    },
    intro:
      'Most cover letter advice on the internet is identical, vague, and 10 years old. This one is different. Below is the exact framework professional recruiters use to screen cover letters at scale, the structure that consistently moves candidates forward, and concrete examples for entry-level, mid-career, and senior roles. Read it once, write yours in 30 minutes, and never write a generic cover letter again.',
    estimatedReadTime: '12 min read',
    sections: [
      {
        id: 'do-i-need-one',
        heading: 'Do I actually need a cover letter in 2026?',
        paragraphs: [
          'Short answer: yes, when you can. Recent studies of recruiting practices show that ~70% of hiring managers still read cover letters, and ~45% say a strong cover letter can move a candidate from "maybe" to "yes." For competitive roles, especially at companies that get 200+ applications per opening, the cover letter is often the deciding factor between similar resumes.',
          'The exceptions: high-volume new-grad roles where the application is purely an ATS screen, and explicitly "no cover letter required" postings (write one anyway — it almost never hurts). For everything else, write one.',
        ],
      },
      {
        id: 'structure',
        heading: 'The structure that works (and why)',
        paragraphs: [
          'Every cover letter that interviews well shares the same skeleton:',
        ],
        bullets: {
          items: [
            'Opening hook (1-2 sentences) — a specific reason you\'re writing, not "I\'m applying to the [Job Title] role."',
            'Qualifications paragraph (3-5 sentences) — your strongest specific achievement, with a number.',
            'Fit paragraph (2-4 sentences) — why this company, why this role, what you\'d bring.',
            'Close (1-2 sentences) — confident, no apologizing, no "I look forward to hearing from you."',
          ],
        },
        callout: {
          kind: 'tip',
          title: 'Word count target: 250-400 words',
          body: 'Recruiters spend an average of 11-15 seconds on a cover letter. Density wins; comprehensiveness loses. If you can\'t cut a sentence without losing meaning, leave it. If you can — cut it.',
        },
      },
      {
        id: 'opening-line',
        heading: 'The opening line: where most cover letters die',
        paragraphs: [
          'The opening sentence is doing more work than any other line in the letter. Recruiters decide whether to keep reading based on it. Generic openers ("I am writing to apply to the [Role] position at [Company]") are the single most common reason cover letters get filtered.',
          'Strong openers do three things: anchor on something specific (a recent product launch, a published post, a piece of company news), connect it to your background, and avoid filler phrases.',
        ],
        callout: {
          kind: 'example',
          title: 'Weak vs. strong opener',
          body: 'Weak: "I am writing to express my interest in the Senior Software Engineer role at Stripe."\n\nStrong: "When Stripe published the post on durable execution patterns last quarter, it landed exactly where I\'ve spent the last three years of my career — building distributed systems for payment platforms."',
        },
      },
      {
        id: 'qualifications',
        heading: 'The qualifications paragraph: lead with the number',
        paragraphs: [
          'This paragraph is your single biggest opportunity to differentiate yourself. The mistake most candidates make is hedging: listing three things they\'re "good at" instead of one specific thing they\'ve done. Specific beats general every time.',
          'The formula: pick the achievement that most resembles the work in the JD. Open with a measurable outcome. Connect it to a story (one or two sentences) that demonstrates how you got there. End with a related responsibility or scope.',
        ],
        callout: {
          kind: 'example',
          title: 'Strong qualifications paragraph',
          body: '"At my current company I led the redesign of our checkout API, cutting p95 latency by 38% and reducing peak-hour error rates from 1.2% to under 0.1%. I partnered closely with product, design, and SRE to make the rollout zero-downtime, and I authored the runbook the on-call team still uses today. Beyond performance work, I\'ve mentored three junior engineers — all three were promoted within 18 months."',
        },
      },
      {
        id: 'fit-paragraph',
        heading: 'The "why this company" paragraph: be specific or skip it',
        paragraphs: [
          'This paragraph is where the most performative writing shows up — and where recruiters are most likely to filter. Generic enthusiasm ("I\'ve always loved [Company]") reads as filler. Specific knowledge of the company\'s product, recent moves, or published work reads as genuine interest.',
          'Reference one concrete thing: a feature, a blog post, a press release, a team member\'s public work. Then connect it to what you\'d bring. If you don\'t have a specific reason, skip this paragraph entirely — a generic version is worse than nothing.',
        ],
      },
      {
        id: 'close',
        heading: 'The close: confidence without arrogance',
        paragraphs: [
          'The closing paragraph should be one or two sentences. State that you\'d welcome a conversation, thank them for their time, and stop.',
          'Avoid: "I look forward to hearing from you" (passive, expected, fine but boring), "I am confident I would be a great fit" (you don\'t know that), and any version of "Thank you for your consideration of my candidacy" (stiff, dated).',
        ],
      },
      {
        id: 'common-mistakes',
        heading: 'The 8 most common mistakes (and how to avoid them)',
        paragraphs: [
          'In order of frequency:',
        ],
        bullets: {
          items: [
            'Generic opener — "I am writing to apply" gets you filtered immediately.',
            'No company-specific reference — reads as a copy-paste letter.',
            'Restating the resume — the cover letter is for what the resume can\'t show.',
            'Too long — over 400 words signals candidate doesn\'t respect reader\'s time.',
            'No measurable outcomes — claims without numbers are weak.',
            'Typos and grammar issues — instant filter.',
            'Wrong company name — happens more than you\'d think; always check twice.',
            'Self-deprecation — "I know I don\'t have all the qualifications, but..." weakens you.',
          ],
        },
      },
      {
        id: 'tailoring',
        heading: 'How to tailor for each application',
        paragraphs: [
          'A great cover letter is fully tailored. That doesn\'t mean writing from scratch every time — it means having a strong base draft and then customizing three things per application:',
        ],
        bullets: {
          items: [
            'The opener — anchor on something specific to this company.',
            'The qualifications paragraph — pick the achievement most relevant to this role.',
            'Keywords — mirror 5-8 from the JD verbatim (ATS does exact matching).',
          ],
        },
        callout: {
          kind: 'tip',
          title: 'AI-assisted tailoring',
          body: 'CareerThings AI does this automatically — paste the job description, upload your resume, and the cover letter is tailored to the specific role with the right keywords and tone. It\'s the fastest way to apply at scale without sacrificing quality.',
        },
      },
      {
        id: 'final-checklist',
        heading: 'The final checklist before you send',
        paragraphs: [
          'Before hitting submit, run through this list:',
        ],
        bullets: {
          items: [
            'Word count: 250-400.',
            'Opener references something specific.',
            'Qualifications paragraph has at least one measurable outcome.',
            'Fit paragraph mentions the company by name and references something concrete.',
            'No typos. Read it out loud once.',
            'Right company name in every reference.',
            'Saved as PDF (preserves formatting across email clients and ATS).',
            'File named clearly: "FirstName-LastName-Cover-Letter.pdf" — not "cover-letter-final-v2.pdf".',
          ],
        },
      },
    ],
    faq: [
      {
        question: 'How long should a cover letter be?',
        answer: '250-400 words on a single page. Recruiters spend 11-15 seconds on average — density wins, length loses.',
      },
      {
        question: 'Should I use the same cover letter for every application?',
        answer: 'No. At minimum, customize the opener, the company-specific paragraph, and 5-8 keywords. A fully generic letter is worse than no letter.',
      },
      {
        question: 'Should I address the cover letter to a specific person?',
        answer: 'If you can find a name (LinkedIn search for the recruiter or hiring manager), yes. If not, "Dear Hiring Team" is fine. Avoid "To Whom It May Concern" — it\'s dated.',
      },
      {
        question: 'Can I use AI to write my cover letter?',
        answer: 'Yes, with judgment. AI is excellent at structuring, mirroring keywords, and getting a clean draft fast. But the specifics — the achievement you lead with, the company-specific reference — should come from you. Tools like CareerThings AI generate a strong draft from your real experience, which you then refine.',
      },
      {
        question: 'Do I need a cover letter if the application says it\'s optional?',
        answer: 'Yes. "Optional" is often a soft test of motivation. Candidates who skip the optional cover letter are de-prioritized at the margin.',
      },
    ],
    relatedSlugs: ['how-to-beat-ats', 'cover-letter-format', 'how-long-should-a-cover-letter-be'],
  },
  {
    slug: 'how-to-beat-ats',
    title: 'How to Beat the ATS: A Practical Guide for 2026',
    category: 'ATS & Resumes',
    meta: {
      title: 'How to Beat the ATS in 2026 — A Practical Guide',
      description:
        'Practical guide to beating Applicant Tracking Systems in 2026: how ATS actually works, what to optimize, formatting rules that matter, and tools to test your resume.',
    },
    intro:
      'Most "beat the ATS" advice is recycled, misleading, or both. The truth: ATS systems are simpler than people think, but the rules for passing them are real. This guide explains how modern ATS actually works, what matters (and what doesn\'t), and the exact optimization steps that move resumes from filtered to forwarded.',
    estimatedReadTime: '10 min read',
    sections: [
      {
        id: 'what-ats-actually-does',
        heading: 'What an ATS actually does',
        paragraphs: [
          'An Applicant Tracking System is software that ingests, parses, and ranks resumes. The dominant systems — Workday, Greenhouse, Lever, iCIMS, Taleo, Ashby — all do roughly the same thing:',
          '1. Parse the uploaded file into structured fields (name, work history, education, skills).',
          '2. Match the parsed content against the job description.',
          '3. Rank candidates by match score.',
          '4. Surface top-ranked candidates to recruiters.',
          'Recruiters then read the top of the stack first. If your resume ranks low, it may technically be in the system but it will never be read.',
        ],
        callout: {
          kind: 'tip',
          title: 'The two failure modes',
          body: 'There are exactly two ways an ATS hurts you: (1) parsing errors that mangle your resume into unreadable fields, and (2) low keyword match that ranks you below the cutoff. Optimize for both.',
        },
      },
      {
        id: 'parsing',
        heading: 'Formatting rules that actually matter',
        paragraphs: [
          'Most ATS parsers in 2026 are vastly better than they were in 2018. Modern systems handle PDF well, parse most common layouts cleanly, and don\'t require the rigid "ATS-friendly templates" the SEO content has been pushing for a decade. Still, certain choices break parsers consistently. Avoid them.',
        ],
        bullets: {
          title: 'Formatting rules that hold up:',
          items: [
            'Single-column layout. Multi-column resumes break in many parsers.',
            'Standard section headings: "Experience," "Education," "Skills." Don\'t get clever.',
            'Reverse-chronological work history.',
            'Standard fonts: Calibri, Arial, Helvetica, Times, Garamond, Georgia.',
            'PDF is fine. So is .docx. Don\'t use .pages, .odt, or images.',
            'No headers/footers for important content (some parsers skip these).',
            'No tables for layout (use them for actual tabular data only).',
            'No graphics, icons, or images of text — they\'re invisible to parsers.',
          ],
        },
      },
      {
        id: 'keyword-strategy',
        heading: 'The keyword strategy that wins',
        paragraphs: [
          'Keyword optimization is where most candidates leave the most points on the table. The rule: ATS does roughly exact matching, not semantic matching. If the JD says "TypeScript" and your resume says "JavaScript," that\'s a miss.',
          'The strategy:',
        ],
        bullets: {
          items: [
            'Identify the top 15-25 keywords from the JD (tools like our Keyword Extractor do this).',
            'Mirror the relevant ones verbatim in your resume — same casing, same form.',
            'Distribute them naturally across the resume — Summary, Skills, Experience bullets.',
            'Don\'t stuff. Recruiters notice. ATS doesn\'t reward density past a threshold.',
            'Focus on technical/domain terms first — those are weighted highest.',
          ],
        },
        callout: {
          kind: 'warning',
          title: 'Don\'t pad keywords you don\'t have',
          body: 'Adding "Kubernetes" to your resume because the JD asks for it — when you\'ve never touched it — is short-sighted. The ATS will love it; the technical interview will not. Only mirror keywords that genuinely match your experience.',
        },
      },
      {
        id: 'resume-sections',
        heading: 'The section-by-section optimization',
        paragraphs: [
          'Each section has different ATS implications:',
        ],
        bullets: {
          items: [
            'Header — name, email, phone, city/state, LinkedIn. ATS reads name from this; don\'t put it in a graphic header.',
            'Summary — 2-3 lines, keyword-dense, written for the specific role. Skip "Objective" — it\'s dated.',
            'Skills — list 12-20 relevant terms. Single column, comma-separated or grouped by category.',
            'Experience — reverse-chronological. Each role: title, company, location, dates, then 3-5 bullets.',
            'Education — degree, institution, graduation year. Optional GPA if 3.5+ and within ~5 years of graduation.',
            'Certifications — list any current certs. Especially valuable in healthcare, finance, project management.',
          ],
        },
      },
      {
        id: 'experience-bullets',
        heading: 'How to write experience bullets that pass ATS and impress humans',
        paragraphs: [
          'Every bullet should: start with a strong verb, describe what you did, and quantify the outcome. The standard formula is [Action verb] + [what you did] + [measurable result].',
          'Examples:',
        ],
        bullets: {
          items: [
            '"Led migration of recommendation service from batch to streaming, reducing p95 latency 38% across 40M monthly users."',
            '"Built lifecycle program from scratch sourcing $3.2M annual pipeline; lifted MQL-to-SQL conversion from 14% to 22%."',
            '"Closed 142% of quota in 2024 across $1.4M book through targeted outbound to mid-market RevOps leaders."',
          ],
        },
      },
      {
        id: 'how-to-test',
        heading: 'How to test your resume against ATS',
        paragraphs: [
          'Before you submit, run two checks:',
        ],
        bullets: {
          items: [
            'Copy your resume into a plain text editor. If sections appear out of order, sections are missing, or content is garbled — your formatting is breaking parsers. Fix it.',
            'Use an ATS keyword checker (like our free ATS Resume Checker) against the actual job description. Aim for 70%+ match before submitting.',
          ],
        },
        callout: {
          kind: 'tip',
          title: 'The 30-minute optimization',
          body: 'Most resumes can be moved from "ranked low" to "ranked high" with 30 minutes of focused keyword and formatting work per application. It\'s the highest-leverage time you can spend in your job search.',
        },
      },
      {
        id: 'common-myths',
        heading: 'Common myths to ignore',
        paragraphs: [
          'A few persistent pieces of bad advice you can safely disregard in 2026:',
        ],
        bullets: {
          items: [
            '"Use white-on-white invisible keywords." Detected and penalized. Don\'t.',
            '"Submit a Word doc instead of PDF." Both work fine. PDF preserves formatting better.',
            '"Avoid headers and footers." Modern parsers handle them — just don\'t put load-bearing content there.',
            '"Use the exact same job title from the JD." Your actual title is fine. Add the JD title in parens if helpful.',
            '"ATS scores you on grammar." Most don\'t. Recruiters do.',
          ],
        },
      },
    ],
    faq: [
      {
        question: 'What ATS match score should I aim for?',
        answer: '70% or higher. 70-100% means strong alignment. 50-69% has real gaps to close. Below 50% suggests the role may not be a fit, or your resume needs significant tailoring.',
      },
      {
        question: 'Are PDF or Word documents better for ATS?',
        answer: 'Both work. PDF is preferred — it preserves formatting reliably across systems and devices. Use Word only if the application explicitly requires it.',
      },
      {
        question: 'Can ATS read images and graphics?',
        answer: 'No. Anything in an image — logos, headshots, graphical headers, icons — is invisible to ATS parsers. Keep critical content as plain text.',
      },
      {
        question: 'Should every resume be a different version?',
        answer: 'Yes — at minimum, tailor keywords and the summary to each role. A 30-minute customization on each application is the single biggest lever in your job search.',
      },
    ],
    relatedSlugs: ['how-to-write-a-cover-letter', 'how-long-should-a-resume-be', 'resume-summary-examples'],
  },
  {
    slug: 'cover-letter-format',
    title: 'Cover Letter Format Guide: Layout, Length & Examples',
    category: 'Cover Letters',
    meta: {
      title: 'Cover Letter Format Guide for 2026 — Layout, Length & Examples',
      description:
        'A complete cover letter format guide: ideal layout, margins, font, length, structure, and examples for entry-level, mid-career, and senior roles.',
    },
    intro:
      'Format isn\'t the most important part of a cover letter — what you say is. But poor format gets cover letters filtered before content matters. This guide covers the layout, length, font, and structural conventions that make a cover letter look professional and read fast.',
    estimatedReadTime: '7 min read',
    sections: [
      {
        id: 'page-layout',
        heading: 'Page layout: one page, single column',
        paragraphs: [
          'A cover letter should be one page, single column, with margins between 0.75" and 1". Anything more than one page signals the candidate doesn\'t respect the reader\'s time. Anything less than 0.75" margins is hard to read and looks unprofessional.',
          'Single column matters: multi-column layouts break in many ATS parsers and look cramped on email previews. Keep it simple.',
        ],
      },
      {
        id: 'font-and-spacing',
        heading: 'Font, size, and spacing',
        paragraphs: [
          'Stick to standard, professional fonts:',
        ],
        bullets: {
          title: 'Approved fonts:',
          items: [
            'Calibri (modern, clean, default Word font)',
            'Arial / Helvetica (clean sans-serif, very readable)',
            'Times New Roman / Garamond / Georgia (traditional serif)',
            'Cambria (serif, modern, designed for screens)',
          ],
        },
        callout: {
          kind: 'tip',
          title: 'Font and spacing rules',
          body: 'Body size: 10.5-12pt. Line spacing: 1.15-1.5. Paragraph spacing: 6-12pt after paragraphs. These ranges look polished without being cramped or sparse.',
        },
      },
      {
        id: 'header-block',
        heading: 'The header block',
        paragraphs: [
          'The top of the cover letter should mirror your resume header for consistency. Include:',
        ],
        bullets: {
          items: [
            'Your full name (one font size larger than body, bold).',
            'City, State (no need for full address in 2026).',
            'Email and phone.',
            'LinkedIn URL (optional but recommended).',
            'Portfolio or GitHub (for design, engineering roles).',
          ],
        },
      },
      {
        id: 'date-and-recipient',
        heading: 'Date and recipient block',
        paragraphs: [
          'Below your contact info, add (left-aligned):',
        ],
        bullets: {
          items: [
            'Today\'s date.',
            'A blank line.',
            'Recipient name (if known) — "Jordan Lee, Engineering Manager" or just "Hiring Manager."',
            'Company name.',
            'Company address (city, state — full street address optional in 2026).',
          ],
        },
      },
      {
        id: 'salutation',
        heading: 'Salutation',
        paragraphs: [
          'Use "Dear [Name]," when you have it. If you don\'t, "Dear Hiring Manager," "Dear Hiring Team," or "Dear [Department] Team" all work. Avoid "To Whom It May Concern" — it\'s dated.',
        ],
      },
      {
        id: 'body',
        heading: 'Body structure',
        paragraphs: [
          'Three paragraphs, occasionally four:',
        ],
        bullets: {
          items: [
            'Opening (1-2 sentences): specific hook tying you to the role.',
            'Qualifications (3-5 sentences): your strongest specific achievement, with a number.',
            'Fit (2-4 sentences): why this company specifically.',
            'Close (1-2 sentences): confident, no apologizing.',
          ],
        },
      },
      {
        id: 'closing',
        heading: 'Closing and signature',
        paragraphs: [
          '"Best regards," "Sincerely," or "Thank you," all work. "Sincerely" reads slightly more formal — appropriate for finance, law, healthcare. "Best regards" is neutral. "Thank you" is warm.',
          'Sign your full name. If submitting electronically, a typed name is fine — no need to insert an image of your signature.',
        ],
      },
      {
        id: 'file-format',
        heading: 'File format and naming',
        paragraphs: [
          'Save as PDF unless the application explicitly requires .docx. PDF preserves formatting across devices, email clients, and ATS systems.',
          'File name: "FirstName-LastName-Cover-Letter.pdf" or "FirstName-LastName-CompanyName-Cover-Letter.pdf". Avoid "cover-letter-final-v2.pdf" or anything with "draft" in the name.',
        ],
      },
    ],
    faq: [
      {
        question: 'Should a cover letter be formatted like a business letter?',
        answer: 'Yes — but a modern, lean version. Keep the header, date, recipient block, salutation, body, and closing. Skip the formal mailing address blocks unless applying to traditional industries (law, finance, government).',
      },
      {
        question: 'How long should a cover letter be in pages?',
        answer: 'One page. Always. Word count: 250-400. Anything longer signals the candidate doesn\'t respect the reader\'s time.',
      },
      {
        question: 'Should the cover letter match the resume\'s visual style?',
        answer: 'Yes. Same header, same fonts, same color accents. Visual consistency signals attention to detail.',
      },
    ],
    relatedSlugs: ['how-to-write-a-cover-letter', 'how-long-should-a-cover-letter-be', 'how-to-beat-ats'],
  },
  {
    slug: 'how-long-should-a-resume-be',
    title: 'How Long Should a Resume Be? (One Page or Two?)',
    category: 'ATS & Resumes',
    meta: {
      title: 'How Long Should a Resume Be in 2026? — One Page vs. Two',
      description:
        'A clear, decision-tree-style guide to resume length: when one page is right, when two pages are better, and the rules that hold up across industries.',
    },
    intro:
      'The question "how long should my resume be" has spawned a decade of conflicting advice. The answer is simpler than the internet suggests: it depends on years of experience, role seniority, and field. This guide gives you a decision tree that resolves the question in under a minute.',
    estimatedReadTime: '5 min read',
    sections: [
      {
        id: 'the-decision',
        heading: 'The decision tree',
        paragraphs: [
          'Use this:',
        ],
        bullets: {
          items: [
            '0-2 years experience → one page.',
            '3-7 years experience → one page (some industries: 1-2 pages OK).',
            '8-15 years experience → 1-2 pages.',
            '15+ years experience → 2 pages, occasionally 3 for academic or executive resumes.',
            'New grad, regardless of internships → one page.',
            'Career changer with relevant adjacent experience → one page.',
          ],
        },
      },
      {
        id: 'when-one-page',
        heading: 'When one page is right',
        paragraphs: [
          'A one-page resume forces ruthless prioritization, which is exactly what hiring managers want to see. If you can fit it on one page without making the font tiny or the margins criminal, do.',
          'One-page resumes are appropriate for:',
        ],
        bullets: {
          items: [
            'New graduates (always).',
            'Anyone with under ~7 years of experience.',
            'Career changers — show only the experience that\'s relevant to the new path.',
            'Sales, marketing, customer-facing roles where punchiness is a virtue.',
          ],
        },
      },
      {
        id: 'when-two-pages',
        heading: 'When two pages are appropriate',
        paragraphs: [
          'Two pages are appropriate when you genuinely have 8+ years of relevant experience and a one-page format would force you to omit material that\'s actually load-bearing for the application. Common scenarios:',
        ],
        bullets: {
          items: [
            'Senior individual contributors with deep technical experience and 10+ shipped projects worth listing.',
            'Engineering managers with team-size and outcome details for multiple roles.',
            'Senior medical professionals with extensive certifications, residencies, and publications.',
            'Senior consultants with multi-year engagements at named clients.',
          ],
        },
        callout: {
          kind: 'warning',
          title: 'Two pages don\'t mean lazy',
          body: 'Two-page resumes have to be just as edited as one-page resumes. Every bullet still has to earn its place. "I have lots of experience so I need two pages" is not a reason — "every page contains material that materially advances my candidacy" is.',
        },
      },
      {
        id: 'three-page-resumes',
        heading: 'When (rarely) three pages are appropriate',
        paragraphs: [
          'Three pages are reserved for academic CVs (which list every publication, conference talk, and grant), federal government positions (which require detailed qualification narratives), and select C-level executive roles (where extensive board service and major transactions warrant the space). For nearly all other roles, three pages is too much.',
        ],
      },
      {
        id: 'how-to-cut',
        heading: 'How to cut down to one page',
        paragraphs: [
          'If you\'re trying to compress to one page, in priority order:',
        ],
        bullets: {
          items: [
            'Cut roles older than 15 years entirely (or compress to one line).',
            'Cut bullets that don\'t directly relate to the target role.',
            'Combine duplicate accomplishments across roles into the most recent one.',
            'Remove unrelated certifications.',
            'Reduce summary to 2 lines max.',
            'Tighten font from 12pt to 11pt (not lower).',
            'Reduce margins to 0.7" (not lower).',
            'Cut the "Interests/Hobbies" section unless it\'s genuinely relevant.',
          ],
        },
      },
    ],
    faq: [
      {
        question: 'Is a two-page resume always worse than a one-page resume?',
        answer: 'No. For experienced candidates, a well-edited two-page resume is better than a cramped one-page resume. The rule is "as concise as possible without losing material substance." For most candidates over 8 years experience, that\'s 1-2 pages.',
      },
      {
        question: 'Do recruiters actually read past page one?',
        answer: 'Yes, when page one earns it. Recruiters skim the top of page one to decide if the resume is worth deeper attention. If it is, they read further. Page two is where you support the claims page one made.',
      },
      {
        question: 'What about LinkedIn — does it have the same length rules?',
        answer: 'No. LinkedIn profiles can and should be longer than resumes — they\'re a different artifact. Use LinkedIn for full history; use the resume for tailored highlights.',
      },
    ],
    relatedSlugs: ['how-to-beat-ats', 'resume-summary-examples', 'how-to-write-a-cover-letter'],
  },
  {
    slug: 'resume-summary-examples',
    title: 'How to Write a Resume Summary (with 12 Examples)',
    category: 'ATS & Resumes',
    meta: {
      title: 'How to Write a Resume Summary in 2026 — With 12 Examples',
      description:
        'A practical guide to writing a resume summary that gets read. Includes 12 examples by role: software engineer, PM, marketing manager, nurse, accountant, and more.',
    },
    intro:
      'The resume summary is 2-3 lines at the top of your resume. It\'s the most-read section after your name. Done well, it gets the recruiter to read the rest of the page. Done poorly, it triggers the skip. This guide covers the formula, the common mistakes, and 12 concrete examples to model from.',
    estimatedReadTime: '8 min read',
    sections: [
      {
        id: 'the-formula',
        heading: 'The formula',
        paragraphs: [
          'A strong resume summary has three components:',
        ],
        bullets: {
          items: [
            'Title and years of experience (e.g., "Senior software engineer with 6+ years building...").',
            'A specific, measurable achievement (e.g., "led migration that reduced p95 latency by 38% serving 40M users").',
            'A unique angle — what makes you different (e.g., "with a focus on observability and clean APIs").',
          ],
        },
      },
      {
        id: 'what-to-skip',
        heading: 'What to skip in a resume summary',
        paragraphs: [
          'Avoid:',
        ],
        bullets: {
          items: [
            '"Objective" framing ("Seeking a role where I can..."). Dated. Modern resumes use a Summary instead.',
            'Generic adjectives ("hard-working," "passionate," "results-driven"). They mean nothing.',
            'Personal pronouns at the start ("I am a..."). Drop the "I" — implied.',
            'Listing every skill. The Skills section is for that.',
            'Buzzwords without backing ("synergize cross-functional excellence"). Cringe.',
          ],
        },
      },
      {
        id: 'examples-tech',
        heading: 'Examples: tech roles',
        paragraphs: [
          'Software Engineer: "Senior software engineer with 6+ years building production distributed systems. Led migration of recommendation service from batch to streaming, reducing p95 latency 38% serving 40M monthly users. Strong instinct for observability, clean APIs, and well-tested code."',
          'Product Manager: "Product manager with 6+ years shipping consumer SaaS, most recently driving activation at a Series B fintech. Lifted trial-to-paid conversion 22% and reduced first-week churn 31% through 30+ user interviews and 8 A/B tests."',
          'UX Designer: "Senior UX designer with 7+ years embedded on growth teams. Led onboarding redesign that lifted activation 27% through 18 user interviews and 4 rounds of usability testing. Strong systems thinker; contributed 8 components to in-house design system."',
          'Data Analyst: "Data analyst with 4+ years embedded with a growth team. Built churn segmentation model surfacing a high-LTV cohort that drove $1.4M of incremental revenue. Daily SQL, Python, Looker; 40+ A/B tests with proper power analysis."',
        ],
      },
      {
        id: 'examples-business',
        heading: 'Examples: business roles',
        paragraphs: [
          'Marketing Manager: "B2B SaaS marketing manager with 7+ years scaling demand-gen and lifecycle programs. Built lifecycle from scratch sourcing $3.2M annual pipeline; reduced blended CAC from $4.8K to $3.4K through paid optimization."',
          'Sales Representative: "Account executive with 5+ years in B2B SaaS. Closed 142% of quota in 2024 across $1.4M book; generate 70% of pipeline through outbound to mid-market RevOps leaders. MEDDIC-disciplined discovery, fluent in Salesforce and Outreach."',
          'Project Manager: "PMP-certified project manager with 8+ years delivering complex initiatives across financial services and SaaS. Recently led 14-month, $4.2M platform migration delivered 2 weeks early and 8% under budget with zero customer-facing incidents."',
          'Financial Analyst: "Senior FP&A analyst with 4+ years embedded with engineering orgs. Built operating model driving a $4.2M reallocation cited by CFO as one of the year\'s best calls. Halved quarterly forecast cycle from 14 days to 7."',
        ],
      },
      {
        id: 'examples-other',
        heading: 'Examples: healthcare, education, accounting',
        paragraphs: [
          'Registered Nurse: "BSN-prepared RN with 5+ years on a 32-bed med-surg unit at a Level II trauma center. Co-led fall-prevention initiative reducing falls 31% over six months. Comfortable with high-acuity assessments and complex medication regimens."',
          'Teacher: "State-certified middle-school ELA teacher with 6+ years in heterogeneous classrooms. Grew 7th-grade cohort 1.4 grade levels per year on NWEA MAP. Workshop-model practitioner with strong family-communication discipline."',
          'Accountant: "CPA with 5+ years closing books for multi-entity SaaS organizations. Own month-end close for 3 U.S. and 1 Canadian entity in 5 business days; zero material adjustments past 7 cycles. NetSuite power user; led intercompany reconciliation rollout."',
          'HR Manager: "HR business partner with 7+ years scaling people functions at pre-IPO companies. Lifted engagement-survey \'manager effectiveness\' score from 67 to 81 through a manager-development program; led ER intake including two complex investigations."',
        ],
      },
      {
        id: 'tailoring',
        heading: 'How to tailor your summary to each role',
        paragraphs: [
          'A great summary is fully tailored to the JD. Customize three things:',
        ],
        bullets: {
          items: [
            'The achievement you lead with — pick the one most relevant to the target role.',
            'Keywords — mirror 3-5 from the JD verbatim.',
            'The unique angle — match it to the team\'s focus (growth, platform, brand, etc.).',
          ],
        },
      },
    ],
    faq: [
      {
        question: 'Is a resume summary the same as an objective?',
        answer: 'No. An objective states what you\'re looking for ("Seeking a role where..."). A summary states what you bring ("Senior engineer with 6+ years..."). Modern resumes use summaries; objectives are dated.',
      },
      {
        question: 'How long should a resume summary be?',
        answer: '2-3 lines, 30-60 words. Anything longer cuts into the space your Experience section needs.',
      },
      {
        question: 'Do I need a summary if I have a strong cover letter?',
        answer: 'Yes. Resume summaries and cover letters serve different functions. The resume summary anchors the resume\'s claim; the cover letter expands on fit and motivation. Both are read.',
      },
    ],
    relatedSlugs: ['how-to-beat-ats', 'how-long-should-a-resume-be', 'how-to-write-a-cover-letter'],
  },
  {
    slug: 'how-long-should-a-cover-letter-be',
    title: 'How Long Should a Cover Letter Be? (Word Count by Role)',
    category: 'Cover Letters',
    meta: {
      title: 'How Long Should a Cover Letter Be in 2026? — Word Count Guide',
      description:
        'Optimal cover letter length by role and industry: word count targets, what to cut, and when shorter is better than longer.',
    },
    intro:
      'The right cover letter length is shorter than most candidates think. This guide gives you concrete word-count targets by role and industry, plus the rule for deciding what to cut when you\'re over.',
    estimatedReadTime: '4 min read',
    sections: [
      {
        id: 'the-target',
        heading: 'The target: 250-400 words',
        paragraphs: [
          'For nearly every role, the right cover letter is 250-400 words on a single page. This range is the sweet spot: long enough to make a substantive case, short enough that recruiters will actually read it.',
          'Recruiters spend an average of 11-15 seconds on a cover letter. At 400 words, that\'s about 27 words per second of attention — already aggressive. Anything longer is unread.',
        ],
      },
      {
        id: 'by-role',
        heading: 'Word count by role',
        paragraphs: [
          'Some variation by role and seniority:',
        ],
        bullets: {
          items: [
            'Entry-level / new grad: 250-300 words. You don\'t have enough material to fill more.',
            'Mid-career individual contributor: 300-400 words. The sweet spot.',
            'Senior IC / staff: 350-450 words. More scope to demonstrate.',
            'Manager / director: 350-450 words. Add team-size and business-impact specifics.',
            'Executive (VP+): 400-500 words. Slightly more latitude, but tight discipline still wins.',
            'Sales roles: 250-300 words. Sales hiring managers move fast.',
            'Tech roles: 300-400 words. Engineering hiring managers want signal density.',
            'Academia / research: 500-700 words. Different conventions; longer letters are normal.',
          ],
        },
      },
      {
        id: 'when-shorter-better',
        heading: 'When shorter is better than longer',
        paragraphs: [
          'A 250-word cover letter that says one specific thing well beats a 400-word cover letter that says four things vaguely. If you can\'t fill 400 words with substantive material, write 250 well and stop.',
          'Sales roles in particular reward brevity — sales hiring managers screen high volumes and have a strong instinct that long cover letters signal candidates who don\'t self-edit.',
        ],
      },
      {
        id: 'how-to-cut',
        heading: 'How to cut a cover letter that\'s too long',
        paragraphs: [
          'If you\'re over 400 words:',
        ],
        bullets: {
          items: [
            'Cut every sentence that doesn\'t name a specific company, achievement, or fit signal.',
            'Combine "I\'m looking for" framing — recruiters know you want the role.',
            'Trim the close to 1-2 sentences. "I look forward to discussing this further" is enough.',
            'Cut adjectives and adverbs aggressively.',
            'Replace "in order to" with "to," "due to the fact that" with "because," etc.',
          ],
        },
      },
    ],
    faq: [
      {
        question: 'Is a 200-word cover letter too short?',
        answer: 'For some roles, no — a tight 200-word letter that lands one specific point can be effective. But most cover letters at 200 words feel undercooked. 250-400 is the safer range.',
      },
      {
        question: 'Should I count the header, salutation, and signature in the word count?',
        answer: 'No. Word count refers to the body of the letter. The header, salutation, and signature don\'t count.',
      },
      {
        question: 'Will a 500-word cover letter be rejected?',
        answer: 'Not automatically — but the recruiter is more likely to skim than read carefully, and important content may not get attention. Tighten to under 400 unless you have a specific reason not to.',
      },
    ],
    relatedSlugs: ['how-to-write-a-cover-letter', 'cover-letter-format', 'how-long-should-a-resume-be'],
  },
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export function getGuideSlugs(): string[] {
  return GUIDES.map((g) => g.slug);
}

export function getRelatedGuides(slug: string): Guide[] {
  const current = getGuideBySlug(slug);
  if (!current) return [];
  return current.relatedSlugs
    .map((s) => getGuideBySlug(s))
    .filter((g): g is Guide => Boolean(g));
}

export function groupGuidesByCategory(): Record<string, Guide[]> {
  return GUIDES.reduce<Record<string, Guide[]>>((acc, g) => {
    if (!acc[g.category]) acc[g.category] = [];
    acc[g.category].push(g);
    return acc;
  }, {});
}
