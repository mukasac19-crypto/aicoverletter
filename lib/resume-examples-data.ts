// Seed data for the /resume-examples/[slug] programmatic SEO surface.
// Each entry generates one indexable page with a full resume sample (rendered
// as HTML so it's crawlable text), keyword-rich content, JSON-LD schema, and
// internal links. Add entries here to ship more pages.

export type ResumeFaq = { question: string; answer: string };

export type ResumeExperience = {
  title: string;
  company: string; // can be a placeholder like "Tech Company A"
  location: string;
  dates: string;
  bullets: string[];
};

export type ResumeEducation = {
  degree: string;
  school: string;
  graduated: string;
};

export type ResumeExample = {
  slug: string;
  jobTitle: string;
  category: string;
  shortDescription: string;
  meta: { title: string; description: string };
  intro: string;
  recruiterSignals: string[];
  atsKeywords: string[];
  proTips: string[];
  sample: {
    name: string;
    title: string;
    contact: { email: string; phone: string; location: string; linkedIn: string };
    summary: string;
    skills: { category: string; items: string[] }[];
    experience: ResumeExperience[];
    education: ResumeEducation[];
    certifications?: string[];
  };
  faq: ResumeFaq[];
  relatedSlugs: string[];
};

export const RESUME_EXAMPLES: ResumeExample[] = [
  {
    slug: 'software-engineer',
    jobTitle: 'Software Engineer',
    category: 'Engineering & Technology',
    shortDescription:
      'A software engineer resume that pairs measurable shipping wins with clean, ATS-friendly structure — the version of "engineer" hiring managers actually want to interview.',
    meta: {
      title: 'Software Engineer Resume Example & Writing Guide',
      description:
        'A proven software engineer resume example with section-by-section guidance, ATS keywords, and FAQ. Tailor it to your dream role in minutes with CareerThings AI.',
    },
    intro:
      'Software engineering resumes get screened in under 30 seconds. The strongest ones lead with measurable impact, mirror the JD\'s tech stack verbatim, and keep formatting clean enough to pass ATS parsing. Use the example below as a baseline; tailor every bullet to the specific role.',
    recruiterSignals: [
      'Measurable shipping impact: latency, throughput, user count',
      'Stack overlap with the JD — frameworks, languages, infra',
      'Ownership signals: led a migration, drove a decision, mentored juniors',
      'Cross-functional collaboration with PMs, designers, data',
      'Clean, single-column ATS-friendly formatting',
    ],
    atsKeywords: [
      'TypeScript', 'React', 'Node.js', 'Python', 'Go', 'AWS', 'Kubernetes',
      'CI/CD', 'PostgreSQL', 'GraphQL', 'unit testing', 'system design',
      'distributed systems', 'observability', 'agile', 'on-call',
    ],
    proTips: [
      'Lead each bullet with a strong action verb plus a quantified outcome.',
      'Mirror 8-10 keywords from the JD verbatim — ATS does exact matching.',
      'Keep it to one page if you have under 8 years of experience; two pages max ever.',
      'Skip the "Objective" section. Use a 2-3 line Summary instead.',
      'Single-column layout. Multi-column resumes break in many ATS parsers.',
    ],
    sample: {
      name: 'Your Name',
      title: 'Senior Software Engineer',
      contact: {
        email: 'you@example.com',
        phone: '(555) 123-4567',
        location: 'San Francisco, CA',
        linkedIn: 'linkedin.com/in/yourname',
      },
      summary:
        'Senior software engineer with 6+ years building production systems in TypeScript, Python, and Go. Led the migration of a recommendation service from batch to sub-100ms streaming, serving 40M monthly users. Strong instinct for distributed systems, clean APIs, and observable services.',
      skills: [
        { category: 'Languages', items: ['TypeScript', 'Python', 'Go', 'SQL'] },
        { category: 'Frameworks', items: ['React', 'Next.js', 'Node.js', 'FastAPI'] },
        { category: 'Infrastructure', items: ['AWS', 'GCP', 'Kubernetes', 'Terraform', 'Docker'] },
        { category: 'Databases', items: ['PostgreSQL', 'Redis', 'DynamoDB', 'BigQuery'] },
        { category: 'Tools', items: ['Git', 'Datadog', 'PagerDuty', 'GitHub Actions'] },
      ],
      experience: [
        {
          title: 'Senior Software Engineer',
          company: 'Tech Company A',
          location: 'San Francisco, CA',
          dates: 'Jul 2022 — Present',
          bullets: [
            'Led migration of recommendation service from batch pipeline to streaming architecture, reducing p95 latency by 38% and serving 40M monthly users.',
            'Owned the redesign of checkout API, cutting peak-hour error rate from 1.2% to 0.08% across 6M daily transactions.',
            'Authored on-call runbook adopted by 14-person platform org, reducing average MTTR from 47 minutes to 18.',
            'Mentored three junior engineers; all three were promoted within 18 months.',
          ],
        },
        {
          title: 'Software Engineer',
          company: 'Tech Company B',
          location: 'New York, NY',
          dates: 'Aug 2019 — Jun 2022',
          bullets: [
            'Built core payment service in Go handling $200M+ annualized GMV with 99.98% uptime.',
            'Implemented event-driven architecture using Kafka, replacing brittle cron-based system and cutting failed payment retries by 64%.',
            'Co-led adoption of Kubernetes across the engineering org, writing the Helm charts used by all 12 services.',
          ],
        },
      ],
      education: [
        {
          degree: 'B.S. Computer Science',
          school: 'University Name',
          graduated: 'May 2019',
        },
      ],
      certifications: ['AWS Certified Solutions Architect — Associate'],
    },
    faq: [
      {
        question: 'How long should a software engineer resume be?',
        answer:
          'One page if you have under 8 years of experience. Two pages maximum, ever. Recruiters skim — density and clarity beat comprehensiveness.',
      },
      {
        question: 'Should I include a GitHub link or portfolio?',
        answer:
          'Yes, in the contact section. Make sure the linked GitHub has at least 2-3 polished, recent repos — a sparse or stale GitHub can hurt more than help.',
      },
      {
        question: 'Do I need to list every technology I\'ve touched?',
        answer:
          'No. List the ones you\'d be comfortable being grilled on in an interview. Tool sprawl signals shallow experience — depth in 8-12 things beats surface knowledge of 30.',
      },
    ],
    relatedSlugs: ['data-analyst', 'product-manager', 'web-developer'],
  },
  {
    slug: 'product-manager',
    jobTitle: 'Product Manager',
    category: 'Product & Strategy',
    shortDescription:
      'A product manager resume built around outcomes, not features — the version of "PM" hiring managers actually screen for.',
    meta: {
      title: 'Product Manager Resume Example & Writing Guide',
      description:
        'A complete product manager resume example with writing guide, ATS keywords, and FAQ. Tailor it to any PM role with CareerThings AI.',
    },
    intro:
      'PM resumes that interview well share three traits: every bullet leads with an outcome (not a feature), the metric is specific, and the candidate\'s scope (team size, surface area) is clear. Use the structure below; tailor each bullet to the role\'s focus area (growth, platform, monetization).',
    recruiterSignals: [
      'Outcome ownership — a metric you moved, not features you shipped',
      'Customer-discovery rigor (interviews, usability tests, win/loss)',
      'Cross-functional team scope and seniority',
      'Comfort with data: SQL, dashboards, A/B tests',
      'Strategic framing — "why now" and trade-offs',
    ],
    atsKeywords: [
      'product roadmap', 'OKRs', 'A/B testing', 'user research', 'discovery',
      'PRD', 'prioritization', 'RICE', 'product analytics', 'SQL',
      'cross-functional', 'stakeholder management', 'go-to-market', 'beta launch',
    ],
    proTips: [
      'Every bullet starts with the outcome, not the feature.',
      'Quantify scope: team size, MRR/users impacted, percentage lifts.',
      'Skip "passionate about products" — show, don\'t tell.',
      'Keep it one page unless you have 10+ years.',
    ],
    sample: {
      name: 'Your Name',
      title: 'Senior Product Manager',
      contact: {
        email: 'you@example.com',
        phone: '(555) 123-4567',
        location: 'New York, NY',
        linkedIn: 'linkedin.com/in/yourname',
      },
      summary:
        'Product manager with 6+ years shipping consumer SaaS, most recently driving activation and trial-to-paid conversion at a Series B fintech. Lifted trial conversion 22% and reduced first-week churn 31% through 30+ user interviews and 8 A/B tests over 18 months.',
      skills: [
        { category: 'Tools', items: ['Jira', 'Linear', 'Amplitude', 'Mixpanel', 'Figma', 'Notion'] },
        { category: 'Methods', items: ['User Research', 'A/B Testing', 'Jobs-to-be-Done', 'OKRs', 'PRDs'] },
        { category: 'Data', items: ['SQL', 'Looker', 'Mode', 'Excel'] },
      ],
      experience: [
        {
          title: 'Senior Product Manager, Growth',
          company: 'SaaS Company A',
          location: 'New York, NY',
          dates: 'Aug 2022 — Present',
          bullets: [
            'Led top-of-funnel rebuild that lifted trial-to-paid conversion 22% and reduced first-week churn from 41% to 28%.',
            'Owned roadmap for 4-engineer, 2-designer pod with $4M annualized impact target; hit 118% of plan in FY2024.',
            'Ran 30+ customer interviews and 8 A/B tests; documented one failure publicly that became the team\'s case study on instrumenting before launch.',
          ],
        },
        {
          title: 'Product Manager',
          company: 'SaaS Company B',
          location: 'San Francisco, CA',
          dates: 'Jun 2020 — Jul 2022',
          bullets: [
            'Shipped self-serve billing flow that moved 38% of low-touch deals off the sales-assisted path, freeing $1.2M of AE capacity annually.',
            'Partnered with data team to instrument 14 product events, enabling first cohort retention analysis the company had ever run.',
          ],
        },
      ],
      education: [
        { degree: 'B.A. Economics', school: 'University Name', graduated: 'May 2019' },
      ],
    },
    faq: [
      {
        question: 'Should a PM resume include feature lists?',
        answer:
          'No. Lead with outcomes; reference features only as context. "Shipped a billing flow" is weak — "Moved 38% of low-touch deals off the sales path, saving $1.2M of AE capacity" is strong.',
      },
      {
        question: 'Do I need an MBA on a PM resume?',
        answer:
          'No. MBAs help with some employers and don\'t with others. List it if you have it, but don\'t lead with it — the work is the audition.',
      },
    ],
    relatedSlugs: ['software-engineer', 'data-analyst', 'ux-designer'],
  },
  {
    slug: 'marketing-manager',
    jobTitle: 'Marketing Manager',
    category: 'Marketing & Communications',
    shortDescription:
      'A marketing manager resume built around pipeline, channel mastery, and the kind of revenue impact that earns a seat at the GTM table.',
    meta: {
      title: 'Marketing Manager Resume Example & Writing Guide',
      description:
        'A marketing manager resume example with writing guide, ATS keywords, and FAQ. Tailor to demand gen, brand, or content roles with CareerThings AI.',
    },
    intro:
      'Marketing manager resumes get screened on revenue impact first, channel craft second. The strongest ones quantify pipeline sourced or influenced, name the channels owned, and show the tools fluency the JD asks for.',
    recruiterSignals: [
      'Pipeline or revenue you sourced or influenced',
      'Channel mastery — paid, lifecycle, content, events',
      'Comfort with attribution and dashboards',
      'Strong copywriting and brand sensibility',
      'Cross-functional partnership with sales',
    ],
    atsKeywords: [
      'demand generation', 'lifecycle marketing', 'paid acquisition', 'SEO',
      'content marketing', 'brand', 'campaign', 'pipeline', 'CAC', 'LTV',
      'HubSpot', 'Marketo', 'Google Ads', 'attribution', 'positioning',
    ],
    proTips: [
      'Lead with a pipeline or revenue number in your summary.',
      'Each bullet: outcome first, channel second.',
      'Mention specific tools from the JD verbatim.',
      'Show one piece of content you\'re proud of — link it.',
    ],
    sample: {
      name: 'Your Name',
      title: 'Marketing Manager',
      contact: {
        email: 'you@example.com',
        phone: '(555) 123-4567',
        location: 'Austin, TX',
        linkedIn: 'linkedin.com/in/yourname',
      },
      summary:
        'B2B SaaS marketing manager with 7+ years scaling demand gen and lifecycle programs. Built lifecycle from scratch sourcing $3.2M annual pipeline; owned paid (Google, LinkedIn, Reddit) with 1.4x improvement in CAC payback.',
      skills: [
        { category: 'Channels', items: ['Paid Search', 'Paid Social', 'SEO', 'Content', 'Lifecycle Email', 'Webinars'] },
        { category: 'Tools', items: ['HubSpot', 'Marketo', 'Google Ads', 'LinkedIn Campaign Manager', 'GA4', 'Looker'] },
        { category: 'Skills', items: ['Copywriting', 'Brief Writing', 'Attribution Analysis', 'Positioning'] },
      ],
      experience: [
        {
          title: 'Marketing Manager',
          company: 'SaaS Company A',
          location: 'Austin, TX',
          dates: 'Mar 2022 — Present',
          bullets: [
            'Built lifecycle program from scratch; now sources $3.2M annual pipeline and lifted MQL-to-SQL conversion from 14% to 22%.',
            'Owned paid acquisition (Google, LinkedIn, Reddit); reduced blended CAC from $4,800 to $3,400 over 12 months.',
            'Wrote and shipped 16 long-form pieces in 2024; two still rank #1 on Google for their primary terms and drove 1,400 trial signups.',
          ],
        },
        {
          title: 'Demand Gen Specialist',
          company: 'SaaS Company B',
          location: 'Remote',
          dates: 'Jan 2020 — Feb 2022',
          bullets: [
            'Scaled webinar program from 1 quarterly to 1 monthly; drove 480 SQLs in 2021 alone.',
            'Built reporting in HubSpot and Looker that became the source of truth for the GTM staff meeting.',
          ],
        },
      ],
      education: [
        { degree: 'B.S. Marketing', school: 'University Name', graduated: 'May 2018' },
      ],
    },
    faq: [
      {
        question: 'How do I quantify marketing impact when I don\'t own the number?',
        answer:
          'Use "influenced" or "contributed to" framing: "Influenced $4M in pipeline through co-marketing with sales." It\'s honest and still strong.',
      },
      {
        question: 'Should I list every campaign I\'ve run?',
        answer:
          'No. Pick the 4-6 most relevant or impactful. Resume bullets should be the highlight reel, not the full archive.',
      },
    ],
    relatedSlugs: ['product-manager', 'data-analyst', 'content-writer'],
  },
  {
    slug: 'registered-nurse',
    jobTitle: 'Registered Nurse',
    category: 'Healthcare',
    shortDescription:
      'A nursing resume that highlights specialty, certifications, and patient-outcome metrics — the version nurse managers and recruiters actually screen for.',
    meta: {
      title: 'Registered Nurse Resume Example & Writing Guide',
      description:
        'A registered nurse resume example with writing guide, ATS keywords, and FAQ. Tailor to your specialty in minutes with CareerThings AI.',
    },
    intro:
      'Nursing resumes are different from corporate resumes: the credential block matters more, the unit/specialty has to be obvious in 5 seconds, and patient-outcome stories belong in measurable terms. Use the structure below to make every section earn its place.',
    recruiterSignals: [
      'Active state RN license',
      'Specialty fit (ICU, ED, med-surg, peds, L&D, oncology)',
      'Required certifications (BLS, ACLS, PALS, specialty certs)',
      'Patient ratio and unit type',
      'EHR fluency (Epic, Cerner, Meditech)',
    ],
    atsKeywords: [
      'BSN', 'RN', 'BLS', 'ACLS', 'PALS', 'med-surg', 'ICU', 'patient assessment',
      'medication administration', 'IV therapy', 'wound care', 'EHR', 'Epic',
      'patient education', 'care plan', 'evidence-based practice', 'HIPAA',
    ],
    proTips: [
      'Lead with credentials in your name line: "Your Name, BSN, RN."',
      'List unit, bed count, and patient ratio in every role.',
      'Quantify outcomes: fall reduction, satisfaction scores, CLABSI rates.',
      'Keep certifications current; list expiration only if asked.',
    ],
    sample: {
      name: 'Your Name, BSN, RN',
      title: 'Registered Nurse — Medical-Surgical',
      contact: {
        email: 'you@example.com',
        phone: '(555) 123-4567',
        location: 'Chicago, IL',
        linkedIn: 'linkedin.com/in/yourname',
      },
      summary:
        'BSN-prepared RN with 5+ years on a 32-bed med-surg unit at a Level II trauma center. Led unit-based fall-prevention initiative reducing patient falls 31% over six months. Comfortable with high-acuity assessments, complex medication regimens, and coordinated discharge planning.',
      skills: [
        { category: 'Clinical', items: ['Patient Assessment', 'Medication Administration', 'IV Therapy', 'Wound Care', 'Pain Management', 'Telemetry Monitoring'] },
        { category: 'Systems', items: ['Epic', 'Pyxis', 'Omnicell'] },
        { category: 'Certifications', items: ['RN License (IL)', 'BSN', 'BLS', 'ACLS', 'TNCC'] },
      ],
      experience: [
        {
          title: 'Registered Nurse, Medical-Surgical',
          company: 'Hospital A — Level II Trauma Center',
          location: 'Chicago, IL',
          dates: 'Jul 2021 — Present',
          bullets: [
            'Care for 5 patients per shift on a 32-bed unit including post-op, oncology, and complex medical patients.',
            'Co-led fall-prevention initiative reducing patient falls 31% over six months.',
            'Precepted three new graduate nurses through their first 12 weeks of orientation.',
          ],
        },
        {
          title: 'Registered Nurse, Med-Surg Float',
          company: 'Hospital B',
          location: 'Chicago, IL',
          dates: 'May 2019 — Jun 2021',
          bullets: [
            'Floated across 4 med-surg units, supporting 32-44 bed units with 5-6 patient ratios.',
            'Maintained 96% patient-satisfaction scores in HCAHPS communication-with-nurses domain.',
          ],
        },
      ],
      education: [
        {
          degree: 'B.S. Nursing (BSN)',
          school: 'University Name',
          graduated: 'May 2019',
        },
      ],
      certifications: ['RN License — IL #12345', 'BLS — AHA, current', 'ACLS — AHA, current', 'TNCC — current'],
    },
    faq: [
      {
        question: 'Should a nurse resume be one page or two?',
        answer:
          'One page for new grads through ~5 years; two pages for experienced or specialty nurses. Don\'t pad — density wins.',
      },
      {
        question: 'Where do certifications go?',
        answer:
          'Top of the resume in the credentials line plus a dedicated Certifications section. Active license, BLS, ACLS, and any specialty certs (CCRN, CEN) go here.',
      },
    ],
    relatedSlugs: ['teacher', 'customer-service-representative'],
  },
  {
    slug: 'teacher',
    jobTitle: 'Teacher',
    category: 'Education',
    shortDescription:
      'A teaching resume that demonstrates instructional craft, classroom outcomes, and the kind of differentiation strategies that hiring principals screen for.',
    meta: {
      title: 'Teacher Resume Example & Writing Guide',
      description:
        'A teacher resume example with writing guide, ATS keywords, and FAQ. Tailor to your grade and subject in minutes with CareerThings AI.',
    },
    intro:
      'Teaching resumes that interview well lead with grade level and subject, anchor on student-growth outcomes, and demonstrate concrete classroom strategies. Show, don\'t tell — every bullet should imply what your classroom looks like on a Tuesday.',
    recruiterSignals: [
      'Grade level / subject match',
      'State certification status and endorsements',
      'Measured student-growth outcomes',
      'Differentiation and classroom-management evidence',
      'PLC participation and family communication',
    ],
    atsKeywords: [
      'lesson planning', 'differentiation', 'classroom management', 'IEP',
      'standards-aligned', 'formative assessment', 'data-driven instruction',
      'PLC', 'small-group instruction', 'state certification', 'parent communication',
    ],
    proTips: [
      'List grade level and subject in your headline.',
      'Quantify growth using NWEA, MAP, or state assessments.',
      'Mention specialized populations (ELL, special ed, gifted).',
      'List certifications and endorsements clearly — recruiters filter on them.',
    ],
    sample: {
      name: 'Your Name',
      title: 'Middle School ELA Teacher',
      contact: {
        email: 'you@example.com',
        phone: '(555) 123-4567',
        location: 'Denver, CO',
        linkedIn: 'linkedin.com/in/yourname',
      },
      summary:
        'State-certified middle-school ELA teacher with 6+ years in heterogeneous classrooms. Grew 7th-grade cohort an average of 1.4 grade levels in reading per year on NWEA MAP. Workshop-model practitioner with strong family-communication discipline.',
      skills: [
        { category: 'Instruction', items: ['Workshop Model', 'Differentiation', 'Formative Assessment', 'Small-Group Instruction', 'IEP Implementation'] },
        { category: 'Tools', items: ['Google Classroom', 'Canvas', 'NWEA MAP', 'IXL'] },
        { category: 'Certifications', items: ['State Teaching License (CO)', 'ELA 6-12 Endorsement', 'ELL Endorsement'] },
      ],
      experience: [
        {
          title: '7th Grade ELA Teacher',
          company: 'School A',
          location: 'Denver, CO',
          dates: 'Aug 2020 — Present',
          bullets: [
            'Grew heterogeneous 7th-grade cohort 1.4 grade levels per year in reading on NWEA MAP.',
            'Co-led building literacy PLC; revised 6-8 writing rubrics for vertical alignment.',
            'Maintained 30+ positive home contacts per quarter alongside required documentation.',
          ],
        },
        {
          title: '6th Grade ELA Teacher',
          company: 'School B',
          location: 'Denver, CO',
          dates: 'Aug 2018 — Jun 2020',
          bullets: [
            'Implemented daily 20-minute independent reading block; lifted reading-volume tracking from 12 books/year to 28.',
            'Differentiated for 6 students with IEPs and 9 ELL students alongside core instruction.',
          ],
        },
      ],
      education: [
        { degree: 'M.Ed., Curriculum & Instruction', school: 'University Name', graduated: 'May 2020' },
        { degree: 'B.A. English Literature', school: 'University Name', graduated: 'May 2018' },
      ],
      certifications: [
        'CO State Teaching License — current',
        'ELA 6-12 Endorsement',
        'ELL Endorsement',
      ],
    },
    faq: [
      {
        question: 'How long should a teaching resume be?',
        answer:
          'One page for early-career, two for veteran teachers with leadership roles. Recruiters skim — density wins.',
      },
      {
        question: 'Should I include test scores?',
        answer:
          'Yes — NWEA MAP, STAR, state assessment growth, AP pass rates. Frame as evidence, not outcome ownership.',
      },
    ],
    relatedSlugs: ['registered-nurse', 'customer-service-representative'],
  },
  {
    slug: 'accountant',
    jobTitle: 'Accountant',
    category: 'Finance & Accounting',
    shortDescription:
      'An accountant resume built around close-cycle ownership, GAAP fluency, and the ERP depth controllers actually want.',
    meta: {
      title: 'Accountant Resume Example & Writing Guide',
      description:
        'An accountant resume example with writing guide, ATS keywords, and FAQ. Tailor to staff, senior, or industry-specific roles with CareerThings AI.',
    },
    intro:
      'Accountant resumes get screened on close-cycle ownership and ERP fluency. The strongest ones quantify number of entities closed, days-to-close, accuracy, and audit-readiness. Generic "responsible for journal entries" gets filtered.',
    recruiterSignals: [
      'CPA or CPA candidate status',
      'Close-cycle ownership across multiple entities',
      'ERP fluency: NetSuite, SAP, Oracle, QuickBooks',
      'Audit and SOX experience',
      'Industry knowledge (SaaS, manufacturing, healthcare)',
    ],
    atsKeywords: [
      'GAAP', 'CPA', 'general ledger', 'journal entries', 'month-end close',
      'reconciliation', 'NetSuite', 'SAP', 'QuickBooks', 'SOX', 'audit',
      'accruals', 'AR', 'AP', 'fixed assets', 'variance analysis',
    ],
    proTips: [
      'Lead with CPA status and years of close-cycle ownership.',
      'Quantify days-to-close and accuracy.',
      'Mention audit experience explicitly.',
      'List the ERP from the JD prominently.',
    ],
    sample: {
      name: 'Your Name, CPA',
      title: 'Senior Accountant',
      contact: {
        email: 'you@example.com',
        phone: '(555) 123-4567',
        location: 'Boston, MA',
        linkedIn: 'linkedin.com/in/yourname',
      },
      summary:
        'CPA with 5+ years closing books for multi-entity SaaS organizations. Own month-end close for 3 U.S. and 1 Canadian entity in 5 business days with zero material adjustments in last 7 cycles. NetSuite power user; led intercompany reconciliation module implementation.',
      skills: [
        { category: 'Accounting', items: ['GAAP', 'Month-End Close', 'Reconciliations', 'Accruals', 'Fixed Assets', 'Revenue Recognition (ASC 606)'] },
        { category: 'Systems', items: ['NetSuite', 'QuickBooks', 'BlackLine', 'Excel (advanced)'] },
        { category: 'Compliance', items: ['SOX 404 Walkthroughs', 'External Audit Coordination'] },
      ],
      experience: [
        {
          title: 'Senior Accountant',
          company: 'SaaS Company A',
          location: 'Boston, MA',
          dates: 'Sep 2021 — Present',
          bullets: [
            'Own month-end close for 3 U.S. and 1 Canadian entity in 5 business days; zero material adjustments past 7 cycles.',
            'Led NetSuite intercompany reconciliation module rollout, eliminating ~20 hours of manual work per close.',
            'Coordinated SOX walkthrough with external auditors; passed Big 4 review with no significant deficiencies.',
          ],
        },
        {
          title: 'Staff Accountant',
          company: 'SaaS Company B',
          location: 'Boston, MA',
          dates: 'Aug 2019 — Aug 2021',
          bullets: [
            'Reconciled 22 balance sheet accounts monthly; identified $180K of misposted revenue requiring correction.',
            'Implemented BlackLine for reconciliation tracking, reducing close cycle by 1.5 days.',
          ],
        },
      ],
      education: [
        { degree: 'B.S. Accounting', school: 'University Name', graduated: 'May 2019' },
      ],
      certifications: ['CPA — MA, current', 'CMA — in progress'],
    },
    faq: [
      {
        question: 'Should I list every account I\'ve reconciled?',
        answer:
          'No. List number reconciled and any specific complex accounts (intercompany, fixed assets, revenue). Save the full list for the interview.',
      },
      {
        question: 'How important is industry experience for accounting roles?',
        answer:
          'Matters more for senior/controller-track roles. SaaS revenue recognition and manufacturing inventory accounting are real specialties — call out industry depth when relevant.',
      },
    ],
    relatedSlugs: ['software-engineer', 'product-manager'],
  },
];

