// Seed data for the /cover-letter-examples/[slug] programmatic SEO surface.
// Each entry generates one indexable page with ~1500-2500 words of content,
// keyword-rich HTML sample, schema.org markup, and links into the rest of the
// matrix. Add new entries here to ship more pages — no code changes needed.

export type CoverLetterFaq = { question: string; answer: string };

export type CoverLetterExample = {
  slug: string;
  jobTitle: string;
  category: string;
  experienceLevel: 'entry-level' | 'mid-level' | 'senior' | 'general';
  shortDescription: string;
  meta: { title: string; description: string };
  intro: string;
  whatRecruitersWantTitle?: string;
  hiringSignals: string[];
  commonKeywords: string[];
  proTips: string[];
  sampleLetter: {
    greeting: string;
    paragraphs: string[];
    closing: string;
    signature: string;
  };
  faq: CoverLetterFaq[];
  relatedSlugs: string[];
};

export const COVER_LETTER_EXAMPLES: CoverLetterExample[] = [
  {
    slug: 'software-engineer',
    jobTitle: 'Software Engineer',
    category: 'Engineering & Technology',
    experienceLevel: 'general',
    shortDescription:
      'A technical-but-human cover letter that pairs concrete shipping wins with clean structure — built to clear ATS filters and impress engineering hiring managers.',
    meta: {
      title: 'Software Engineer Cover Letter Example & Writing Guide',
      description:
        'A proven software engineer cover letter example, plus a section-by-section writing guide, ATS keywords, and FAQ. Tailor it to your dream role in minutes with CareerThings AI.',
    },
    intro:
      'Software engineering hiring managers read hundreds of cover letters per opening. The ones that stand out share three traits: they connect specific technical achievements to the role, demonstrate measurable business impact, and read like a human wrote them — not a template. Use the example below as a starting point, then tailor it with the keywords from the actual job description.',
    hiringSignals: [
      'Concrete, measurable shipping impact (e.g., "reduced p95 latency by 38%")',
      'A modern stack that overlaps the team\'s tech (the JD spells it out — mirror it)',
      'Cross-functional collaboration: PMs, designers, data, infra',
      'Ownership signals: led an on-call rotation, drove a migration, mentored juniors',
      'Clear, well-structured writing (yes, recruiters infer code quality from prose)',
    ],
    commonKeywords: [
      'TypeScript', 'React', 'Node.js', 'Python', 'Go', 'AWS', 'GCP', 'Kubernetes',
      'CI/CD', 'system design', 'distributed systems', 'unit testing', 'code review',
      'agile', 'sprint planning', 'on-call', 'incident response', 'observability',
      'PostgreSQL', 'REST API', 'GraphQL', 'microservices',
    ],
    proTips: [
      'Open with a one-sentence hook tied to the company\'s product or mission. Generic openers ("I am writing to apply…") get skipped.',
      'Quantify everything you can: "shipped to 40M users", "cut build time from 18 minutes to 4", "owned the migration to Postgres 15".',
      'Mirror 5-8 keywords from the job description verbatim — ATS systems do exact matches.',
      'Keep it under one page. ~350 words is the sweet spot for engineering roles.',
      'Skip personal pronouns at the start of every paragraph. Vary sentence openings.',
    ],
    sampleLetter: {
      greeting: 'Dear Hiring Manager,',
      paragraphs: [
        'When I read that {{Company}} is rebuilding its real-time inference platform, I knew I had to write. For the last three years I\'ve been doing exactly that — leading the migration of our recommendation service from a batch pipeline to a sub-100ms streaming architecture serving 40M monthly users.',
        'I\'m a software engineer with five years of experience shipping production systems in TypeScript, Python, and Go. At my current company I led the redesign of our checkout API, cutting p95 latency by 38% and reducing peak-hour error rates from 1.2% to under 0.1%. I partnered closely with product, design, and SRE to make the rollout zero-downtime, and I authored the runbook the on-call team still uses today.',
        'What draws me to {{Company}} specifically is your published work on vector indexing and the way the engineering team writes about trade-offs in your blog. The role you\'ve posted maps directly to my strongest skills: distributed systems, observability tooling, and clear technical communication. I would bring a track record of delivering measurable performance wins, mentoring junior engineers (three of mine were promoted last year), and writing the kind of clean, well-tested code that other engineers actually want to extend.',
        'I\'d welcome the chance to discuss how my experience with high-throughput services and incident response could contribute to {{Company}}\'s next phase. Thank you for considering my application — I\'ve attached my resume and would be happy to dive deeper into any of the projects above.',
      ],
      closing: 'Best regards,',
      signature: 'Your Name',
    },
    faq: [
      {
        question: 'How long should a software engineer cover letter be?',
        answer:
          'Aim for 250-400 words on a single page. Engineering hiring managers skim — get the strongest signal (a specific shipped project with measurable impact) into the first paragraph and keep paragraphs short.',
      },
      {
        question: 'Should I include code snippets in my cover letter?',
        answer:
          'No. Cover letters are prose. Save code for your portfolio, GitHub, or take-home. Use the cover letter to translate your technical work into business outcomes a non-engineer can also appreciate.',
      },
      {
        question: 'Do I really need a cover letter for software engineering roles?',
        answer:
          'For most senior or mission-driven roles, yes — it\'s often the deciding factor between similar resumes. For high-volume new-grad postings it matters less, but a good one never hurts and a great one moves you to the top of the stack.',
      },
      {
        question: 'How do I tailor this template to a specific job posting?',
        answer:
          'Replace {{Company}} with the real company name, swap in 5-8 verbatim keywords from the job description (frameworks, methodologies, domain terms), and rewrite the second paragraph around the achievement that most resembles the work in the JD. CareerThings AI does this automatically when you paste the job description.',
      },
    ],
    relatedSlugs: ['data-analyst', 'product-manager', 'ux-designer', 'project-manager'],
  },
  {
    slug: 'product-manager',
    jobTitle: 'Product Manager',
    category: 'Product & Strategy',
    experienceLevel: 'general',
    shortDescription:
      'A PM cover letter built around outcomes, customer insight, and cross-functional leadership — the three things every PM hiring manager screens for.',
    meta: {
      title: 'Product Manager Cover Letter Example & Writing Guide',
      description:
        'A complete product manager cover letter example with a step-by-step writing guide, ATS keywords, and FAQ. Tailor it to any PM role in minutes with CareerThings AI.',
    },
    intro:
      'Great product manager cover letters do what great PMs do: they lead with outcomes, demonstrate customer empathy, and show how the candidate moves cross-functional teams. Use this template as scaffolding, then make it specific to the company\'s product, the team\'s stage, and the metric the role is responsible for.',
    hiringSignals: [
      'Outcome ownership — a metric you moved, not features you shipped',
      'Customer-discovery rigor (interviews, usability tests, NPS, win/loss)',
      'Strategic framing — you can articulate "why now" and trade-offs',
      'Cross-functional leadership without authority',
      'Comfort with data: SQL, dashboards, A/B tests',
    ],
    commonKeywords: [
      'product roadmap', 'OKRs', 'A/B testing', 'user research', 'discovery',
      'stakeholder management', 'go-to-market', 'PRD', 'prioritization',
      'RICE', 'Jobs-to-be-Done', 'product analytics', 'SQL', 'Amplitude',
      'cross-functional', 'agile', 'beta launch', 'feature adoption',
    ],
    proTips: [
      'Lead with the outcome, not the title. "Drove a 22% lift in trial-to-paid conversion" beats "Senior PM at Acme."',
      'Reference the company\'s product by name and show you\'ve actually used it. PMs who don\'t use the product are an instant red flag.',
      'Pick the achievement that most resembles the role\'s scope. Growth PM role? Lead with retention. Platform PM? Lead with reliability or developer experience.',
      'Keep it 300-400 words. PMs write a lot — your cover letter is a writing sample.',
    ],
    sampleLetter: {
      greeting: 'Dear Hiring Manager,',
      paragraphs: [
        'I\'ve been a {{Company}} customer for two years, and the way your team approaches onboarding is the reason I\'m writing today. I\'d love to bring the playbook I\'ve built around activation and retention to a product I already love.',
        'I\'m a product manager with six years of experience shipping consumer SaaS, most recently as Senior PM at a Series B fintech where I owned activation and trial conversion. Over 18 months I led a cross-functional team of four engineers, two designers, and a researcher through a top-of-funnel rebuild that lifted trial-to-paid conversion by 22% and reduced first-week churn from 41% to 28%. The work involved 30+ user interviews, three discovery sprints, two failed experiments, and one big bet that paid off.',
        'What I would bring to {{Company}} is that same blend: rigorous discovery, sharp prioritization, and the ability to keep a team moving through ambiguity. I write tight PRDs, instrument carefully, and make sure every launch ships with a learning agenda — not just a feature flag. I\'m also comfortable in SQL and Amplitude, which I rely on daily for self-serve analysis instead of waiting on data partners.',
        'I\'d welcome the chance to talk about the role and where I think I could move the needle in the first 90 days. Thank you for the consideration.',
      ],
      closing: 'Best regards,',
      signature: 'Your Name',
    },
    faq: [
      {
        question: 'What should a product manager cover letter include?',
        answer:
          'A specific outcome you owned (with a metric), a discovery story showing customer empathy, and a paragraph connecting your background to the role\'s scope. Skip generic claims like "passionate about products" — show, don\'t tell.',
      },
      {
        question: 'How is a PM cover letter different from a software engineer cover letter?',
        answer:
          'PM cover letters lean more on outcomes and narrative; engineering cover letters can lean more on technical depth. PMs are also evaluated on writing quality, so the cover letter doubles as a writing sample.',
      },
      {
        question: 'Should I mention the company\'s product?',
        answer:
          'Yes, specifically and accurately. Reference a feature, a recent launch, or something from their changelog. PM hiring managers screen out candidates who haven\'t used the product.',
      },
    ],
    relatedSlugs: ['software-engineer', 'data-analyst', 'ux-designer', 'marketing-manager'],
  },
  {
    slug: 'marketing-manager',
    jobTitle: 'Marketing Manager',
    category: 'Marketing & Communications',
    experienceLevel: 'general',
    shortDescription:
      'A marketing manager cover letter that demonstrates strategic thinking, channel expertise, and measurable revenue impact.',
    meta: {
      title: 'Marketing Manager Cover Letter Example & Writing Guide',
      description:
        'A polished marketing manager cover letter example, with section-by-section guidance, ATS keywords, and FAQ. Personalize it in minutes with CareerThings AI.',
    },
    intro:
      'Marketing manager hiring managers want one thing above all else: evidence you can move pipeline. The strongest cover letters open with a measurable revenue or growth outcome, then connect channel expertise (paid, lifecycle, content, events) to the company\'s actual go-to-market motion.',
    hiringSignals: [
      'Pipeline or revenue you sourced or influenced',
      'Channel mastery — pick the channels that match the JD',
      'Ability to brief creative and run a calendar',
      'Comfort with attribution, dashboards, and basic SQL',
      'Strong copywriting (your cover letter is the audition)',
    ],
    commonKeywords: [
      'demand generation', 'lifecycle marketing', 'paid acquisition', 'SEO',
      'content marketing', 'brand', 'campaign', 'ABM', 'attribution',
      'CAC', 'LTV', 'pipeline', 'MQL', 'SQL', 'HubSpot', 'Marketo',
      'GA4', 'Looker', 'positioning', 'go-to-market',
    ],
    proTips: [
      'Lead with a revenue or pipeline number. Marketing leaders are tired of "passionate storyteller" openers.',
      'Match the channel mix to the JD — don\'t pitch SEO experience to a paid-led team.',
      'Show, don\'t tell, on writing. Strong sentences are the proof.',
      'Reference the company\'s positioning or recent campaign. Specificity wins.',
    ],
    sampleLetter: {
      greeting: 'Dear Hiring Manager,',
      paragraphs: [
        'The campaign {{Company}} ran last quarter — the one anchored on the new buyer persona work — was the reason I subscribed to your newsletter. The clarity of the positioning is rare, and I\'d love to help build on it.',
        'I\'m a marketing manager with seven years of experience scaling B2B SaaS pipelines. At my current company I built a lifecycle program from scratch that now sources $3.2M in annual pipeline and lifted MQL-to-SQL conversion from 14% to 22%. I\'ve owned paid (Google, LinkedIn, Reddit), content (16 long-form pieces last year, two of which still rank #1 for their target terms), and a quarterly webinar program that drove 480 SQLs in 2024.',
        'What I would bring to {{Company}} is the ability to run a sharp, integrated calendar without losing sight of the brand. I\'m as comfortable in HubSpot workflows as I am briefing a creative team, and I treat attribution as a tool for sharpening decisions, not winning credit fights.',
        'I\'d welcome a conversation about where the team is investing next quarter and how I could help accelerate it. Thank you for considering my application.',
      ],
      closing: 'Best regards,',
      signature: 'Your Name',
    },
    faq: [
      {
        question: 'What metrics should a marketing manager mention in a cover letter?',
        answer:
          'Pipeline sourced, revenue influenced, MQL/SQL volume and conversion rates, CAC payback, and any specific channel ROAS. Pick the two or three most relevant to the role and lead with them.',
      },
      {
        question: 'How long should a marketing cover letter be?',
        answer:
          '300-400 words. Hiring managers in marketing read hundreds — clarity and tight prose are the audition.',
      },
    ],
    relatedSlugs: ['product-manager', 'data-analyst', 'graphic-designer', 'sales-representative'],
  },
  {
    slug: 'data-analyst',
    jobTitle: 'Data Analyst',
    category: 'Data & Analytics',
    experienceLevel: 'general',
    shortDescription:
      'A data analyst cover letter that demonstrates business impact, SQL fluency, and the ability to turn ambiguous questions into clear insights.',
    meta: {
      title: 'Data Analyst Cover Letter Example & Writing Guide',
      description:
        'Use this proven data analyst cover letter example to land more interviews. Includes a section-by-section guide, ATS keywords, and FAQ. Tailor it with CareerThings AI.',
    },
    intro:
      'The best data analyst cover letters do something most don\'t: they show business impact, not just technical skill. SQL fluency is table stakes — what separates strong analysts is the ability to turn an ambiguous business question into a clear answer the team can act on.',
    hiringSignals: [
      'Business impact — a decision your analysis drove',
      'SQL fluency (mention the dialect: Snowflake, BigQuery, Redshift, Postgres)',
      'Comfort with at least one BI tool: Looker, Tableau, Mode, Hex',
      'Statistical literacy — A/B testing, confidence intervals, cohort analysis',
      'Stakeholder communication — you can present to non-technical audiences',
    ],
    commonKeywords: [
      'SQL', 'Python', 'Snowflake', 'BigQuery', 'dbt', 'Tableau', 'Looker',
      'Mode', 'A/B testing', 'cohort analysis', 'data modeling', 'ETL',
      'experimentation', 'KPI', 'dashboard', 'self-serve analytics', 'statistical significance',
    ],
    proTips: [
      'Open with the most impactful question you answered — not "I love working with data."',
      'Quantify the decision your analysis drove (revenue, retention, hours saved).',
      'Mention the actual data stack from the JD. ATS does exact matching.',
      'Keep technical depth in the second paragraph; business outcome in the first.',
    ],
    sampleLetter: {
      greeting: 'Dear Hiring Manager,',
      paragraphs: [
        'The blog post your data team published on causal inference for pricing experiments is exactly the kind of work I want to be doing — and exactly the kind of analysis I\'ve been building my career around for the last four years.',
        'I\'m a data analyst with four years of experience embedded in a growth team at a B2C marketplace. My work on a churn segmentation model surfaced a high-LTV cohort the product team didn\'t know existed; the resulting reactivation campaign generated $1.4M in incremental revenue last year. I work daily in SQL (Snowflake), Python, and Looker, partner with data engineering on dbt models, and have run 40+ A/B tests with proper power analysis.',
        'What I\'d bring to {{Company}} is rigor without rigidity — I push back on shaky readings, but I also know when a directional answer is enough to make the call. I write up findings in plain English, and I\'ve trained two business teams to self-serve their own dashboards so I can spend more time on the questions that actually require an analyst.',
        'I\'d welcome the chance to discuss the team\'s priorities and where I could contribute first. Thank you for the consideration.',
      ],
      closing: 'Best regards,',
      signature: 'Your Name',
    },
    faq: [
      {
        question: 'What technical skills should I mention in a data analyst cover letter?',
        answer:
          'Lead with SQL and the specific data stack from the job description. Mention Python or R if relevant, your BI tool of choice, and any experimentation frameworks. Keep the technical paragraph tight — recruiters want to see business impact too.',
      },
      {
        question: 'How do I show business impact if my work is mostly internal dashboards?',
        answer:
          'Reframe it: which decisions did the dashboard drive? Which team adopted it and how often? Did it replace a manual process, surface a new insight, or shorten a feedback loop? Those are all impact statements.',
      },
    ],
    relatedSlugs: ['software-engineer', 'product-manager', 'business-analyst', 'marketing-manager'],
  },
  {
    slug: 'registered-nurse',
    jobTitle: 'Registered Nurse',
    category: 'Healthcare',
    experienceLevel: 'general',
    shortDescription:
      'A nursing cover letter that highlights clinical specialty, patient outcomes, and the soft skills that hiring managers in healthcare actually screen for.',
    meta: {
      title: 'Registered Nurse Cover Letter Example & Writing Guide',
      description:
        'A complete registered nurse cover letter example with section guidance, ATS keywords, and FAQ. Tailor to your specialty in minutes with CareerThings AI.',
    },
    intro:
      'Nursing cover letters are different from corporate cover letters: hiring managers want to see clinical fit, soft-skill evidence, and a clear sense of why this unit, not just any unit. Lead with your specialty, certifications, and one specific patient-outcome story.',
    hiringSignals: [
      'Clinical specialty match (med-surg, ICU, ED, peds, L&D, oncology, etc.)',
      'Active RN license in state and BLS/ACLS as required',
      'Specific patient-outcome examples',
      'Calmness under pressure, communication with families, EHR fluency',
      'Why this hospital, this unit, this team',
    ],
    commonKeywords: [
      'BSN', 'RN', 'BLS', 'ACLS', 'PALS', 'med-surg', 'ICU', 'emergency',
      'patient assessment', 'medication administration', 'EHR', 'Epic', 'Cerner',
      'patient education', 'care plan', 'interdisciplinary team', 'evidence-based practice',
      'IV therapy', 'wound care', 'infection control', 'HIPAA',
    ],
    proTips: [
      'Open with your years of experience plus specialty in the first sentence.',
      'Pick one patient story to anchor the letter — specific beats general every time.',
      'Mention the unit by name and reference something concrete about the hospital (Magnet status, recent recognition, a program you admire).',
      'Keep it to one page. Nurse managers read fast.',
    ],
    sampleLetter: {
      greeting: 'Dear Nurse Manager,',
      paragraphs: [
        'I\'m a BSN-prepared RN with five years of medical-surgical experience, most recently on a 32-bed unit at a Level II trauma center, applying to join {{Company}}\'s med-surg team. {{Company}}\'s reputation for staff development and the unit\'s focus on evidence-based practice are the reasons I\'m specifically interested in this position.',
        'In my current role I care for an average of 5 patients per shift, with full responsibility for assessments, medication administration, IV therapy, patient education, and family communication. Last year I helped lead a unit-based fall-prevention initiative that reduced patient falls by 31% over six months. I\'m comfortable in Epic, hold current BLS and ACLS, and have precepted three new graduate nurses through their first 12 weeks.',
        'What I would bring to your team is the kind of steady, careful clinical judgment that complex patients need, paired with the communication style that keeps families informed and colleagues coordinated. I\'m looking for a unit where I can keep growing — eventually toward a charge or educator role — and {{Company}}\'s pathways are exactly what I\'m looking for.',
        'I\'d welcome the chance to discuss how my experience could fit your team. Thank you for the consideration.',
      ],
      closing: 'Sincerely,',
      signature: 'Your Name, BSN, RN',
    },
    faq: [
      {
        question: 'How long should a nurse cover letter be?',
        answer:
          'One page, 250-350 words. Lead with specialty and license, anchor with one patient story, and close with why this unit specifically.',
      },
      {
        question: 'Should I list every certification?',
        answer:
          'List the ones the JD requires (BLS, ACLS, etc.) plus any specialty certifications relevant to the role (e.g., CCRN for ICU, CEN for emergency). Save the full list for your resume.',
      },
    ],
    relatedSlugs: ['teacher', 'customer-service-representative', 'project-manager'],
  },
  {
    slug: 'teacher',
    jobTitle: 'Teacher',
    category: 'Education',
    experienceLevel: 'general',
    shortDescription:
      'A teaching cover letter built around classroom outcomes, instructional philosophy, and concrete differentiation strategies.',
    meta: {
      title: 'Teacher Cover Letter Example & Writing Guide',
      description:
        'A standout teacher cover letter example with section-by-section guidance, ATS keywords, and FAQ. Tailor it to any grade or subject in minutes with CareerThings AI.',
    },
    intro:
      'Hiring principals and curriculum directors look for three things in a cover letter: a clear instructional philosophy, evidence of student growth, and proof you can collaborate with colleagues and families. Show, don\'t tell — concrete classroom moments beat abstract claims every time.',
    hiringSignals: [
      'Grade level / subject match with the JD',
      'Measured student-growth outcomes',
      'Differentiation and classroom-management strategies',
      'Family communication and PLC participation',
      'State certification status',
    ],
    commonKeywords: [
      'lesson planning', 'differentiation', 'IEP', 'classroom management',
      'student engagement', 'standards-aligned', 'formative assessment',
      'data-driven instruction', 'PLC', 'SEL', 'multi-tiered support',
      'state certification', 'parent communication', 'small-group instruction',
    ],
    proTips: [
      'Open with grade level, subject, and years of experience in the first sentence.',
      'Anchor with one student-growth story (a specific outcome, not "I helped students grow").',
      'Reference the school\'s mission or a specific program. Generic letters get filtered.',
      'Mention certification and any specialized endorsements early.',
    ],
    sampleLetter: {
      greeting: 'Dear Principal,',
      paragraphs: [
        'I\'m a state-certified middle school ELA teacher with six years of classroom experience applying for the 7th-grade ELA position at {{Company}}. The school\'s commitment to writing across the curriculum is the reason I\'m specifically interested in joining your team.',
        'In my current building I\'ve grown a heterogeneous 7th-grade cohort an average of 1.4 grade levels in reading per year (NWEA MAP), with my students of color outpacing the building average for the last two years. I run a workshop-model classroom with daily independent reading, weekly writing conferences, and small-group instruction grounded in formative data. I\'ve served on our school\'s literacy PLC for three years and co-led a vertical-alignment project that revised our 6-8 writing rubrics.',
        'What I would bring to {{Company}} is a steady, structured classroom where students do the cognitive work, plus a willingness to collaborate deeply with grade-level and content teams. I\'m also a strong communicator with families — I average 30+ positive home contacts per quarter alongside the harder conversations.',
        'I\'d welcome the chance to discuss the position and tour the building. Thank you for the consideration.',
      ],
      closing: 'Sincerely,',
      signature: 'Your Name',
    },
    faq: [
      {
        question: 'Should a teacher cover letter mention test scores?',
        answer:
          'Yes, with context. NWEA, STAR, state assessment growth, or AP pass rates all work — frame them as evidence of practice, not the practice itself.',
      },
      {
        question: 'How is a new-teacher cover letter different from an experienced-teacher one?',
        answer:
          'New teachers should lean on student-teaching outcomes, methods coursework, and any specialized training. Be specific about what you learned and how you\'d apply it.',
      },
    ],
    relatedSlugs: ['registered-nurse', 'customer-service-representative', 'graphic-designer'],
  },
  {
    slug: 'project-manager',
    jobTitle: 'Project Manager',
    category: 'Operations & Project Management',
    experienceLevel: 'general',
    shortDescription:
      'A project manager cover letter that demonstrates delivery discipline, stakeholder management, and the ability to ship complex initiatives on time and on budget.',
    meta: {
      title: 'Project Manager Cover Letter Example & Writing Guide',
      description:
        'A complete project manager cover letter example with a writing guide, ATS keywords, and FAQ. Tailor it to any PM role in minutes with CareerThings AI.',
    },
    intro:
      'Project manager cover letters live or die on specifics. Hiring managers want to see complex initiatives you led, the methodology you used, and the business outcome — not generic claims about being "organized" or "detail-oriented."',
    hiringSignals: [
      'Complex initiatives delivered on time and on budget',
      'Methodology fluency (Agile, Scrum, Waterfall, hybrid)',
      'Stakeholder management across functions',
      'Risk identification and mitigation',
      'Tools fluency (Jira, Asana, MS Project, Smartsheet)',
    ],
    commonKeywords: [
      'project management', 'PMP', 'Agile', 'Scrum', 'Waterfall', 'Kanban',
      'stakeholder management', 'risk management', 'budget management',
      'Jira', 'Asana', 'MS Project', 'sprint planning', 'roadmap', 'PMO',
      'change management', 'cross-functional', 'milestone', 'dependency',
    ],
    proTips: [
      'Lead with the biggest project you\'ve owned — scope, timeline, budget, outcome.',
      'Mention certifications (PMP, CSM, PRINCE2) once, not repeatedly.',
      'Pick the methodology that matches the JD. Agile shop? Don\'t lead with Waterfall.',
      'Quantify schedule and budget performance — "delivered 12% under budget, two weeks ahead."',
    ],
    sampleLetter: {
      greeting: 'Dear Hiring Manager,',
      paragraphs: [
        'I\'m a PMP-certified project manager with eight years delivering complex initiatives across financial services and SaaS. I\'m writing because the program described in your job posting — a multi-vendor platform migration — is exactly the kind of work I most enjoy and where I\'ve had the strongest results.',
        'At my current company I led a 14-month migration of our core trading platform across four vendors and three regulatory jurisdictions. The program was delivered two weeks ahead of schedule and 8% under a $4.2M budget, with zero customer-facing incidents at cutover. I ran the program in a hybrid mode — Agile inside the engineering tracks, Waterfall for the regulatory and vendor coordination — and stood up a weekly executive steering committee that became the model for the PMO.',
        'What I would bring to {{Company}} is the same blend: rigorous risk management, clear executive communication, and a working style that gets the right decisions made early. I work fluently in Jira and Smartsheet, and I\'m as comfortable in a sprint review as I am in a vendor SOW negotiation.',
        'I\'d welcome the chance to talk through the role and where I think I could contribute first. Thank you for the consideration.',
      ],
      closing: 'Best regards,',
      signature: 'Your Name, PMP',
    },
    faq: [
      {
        question: 'Should I list every project I\'ve managed?',
        answer:
          'No. Pick the one most relevant to the role — same domain, similar scope, similar methodology — and go deep. Save the full list for your resume.',
      },
      {
        question: 'Is a PMP certification required?',
        answer:
          'Depends on the company. Many enterprises require it; many tech companies don\'t care. Always check the JD. If you don\'t have it but the JD asks, mention any in-progress study or equivalent (CSM, PRINCE2).',
      },
    ],
    relatedSlugs: ['software-engineer', 'product-manager', 'business-analyst', 'marketing-manager'],
  },
  {
    slug: 'graphic-designer',
    jobTitle: 'Graphic Designer',
    category: 'Design & Creative',
    experienceLevel: 'general',
    shortDescription:
      'A graphic designer cover letter that demonstrates craft, brand thinking, and the ability to translate a brief into work that ships.',
    meta: {
      title: 'Graphic Designer Cover Letter Example & Writing Guide',
      description:
        'A polished graphic designer cover letter example, with a section-by-section writing guide, ATS keywords, and FAQ. Tailor it to any role with CareerThings AI.',
    },
    intro:
      'Design hiring managers spend most of their time in your portfolio — the cover letter\'s job is to make them want to open it. Lead with one specific project, your role on it, and the business outcome it drove.',
    hiringSignals: [
      'A portfolio that demonstrates range and craft',
      'Brand consistency across formats (print, digital, motion)',
      'Tool fluency (Figma, Adobe CC, motion tools)',
      'Ability to take and respond to feedback',
      'Business context — design serving a goal, not just looking good',
    ],
    commonKeywords: [
      'Figma', 'Adobe Creative Cloud', 'Photoshop', 'Illustrator', 'InDesign',
      'After Effects', 'brand identity', 'typography', 'layout', 'visual design',
      'design system', 'iconography', 'motion graphics', 'art direction',
      'brand guidelines', 'production-ready files', 'print', 'digital',
    ],
    proTips: [
      'Link your portfolio in the first paragraph. Don\'t make hiring managers hunt for it.',
      'Pick one project to anchor the letter — describe brief, your role, outcome.',
      'Mention the tools that match the JD verbatim.',
      'Keep it tight — 250-350 words. The portfolio is the audition.',
    ],
    sampleLetter: {
      greeting: 'Dear Design Lead,',
      paragraphs: [
        'I\'ve been following {{Company}}\'s rebrand work for the past year, and the way the new identity system flexes across channels is exactly the kind of brand-building I want to be part of. My portfolio is at yourdomain.com — the case study most relevant to your role is the rebrand I led for an indie skincare line last year.',
        'I\'m a graphic designer with five years of in-house and agency experience. On the rebrand referenced above, I owned the full system — wordmark, color, type stack, packaging, digital — and shipped a complete brand-guidelines document plus production files for 14 SKUs. The launch drove a 38% lift in DTC conversion in its first quarter and earned a Brand New writeup. I work daily in Figma and the Adobe suite, with comfort in After Effects for short-form social motion.',
        'What I\'d bring to {{Company}} is craft, a calm response to feedback, and the discipline to ship clean, production-ready files on schedule. I read briefs carefully, and I\'m as interested in the business problem as the visual one.',
        'I\'d welcome the chance to walk through the work. Thank you for the consideration.',
      ],
      closing: 'Best regards,',
      signature: 'Your Name',
    },
    faq: [
      {
        question: 'How important is the cover letter for a design role?',
        answer:
          'Less than the portfolio, but enough to move you up the stack. A great cover letter signals you can write — which matters more than design candidates expect.',
      },
      {
        question: 'Should I include design samples in the cover letter itself?',
        answer:
          'No. Link to the portfolio. Cover letter is prose; portfolio is craft. Don\'t mix the two.',
      },
    ],
    relatedSlugs: ['ux-designer', 'marketing-manager', 'product-manager'],
  },
  {
    slug: 'sales-representative',
    jobTitle: 'Sales Representative',
    category: 'Sales & Business Development',
    experienceLevel: 'general',
    shortDescription:
      'A sales rep cover letter built around quota performance, pipeline generation, and a credible POV on the company\'s buyer.',
    meta: {
      title: 'Sales Representative Cover Letter Example & Writing Guide',
      description:
        'A proven sales rep cover letter example with a writing guide, ATS keywords, and FAQ. Tailor it to any sales role in minutes with CareerThings AI.',
    },
    intro:
      'Sales hiring managers screen on three signals: quota attainment, deal complexity, and how well you understand their buyer. The strongest cover letters lead with a number, anchor on a specific deal, and demonstrate research on the company\'s ICP.',
    hiringSignals: [
      'Quota attainment percentages across recent years',
      'Deal size and sales cycle that match the JD',
      'Outbound pipeline generation, not just inbound conversion',
      'Proficiency with the company\'s sales stack',
      'Buyer empathy — you understand their pain',
    ],
    commonKeywords: [
      'quota attainment', 'pipeline generation', 'outbound prospecting', 'discovery',
      'MEDDIC', 'MEDDPICC', 'BANT', 'Sandler', 'Salesforce', 'HubSpot',
      'Outreach', 'Salesloft', 'Gong', 'consultative selling', 'closing',
      'territory management', 'forecasting', 'account executive', 'SDR',
    ],
    proTips: [
      'Open with a specific number: "127% of quota in 2024 across a $1.4M book."',
      'Pick a deal story relevant to the JD — same buyer persona, similar deal size.',
      'Mention the prospecting motion explicitly. Hiring managers want to know you\'ll generate pipeline, not wait for it.',
      'Keep it short — 250-300 words. Sales hiring managers move fast.',
    ],
    sampleLetter: {
      greeting: 'Dear Hiring Manager,',
      paragraphs: [
        'I closed 142% of my quota in 2024 and 118% in 2023, primarily through outbound into mid-market RevOps leaders — which is exactly the buyer described in your JD. I\'m writing because {{Company}}\'s product solves a problem I\'ve been pitching adjacent solutions to for two years.',
        'I\'m an account executive with five years of B2B SaaS sales experience, most recently selling a $40K-$120K ACV product on a 60-90 day cycle. I generate ~70% of my own pipeline through targeted outbound, run discovery using a MEDDIC-flavored framework, and partner closely with SEs on technical evaluation. Last year I closed a $94K deal with a Series C fintech that became my company\'s second-largest expansion in 2024 — I led the procurement and security review personally.',
        'What I\'d bring to {{Company}} is the same blend: disciplined prospecting, sharp discovery, and the persistence to work a deal through procurement when it stalls. I\'m fluent in Salesforce, Outreach, and Gong, and I take call coaching seriously.',
        'I\'d welcome the chance to talk through the role and the territory. Thank you for the consideration.',
      ],
      closing: 'Best regards,',
      signature: 'Your Name',
    },
    faq: [
      {
        question: 'Should sales cover letters mention specific deals?',
        answer:
          'Yes, when you can. Anonymized is fine: "$94K deal with a Series C fintech." Specifics build credibility — generic claims sound like every other rep.',
      },
      {
        question: 'How do I handle a year where I missed quota?',
        answer:
          'Don\'t hide it, but don\'t lead with it. Lead with the years you hit, then briefly acknowledge the miss with context (territory change, segment shift) and what you learned.',
      },
    ],
    relatedSlugs: ['marketing-manager', 'customer-service-representative', 'business-analyst'],
  },
  {
    slug: 'ux-designer',
    jobTitle: 'UX Designer',
    category: 'Design & Creative',
    experienceLevel: 'general',
    shortDescription:
      'A UX designer cover letter built around process rigor, research depth, and shipped product outcomes.',
    meta: {
      title: 'UX Designer Cover Letter Example & Writing Guide',
      description:
        'A complete UX designer cover letter example, plus a writing guide, ATS keywords, and FAQ. Tailor it to any product design role with CareerThings AI.',
    },
    intro:
      'UX hiring managers are looking for designers who think about systems, ship to production, and back decisions with research. The strongest cover letters lead with one shipped project, the research that drove the design choices, and the user or business outcome.',
    hiringSignals: [
      'Shipped product work, not just concept screens',
      'Research practice — interviews, usability tests, surveys',
      'Systems thinking — design systems, components, accessibility',
      'Cross-functional collaboration with PMs and engineers',
      'A portfolio that shows process, not just final pixels',
    ],
    commonKeywords: [
      'Figma', 'design systems', 'user research', 'usability testing',
      'wireframing', 'prototyping', 'information architecture', 'interaction design',
      'accessibility', 'WCAG', 'Jobs-to-be-Done', 'qualitative research',
      'A/B testing', 'design tokens', 'component library', 'mobile-first',
    ],
    proTips: [
      'Lead with one shipped project. Concept work is fine in the portfolio, not the opener.',
      'Show research rigor — what did you learn, how did it change the design?',
      'Mention the design system or component library work. Senior PMs and design leads care.',
      'Link the portfolio in the first paragraph.',
    ],
    sampleLetter: {
      greeting: 'Dear Hiring Manager,',
      paragraphs: [
        'I\'ve been a {{Company}} customer for a year, and the recent redesign of the dashboard is the cleanest piece of complex-information design I\'ve used recently. My portfolio is at yourdomain.com — the case study most relevant to your role is the onboarding redesign I led last year.',
        'I\'m a senior UX designer with seven years of experience, most recently embedded on a growth team at a B2B SaaS. On the onboarding redesign I led 18 user interviews, ran four rounds of usability testing, and partnered with engineering through three sprints to ship. The new flow lifted activation by 27% and reduced first-session drop-off from 44% to 21%. I also contributed eight components to our design system in the process.',
        'What I\'d bring to {{Company}} is rigorous process without process theater — I move fast when the call is clear and slow down when it isn\'t. I work daily in Figma, advocate for accessibility (WCAG 2.1 AA) by default, and I write up findings so PMs and engineers can act on them without translation.',
        'I\'d welcome the chance to walk through the work. Thank you for the consideration.',
      ],
      closing: 'Best regards,',
      signature: 'Your Name',
    },
    faq: [
      {
        question: 'How do I show UX impact when I can\'t share confidential metrics?',
        answer:
          'Use directional framing: "lifted activation by 25-30%" or "cut drop-off roughly in half." Most hiring managers understand confidentiality and respect it.',
      },
      {
        question: 'Do I need to mention every tool I know?',
        answer:
          'No. Mention the ones in the JD plus one or two specialty tools (motion, prototyping). Tool sprawl in a cover letter reads as junior.',
      },
    ],
    relatedSlugs: ['graphic-designer', 'product-manager', 'software-engineer'],
  },
  {
    slug: 'business-analyst',
    jobTitle: 'Business Analyst',
    category: 'Data & Analytics',
    experienceLevel: 'general',
    shortDescription:
      'A business analyst cover letter that demonstrates requirements rigor, stakeholder management, and the ability to translate between business and technical teams.',
    meta: {
      title: 'Business Analyst Cover Letter Example & Writing Guide',
      description:
        'A complete business analyst cover letter example with section guidance, ATS keywords, and FAQ. Tailor it to any BA role with CareerThings AI.',
    },
    intro:
      'Business analysts sit between business and technical teams — the cover letter\'s job is to show you can do both sides well. Lead with a specific initiative where your requirements work shaped the outcome, and show comfort with both spreadsheets and stakeholder meetings.',
    hiringSignals: [
      'Requirements gathering and documentation rigor',
      'Stakeholder management across business and tech',
      'SQL and BI tool fluency',
      'Process mapping and improvement',
      'Domain knowledge in the company\'s industry',
    ],
    commonKeywords: [
      'requirements gathering', 'BRD', 'user stories', 'process mapping',
      'gap analysis', 'stakeholder management', 'SQL', 'Tableau', 'Power BI',
      'JIRA', 'Confluence', 'Visio', 'Lucidchart', 'agile', 'UAT',
      'business case', 'KPI', 'data analysis', 'workflow optimization',
    ],
    proTips: [
      'Open with a specific initiative — what problem, what role you played, what outcome.',
      'Show both sides: a business stakeholder you partnered with AND a tech team you handed requirements to.',
      'Quantify wherever possible: "reduced cycle time 28%", "$1.2M cost avoidance".',
      'Mention the domain (banking, healthcare, retail). Domain BAs are valued.',
    ],
    sampleLetter: {
      greeting: 'Dear Hiring Manager,',
      paragraphs: [
        'I\'ve spent six years as a business analyst in financial services — most recently leading the requirements work for a payments-platform modernization that I think mirrors the program described in your JD.',
        'On that initiative I partnered with eight business stakeholders across treasury and operations, ran the gap analysis against three vendor platforms, and authored the BRD that drove a $4.8M build-versus-buy decision. After we selected the vendor, I led requirements traceability through three release cycles and ran UAT with 22 business users; the platform launched two weeks ahead of plan and reduced reconciliation cycle time by 28%. I work daily in SQL, Tableau, and Confluence, and I\'m fluent in both Agile and Waterfall delivery.',
        'What I\'d bring to {{Company}} is the ability to keep technical and business teams genuinely aligned — not just in meetings but in the artifacts. I write tight user stories, push back when scope drifts, and follow up on every open question.',
        'I\'d welcome the chance to talk through the role. Thank you for the consideration.',
      ],
      closing: 'Best regards,',
      signature: 'Your Name',
    },
    faq: [
      {
        question: 'How is a business analyst cover letter different from a data analyst cover letter?',
        answer:
          'BA cover letters lean more on stakeholder management, requirements work, and process; data analyst cover letters lean more on SQL, statistics, and decisions driven by analysis. Plenty of overlap, different emphasis.',
      },
      {
        question: 'Should I mention specific frameworks like BABOK?',
        answer:
          'If the JD mentions them, yes. Otherwise show the work, not the framework name.',
      },
    ],
    relatedSlugs: ['data-analyst', 'project-manager', 'product-manager'],
  },
  {
    slug: 'customer-service-representative',
    jobTitle: 'Customer Service Representative',
    category: 'Customer Support',
    experienceLevel: 'general',
    shortDescription:
      'A customer service cover letter that demonstrates patience, problem-solving, and tangible CSAT or resolution metrics.',
    meta: {
      title: 'Customer Service Representative Cover Letter Example & Writing Guide',
      description:
        'A polished customer service cover letter example with a writing guide, ATS keywords, and FAQ. Tailor it to any CS role with CareerThings AI.',
    },
    intro:
      'Customer service hiring managers want evidence of patience, problem-solving, and the ability to handle volume without losing quality. The strongest cover letters lead with a metric — CSAT, resolution rate, AHT — and one specific situation where the rep turned a tough conversation into a save.',
    hiringSignals: [
      'CSAT and resolution-rate evidence',
      'Volume comfort (calls/day, tickets/week)',
      'A specific tough-customer save story',
      'Tools: Zendesk, Salesforce, Intercom, Freshdesk',
      'Multilingual or specialty (technical, billing, healthcare) when relevant',
    ],
    commonKeywords: [
      'customer service', 'CSAT', 'NPS', 'first-call resolution', 'AHT',
      'Zendesk', 'Salesforce', 'Intercom', 'Freshdesk', 'ticket triage',
      'de-escalation', 'active listening', 'product knowledge', 'onboarding',
      'escalation', 'KPI', 'SLA', 'omni-channel', 'multi-line phone',
    ],
    proTips: [
      'Lead with a CSAT or resolution number. Generic "I love helping people" gets skipped.',
      'Tell one specific save story — what happened, how you handled it, what the customer said.',
      'Mention the tools from the JD verbatim.',
      'Keep it short — 200-300 words. CS hiring managers screen high volumes.',
    ],
    sampleLetter: {
      greeting: 'Dear Hiring Manager,',
      paragraphs: [
        'I held a 96% CSAT and 81% first-contact resolution rate on a 60-call-per-day queue last year, which is why your team\'s focus on quality alongside volume drew me to this role.',
        'I\'m a customer service representative with three years handling tier-1 and tier-2 issues for a SaaS billing platform. I work in Zendesk and Salesforce daily, and I\'ve been the team\'s designated de-escalation backup for the last 18 months — I take 5-10 supervisor-requested escalations per week and resolve about 80% without a manager hand-off. Last quarter I turned around a customer who\'d filed a chargeback and was about to churn; the conversation ended with them upgrading to an annual plan and writing a positive G2 review.',
        'What I\'d bring to {{Company}} is calm, clear communication under pressure, careful documentation, and a willingness to dig into the product so I can solve problems instead of escalating them. I learn new tools fast and take coaching seriously.',
        'I\'d welcome the chance to discuss the role. Thank you for the consideration.',
      ],
      closing: 'Best regards,',
      signature: 'Your Name',
    },
    faq: [
      {
        question: 'Should I mention call volume in a customer service cover letter?',
        answer:
          'Yes — specific volume (calls per day, tickets per week) shows you can handle the workload. Pair it with a quality metric (CSAT, FCR) so it doesn\'t read as just throughput.',
      },
      {
        question: 'Is customer service experience transferable to other roles?',
        answer:
          'Yes. Pivoting to sales, success, or operations? Reframe CSAT as customer empathy, FCR as problem-solving, escalation handling as conflict management. Quantify everything.',
      },
    ],
    relatedSlugs: ['sales-representative', 'registered-nurse', 'graphic-designer'],
  },
  {
    slug: 'accountant',
    jobTitle: 'Accountant',
    category: 'Finance & Accounting',
    experienceLevel: 'general',
    shortDescription:
      'An accountant cover letter that demonstrates technical accuracy, GAAP fluency, and the kind of close-cycle ownership that hiring managers screen for.',
    meta: {
      title: 'Accountant Cover Letter Example & Writing Guide',
      description:
        'A polished accountant cover letter example with section-by-section guidance, ATS keywords, and FAQ. Tailor to staff, senior, or industry-specific roles with CareerThings AI.',
    },
    intro:
      'Accounting hiring managers screen for two things first: technical fluency (GAAP, close cycle, reconciliations) and reliability under deadline pressure. The strongest cover letters lead with a specific close-cycle metric and demonstrate ownership of a complex reconciliation or audit.',
    hiringSignals: [
      'GAAP fluency and current CPA status (or in progress)',
      'Close-cycle ownership — month-end, quarter-end, year-end',
      'Reconciliation experience across multiple entities or systems',
      'ERP fluency: NetSuite, SAP, Oracle, QuickBooks, Sage Intacct',
      'Audit-ready documentation and SOX awareness',
    ],
    commonKeywords: [
      'GAAP', 'CPA', 'general ledger', 'journal entries', 'month-end close',
      'reconciliation', 'NetSuite', 'SAP', 'QuickBooks', 'Excel', 'pivot tables',
      'SOX', 'audit', 'accruals', 'AR', 'AP', 'fixed assets', 'variance analysis',
    ],
    proTips: [
      'Lead with the close cycle you owned — number of entities, days to close, accuracy.',
      'Mention the ERP from the JD verbatim. Hiring managers filter on it.',
      'CPA in progress is worth saying — show momentum.',
      'Keep it tight: 250-350 words. Accountants are evaluated on precision.',
    ],
    sampleLetter: {
      greeting: 'Dear Hiring Manager,',
      paragraphs: [
        'I\'m a CPA with five years of experience closing books for multi-entity organizations, applying for the senior accountant role at {{Company}}. The expansion into European operations described in your posting is exactly the kind of work I\'ve been doing for the last two years.',
        'In my current role I own the month-end close for three U.S. entities and one Canadian subsidiary, completing close in 5 business days with zero material adjustments in the last seven cycles. I lead the reconciliation of 28 balance sheet accounts, partner with FP&A on flux analysis, and coordinated last year\'s SOX walkthrough with our external auditors. I work daily in NetSuite and have led the implementation of our intercompany reconciliation module.',
        'What I\'d bring to {{Company}} is rigor, calm under deadline, and the kind of process documentation that audit teams actually want to read. I\'m also pursuing my CMA and would be excited to grow into a controller-track role over time.',
        'I\'d welcome the chance to discuss the position. Thank you for the consideration.',
      ],
      closing: 'Best regards,',
      signature: 'Your Name, CPA',
    },
    faq: [
      {
        question: 'Should I list every ERP I\'ve used?',
        answer: 'List the ones from the JD plus your strongest. ERP sprawl in a cover letter dilutes the signal — show depth in 1-2 systems, not breadth in 6.',
      },
      {
        question: 'How do I handle being a CPA candidate (not yet certified)?',
        answer: 'Say "CPA candidate, exam scheduled for Q2" or similar. Specificity shows momentum and is far stronger than vague "studying for the CPA."',
      },
    ],
    relatedSlugs: ['financial-analyst', 'business-analyst', 'data-analyst'],
  },
  {
    slug: 'financial-analyst',
    jobTitle: 'Financial Analyst',
    category: 'Finance & Accounting',
    experienceLevel: 'general',
    shortDescription:
      'A financial analyst cover letter built around modeling depth, business-partner fluency, and the kind of strategic FP&A work that earns a seat at the table.',
    meta: {
      title: 'Financial Analyst Cover Letter Example & Writing Guide',
      description:
        'A complete financial analyst cover letter example with writing guide, ATS keywords, and FAQ. Tailor to corporate, investment, or FP&A roles with CareerThings AI.',
    },
    intro:
      'Financial analyst cover letters live or die on the modeling work. Hiring managers want to see Excel/SQL fluency, business-partner orientation, and the kind of analysis that drove a real decision — not template valuation work.',
    hiringSignals: [
      'Modeling depth (DCF, LBO, three-statement, or operating models)',
      'Business-partner experience embedded with a function',
      'SQL or BI-tool fluency for self-serve analysis',
      'A decision your analysis drove — capital allocation, headcount, pricing',
      'Comfort presenting to senior stakeholders',
    ],
    commonKeywords: [
      'financial modeling', 'three-statement model', 'DCF', 'variance analysis',
      'forecasting', 'budgeting', 'FP&A', 'P&L', 'EBITDA', 'cost analysis',
      'SQL', 'Tableau', 'Power BI', 'Excel', 'PowerPoint', 'board reporting',
    ],
    proTips: [
      'Lead with the decision your model drove, not the model itself.',
      'Mention the business unit you partnered with — embedded analysts are valued.',
      'Quantify: "$3.2M reallocation", "12% margin lift", "halved the budget cycle."',
      'Keep technical jargon for the second paragraph.',
    ],
    sampleLetter: {
      greeting: 'Dear Hiring Manager,',
      paragraphs: [
        'The investment thesis your team published on the Latin America expansion is the cleanest piece of internal strategy work I\'ve read this year, and the reason I\'m specifically applying to {{Company}}.',
        'I\'m a senior financial analyst with four years of FP&A experience, currently embedded with a 200-person engineering org at a Series C SaaS company. Last year I built the operating model that informed a $4.2M reallocation from infrastructure into machine learning headcount — a call our CFO has since cited as one of the year\'s best. I work daily in Excel, SQL (Snowflake), and Pigment, and I\'ve halved our quarterly forecast cycle from 14 days to 7 by automating the data-pull layer.',
        'What I\'d bring to {{Company}} is the ability to translate business questions into models executives actually use, not just decks they nod at. I write tight commentary, push back on shaky assumptions, and treat finance as a partner function, not a scorecard.',
        'I\'d welcome the chance to talk about the role. Thank you for the consideration.',
      ],
      closing: 'Best regards,',
      signature: 'Your Name',
    },
    faq: [
      {
        question: 'Should I include modeling samples?',
        answer: 'Don\'t attach files. Reference the work specifically — "built a three-statement model that drove a $4M decision." If asked in the interview, walk through it.',
      },
      {
        question: 'How is FP&A different from corporate development for cover letter purposes?',
        answer: 'FP&A leans on partnering with business units and forecasting; corp dev leans on M&A modeling and deal execution. Match your emphasis to the JD.',
      },
    ],
    relatedSlugs: ['accountant', 'business-analyst', 'data-analyst', 'product-manager'],
  },
  {
    slug: 'web-developer',
    jobTitle: 'Web Developer',
    category: 'Engineering & Technology',
    experienceLevel: 'general',
    shortDescription:
      'A web developer cover letter that pairs front-end craft with shipped product impact — the version of "developer" hiring managers actually want.',
    meta: {
      title: 'Web Developer Cover Letter Example & Writing Guide',
      description:
        'A web developer cover letter example with section-by-section guidance, ATS keywords, and FAQ. Tailor to front-end, full-stack, or agency roles with CareerThings AI.',
    },
    intro:
      'Web developer hiring managers want to see craft AND shipping. The strongest cover letters reference a live URL, demonstrate fluency in the team\'s stack, and connect technical work to a user or business outcome.',
    hiringSignals: [
      'A live, polished portfolio site (it\'s the audition)',
      'Stack overlap with the JD — mirror the framework',
      'Performance instinct (Core Web Vitals, accessibility, SEO)',
      'Ability to ship to production, not just build prototypes',
      'Cross-functional comfort with designers and PMs',
    ],
    commonKeywords: [
      'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue', 'HTML', 'CSS',
      'Tailwind', 'responsive design', 'accessibility', 'WCAG', 'Core Web Vitals',
      'SEO', 'CI/CD', 'Git', 'REST API', 'GraphQL', 'Vercel', 'Netlify',
    ],
    proTips: [
      'Link your portfolio in the first sentence.',
      'Pick one project to anchor — describe stack, your role, the outcome.',
      'Mention performance metrics if you have them (LCP, CLS).',
      'Keep it under 350 words. The portfolio carries the weight.',
    ],
    sampleLetter: {
      greeting: 'Dear Hiring Manager,',
      paragraphs: [
        'My portfolio is at yourdomain.com — the project most relevant to your role is the marketing-site rebuild I led for a Series B fintech last year. I rebuilt the site in Next.js 14 with a Sanity CMS, hit a Lighthouse score of 98 across the four core pages, and shipped to production in five weeks.',
        'I\'m a web developer with four years of experience, fluent in TypeScript, React, Next.js, and Tailwind, with strong CSS instincts and a real interest in performance. The rebuild above lifted organic conversion by 22% on the marketing site and reduced LCP from 3.4s to 1.1s on mobile. I\'m comfortable owning a project end-to-end: design hand-off, CMS modeling, accessibility audit, deployment, and the post-launch performance tail.',
        'What I\'d bring to {{Company}} is craft — careful HTML, accessibility by default, and the kind of polish that makes a marketing site actually convert. I work well with designers (I\'ll push back on layouts that won\'t hold up at 320px) and with content editors (I build CMS schemas they can actually use).',
        'I\'d welcome the chance to walk through the work. Thank you for the consideration.',
      ],
      closing: 'Best regards,',
      signature: 'Your Name',
    },
    faq: [
      {
        question: 'Is web developer the same as software engineer for cover letter purposes?',
        answer: 'Overlap, but emphasis differs. Web developer roles weight front-end craft, performance, and shipping marketing/product surfaces. Software engineer roles often emphasize backend systems and computer science fundamentals.',
      },
      {
        question: 'Should I list every framework I\'ve used?',
        answer: 'No. List the ones in the JD plus your strongest two. Framework sprawl reads as junior — depth wins.',
      },
    ],
    relatedSlugs: ['software-engineer', 'ux-designer', 'graphic-designer'],
  },
  {
    slug: 'devops-engineer',
    jobTitle: 'DevOps Engineer',
    category: 'Engineering & Technology',
    experienceLevel: 'general',
    shortDescription:
      'A DevOps cover letter built around reliability outcomes, automation depth, and the cloud platform fluency that platform teams screen for.',
    meta: {
      title: 'DevOps Engineer Cover Letter Example & Writing Guide',
      description:
        'A DevOps engineer cover letter example with writing guide, ATS keywords, and FAQ. Tailor to platform, SRE, or cloud-engineer roles with CareerThings AI.',
    },
    intro:
      'DevOps and platform engineering hiring managers want measurable reliability outcomes — uptime, deploy frequency, MTTR — and depth in one major cloud. Generic "I love automation" openers get filtered. Lead with a specific reliability or velocity metric you moved.',
    hiringSignals: [
      'A reliability or velocity metric you owned',
      'Deep fluency in one cloud (AWS / GCP / Azure)',
      'IaC depth (Terraform, Pulumi, CloudFormation)',
      'Container & orchestration: Kubernetes, ECS, Nomad',
      'On-call practice and incident-response leadership',
    ],
    commonKeywords: [
      'AWS', 'GCP', 'Azure', 'Kubernetes', 'Terraform', 'Helm', 'Docker',
      'CI/CD', 'GitHub Actions', 'GitLab', 'ArgoCD', 'observability',
      'Prometheus', 'Grafana', 'Datadog', 'on-call', 'SRE', 'IaC', 'Linux',
    ],
    proTips: [
      'Lead with a reliability or velocity metric you moved — uptime, MTTR, deploy frequency.',
      'Mention the cloud and orchestration stack from the JD verbatim.',
      'Reference a specific incident you led or migration you owned.',
      'Show you write postmortems people actually learn from.',
    ],
    sampleLetter: {
      greeting: 'Dear Hiring Manager,',
      paragraphs: [
        'I\'ve spent the last three years rebuilding the deploy pipeline at a Series B fintech, and the migration described in your JD — multi-region GKE on top of Terraform — is exactly the work I most want to keep doing.',
        'I\'m a senior DevOps engineer with six years across AWS and GCP, currently running a platform that serves 12M monthly users on a Kubernetes-based stack. Last year I led the move to GitOps via ArgoCD and Helm, raising deploy frequency from 8/week to 47/week and cutting MTTR from 38 minutes to 9. I\'ve owned our Terraform modules across three environments, written the runbooks our four-person on-call uses, and led postmortems for two SEV-1 incidents.',
        'What I\'d bring to {{Company}} is rigor, calm under pressure, and the discipline to automate the boring parts so the team can focus on the hard ones. I\'m fluent in Terraform, Helm, and Datadog, and I take observability seriously — alerts that fire only when humans need to act.',
        'I\'d welcome the chance to discuss the role. Thank you for the consideration.',
      ],
      closing: 'Best regards,',
      signature: 'Your Name',
    },
    faq: [
      {
        question: 'Should I mention specific certs (AWS, GCP)?',
        answer: 'List the relevant ones once, briefly. Certs help at the resume screen but the cover letter should weight outcomes over credentials.',
      },
      {
        question: 'How much should a DevOps cover letter focus on incidents?',
        answer: 'One specific incident or migration story is enough. Show how you led, what you fixed, what you learned. More than one tips into "incident-response career" framing.',
      },
    ],
    relatedSlugs: ['software-engineer', 'data-analyst', 'project-manager'],
  },
  {
    slug: 'hr-manager',
    jobTitle: 'HR Manager',
    category: 'People & HR',
    experienceLevel: 'general',
    shortDescription:
      'An HR manager cover letter that demonstrates business partnership, employee-relations craft, and the metrics that show real impact on the workforce.',
    meta: {
      title: 'HR Manager Cover Letter Example & Writing Guide',
      description:
        'An HR manager cover letter example with section guidance, ATS keywords, and FAQ. Tailor to HRBP, people ops, or employee-relations roles with CareerThings AI.',
    },
    intro:
      'HR hiring managers want to see business partnership and judgment — not policy enforcement. The strongest cover letters demonstrate measurable impact on retention, engagement, or workforce planning, plus the ability to handle complex employee-relations situations with care.',
    hiringSignals: [
      'Retention or engagement metrics you moved',
      'Employee relations and investigation experience',
      'Business-partner fluency with line leaders',
      'Comfort with HRIS systems (Workday, BambooHR, Rippling, Gusto)',
      'Compliance instinct without being bureaucratic',
    ],
    commonKeywords: [
      'HRBP', 'employee relations', 'performance management', 'workforce planning',
      'compensation', 'benefits', 'Workday', 'BambooHR', 'engagement survey',
      'retention', 'DEI', 'compliance', 'EEOC', 'FMLA', 'ADA', 'onboarding',
    ],
    proTips: [
      'Lead with a workforce metric you moved — retention, engagement, time-to-fill.',
      'Mention the function you partnered with (engineering, sales) and the leader level.',
      'Reference the company\'s stage — pre-IPO HR is different from late-stage.',
      'Show judgment: handle a hard ER situation in one sentence, with discretion.',
    ],
    sampleLetter: {
      greeting: 'Dear Hiring Manager,',
      paragraphs: [
        'I\'ve built people functions at two pre-IPO companies and was specifically interested in {{Company}} because of the recent post your CPO wrote about scaling people partner depth without diluting culture. That\'s the work I most want to do next.',
        'I\'m an HR manager with seven years of experience, currently HRBP to a 180-person engineering org at a Series C SaaS company. In the last 18 months I led a manager-development program that lifted our engagement-survey "manager effectiveness" score from 67 to 81, partnered on a level-and-comp recalibration that resolved 12 escalated retention conversations, and led ER intake for the org including two complex investigations. I work daily in Workday and Lattice.',
        'What I\'d bring to {{Company}} is a strong business-partner orientation, judgment under ambiguity, and the discipline to follow up. I prefer to coach managers into hard conversations rather than have them myself, but I\'m also willing to step in when the situation calls for it.',
        'I\'d welcome the chance to discuss the role. Thank you for the consideration.',
      ],
      closing: 'Best regards,',
      signature: 'Your Name, SHRM-CP',
    },
    faq: [
      {
        question: 'Should HR cover letters mention employee-relations cases?',
        answer: 'Yes, but anonymized and high-level. "Led two complex investigations" is enough. Specifics belong in the interview.',
      },
      {
        question: 'How important are HR certifications (SHRM, PHR)?',
        answer: 'Helpful but not decisive. Mention them in your sign-off if you have them. The work matters more than the credential.',
      },
    ],
    relatedSlugs: ['recruiter', 'project-manager', 'business-analyst'],
  },
  {
    slug: 'recruiter',
    jobTitle: 'Recruiter',
    category: 'People & HR',
    experienceLevel: 'general',
    shortDescription:
      'A recruiter cover letter built around hiring metrics, sourcing craft, and the kind of candidate-experience focus that hiring managers actually want.',
    meta: {
      title: 'Recruiter Cover Letter Example & Writing Guide',
      description:
        'A recruiter cover letter example with writing guide, ATS keywords, and FAQ. Tailor to corporate, agency, or technical recruiting roles with CareerThings AI.',
    },
    intro:
      'Recruiting hiring managers want numbers: hires per quarter, time-to-fill, source-of-hire breakdown, candidate NPS. The best cover letters lead with one specific role you closed (anonymized, e.g., "Director of Engineering at a Series B SaaS"), then connect that win to the sourcing motion.',
    hiringSignals: [
      'Hires-per-quarter and time-to-fill numbers',
      'Sourcing depth — outbound, not just inbound conversion',
      'Tools fluency: Greenhouse, Lever, Ashby, LinkedIn Recruiter, Gem',
      'Hiring-manager partnership (you push back on bad JDs)',
      'Candidate NPS or experience metrics',
    ],
    commonKeywords: [
      'sourcing', 'time-to-fill', 'pipeline', 'Greenhouse', 'Lever', 'Ashby',
      'LinkedIn Recruiter', 'Gem', 'candidate experience', 'offer negotiation',
      'diversity sourcing', 'intake meeting', 'scorecard', 'ATS', 'closing',
    ],
    proTips: [
      'Lead with a specific role you closed and the time-to-fill.',
      'Mention sourcing channel mix — outbound vs. inbound.',
      'Reference one tool you\'re great at, not a list of ten you\'ve touched.',
      'Show how you partner with hiring managers (intake quality, scorecard discipline).',
    ],
    sampleLetter: {
      greeting: 'Dear Hiring Manager,',
      paragraphs: [
        'Last quarter I closed a Director of Engineering role for a Series B SaaS in 38 days — a position that had been open for four months before I picked it up. The role you posted has the same shape, and I\'d love to bring the same approach.',
        'I\'m a senior technical recruiter with five years of in-house experience, currently filling 12-15 engineering and product roles per quarter at a 400-person company. I source 60-70% of my pipeline outbound through LinkedIn Recruiter and Gem, with a 22% reply rate on my top sequences. I work in Ashby daily and run weekly intake meetings that have noticeably improved scorecard discipline across our hiring panels. Last year my candidate NPS averaged 9.1 across 142 closed-won feedback responses.',
        'What I\'d bring to {{Company}} is a sourcing motion that doesn\'t wait for inbound, the discipline to push back on hiring managers when the bar isn\'t calibrated, and the kind of candidate communication that closes offers (and earns referrals when they don\'t).',
        'I\'d welcome the chance to discuss the role. Thank you for the consideration.',
      ],
      closing: 'Best regards,',
      signature: 'Your Name',
    },
    faq: [
      {
        question: 'How specific should I be about candidates I\'ve placed?',
        answer: 'Anonymize but be specific on shape: "Director of Engineering at a Series B SaaS" beats "I closed a senior role." Confidentiality is respected, specificity isn\'t.',
      },
      {
        question: 'Should agency recruiters write differently than in-house?',
        answer: 'Yes. Agency cover letters lean more on placement volume and revenue per placement; in-house leans on stakeholder partnership and candidate experience over the long arc.',
      },
    ],
    relatedSlugs: ['hr-manager', 'sales-representative', 'project-manager'],
  },
  {
    slug: 'content-writer',
    jobTitle: 'Content Writer',
    category: 'Marketing & Communications',
    experienceLevel: 'general',
    shortDescription:
      'A content writer cover letter that lets the writing itself do the work — voice, clarity, and a clear theory of how content drives business results.',
    meta: {
      title: 'Content Writer Cover Letter Example & Writing Guide',
      description:
        'A content writer cover letter example with writing guide, ATS keywords, and FAQ. Tailor to SEO, B2B, or brand-content roles with CareerThings AI.',
    },
    intro:
      'A content writer cover letter has to be the single best writing sample a hiring manager has read that day. Voice, clarity, structure — they\'re all on the table. Use specifics: links to published work, traffic or pipeline numbers, and a sharp opinion about content strategy.',
    hiringSignals: [
      'Published work that demonstrates voice',
      'Traffic, ranking, or pipeline numbers',
      'Subject-matter range or depth (B2B SaaS, fintech, healthcare)',
      'SEO instincts without being SEO-poisoned',
      'Editorial discipline — outlines, briefs, deadlines',
    ],
    commonKeywords: [
      'content marketing', 'SEO', 'long-form', 'editorial calendar', 'briefing',
      'CMS', 'WordPress', 'Webflow', 'organic traffic', 'keyword research',
      'tone of voice', 'style guide', 'content strategy', 'thought leadership',
    ],
    proTips: [
      'Link to your strongest piece in the first paragraph.',
      'Pick a clip that matches the company\'s domain.',
      'Show traffic or business outcomes when you can.',
      'Make the cover letter itself good. It\'s the audition.',
    ],
    sampleLetter: {
      greeting: 'Dear Editor,',
      paragraphs: [
        'My favorite piece is at yourdomain.com/article-name — a 2,200-word teardown of a topic adjacent to {{Company}}\'s focus, which has held the #2 spot on Google for its target query for eight months and drove 1,400 trial signups in its first quarter.',
        'I\'m a content writer with four years of experience producing long-form for B2B SaaS, most recently as the second writer on a four-person content team. Last year I wrote 28 pieces averaging 2,000 words, two of which still rank #1 for their primary terms. I run my own outlines, work directly with subject-matter experts (without losing my voice in the edit), and treat content as a product surface — every piece ships with a thesis, a structure, and an obvious next step for the reader.',
        'What I\'d bring to {{Company}} is range, voice, and the discipline to file clean drafts on schedule. I read the field carefully — your last three Substack posts and the recent product update on positioning are the reason I\'m here.',
        'I\'d welcome the chance to talk through the role. Thank you for the consideration.',
      ],
      closing: 'Best regards,',
      signature: 'Your Name',
    },
    faq: [
      {
        question: 'How long should a content writer cover letter be?',
        answer: '250-350 words. The cover letter is the writing audition — short and tight beats comprehensive.',
      },
      {
        question: 'Should I attach clips or link them?',
        answer: 'Link them, in the first paragraph. Don\'t make hiring managers hunt.',
      },
    ],
    relatedSlugs: ['marketing-manager', 'graphic-designer', 'ux-designer'],
  },
  {
    slug: 'executive-assistant',
    jobTitle: 'Executive Assistant',
    category: 'Operations & Project Management',
    experienceLevel: 'general',
    shortDescription:
      'An EA cover letter that demonstrates discretion, calendar craft, and the strategic-partner orientation that the strongest executives want.',
    meta: {
      title: 'Executive Assistant Cover Letter Example & Writing Guide',
      description:
        'An executive assistant cover letter example with writing guide, ATS keywords, and FAQ. Tailor to C-suite, founder, or chief-of-staff-track roles with CareerThings AI.',
    },
    intro:
      'EA hiring managers — and the executives they support — want to see judgment, discretion, and proactive ownership. The strongest cover letters move past "highly organized" cliches and demonstrate the strategic partnering that separates a great EA from a calendar-keeper.',
    hiringSignals: [
      'Years supporting a specific exec level (C-suite, founder, VP)',
      'Calendar craft for high-volume exec calendars',
      'Discretion with sensitive information',
      'Travel and event planning experience',
      'Tools fluency: Google Workspace, Slack, Notion, expense systems',
    ],
    commonKeywords: [
      'calendar management', 'travel coordination', 'expense management',
      'board meeting', 'executive support', 'Google Workspace', 'Outlook',
      'Concur', 'Slack', 'Notion', 'meeting prep', 'gatekeeping', 'event planning',
    ],
    proTips: [
      'Lead with the level of exec you supported and for how long.',
      'Show one specific moment of judgment — a hard scheduling call, a discreet save.',
      'Mention calendar volume and travel volume.',
      'Skip "Type-A" — it\'s a cliche. Show, don\'t label.',
    ],
    sampleLetter: {
      greeting: 'Dear Hiring Manager,',
      paragraphs: [
        'I\'ve supported a Series C SaaS CEO for the last four years — a 60-meeting-per-week calendar, two board meetings per quarter, ~40 travel segments per year, and the kind of fast-moving inbox that needs real triage rather than just flagging.',
        'In that role I\'ve owned executive calendaring, board meeting prep (deck logistics, travel for nine directors, dinner planning), expense management, and the small-but-load-bearing tasks like onboarding three rounds of executive hires. Last year I rebuilt our internal exec-team meeting cadence end-to-end, which cut leadership-meeting time by 30% with no loss of decisions made. I work fluently in Google Workspace, Slack, Notion, Concur, and Brex.',
        'What I\'d bring to {{Company}} is judgment, discretion, and a working style that anticipates rather than reacts. I read the room well and I close the loop on every commitment.',
        'I\'d welcome the chance to discuss the role. Thank you for the consideration.',
      ],
      closing: 'Best regards,',
      signature: 'Your Name',
    },
    faq: [
      {
        question: 'Should an EA cover letter mention specific executives by name?',
        answer: 'Anonymize. "Series C SaaS CEO" or "VP of Engineering at a 400-person SaaS" is specific enough. Naming executives without permission is a discretion red flag.',
      },
      {
        question: 'How is a chief-of-staff cover letter different?',
        answer: 'Chief of staff leans on strategic projects and operational ownership; EA leans on calendar/travel/communication craft. There\'s overlap — match the emphasis to the JD.',
      },
    ],
    relatedSlugs: ['project-manager', 'hr-manager', 'customer-service-representative'],
  },
  {
    slug: 'electrician',
    jobTitle: 'Electrician',
    category: 'Skilled Trades',
    experienceLevel: 'general',
    shortDescription:
      'An electrician cover letter that leads with license status, project complexity, and the safety record contractors and facility managers actually screen for.',
    meta: {
      title: 'Electrician Cover Letter Example & Writing Guide',
      description:
        'A polished electrician cover letter example with writing guide, ATS keywords, and FAQ. Tailor to residential, commercial, or industrial roles with CareerThings AI.',
    },
    intro:
      'Electrician hiring screens on three things first: license status, project complexity, and safety record. The strongest cover letters lead with all three in the first paragraph and connect them to the specific work environment in the JD.',
    hiringSignals: [
      'Active state license (Journeyman or Master) and union status if relevant',
      'Project complexity — voltage range, system type, building type',
      'Safety record — OSHA hours, no recordable incidents, lockout/tagout discipline',
      'Code fluency — current NEC edition, local amendments',
      'Tools and equipment fluency, especially diagnostic equipment',
    ],
    commonKeywords: [
      'Journeyman', 'Master Electrician', 'NEC', 'OSHA', 'low-voltage',
      'high-voltage', 'three-phase', 'PLC', 'conduit', 'panel installation',
      'troubleshooting', 'lockout/tagout', 'arc flash', 'load calculation',
      'commercial', 'industrial', 'residential', 'service work',
    ],
    proTips: [
      'Lead with license type (Journeyman/Master) and state in the first sentence.',
      'Quantify project scale: voltage, square footage, dollar value when appropriate.',
      'Mention specific safety record metrics (zero-incident hours).',
      'Match the work environment to the JD: residential vs. commercial vs. industrial cultures differ.',
    ],
    sampleLetter: {
      greeting: 'Dear Hiring Manager,',
      paragraphs: [
        'I\'m a Master Electrician licensed in {{State}} with 12 years of commercial and light-industrial experience, applying for the role at {{Company}}. The healthcare-facility scope you\'ve described is exactly where I\'ve spent the last four years — and where the code-compliance discipline matters most.',
        'In my current role I lead a four-person crew on commercial fitouts ranging from $200K to $1.8M. Last year we completed a 38,000 sq ft outpatient facility — full panel installation, three-phase service upgrade, low-voltage data infrastructure, and emergency lighting — on schedule and 6% under budget. I maintain current NEC and have led arc-flash safety training for our team for three years running, with zero recordable incidents across 14,000 crew-hours.',
        'What I\'d bring to {{Company}} is the kind of clean code-compliance work healthcare and institutional clients require, plus a track record of bringing crews along on safety culture without slowing them down. I\'m comfortable on-call for service work and willing to take on lead-foreman scope.',
        'I\'d welcome the chance to discuss the role. Thank you for the consideration.',
      ],
      closing: 'Best regards,',
      signature: 'Your Name, Master Electrician',
    },
    faq: [
      {
        question: 'Should I attach my license to the cover letter?',
        answer: 'Reference license status in the cover letter; attach the license itself only if the application asks. Most contractors verify before hiring.',
      },
      {
        question: 'How is a residential electrician cover letter different from commercial?',
        answer: 'Residential leans more on customer-service and small-team scope; commercial leans on crew leadership, project size, and code-compliance rigor. Match the JD.',
      },
    ],
    relatedSlugs: ['plumber', 'mechanical-engineer', 'project-manager'],
  },
  {
    slug: 'plumber',
    jobTitle: 'Plumber',
    category: 'Skilled Trades',
    experienceLevel: 'general',
    shortDescription:
      'A plumber cover letter that leads with license, project type fluency, and the customer-service skills service-call hiring managers screen for.',
    meta: {
      title: 'Plumber Cover Letter Example & Writing Guide',
      description:
        'A polished plumber cover letter example with writing guide, keywords, and FAQ. Tailor to residential service, new construction, or commercial roles with CareerThings AI.',
    },
    intro:
      'Plumber hiring is split between three buckets — residential service, new construction, and commercial — each with its own cultural and technical norms. The strongest cover letters lead with license status, name the bucket clearly, and back it up with one specific repair or installation story.',
    hiringSignals: [
      'Active Journeyman or Master Plumber license',
      'Bucket fluency: service vs. construction vs. commercial',
      'Diagnostic skills (especially for service work)',
      'Customer communication for residential service',
      'Code fluency — UPC, IPC, local amendments',
    ],
    commonKeywords: [
      'Journeyman Plumber', 'Master Plumber', 'UPC', 'IPC', 'rough-in',
      'service work', 'pipefitting', 'PEX', 'copper', 'cast iron',
      'sewer line', 'water heater', 'fixture installation', 'hydrojetting',
      'backflow prevention', 'gas lines', 'commercial', 'residential',
    ],
    proTips: [
      'Lead with license and state in the first sentence.',
      'Pick a bucket — service, construction, or commercial — and stay in it.',
      'For service: emphasize customer communication and turnaround time.',
      'Quantify work: jobs per week, tickets resolved, rough-in scale.',
    ],
    sampleLetter: {
      greeting: 'Dear Hiring Manager,',
      paragraphs: [
        'I\'m a Journeyman Plumber licensed in {{State}} with seven years of residential service experience, applying for the position at {{Company}}. Your shop\'s reputation for fast diagnostic-first service is the reason I\'m specifically interested.',
        'In my current role I run an average of 6-8 service calls per day across a 35-mile territory, with a 92% first-trip resolution rate on the most common jobs (water heaters, drain clears, fixture replacement). I\'m comfortable on hydrojetting, sewer line video, and tankless install. Last year I led the team\'s NPS in customer-rated communication — clear ETAs, written estimates before work starts, photos of every repair.',
        'What I\'d bring to {{Company}} is the same approach: diagnostic discipline, clean truck and uniform, and the kind of customer communication that turns one service call into recurring household work.',
        'I\'d welcome the chance to discuss the role. Thank you for the consideration.',
      ],
      closing: 'Best regards,',
      signature: 'Your Name, Journeyman Plumber',
    },
    faq: [
      {
        question: 'How long should a plumber cover letter be?',
        answer: '200-300 words. Hiring managers in trades read fast — density and license-first framing wins.',
      },
      {
        question: 'Should I include a list of every job type I\'ve handled?',
        answer: 'No. Pick the 3-4 most relevant to the JD. Save the full list for the resume.',
      },
    ],
    relatedSlugs: ['electrician', 'mechanical-engineer', 'project-manager'],
  },
  {
    slug: 'social-worker',
    jobTitle: 'Social Worker',
    category: 'Healthcare & Social Services',
    experienceLevel: 'general',
    shortDescription:
      'A social worker cover letter that leads with licensure, population specialty, and the kind of ethical, evidence-based practice agency directors screen for.',
    meta: {
      title: 'Social Worker Cover Letter Example & Writing Guide',
      description:
        'A polished social worker cover letter example with writing guide, ATS keywords, and FAQ. Tailor to clinical, school, or community roles with CareerThings AI.',
    },
    intro:
      'Social work hiring depends heavily on licensure and population specialty (clinical, school, child welfare, geriatric, etc.). The strongest cover letters open with both, anchor on one specific case-work story (anonymized), and demonstrate the ethical and evidence-based practice agencies screen for.',
    hiringSignals: [
      'License level: LMSW, LCSW, LICSW, etc., and state',
      'Population specialty match',
      'Evidence-based practice fluency (CBT, DBT, motivational interviewing)',
      'Documentation and case-management discipline',
      'Multidisciplinary team experience',
    ],
    commonKeywords: [
      'LMSW', 'LCSW', 'LICSW', 'MSW', 'CBT', 'DBT', 'motivational interviewing',
      'trauma-informed', 'case management', 'biopsychosocial assessment',
      'EHR', 'CPS', 'discharge planning', 'crisis intervention',
      'substance use', 'mental health', 'IEP', 'multidisciplinary team',
    ],
    proTips: [
      'Lead with license level and state in the first sentence.',
      'Anchor with one client story (anonymized) that demonstrates clinical judgment.',
      'Mention specific evidence-based modalities you use.',
      'Show your documentation and team-collaboration discipline.',
    ],
    sampleLetter: {
      greeting: 'Dear Hiring Manager,',
      paragraphs: [
        'I\'m an LCSW licensed in {{State}} with five years of community mental health experience, applying for the clinical role at {{Company}}. The trauma-informed, evidence-based approach you describe is exactly the practice I\'ve built my career around.',
        'In my current role I carry a caseload of 28 adults with co-occurring mood and substance-use disorders. I provide individual therapy using CBT and motivational interviewing, complete biopsychosocial assessments, and partner closely with our medication-management team and external support services. Last year I co-led the agency\'s rollout of a trauma-informed care framework that re-trained 14 clinicians and reduced post-intake drop-out by 22%.',
        'What I\'d bring to {{Company}} is the dual fluency of strong clinical practice and discipline around documentation, ethics, and multi-system coordination. I\'m comfortable in Epic and Salesforce-based case-management systems and take supervision seriously as a growth practice.',
        'I\'d welcome the chance to discuss the role. Thank you for the consideration.',
      ],
      closing: 'Sincerely,',
      signature: 'Your Name, LCSW',
    },
    faq: [
      {
        question: 'Should I name specific therapeutic modalities?',
        answer: 'Yes — but only ones you\'re genuinely trained in and use. Listing modalities you don\'t practice is detectable in the interview.',
      },
      {
        question: 'How do I write about clients while protecting confidentiality?',
        answer: 'De-identify completely: no names, no identifying details. "A 34-year-old client with a history of trauma" is appropriate; specific details are not.',
      },
    ],
    relatedSlugs: ['registered-nurse', 'teacher', 'customer-service-representative'],
  },
  {
    slug: 'dental-hygienist',
    jobTitle: 'Dental Hygienist',
    category: 'Healthcare',
    experienceLevel: 'general',
    shortDescription:
      'A dental hygienist cover letter that leads with license, patient volume, and the chair-side skills practice managers actually screen for.',
    meta: {
      title: 'Dental Hygienist Cover Letter Example & Writing Guide',
      description:
        'A polished dental hygienist cover letter example with writing guide, keywords, and FAQ. Tailor to general, periodontal, or pediatric practice roles with CareerThings AI.',
    },
    intro:
      'Dental hygienist hiring focuses on license status, daily patient volume, and chair-side communication craft. The strongest cover letters lead with all three and connect to the specific practice setting in the JD.',
    hiringSignals: [
      'Active RDH license + state',
      'Patient throughput (typical patients per day)',
      'Comfort with adjunctive procedures (fluoride, sealants, perio)',
      'Imaging fluency (digital, panoramic, CBCT if relevant)',
      'Patient communication and education',
    ],
    commonKeywords: [
      'RDH', 'dental hygienist', 'scaling', 'root planing', 'prophylaxis',
      'periodontal', 'fluoride', 'sealants', 'digital radiography',
      'panoramic', 'CBCT', 'patient education', 'oral cancer screening',
      'CDT codes', 'soft-tissue management', 'Dentrix', 'Eaglesoft', 'Open Dental',
    ],
    proTips: [
      'Lead with RDH license and state in the first sentence.',
      'State patient throughput per day — practice managers screen on this.',
      'Mention specific software (Dentrix, Eaglesoft, Open Dental).',
      'Reference patient-education or community-engagement work for general practice.',
    ],
    sampleLetter: {
      greeting: 'Dear Hiring Manager,',
      paragraphs: [
        'I\'m an RDH licensed in {{State}} with four years of general-practice experience, applying for the position at {{Company}}. The practice\'s focus on periodontal-health programs is exactly where I\'ve been deepening my own work.',
        'In my current role I see 8-10 patients per day on a mix of prophy and full-mouth periodontal scaling, with comfort across digital radiography, sealants, fluoride application, and oral cancer screening. I work daily in Dentrix, partner closely with our dentists on treatment planning, and have led patient-education materials our practice now uses across the front desk.',
        'What I\'d bring to {{Company}} is reliable chair-side technique paired with patient communication that drives recall compliance and case-acceptance for the dentists. I\'m steady, on-time, and easy to work with on a tight schedule.',
        'I\'d welcome the chance to discuss the role. Thank you for the consideration.',
      ],
      closing: 'Best regards,',
      signature: 'Your Name, RDH',
    },
    faq: [
      {
        question: 'Should I mention specific patient counts?',
        answer: 'Yes — practice managers screen heavily on chair productivity. "8-10 patients per day" or "30+ recall patients per week" gives them a concrete read.',
      },
      {
        question: 'Is dental software fluency important?',
        answer: 'Yes. Mention the system from the JD verbatim if you\'re fluent in it. Dentrix, Eaglesoft, and Open Dental are the most common.',
      },
    ],
    relatedSlugs: ['registered-nurse', 'customer-service-representative'],
  },
  {
    slug: 'real-estate-agent',
    jobTitle: 'Real Estate Agent',
    category: 'Sales & Business Development',
    experienceLevel: 'general',
    shortDescription:
      'A real estate agent cover letter built around licensed transaction volume, market specialty, and the client-acquisition skills brokerages screen for.',
    meta: {
      title: 'Real Estate Agent Cover Letter Example & Writing Guide',
      description:
        'A polished real estate agent cover letter example with writing guide, keywords, and FAQ. Tailor to brokerage, team, or boutique roles with CareerThings AI.',
    },
    intro:
      'Real estate hiring (or brokerage placement) screens on transaction volume, market specialty, and client-acquisition discipline. The strongest cover letters lead with annual volume in dollars and number of transactions, then back it with one specific deal story.',
    hiringSignals: [
      'Active state license and brokerage relationship',
      'Annual transaction count and dollar volume',
      'Market specialty (luxury, first-time buyer, investor, commercial)',
      'Client-acquisition channels — sphere, online, open houses, referrals',
      'CRM and transaction-management fluency',
    ],
    commonKeywords: [
      'real estate agent', 'Realtor', 'MLS', 'GCI', 'transaction volume',
      'buyer\'s agent', 'listing agent', 'CMA', 'Zillow', 'follow-up boss',
      'KW Command', 'kvCORE', 'open house', 'farm area', 'referral',
      'investment property', 'luxury', 'first-time buyer', 'commission split',
    ],
    proTips: [
      'Lead with annual transaction count and dollar volume.',
      'Mention market specialty explicitly — luxury, first-time, commercial.',
      'Show one deal story that demonstrates negotiation or problem-solving.',
      'Reference CRM and lead-management discipline.',
    ],
    sampleLetter: {
      greeting: 'Dear Broker,',
      paragraphs: [
        'I\'m a licensed real estate agent in {{State}} with four years and 38 closed transactions totaling $14.2M in volume, considering a brokerage move and specifically interested in joining {{Company}}. The team\'s focus on first-time buyer education aligns directly with the niche I\'ve built.',
        'My business is roughly 70% buyer-side, with most of the pipeline coming from a sphere-based referral motion plus a monthly first-time-buyer education series I run on Instagram. Last year I closed an off-market sale to a young couple for $580K — full-cycle, including inspection negotiations that recovered $14K in seller credits and a tight 18-day close. I work daily in Follow Up Boss, run my farm area discipline weekly, and treat client communication as the primary product.',
        'What I\'d bring to {{Company}} is a steady pipeline, strong client-care reviews (averaging 4.9 stars across 28 reviews), and a working style that fits team-based brokerages.',
        'I\'d welcome the chance to discuss commission structure and team fit. Thank you for the consideration.',
      ],
      closing: 'Best regards,',
      signature: 'Your Name',
    },
    faq: [
      {
        question: 'Is a "cover letter" the right term in real estate?',
        answer: 'Often it\'s a brokerage interview letter or a "join our team" pitch. Same structure: lead with metrics, anchor with a story, close with fit.',
      },
      {
        question: 'Should I include client testimonials?',
        answer: 'Reference review averages (e.g., "4.9 stars across 28 reviews") in the cover letter. Save full quotes for your portfolio or website.',
      },
    ],
    relatedSlugs: ['sales-representative', 'marketing-manager'],
  },
  {
    slug: 'mechanical-engineer',
    jobTitle: 'Mechanical Engineer',
    category: 'Engineering & Technology',
    experienceLevel: 'general',
    shortDescription:
      'A mechanical engineer cover letter built around design ownership, production outcomes, and the cross-disciplinary collaboration ME hiring managers screen for.',
    meta: {
      title: 'Mechanical Engineer Cover Letter Example & Writing Guide',
      description:
        'A polished mechanical engineer cover letter example with writing guide, ATS keywords, and FAQ. Tailor to product design, manufacturing, or HVAC roles with CareerThings AI.',
    },
    intro:
      'Mechanical engineer hiring screens on design ownership, production outcomes, and cross-disciplinary collaboration with EE, manufacturing, and quality teams. The strongest cover letters lead with one shipped product, the design responsibility you owned, and the measurable outcome.',
    hiringSignals: [
      'Shipped product with design ownership',
      'CAD fluency (SolidWorks, Creo, NX) at advanced level',
      'GD&T literacy and tolerance analysis',
      'DFM/DFA — design for manufacturing or assembly',
      'Cross-disciplinary collaboration with EE, manufacturing, QA',
    ],
    commonKeywords: [
      'SolidWorks', 'Creo', 'NX', 'CAD', 'GD&T', 'tolerance analysis',
      'DFM', 'DFA', 'FEA', 'CFD', 'PLM', 'BOM', 'manufacturing', 'injection molding',
      'sheet metal', 'machining', 'prototyping', 'P.E.', 'FMEA', 'six sigma',
    ],
    proTips: [
      'Lead with one shipped product — the design ownership and outcome.',
      'Mention the CAD tool from the JD verbatim.',
      'Quantify production outcomes: yield, cost reduction, throughput.',
      'Mention cross-disciplinary work with EE and manufacturing.',
    ],
    sampleLetter: {
      greeting: 'Dear Hiring Manager,',
      paragraphs: [
        'I\'ve spent the last four years designing injection-molded consumer products at a Series C hardware company, and the role you\'ve posted maps directly to that experience. The product line you described — outdoor consumer electronics — is exactly where I want to keep working.',
        'In my current role I owned the mechanical design of three product launches totaling 380K units shipped. The most recent — a ruggedized outdoor speaker — went from concept to production in 11 months, with a final cost-of-goods 18% below target through DFM iteration with our contract manufacturer. I work daily in SolidWorks and PDM, lead our DFMEA reviews, and have run tolerance analyses that flagged two assembly issues during prototyping (saved an estimated $80K in tooling rework).',
        'What I\'d bring to {{Company}} is the rigor of careful design paired with the speed startups need. I\'m comfortable in factories on FAI walkthroughs, fluent with our EE and firmware partners, and I take cost and reliability seriously from the first sketch.',
        'I\'d welcome the chance to discuss the role. Thank you for the consideration.',
      ],
      closing: 'Best regards,',
      signature: 'Your Name',
    },
    faq: [
      {
        question: 'Should I mention my CAD software?',
        answer: 'Yes — match the JD. SolidWorks, Creo, and NX are not interchangeable from a hiring perspective; the ATS does exact matching on tool names.',
      },
      {
        question: 'Is a P.E. license important for ME cover letters?',
        answer: 'Depends on industry. Required for civil and structural; uncommon for product design and consumer hardware. Always check the JD.',
      },
    ],
    relatedSlugs: ['software-engineer', 'devops-engineer', 'project-manager'],
  },
  {
    slug: 'paralegal',
    jobTitle: 'Paralegal',
    category: 'Legal',
    experienceLevel: 'general',
    shortDescription:
      'A paralegal cover letter that leads with practice-area specialty, case-management fluency, and the document-production discipline attorneys screen for.',
    meta: {
      title: 'Paralegal Cover Letter Example & Writing Guide',
      description:
        'A polished paralegal cover letter example with writing guide, keywords, and FAQ. Tailor to litigation, corporate, or family law roles with CareerThings AI.',
    },
    intro:
      'Paralegal hiring screens on practice-area specialty (litigation, corporate, IP, family) and document-production discipline. The strongest cover letters lead with practice area, name the specific document types and case-management software you use, and demonstrate the kind of attorney-supporting reliability that makes a paralegal valuable.',
    hiringSignals: [
      'Practice area match — litigation, corporate, IP, family, real estate',
      'Document-production fluency (pleadings, discovery, contracts, closings)',
      'Case management software (Clio, MyCase, Relativity, NetDocuments)',
      'E-filing and court rules fluency',
      'Reliability under deadline pressure',
    ],
    commonKeywords: [
      'paralegal', 'legal assistant', 'litigation', 'discovery', 'pleadings',
      'depositions', 'e-discovery', 'Relativity', 'Clio', 'MyCase',
      'NetDocuments', 'Westlaw', 'Lexis', 'Bates stamping', 'cite-checking',
      'contract review', 'closing binder', 'court filing', 'PACER', 'CM/ECF',
    ],
    proTips: [
      'Lead with practice area in the first sentence.',
      'Name specific document types you produce (motions, discovery responses, contracts).',
      'Mention case-management software from the JD verbatim.',
      'Demonstrate deadline reliability with a specific story.',
    ],
    sampleLetter: {
      greeting: 'Dear Hiring Attorney,',
      paragraphs: [
        'I\'m a paralegal with six years of complex commercial litigation experience, currently supporting a partner-led team at a mid-size firm and applying for the position at {{Company}}. Your firm\'s reputation in healthcare-litigation defense is the reason I\'m specifically interested.',
        'In my current role I support three attorneys on cases ranging from $500K to $14M in dispute. I draft routine pleadings, manage discovery production (last year: 220K pages across two MDL cases), prepare deposition binders, and run our e-discovery work in Relativity. I\'m fluent with PACER and state CM/ECF systems, and I\'ve handled summary judgment binder prep on a tight 10-day window twice in the last year.',
        'What I\'d bring to {{Company}} is the kind of high-output, low-error production support partners rely on, plus a working style that pairs initiative with respect for the attorney-client privilege boundaries paralegals must keep. I treat deadlines as fixed and triple-check filings before they go out the door.',
        'I\'d welcome the chance to discuss the role. Thank you for the consideration.',
      ],
      closing: 'Sincerely,',
      signature: 'Your Name',
    },
    faq: [
      {
        question: 'Should a paralegal cover letter mention specific case names?',
        answer: 'No. Reference case types, dollar values, and outcomes anonymized. Naming clients or matters violates confidentiality.',
      },
      {
        question: 'How important are paralegal certifications?',
        answer: 'Vary by employer. Federal certifications (CP, ACP) help; state certifications matter more in some markets. Mention any current certifications once.',
      },
    ],
    relatedSlugs: ['accountant', 'business-analyst', 'project-manager'],
  },
  {
    slug: 'pharmacist',
    jobTitle: 'Pharmacist',
    category: 'Healthcare',
    experienceLevel: 'general',
    shortDescription:
      'A pharmacist cover letter built around licensure, clinical specialty, and the patient-counseling and medication-safety discipline employers actually screen for.',
    meta: {
      title: 'Pharmacist Cover Letter Example & Writing Guide',
      description:
        'A polished pharmacist cover letter example with writing guide, keywords, and FAQ. Tailor to retail, hospital, or clinical roles with CareerThings AI.',
    },
    intro:
      'Pharmacist hiring screens on licensure, setting fluency (retail, hospital, clinical, ambulatory), and the medication-safety discipline that defines the role. The strongest cover letters lead with all three.',
    hiringSignals: [
      'Active state license and PharmD',
      'Setting match (retail, hospital, ambulatory, clinical)',
      'Patient-counseling and MTM experience',
      'EHR and pharmacy software fluency',
      'Specialty certifications (BCPS, BCACP, etc.) where relevant',
    ],
    commonKeywords: [
      'PharmD', 'RPh', 'BCPS', 'BCACP', 'medication therapy management',
      'MTM', 'patient counseling', 'immunizations', 'compounding',
      'Epic', 'Pyxis', 'Omnicell', 'CPOE', 'sterile compounding', 'USP 797',
      'antimicrobial stewardship', 'discharge medication reconciliation',
    ],
    proTips: [
      'Lead with PharmD year and state license in the first sentence.',
      'Specify setting (retail, hospital, ambulatory) and patient volume.',
      'Mention specialty certifications once.',
      'Reference EHR and pharmacy software from the JD.',
    ],
    sampleLetter: {
      greeting: 'Dear Hiring Manager,',
      paragraphs: [
        'I\'m a PharmD licensed in {{State}} with five years of hospital pharmacy experience, applying for the inpatient pharmacist position at {{Company}}. Your hospital\'s antimicrobial stewardship program — and the published outcomes around it — are the reason I\'m specifically interested.',
        'In my current role I support a 320-bed community hospital, verifying 350-450 orders per shift with active CPOE through Epic. I rotate through medication reconciliation, sterile compounding (USP 797 compliant), and our antimicrobial stewardship rounds twice weekly. Last year I co-led a pharmacist-driven discharge medication reconciliation pilot that reduced 30-day readmissions on cardiology by 14% over six months.',
        'What I\'d bring to {{Company}} is the dual fluency of strong clinical practice and the team-based discipline hospital pharmacy demands. I\'m current with BCPS recertification, comfortable mentoring residents, and committed to the safety-first culture good hospital pharmacy is built around.',
        'I\'d welcome the chance to discuss the role. Thank you for the consideration.',
      ],
      closing: 'Sincerely,',
      signature: 'Your Name, PharmD, BCPS',
    },
    faq: [
      {
        question: 'How important is patient counseling experience for retail pharmacist roles?',
        answer: 'Very. Lead with daily patient volume and demonstrate one MTM-style story. Retail screens heavily on customer-facing discipline.',
      },
      {
        question: 'Should I list every certification?',
        answer: 'List the JD-relevant ones. BCPS, BCACP, BCOP, etc. add weight in their respective specialties. Save full credential lists for your CV.',
      },
    ],
    relatedSlugs: ['registered-nurse', 'social-worker'],
  },
  {
    slug: 'physical-therapist',
    jobTitle: 'Physical Therapist',
    category: 'Healthcare',
    experienceLevel: 'general',
    shortDescription:
      'A physical therapist cover letter that leads with licensure, setting specialty, and the outcome-focused, evidence-based practice clinic directors screen for.',
    meta: {
      title: 'Physical Therapist Cover Letter Example & Writing Guide',
      description:
        'A polished physical therapist cover letter example with writing guide, keywords, and FAQ. Tailor to outpatient, inpatient, or specialty roles with CareerThings AI.',
    },
    intro:
      'Physical therapist hiring screens on licensure, setting fluency, and the outcomes-driven, evidence-based practice that separates strong PTs. The strongest cover letters lead with all three and demonstrate measurable patient outcomes.',
    hiringSignals: [
      'Active state PT license + DPT',
      'Setting match (outpatient orthopedic, inpatient acute, neuro, peds, sports)',
      'Caseload and productivity expectations',
      'Specialty certifications (OCS, SCS, NCS) where relevant',
      'EMR fluency (WebPT, Raintree, Epic)',
    ],
    commonKeywords: [
      'DPT', 'PT', 'OCS', 'SCS', 'NCS', 'manual therapy', 'therapeutic exercise',
      'gait training', 'post-op', 'rotator cuff', 'ACL', 'lumbar', 'cervical',
      'WebPT', 'Raintree', 'Epic', 'evidence-based practice', 'caseload',
      'productivity', 'discharge planning', 'home exercise program',
    ],
    proTips: [
      'Lead with DPT year, license state, and setting.',
      'Mention typical caseload (patients per day) and any specialty certifications.',
      'Reference one specific patient outcome (anonymized).',
      'Match the EMR from the JD.',
    ],
    sampleLetter: {
      greeting: 'Dear Hiring Manager,',
      paragraphs: [
        'I\'m a DPT licensed in {{State}} with four years of outpatient orthopedic experience, applying for the position at {{Company}}. Your clinic\'s focus on post-surgical rehabilitation aligns directly with the work I most enjoy.',
        'In my current role I see 11-13 patients per day across post-operative orthopedic and chronic musculoskeletal cases. My strongest specialty area is post-surgical rotator-cuff and ACL rehabilitation — last year I tracked outcomes across 38 ACL patients with an average return-to-sport at 7.2 months and 92% of patients meeting benchmark functional testing at discharge. I work daily in WebPT, partner with our orthopedic surgeon group on protocols, and have completed coursework toward OCS certification.',
        'What I\'d bring to {{Company}} is evidence-based, manual-therapy-grounded practice paired with strong patient communication and adherence-focused home exercise programs. I\'m calm under productivity pressure and consistent across documentation.',
        'I\'d welcome the chance to discuss the role. Thank you for the consideration.',
      ],
      closing: 'Sincerely,',
      signature: 'Your Name, DPT',
    },
    faq: [
      {
        question: 'Should I include patient outcome metrics?',
        answer: 'Yes — anonymized. Average return-to-activity timelines, functional outcome scores, or adherence rates demonstrate evidence-based practice.',
      },
      {
        question: 'How important is specialty certification (OCS, SCS, NCS)?',
        answer: 'Helpful but not required. Mention current status (e.g., "OCS coursework in progress, exam scheduled Q2") to show momentum.',
      },
    ],
    relatedSlugs: ['registered-nurse', 'pharmacist', 'social-worker'],
  },
  {
    slug: 'operations-manager',
    jobTitle: 'Operations Manager',
    category: 'Operations & Project Management',
    experienceLevel: 'general',
    shortDescription:
      'An operations manager cover letter built around process improvement, team leadership, and the kind of measurable efficiency outcomes executives screen for.',
    meta: {
      title: 'Operations Manager Cover Letter Example & Writing Guide',
      description:
        'A polished operations manager cover letter example with writing guide, ATS keywords, and FAQ. Tailor to manufacturing, services, or tech ops with CareerThings AI.',
    },
    intro:
      'Operations manager hiring screens on process improvement outcomes, team leadership, and the ability to make complex systems run smoothly. The strongest cover letters lead with one specific operational improvement and the measurable business outcome.',
    hiringSignals: [
      'Process improvement with measurable outcomes',
      'Team size and reporting structure',
      'KPI ownership at the operational level',
      'Comfort with operational software stacks',
      'Cross-functional partnership with finance, sales, supply chain',
    ],
    commonKeywords: [
      'operations management', 'process improvement', 'lean', 'six sigma',
      'KPI', 'SOP', 'workflow optimization', 'inventory', 'forecasting',
      'capacity planning', 'cross-functional', 'ERP', 'NetSuite', 'SAP',
      'continuous improvement', 'kaizen', 'change management',
    ],
    proTips: [
      'Lead with one specific process improvement and its measurable outcome.',
      'State team size and reporting structure clearly.',
      'Quantify cost savings, throughput improvements, or cycle-time reductions.',
      'Mention operational tools and ERP fluency.',
    ],
    sampleLetter: {
      greeting: 'Dear Hiring Manager,',
      paragraphs: [
        'I\'ve spent the last five years running operations at a 200-person services company, and the role you\'ve posted — operations leadership during scale-up — is exactly the work I\'ve been doing. Specifically, the rebuild of the customer onboarding workflow described in your post mirrors a project I led last year.',
        'In my current role I lead a 14-person team across customer onboarding, vendor management, and internal IT. Last year I led the redesign of our customer onboarding workflow, cutting time-to-first-value from 14 days to 6 and improving NPS at the 30-day mark from 42 to 61. The work involved redesigning intake forms, automating handoffs in Salesforce, and re-training the support team — all while running daily ops without a hiring freeze on the customer-facing side.',
        'What I\'d bring to {{Company}} is rigor on processes paired with the discipline to coach a team through change. I read SOPs as living documents, push back on initiatives without measurable outcomes, and partner closely with finance on the cost side of every decision.',
        'I\'d welcome the chance to discuss the role. Thank you for the consideration.',
      ],
      closing: 'Best regards,',
      signature: 'Your Name',
    },
    faq: [
      {
        question: 'Is Lean or Six Sigma certification required?',
        answer: 'Not always — but mentioning a Green Belt or Black Belt signals process discipline. Also relevant: PMP, Agile, change-management certifications.',
      },
      {
        question: 'How is operations manager different from project manager?',
        answer: 'Project managers run discrete initiatives with start and end dates; operations managers run ongoing functions. Cover letters should match the lens accordingly.',
      },
    ],
    relatedSlugs: ['project-manager', 'business-analyst', 'product-manager'],
  },
  {
    slug: 'copywriter',
    jobTitle: 'Copywriter',
    category: 'Marketing & Communications',
    experienceLevel: 'general',
    shortDescription:
      'A copywriter cover letter that lets the writing itself audition — voice, brevity, and a clear theory of how copy drives business results.',
    meta: {
      title: 'Copywriter Cover Letter Example & Writing Guide',
      description:
        'A polished copywriter cover letter example with writing guide, ATS keywords, and FAQ. Tailor to brand, performance, or agency roles with CareerThings AI.',
    },
    intro:
      'A copywriter cover letter is the audition. Voice, structure, brevity — they\'re all on the table. The strongest copywriters lead with one campaign that demonstrates voice and outcome, link to portfolio in the first paragraph, and skip every word that isn\'t earning its place.',
    hiringSignals: [
      'A portfolio that demonstrates voice and range',
      'Conversion or revenue outcomes',
      'Brand consistency across channels',
      'Comfort with briefs and editorial feedback',
      'Range — short-form (ads, headlines) AND long-form',
    ],
    commonKeywords: [
      'copywriting', 'brand voice', 'long-form', 'short-form', 'headlines',
      'landing page', 'A/B testing', 'CRO', 'tone of voice', 'editorial calendar',
      'creative brief', 'agency', 'in-house', 'campaign', 'performance creative',
      'email copy', 'social copy', 'product copy',
    ],
    proTips: [
      'Link your portfolio in the first sentence.',
      'Pick one campaign — describe brief, your role, outcome.',
      'Show range: short-form AND long-form.',
      'Make the cover letter itself a writing sample — every word counts.',
    ],
    sampleLetter: {
      greeting: 'Dear Creative Lead,',
      paragraphs: [
        'My portfolio is at yourdomain.com — the case study most relevant to your brand is the rebrand voice work I led for a fintech earlier this year. The new homepage tested 38% higher on conversion than the prior version, and the headline I wrote ran on their billboards for the next two quarters.',
        'I\'m a copywriter with five years of in-house and agency experience, fluent across long-form (white papers, landing pages, email sequences) and short-form (headlines, social, product UI). My current role is at a Series B B2B SaaS where I own the brand voice document, write across 6-8 campaigns per quarter, and partner with performance marketing on testing creative.',
        'What I\'d bring to {{Company}} is the kind of voice that\'s recognizable without being forced, plus the discipline to file clean drafts on schedule. I take briefs seriously, ask sharper questions than most writers, and treat editing as the most important part of the job.',
        'I\'d welcome the chance to walk through the work. Thank you for the consideration.',
      ],
      closing: 'Best regards,',
      signature: 'Your Name',
    },
    faq: [
      {
        question: 'How long should a copywriter cover letter be?',
        answer: '200-300 words. The cover letter is the writing audition — short and tight beats comprehensive.',
      },
      {
        question: 'Should I attach writing samples or link them?',
        answer: 'Link in the first paragraph. Don\'t make creative leads hunt.',
      },
    ],
    relatedSlugs: ['content-writer', 'marketing-manager', 'graphic-designer'],
  },
  {
    slug: 'electrical-engineer',
    jobTitle: 'Electrical Engineer',
    category: 'Engineering & Technology',
    experienceLevel: 'general',
    shortDescription:
      'An electrical engineer cover letter built around shipped designs, schematic and PCB craft, and the cross-disciplinary work EE hiring managers screen for.',
    meta: {
      title: 'Electrical Engineer Cover Letter Example & Writing Guide',
      description:
        'A polished electrical engineer cover letter example with writing guide, ATS keywords, and FAQ. Tailor to hardware, embedded, or power roles with CareerThings AI.',
    },
    intro:
      'Electrical engineer hiring screens on shipped hardware, schematic and PCB design depth, and cross-disciplinary work with mechanical, firmware, and manufacturing teams. The strongest cover letters lead with one shipped product and the design ownership behind it.',
    hiringSignals: [
      'Shipped hardware with EE ownership',
      'Schematic capture and PCB layout fluency (Altium, KiCad, OrCAD)',
      'Lab fluency (oscilloscope, logic analyzer, spectrum analyzer)',
      'Power, signal integrity, or RF specialty',
      'Cross-disciplinary collaboration with ME, firmware, manufacturing',
    ],
    commonKeywords: [
      'electrical engineer', 'schematic', 'PCB', 'Altium', 'KiCad', 'OrCAD',
      'signal integrity', 'power electronics', 'embedded', 'firmware',
      'oscilloscope', 'logic analyzer', 'EMC', 'RF', 'analog', 'digital',
      'DFM', 'BOM', 'production', 'IPC', 'P.E.',
    ],
    proTips: [
      'Lead with one shipped product — your role, the design challenge, the outcome.',
      'Mention the EDA tool from the JD verbatim (Altium, KiCad, OrCAD).',
      'Specify your specialty: power, signal integrity, RF, embedded, mixed-signal.',
      'Reference cross-disciplinary work with ME, firmware, manufacturing.',
    ],
    sampleLetter: {
      greeting: 'Dear Hiring Manager,',
      paragraphs: [
        'I\'ve spent the last four years designing power-management circuitry at a hardware startup, and the role you\'ve posted — battery-management for outdoor consumer products — is exactly the work I most want to keep doing.',
        'In my current role I owned the schematic and PCB design for our second-generation product\'s power subsystem, including a custom buck-boost converter, fuel-gauge IC integration, and an MCU-driven battery-management state machine. The design shipped to 240K units with a field-failure rate of 0.07% on the power path through 18 months. I work daily in Altium, comfortable with signal integrity simulation, and have led DFM walk-throughs at our Shenzhen contract manufacturer twice.',
        'What I\'d bring to {{Company}} is design rigor paired with a tight feedback loop with manufacturing — I read DFM feedback as part of the design, not as something done after the fact. I\'m also comfortable on cross-disciplinary calls with mechanical and firmware partners.',
        'I\'d welcome the chance to discuss the role. Thank you for the consideration.',
      ],
      closing: 'Best regards,',
      signature: 'Your Name',
    },
    faq: [
      {
        question: 'Should I list every EDA tool I\'ve used?',
        answer: 'No. List the one from the JD plus your strongest. Tool sprawl in cover letters reads as junior.',
      },
      {
        question: 'Is a P.E. license needed for EE roles?',
        answer: 'Required for power-systems and utilities work; uncommon for product/embedded roles. Always check the JD.',
      },
    ],
    relatedSlugs: ['mechanical-engineer', 'software-engineer', 'devops-engineer'],
  },
  {
    slug: 'firefighter',
    jobTitle: 'Firefighter',
    category: 'Public Safety',
    experienceLevel: 'general',
    shortDescription:
      'A firefighter cover letter built around training, certifications, and the team-first, calm-under-pressure character departments screen for.',
    meta: {
      title: 'Firefighter Cover Letter Example & Writing Guide',
      description:
        'A polished firefighter cover letter example with writing guide, keywords, and FAQ. Tailor to municipal, county, or specialized roles with CareerThings AI.',
    },
    intro:
      'Firefighter hiring is unusually rigorous — most departments use formal civil-service processes, with cover letters one input among many. The strongest letters lead with certifications and physical readiness, and demonstrate the team-first, service-oriented character that fire departments are built around.',
    hiringSignals: [
      'EMT or Paramedic certification',
      'Firefighter I/II certification',
      'CPAT (Candidate Physical Ability Test) status',
      'Volunteer or career fire experience',
      'Service-oriented motivation',
    ],
    commonKeywords: [
      'firefighter', 'EMT', 'paramedic', 'NREMT', 'Firefighter I', 'Firefighter II',
      'CPAT', 'NIMS', 'ICS', 'wildland', 'structural', 'rescue',
      'hazmat', 'rope rescue', 'apparatus', 'pump operator', 'fire suppression',
    ],
    proTips: [
      'Lead with EMT/Paramedic and Firefighter I/II certifications.',
      'Reference CPAT and physical readiness.',
      'Show one specific service moment — volunteer or career.',
      'Demonstrate team-first character through specific stories.',
    ],
    sampleLetter: {
      greeting: 'Dear Chief,',
      paragraphs: [
        'I\'m an NREMT-Paramedic and Firefighter I/II candidate with three years of volunteer firefighter experience, applying for the firefighter position with {{Department}}. The community engagement and public-education work {{Department}} runs is the reason I\'m specifically interested.',
        'In my current volunteer role I respond to an average of 60 calls per quarter — primarily medical, with structure and brush calls during dry season. I currently hold NREMT-Paramedic, Firefighter I/II, and have completed CPAT within the last six months. Beyond active response work I\'ve volunteered weekly as the lead instructor for our department\'s Junior Firefighter Academy, where I\'ve trained 38 youth over two summers.',
        'What I\'d bring to {{Department}} is current certification, physical readiness, and the kind of team-first character that fire service is built around. I\'ve learned to operate calmly under pressure on the medical side, and I take continuous training as a core part of the job, not a once-a-year requirement.',
        'I\'d welcome the chance to talk through the role and your hiring process. Thank you for the consideration.',
      ],
      closing: 'Sincerely,',
      signature: 'Your Name',
    },
    faq: [
      {
        question: 'Is this cover letter different from a civil service application?',
        answer: 'It\'s usually a supplemental document. Most departments require a civil service application; the cover letter accompanies it as a way to differentiate.',
      },
      {
        question: 'Should I mention specific incidents I\'ve responded to?',
        answer: 'In broad terms only — "responded to a structure fire that required hose advancement under low-visibility conditions" is fine. Specifics about victims or addresses are not.',
      },
    ],
    relatedSlugs: ['registered-nurse', 'social-worker'],
  },
  {
    slug: 'truck-driver',
    jobTitle: 'Truck Driver',
    category: 'Transportation & Logistics',
    experienceLevel: 'general',
    shortDescription:
      'A CDL truck driver cover letter built around clean driving record, license endorsements, and the on-time delivery discipline carriers screen for.',
    meta: {
      title: 'Truck Driver Cover Letter Example & Writing Guide',
      description:
        'A polished CDL truck driver cover letter example with writing guide, keywords, and FAQ. Tailor to OTR, regional, or local roles with CareerThings AI.',
    },
    intro:
      'CDL truck driver hiring screens on license class, endorsements, driving record, and route fluency. The strongest cover letters lead with all four in the first paragraph and back them with specific mileage and on-time delivery numbers.',
    hiringSignals: [
      'CDL Class A or B and any endorsements (HazMat, Tanker, Doubles/Triples)',
      'Years of OTR or regional experience',
      'Clean driving record (mention years without accident)',
      'ELD and route software fluency',
      'Specialty experience (refrigerated, flatbed, intermodal)',
    ],
    commonKeywords: [
      'CDL', 'Class A', 'Class B', 'HazMat', 'Tanker', 'OTR', 'regional',
      'ELD', 'DOT', 'logbook', 'pre-trip inspection', 'flatbed', 'reefer',
      'intermodal', 'load securement', 'on-time delivery', 'safety record',
      'McLeod', 'TMW', 'Trimble',
    ],
    proTips: [
      'Lead with CDL class, endorsements, and years of clean driving.',
      'Quantify miles driven and on-time delivery percentage.',
      'Match route type to the JD (OTR vs. regional vs. local).',
      'Mention ELD and dispatch software from the JD.',
    ],
    sampleLetter: {
      greeting: 'Dear Hiring Manager,',
      paragraphs: [
        'I\'m a CDL Class A driver with HazMat and Tanker endorsements, eight years of OTR experience, and zero preventable accidents across 720,000 miles. I\'m applying for the regional position at {{Company}} because I\'m looking for routes that get me home weekly without dropping into local-only volume.',
        'In my current role I run a 48-state OTR rotation pulling reefer for a national grocery chain, averaging 2,800 miles per week with 98.7% on-time delivery across the last 12 months. I\'m fluent with KeepTruckin ELD, run pre-trip inspections by-the-book, and have held the same dedicated lane for the past three years through trip planning that keeps both me and the load on schedule.',
        'What I\'d bring to {{Company}} is reliability, clean Logs, and the kind of communication with dispatch that makes everyone\'s job easier. I keep my truck clean, my logs current, and my customers updated proactively when traffic or weather shifts ETA.',
        'I\'d welcome the chance to talk through the role and the lanes available. Thank you for the consideration.',
      ],
      closing: 'Best regards,',
      signature: 'Your Name',
    },
    faq: [
      {
        question: 'Should I include MVR (motor vehicle record) details?',
        answer: 'Reference clean driving years (e.g., "zero preventable accidents in 720K miles"). Carriers will pull the actual MVR before hiring; the cover letter sets expectations.',
      },
      {
        question: 'Are endorsements important?',
        answer: 'Yes — list active ones (HazMat, Tanker, Doubles/Triples) in the first sentence. They\'re hard filters in carrier ATS.',
      },
    ],
    relatedSlugs: ['customer-service-representative', 'project-manager'],
  },
];

export function getCoverLetterExampleBySlug(slug: string): CoverLetterExample | undefined {
  return COVER_LETTER_EXAMPLES.find((e) => e.slug === slug);
}

export function getCoverLetterExampleSlugs(): string[] {
  return COVER_LETTER_EXAMPLES.map((e) => e.slug);
}

export function getRelatedExamples(slug: string): CoverLetterExample[] {
  const current = getCoverLetterExampleBySlug(slug);
  if (!current) return [];
  return current.relatedSlugs
    .map((s) => getCoverLetterExampleBySlug(s))
    .filter((e): e is CoverLetterExample => Boolean(e));
}

export function groupByCategory(): Record<string, CoverLetterExample[]> {
  return COVER_LETTER_EXAMPLES.reduce<Record<string, CoverLetterExample[]>>((acc, ex) => {
    if (!acc[ex.category]) acc[ex.category] = [];
    acc[ex.category].push(ex);
    return acc;
  }, {});
}