export function getResumeExampleBySlug(slug: string): ResumeExample | undefined {
  return RESUME_EXAMPLES.find((e) => e.slug === slug);
}

export function getResumeExampleSlugs(): string[] {
  return RESUME_EXAMPLES.map((e) => e.slug);
}

export function getRelatedResumeExamples(slug: string): ResumeExample[] {
  const current = getResumeExampleBySlug(slug);
  if (!current) return [];
  return current.relatedSlugs
    .map((s) => getResumeExampleBySlug(s))
    .filter((e): e is ResumeExample => Boolean(e));
}

export function groupResumeExamplesByCategory(): Record<string, ResumeExample[]> {
  return RESUME_EXAMPLES.reduce<Record<string, ResumeExample[]>>((acc, ex) => {
    if (!acc[ex.category]) acc[ex.category] = [];
    acc[ex.category].push(ex);
    return acc;
  }, {});
}

// ---------- Seniority modifier support ----------

import type { SeniorityModifier } from './seniority-modifiers';

const MODIFIER_LABELS: Record<SeniorityModifier, string> = {
  'entry-level': 'Entry-Level',
  junior: 'Junior',
  senior: 'Senior',
  lead: 'Lead',
  manager: 'Manager',
};

const MODIFIER_INTROS: Record<SeniorityModifier, (job: string) => string> = {
  'entry-level': (job) =>
    `An entry-level ${job.toLowerCase()} resume is doing more work than a mid-career resume — it's making the case that you can do the job before you've done it. Lead with internships, projects, coursework, or open-source contributions, and quantify everything you can. The example below uses that exact playbook.`,
  junior: (job) =>
    `Junior ${job.toLowerCase()} resumes need to translate 1-2 years of experience into the most senior-feeling outcomes you have. Lead with the most ambitious project you've shipped, then quantify the result. Don't apologize for tenure gaps — convert every assignment into a measurable bullet.`,
  senior: (job) =>
    `Senior ${job.toLowerCase()} resumes are screened for depth, scope, and the ability to operate without much oversight. Lead with one specific quantified win, then connect every bullet to a measurable outcome. Cut anything that reads as junior-level "responsible for" framing.`,
  lead: (job) =>
    `Lead ${job.toLowerCase()} resumes need to demonstrate scope of influence, technical judgment, and the ability to elevate the people around you. Lead bullets should reference architecture decisions, mentorship, and cross-team work — not just project completion.`,
  manager: (job) =>
    `${MODIFIER_LABELS.manager} ${job.toLowerCase()} resumes need to demonstrate people leadership clearly. State team size, reporting structure, and the business outcomes you've owned. Include at least one growth story — someone you promoted, hired, or developed.`,
};

const MODIFIER_TIPS_PREPEND: Record<SeniorityModifier, string[]> = {
  'entry-level': [
    'Lead with the most ambitious project, internship, or coursework outcome you have. "Built a real-time dashboard for 40 classmates" beats "Studied React in CS 320."',
    'Quantify every bullet, even academic work. Specifics signal real engagement.',
  ],
  junior: [
    'Lead with the most senior-feeling project you\'ve shipped. Show the upper bound of what you can do.',
    'Don\'t pad with junior-level responsibilities. Edit ruthlessly to the strongest 4-5 bullets.',
  ],
  senior: [
    'Demonstrate scope: cross-team work, ambiguous problems, owning the hardest part of a launch.',
    'Cut "responsible for" framing. Lead with verbs and outcomes.',
  ],
  lead: [
    'Reference who you\'ve mentored and how — at lead level, growing the people around you matters as much as your own work.',
    'Show one architectural or strategic decision that shaped team direction.',
  ],
  manager: [
    'State team size and reporting structure clearly: "Manage a team of 7 engineers across 2 squads" is the right shape.',
    'Show one growth story: a promotion, a hire, a hard performance call you handled well.',
  ],
};

export function applyResumeModifier(
  example: ResumeExample,
  modifier: SeniorityModifier,
): ResumeExample {
  const label = MODIFIER_LABELS[modifier];
  const labeledTitle = `${label} ${example.jobTitle}`;
  return {
    ...example,
    slug: `${modifier}-${example.slug}`,
    jobTitle: labeledTitle,
    meta: {
      title: `${labeledTitle} Resume Example & Writing Guide`,
      description: `A ${label.toLowerCase()} ${example.jobTitle.toLowerCase()} resume example with section-by-section guidance, ATS keywords, and FAQ. Tailor it in minutes with CareerThings AI.`,
    },
    shortDescription: `A ${label.toLowerCase()} ${example.jobTitle.toLowerCase()} resume example with seniority-specific tips, keywords, and a tailored sample.`,
    intro: MODIFIER_INTROS[modifier](example.jobTitle),
    proTips: [...MODIFIER_TIPS_PREPEND[modifier], ...example.proTips],
    sample: {
      ...example.sample,
      title: `${label} ${example.sample.title.replace(/^(Senior |Lead |Junior |Entry-Level |Manager )/, '')}`,
    },
  };
}
