// /resume-keywords/[slug] — fourth programmatic SEO silo. High-volume search:
// "software engineer resume keywords", "nurse resume keywords", etc.
// Each page lists categorized keywords, hard skills, soft skills, action verbs,
// and how to use them. Lighter content than the example silos but still
// substantive (~1200 words per page).

export type KeywordGroup = {
  category: string;
  description: string;
  keywords: string[];
};

export type ResumeKeywordsEntry = {
  slug: string;
  jobTitle: string;
  category: string;
  shortDescription: string;
  meta: { title: string; description: string };
  intro: string;
  groups: KeywordGroup[];
  actionVerbs: string[];
  softSkills: string[];
  certifications?: string[];
  howToUse: string[];
  faq: { question: string; answer: string }[];
  relatedSlugs: string[];
};

export const RESUME_KEYWORDS: ResumeKeywordsEntry[] = [
  {
    slug: 'software-engineer',
    jobTitle: 'Software Engineer',
    category: 'Engineering & Technology',
    shortDescription:
      'The keywords ATS systems screen for on software engineer resumes — frameworks, infrastructure, methodologies, and the action verbs that make bullets land.',
    meta: {
      title: 'Software Engineer Resume Keywords (2026 ATS Guide)',
      description:
        'The exact keywords ATS systems screen for on software engineer resumes. Categorized by hard skills, frameworks, infrastructure, and action verbs. Use them with the CareerThings AI builder.',
    },
    intro:
      'ATS systems rank software engineer resumes by keyword overlap with the job description. The keywords below are the most commonly screened-for terms across modern engineering roles. Mirror the relevant ones from the JD verbatim — exact match matters because most ATS tokenizers do substring matching, not semantic.',
    groups: [
      {
        category: 'Languages',
        description: 'Programming languages most often screened for. Match the JD\'s primary language exactly — "JavaScript" is not "JS" and "TypeScript" is not "JavaScript" to an ATS.',
        keywords: ['TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'Java', 'Kotlin', 'Swift', 'C++', 'C#', 'Ruby', 'PHP', 'SQL', 'Bash'],
      },
      {
        category: 'Frontend Frameworks & Libraries',
        description: 'Frontend technologies. Mirror the JD\'s framework verbatim — many ATS treat "React" and "Reactjs" differently.',
        keywords: ['React', 'Next.js', 'Vue', 'Nuxt', 'Angular', 'Svelte', 'Redux', 'Zustand', 'TanStack Query', 'Tailwind CSS', 'CSS-in-JS', 'webpack', 'Vite'],
      },
      {
        category: 'Backend Frameworks',
        description: 'Backend technologies and runtime ecosystems.',
        keywords: ['Node.js', 'Express', 'Fastify', 'NestJS', 'Django', 'Flask', 'FastAPI', 'Ruby on Rails', 'Spring Boot', 'ASP.NET', 'gRPC', 'GraphQL', 'REST API', 'WebSockets'],
      },
      {
        category: 'Cloud & Infrastructure',
        description: 'Cloud providers and infrastructure tooling — heavily ATS-weighted for senior+ roles.',
        keywords: ['AWS', 'GCP', 'Azure', 'Kubernetes', 'Docker', 'Terraform', 'Pulumi', 'Helm', 'CloudFormation', 'Lambda', 'ECS', 'EKS', 'CloudFront', 'CDN', 'serverless'],
      },
      {
        category: 'Databases & Storage',
        description: 'Databases and persistence layers. Specify the exact engine the JD asks for.',
        keywords: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'DynamoDB', 'Cassandra', 'Snowflake', 'BigQuery', 'Elasticsearch', 'Kafka', 'RabbitMQ', 'S3'],
      },
      {
        category: 'CI/CD & DevOps',
        description: 'Tooling and methodologies for shipping reliably.',
        keywords: ['CI/CD', 'GitHub Actions', 'GitLab CI', 'CircleCI', 'Jenkins', 'ArgoCD', 'Terraform', 'monitoring', 'observability', 'Datadog', 'Prometheus', 'Grafana', 'Sentry', 'PagerDuty'],
      },
      {
        category: 'Methodology & Practices',
        description: 'Engineering practices most JDs explicitly call out.',
        keywords: ['Agile', 'Scrum', 'sprint planning', 'code review', 'pair programming', 'TDD', 'unit testing', 'integration testing', 'system design', 'distributed systems', 'microservices', 'event-driven', 'on-call', 'incident response'],
      },
    ],
    actionVerbs: [
      'Architected', 'Built', 'Shipped', 'Deployed', 'Scaled', 'Migrated', 'Refactored', 'Optimized', 'Reduced', 'Increased', 'Owned', 'Led', 'Designed', 'Implemented', 'Automated', 'Mentored', 'Authored', 'Debugged',
    ],
    softSkills: [
      'Cross-functional collaboration', 'Technical writing', 'Code review', 'Mentorship', 'Stakeholder communication', 'Problem decomposition', 'Architectural judgment',
    ],
    howToUse: [
      'Pick the JD\'s top 8-12 keywords (technical terms first) and mirror them verbatim across Summary, Skills, and Experience sections.',
      'Don\'t pad keywords you don\'t actually have — interviews will catch you.',
      'Lead bullets with strong action verbs from the list above.',
      'Group skills by category (Languages, Frameworks, Infrastructure) so ATS parses them cleanly.',
      'Quantify outcomes — keywords without metrics lose to keywords with metrics.',
    ],
    faq: [
      {
        question: 'How many keywords should I include on a software engineer resume?',
        answer: 'Aim for 12-20 specific technical keywords distributed across Summary, Skills, and Experience. More than 25 starts looking like padding.',
      },
      {
        question: 'Should I list every framework I\'ve used?',
        answer: 'No. List the ones you\'d be comfortable being interviewed on. Tool sprawl signals shallow experience.',
      },
      {
        question: 'Do action verbs matter for ATS?',
        answer: 'They matter more for human readers than ATS, but strong verbs make every bullet land harder. Lead with them.',
      },
    ],
    relatedSlugs: ['data-analyst', 'product-manager', 'devops-engineer'],
  },
  {
    slug: 'product-manager',
    jobTitle: 'Product Manager',
    category: 'Product & Strategy',
    shortDescription:
      'The keywords ATS systems screen for on PM resumes — methodologies, tools, frameworks, and the outcome-focused action verbs that separate strong PMs.',
    meta: {
      title: 'Product Manager Resume Keywords (2026 ATS Guide)',
      description:
        'The exact keywords ATS systems screen for on product manager resumes. Categorized by methodology, tools, soft skills, and action verbs. Use them with the CareerThings AI builder.',
    },
    intro:
      'PM resumes get screened heavily on outcomes and methodology fluency. The keywords below cover the full range of common ATS-screened terms across consumer, B2B, platform, and growth PM roles. Mirror the relevant ones from the JD — and lead bullets with outcome verbs, not feature verbs.',
    groups: [
      {
        category: 'Methodologies',
        description: 'Product methodologies most JDs call out.',
        keywords: ['Agile', 'Scrum', 'OKRs', 'Jobs-to-be-Done', 'Lean', 'Design Sprints', 'Discovery', 'Dual-Track Agile', 'A/B testing', 'experimentation', 'user research', 'usability testing', 'beta launch'],
      },
      {
        category: 'Frameworks',
        description: 'Prioritization and planning frameworks.',
        keywords: ['RICE', 'ICE', 'MoSCoW', 'Kano model', 'cost of delay', 'WSJF', 'opportunity solution tree', 'product roadmap', 'feature prioritization'],
      },
      {
        category: 'Tools',
        description: 'Tools most JDs explicitly require.',
        keywords: ['Jira', 'Linear', 'Asana', 'ProductBoard', 'Aha!', 'Amplitude', 'Mixpanel', 'Heap', 'Pendo', 'Looker', 'Mode', 'Tableau', 'Figma', 'Miro', 'Notion', 'Confluence'],
      },
      {
        category: 'Data & Analysis',
        description: 'Data fluency requirements common in modern PM JDs.',
        keywords: ['SQL', 'A/B testing', 'cohort analysis', 'funnel analysis', 'retention curves', 'statistical significance', 'p-value', 'lift', 'segmentation', 'attribution'],
      },
      {
        category: 'Strategy & Operations',
        description: 'Strategic and operational keywords.',
        keywords: ['go-to-market', 'GTM', 'positioning', 'pricing', 'monetization', 'product-market fit', 'PRD', 'PR/FAQ', 'stakeholder management', 'cross-functional', 'roadmap planning'],
      },
    ],
    actionVerbs: [
      'Launched', 'Drove', 'Lifted', 'Reduced', 'Increased', 'Owned', 'Led', 'Defined', 'Shipped', 'Influenced', 'Prioritized', 'Validated', 'Scaled', 'Pivoted', 'Discovered', 'Authored',
    ],
    softSkills: [
      'Cross-functional leadership', 'Stakeholder management', 'Customer empathy', 'Strategic thinking', 'Negotiation', 'Storytelling', 'Decision-making under ambiguity', 'Coaching engineers',
    ],
    howToUse: [
      'Lead each bullet with an outcome ("Drove 22% lift in conversion") not a feature ("Shipped a new onboarding flow").',
      'Mirror the JD\'s methodology language. If they say "OKRs," use OKRs. If they say "Quarterly Goals," match that.',
      'Quantify scope: team size, MRR/users impacted, percentage lifts.',
      'Skip generic terms ("results-driven", "passionate"). Specific beats generic.',
    ],
    faq: [
      {
        question: 'Should I list specific PM methodologies on my resume?',
        answer: 'Yes — the ones the JD asks for, plus your strongest. Don\'t list every methodology you\'ve heard of; depth wins.',
      },
      {
        question: 'How important is SQL fluency for PMs?',
        answer: 'Increasingly required. If the JD asks for SQL, list it. If you can run basic queries, list it. If you\'ve never written SQL, leave it off.',
      },
    ],
    relatedSlugs: ['software-engineer', 'data-analyst', 'marketing-manager'],
  },
  {
    slug: 'data-analyst',
    jobTitle: 'Data Analyst',
    category: 'Data & Analytics',
    shortDescription:
      'The keywords ATS systems screen for on data analyst resumes — SQL dialects, BI tools, statistical methods, and the action verbs that emphasize impact.',
    meta: {
      title: 'Data Analyst Resume Keywords (2026 ATS Guide)',
      description:
        'The exact keywords ATS systems screen for on data analyst resumes. Categorized by SQL, BI tools, statistical methods, and action verbs. Use with the CareerThings AI builder.',
    },
    intro:
      'Data analyst resumes get screened on technical fluency (SQL is non-negotiable) and business impact. The keywords below cover the full range of modern analyst JDs. Mirror the JD\'s exact stack — recruiters search for "Snowflake" specifically, not "data warehouse."',
    groups: [
      {
        category: 'SQL & Databases',
        description: 'SQL dialect and database engines. Match the JD verbatim.',
        keywords: ['SQL', 'PostgreSQL', 'MySQL', 'Snowflake', 'BigQuery', 'Redshift', 'Databricks', 'window functions', 'CTEs', 'joins', 'aggregations'],
      },
      {
        category: 'BI & Visualization',
        description: 'BI platforms and visualization tools.',
        keywords: ['Tableau', 'Looker', 'Power BI', 'Mode', 'Metabase', 'Hex', 'Sisense', 'Domo', 'data visualization', 'dashboards'],
      },
      {
        category: 'Programming & Tools',
        description: 'Programming languages and analytics tooling.',
        keywords: ['Python', 'R', 'pandas', 'NumPy', 'scikit-learn', 'Jupyter', 'dbt', 'Airflow', 'git', 'Excel', 'pivot tables'],
      },
      {
        category: 'Statistical Methods',
        description: 'Statistical and experimental methods.',
        keywords: ['A/B testing', 'experimentation', 'hypothesis testing', 'cohort analysis', 'regression', 'p-value', 'confidence intervals', 'segmentation', 'time-series', 'forecasting'],
      },
      {
        category: 'Business Concepts',
        description: 'Business-domain keywords analysts need to translate.',
        keywords: ['KPI', 'metric definition', 'churn analysis', 'retention', 'attribution', 'LTV', 'CAC', 'conversion funnel', 'product analytics', 'self-serve analytics'],
      },
    ],
    actionVerbs: [
      'Analyzed', 'Built', 'Identified', 'Surfaced', 'Modeled', 'Forecasted', 'Discovered', 'Quantified', 'Translated', 'Automated', 'Validated', 'Reported', 'Drove', 'Recommended',
    ],
    softSkills: [
      'Stakeholder communication', 'Translating business questions to data', 'Storytelling with data', 'Cross-functional partnership', 'Self-direction', 'Curiosity',
    ],
    howToUse: [
      'Lead bullets with the business decision your analysis drove, not the analytical method.',
      'Mirror the SQL dialect from the JD. "Snowflake" and "BigQuery" are not interchangeable to ATS.',
      'List BI tools you\'re actually fluent in — interviews will catch you on the rest.',
      'Quantify impact when possible: revenue, retention, hours saved.',
    ],
    faq: [
      {
        question: 'How important is Python for data analyst roles?',
        answer: 'Depends on the team. Some teams are SQL-only; many expect basic pandas and notebooks. Match the JD.',
      },
      {
        question: 'Should I list Excel even if it feels basic?',
        answer: 'Yes — Excel is still expected on most analyst resumes. List it alongside your stronger tools.',
      },
    ],
    relatedSlugs: ['software-engineer', 'product-manager', 'business-analyst'],
  },
  {
    slug: 'marketing-manager',
    jobTitle: 'Marketing Manager',
    category: 'Marketing & Communications',
    shortDescription:
      'The keywords ATS systems screen for on marketing manager resumes — channels, tools, attribution, and the revenue-focused action verbs hiring managers want.',
    meta: {
      title: 'Marketing Manager Resume Keywords (2026 ATS Guide)',
      description:
        'The exact keywords ATS systems screen for on marketing manager resumes. Categorized by channels, tools, soft skills, and action verbs. Use with the CareerThings AI builder.',
    },
    intro:
      'Marketing manager resumes get screened on revenue impact and channel-mastery keywords. The strongest resumes mirror the JD\'s exact tech stack and lead with measurable pipeline outcomes.',
    groups: [
      {
        category: 'Channels',
        description: 'Marketing channels — match the ones the JD emphasizes.',
        keywords: ['paid acquisition', 'paid search', 'paid social', 'SEO', 'content marketing', 'lifecycle marketing', 'email marketing', 'webinars', 'events', 'ABM', 'partner marketing', 'PR', 'influencer'],
      },
      {
        category: 'Tools',
        description: 'Marketing automation and analytics tools.',
        keywords: ['HubSpot', 'Marketo', 'Pardot', 'Salesforce Marketing Cloud', 'Mailchimp', 'Klaviyo', 'Iterable', 'Customer.io', 'Google Ads', 'LinkedIn Ads', 'Meta Ads Manager', 'GA4', 'Looker', 'Segment'],
      },
      {
        category: 'Performance & Attribution',
        description: 'Performance and attribution concepts.',
        keywords: ['CAC', 'LTV', 'ROAS', 'pipeline sourced', 'pipeline influenced', 'MQL', 'SQL', 'attribution', 'multi-touch attribution', 'first-touch', 'last-touch', 'A/B testing', 'CRO'],
      },
      {
        category: 'Strategy & Brand',
        description: 'Strategic marketing concepts.',
        keywords: ['positioning', 'messaging', 'brand voice', 'go-to-market', 'GTM', 'product marketing', 'demand generation', 'brand marketing', 'launch planning'],
      },
    ],
    actionVerbs: [
      'Drove', 'Generated', 'Sourced', 'Lifted', 'Reduced', 'Launched', 'Owned', 'Built', 'Scaled', 'Optimized', 'Wrote', 'Briefed', 'Tested', 'Analyzed',
    ],
    softSkills: [
      'Cross-functional partnership with sales', 'Copywriting', 'Brief writing', 'Brand judgment', 'Creative direction', 'Data-driven decision making',
    ],
    howToUse: [
      'Lead bullets with revenue or pipeline numbers — "Drove $3.2M annual pipeline" beats "Built lifecycle program."',
      'Match channel keywords to the JD\'s priorities. Don\'t pitch SEO experience to a paid-led team.',
      'Quantify CAC, LTV, ROAS where possible.',
      'Mention attribution philosophy — "MTA-grounded decisions" reads sharper than "data-driven."',
    ],
    faq: [
      {
        question: 'Should I list every marketing tool I\'ve used?',
        answer: 'No. List the ones from the JD plus your strongest 2-3. Tool sprawl signals shallow experience.',
      },
      {
        question: 'How important are growth-marketing keywords vs. brand-marketing keywords?',
        answer: 'Match the JD. Growth roles weight performance keywords; brand roles weight positioning and creative direction.',
      },
    ],
    relatedSlugs: ['product-manager', 'data-analyst', 'content-writer'],
  },
  {
    slug: 'registered-nurse',
    jobTitle: 'Registered Nurse',
    category: 'Healthcare',
    shortDescription:
      'The keywords ATS systems screen for on RN resumes — clinical specialties, certifications, EHR systems, and the patient-care action verbs nurse managers screen for.',
    meta: {
      title: 'Registered Nurse Resume Keywords (2026 ATS Guide)',
      description:
        'The exact keywords ATS systems screen for on registered nurse resumes. Categorized by clinical specialty, certifications, EHR, and action verbs.',
    },
    intro:
      'Nurse resumes get screened on credentials, specialty, and clinical procedures. ATS screening is unusually strict in healthcare — exact-match credentials are hard filters. The keywords below cover the most common screened terms.',
    groups: [
      {
        category: 'Credentials & Licenses',
        description: 'Credentials are hard ATS filters. List exactly as on the JD.',
        keywords: ['RN', 'BSN', 'MSN', 'BLS', 'ACLS', 'PALS', 'NIHSS', 'CCRN', 'CEN', 'TCRN', 'ENPC', 'TNCC', 'CNOR', 'WOCN', 'Magnet status'],
      },
      {
        category: 'Specialties',
        description: 'Specialty area keywords. Match the unit type from the JD.',
        keywords: ['Med-Surg', 'ICU', 'CCU', 'CVICU', 'NICU', 'PICU', 'ED', 'OR', 'PACU', 'L&D', 'postpartum', 'oncology', 'telemetry', 'step-down', 'home health', 'school nurse', 'public health'],
      },
      {
        category: 'Clinical Skills',
        description: 'Specific procedures and clinical skills.',
        keywords: ['patient assessment', 'medication administration', 'IV therapy', 'central line', 'wound care', 'tracheostomy', 'ventilator management', 'tele monitoring', 'patient education', 'discharge planning'],
      },
      {
        category: 'EHR & Systems',
        description: 'EHR systems and pharmacy automation.',
        keywords: ['Epic', 'Cerner', 'Meditech', 'Allscripts', 'Pyxis', 'Omnicell', 'CPOE', 'eMAR'],
      },
      {
        category: 'Compliance & Quality',
        description: 'Compliance and patient-safety keywords.',
        keywords: ['HIPAA', 'OSHA', 'JCAHO', 'patient safety', 'infection control', 'fall prevention', 'CLABSI prevention', 'evidence-based practice'],
      },
    ],
    actionVerbs: [
      'Provided', 'Administered', 'Assessed', 'Educated', 'Coordinated', 'Documented', 'Monitored', 'Advocated', 'Precepted', 'Led', 'Reduced', 'Improved',
    ],
    softSkills: [
      'Communication with families', 'Multidisciplinary collaboration', 'Calm under pressure', 'Critical thinking', 'Patient advocacy', 'Cultural competence',
    ],
    certifications: [
      'BLS (Basic Life Support)', 'ACLS (Advanced Cardiac Life Support)', 'PALS (Pediatric Advanced Life Support)', 'CCRN (Critical Care Registered Nurse)', 'CEN (Certified Emergency Nurse)', 'TNCC (Trauma Nursing Core Course)', 'NIHSS (NIH Stroke Scale)',
    ],
    howToUse: [
      'List credentials at the top of the resume in the name line: "Your Name, BSN, RN."',
      'Match unit specialty exactly from the JD. "Med-Surg" and "PCU" aren\'t interchangeable.',
      'Quantify outcomes when possible: fall reduction percentages, satisfaction scores, CLABSI rates.',
      'Always list current certifications with expiration awareness.',
    ],
    faq: [
      {
        question: 'Are RN certifications hard ATS filters?',
        answer: 'Yes — many hospital ATS will reject resumes missing required certifications (BLS, ACLS, etc.). List them in a dedicated Certifications section.',
      },
      {
        question: 'Should I list every EHR I\'ve touched?',
        answer: 'List the one from the JD plus your strongest. Most hospitals are on Epic; some on Cerner. Match exactly.',
      },
    ],
    relatedSlugs: ['social-worker', 'physical-therapist', 'pharmacist'],
  },
  {
    slug: 'project-manager',
    jobTitle: 'Project Manager',
    category: 'Operations & Project Management',
    shortDescription:
      'The keywords ATS systems screen for on project manager resumes — methodologies, tools, certifications, and the delivery-focused action verbs hiring managers screen for.',
    meta: {
      title: 'Project Manager Resume Keywords (2026 ATS Guide)',
      description:
        'The exact keywords ATS systems screen for on project manager resumes. Categorized by methodology, tools, certifications, and action verbs.',
    },
    intro:
      'Project manager resumes get screened on methodology fluency, certifications, and delivery outcomes. The keywords below cover what ATS screen for across enterprise PMO, agile delivery, and program management roles.',
    groups: [
      {
        category: 'Methodologies',
        description: 'Project management methodologies.',
        keywords: ['Agile', 'Scrum', 'Kanban', 'Waterfall', 'Hybrid', 'PRINCE2', 'PMBOK', 'SAFe', 'XP', 'Lean'],
      },
      {
        category: 'Tools',
        description: 'Project tracking and collaboration tools.',
        keywords: ['Jira', 'Asana', 'MS Project', 'Smartsheet', 'Monday', 'Confluence', 'SharePoint', 'Trello', 'ClickUp', 'Notion', 'Lucidchart'],
      },
      {
        category: 'Certifications',
        description: 'Project management certifications. Match the JD.',
        keywords: ['PMP', 'CSM', 'PSM', 'CAPM', 'PRINCE2 Practitioner', 'SAFe Agilist', 'Six Sigma Green Belt', 'Six Sigma Black Belt', 'ITIL'],
      },
      {
        category: 'Practices',
        description: 'PM practices commonly called out in JDs.',
        keywords: ['risk management', 'stakeholder management', 'change management', 'budget management', 'resource planning', 'sprint planning', 'retrospectives', 'roadmapping', 'critical path', 'dependency management'],
      },
    ],
    actionVerbs: [
      'Delivered', 'Led', 'Managed', 'Coordinated', 'Mitigated', 'Drove', 'Owned', 'Planned', 'Tracked', 'Reported', 'Escalated', 'Communicated', 'Resolved',
    ],
    softSkills: [
      'Stakeholder management', 'Cross-functional leadership', 'Communication discipline', 'Risk thinking', 'Negotiation', 'Calm under deadline', 'Conflict resolution',
    ],
    howToUse: [
      'Lead bullets with delivery outcomes — early/late, under/over budget, customer impact.',
      'Match methodology language to the JD. Agile shop? Don\'t lead with Waterfall.',
      'List certifications once, prominently. PMP carries weight; mention it.',
      'Quantify project scale: team size, budget, duration.',
    ],
    faq: [
      {
        question: 'Is the PMP certification required?',
        answer: 'Often required at enterprises, often optional at tech companies. Always check the JD.',
      },
      {
        question: 'Should I list every methodology I\'ve worked under?',
        answer: 'List the ones the JD asks for plus your strongest. Don\'t list ones you\'ve only read about.',
      },
    ],
    relatedSlugs: ['software-engineer', 'product-manager', 'business-analyst'],
  },
  {
    slug: 'accountant',
    jobTitle: 'Accountant',
    category: 'Finance & Accounting',
    shortDescription:
      'The keywords ATS systems screen for on accountant resumes — GAAP, ERP systems, certifications, and the close-cycle action verbs controllers screen for.',
    meta: {
      title: 'Accountant Resume Keywords (2026 ATS Guide)',
      description:
        'The exact keywords ATS systems screen for on accountant resumes. Categorized by GAAP, ERP, certifications, and action verbs.',
    },
    intro:
      'Accountant resumes get screened on technical fluency (GAAP, close cycle, ERP) and certifications. ATS screening is exact-match strict in finance — list "CPA" not "Certified Public Accountant" if the JD writes it that way (and check both versions).',
    groups: [
      {
        category: 'Accounting Standards',
        description: 'Standards and frameworks.',
        keywords: ['GAAP', 'IFRS', 'ASC 606', 'ASC 842', 'SOX', 'SOX 404', 'internal controls', 'audit', 'PCAOB'],
      },
      {
        category: 'ERP Systems',
        description: 'ERP and accounting software. Match the JD\'s exact system.',
        keywords: ['NetSuite', 'SAP', 'Oracle', 'QuickBooks', 'Sage Intacct', 'Workday Financials', 'Microsoft Dynamics', 'BlackLine', 'FloQast'],
      },
      {
        category: 'Certifications',
        description: 'Accounting certifications.',
        keywords: ['CPA', 'CMA', 'CIA', 'CFE', 'EA', 'CGMA', 'CPA candidate'],
      },
      {
        category: 'Practices',
        description: 'Specific accounting practices.',
        keywords: ['month-end close', 'quarter-end close', 'year-end close', 'general ledger', 'journal entries', 'accruals', 'reconciliation', 'AR', 'AP', 'fixed assets', 'revenue recognition', 'variance analysis', 'flux analysis', 'intercompany'],
      },
    ],
    actionVerbs: [
      'Closed', 'Reconciled', 'Prepared', 'Reviewed', 'Audited', 'Analyzed', 'Reduced', 'Identified', 'Implemented', 'Documented', 'Coordinated', 'Owned',
    ],
    softSkills: [
      'Attention to detail', 'Process discipline', 'Calm under deadline', 'Cross-functional partnership with FP&A', 'Audit-ready documentation',
    ],
    howToUse: [
      'Lead bullets with close-cycle metrics: days to close, accuracy, number of entities.',
      'List ERP system from the JD verbatim — "NetSuite" not "ERP system."',
      'Mention CPA status (active, candidate, expired) explicitly.',
      'Quantify cost savings, audit outcomes, process improvements.',
    ],
    faq: [
      {
        question: 'Is CPA required for accountant resumes?',
        answer: 'Required for senior+ roles at most companies. For staff roles, often candidate-status is acceptable. Always check the JD.',
      },
      {
        question: 'Should I list every ERP I\'ve touched?',
        answer: 'List the one from the JD plus your strongest. ERP sprawl signals shallow experience in any one system.',
      },
    ],
    relatedSlugs: ['financial-analyst', 'business-analyst', 'data-analyst'],
  },
  {
    slug: 'sales-representative',
    jobTitle: 'Sales Representative',
    category: 'Sales & Business Development',
    shortDescription:
      'The keywords ATS systems screen for on sales rep resumes — methodologies, tools, performance metrics, and the closing-focused action verbs hiring managers want.',
    meta: {
      title: 'Sales Representative Resume Keywords (2026 ATS Guide)',
      description:
        'The exact keywords ATS systems screen for on sales rep resumes. Categorized by methodology, tools, performance metrics, and action verbs.',
    },
    intro:
      'Sales rep resumes get screened on quota attainment, deal complexity, and tool fluency. ATS screening is moderately strict — but human reviewers are quick. Lead with numbers; back with methodology and tool fluency.',
    groups: [
      {
        category: 'Methodologies',
        description: 'Sales methodologies often called out in JDs.',
        keywords: ['MEDDIC', 'MEDDPICC', 'BANT', 'Sandler', 'Challenger', 'SPIN', 'Solution Selling', 'consultative selling', 'Command of the Message'],
      },
      {
        category: 'Tools',
        description: 'Sales tooling. Match the JD\'s stack.',
        keywords: ['Salesforce', 'HubSpot', 'Outreach', 'Salesloft', 'Apollo', 'ZoomInfo', 'Gong', 'Chorus', 'LinkedIn Sales Navigator', 'Clari', 'Highspot', 'Drift'],
      },
      {
        category: 'Performance Metrics',
        description: 'Performance metrics that should appear quantified.',
        keywords: ['quota attainment', 'pipeline generation', 'closed-won', 'win rate', 'sales cycle', 'average contract value', 'ACV', 'ARR', 'expansion revenue', 'territory management'],
      },
      {
        category: 'Sales Activities',
        description: 'Common activity-level keywords.',
        keywords: ['outbound prospecting', 'cold outreach', 'discovery', 'demo', 'objection handling', 'closing', 'forecasting', 'account planning', 'C-level engagement', 'procurement'],
      },
    ],
    actionVerbs: [
      'Closed', 'Sourced', 'Generated', 'Owned', 'Exceeded', 'Drove', 'Negotiated', 'Penetrated', 'Cultivated', 'Forecasted', 'Co-prosecuted',
    ],
    softSkills: [
      'Discovery rigor', 'Active listening', 'Negotiation', 'Persistence', 'Coaching reception', 'Cross-functional partnership with marketing and CS',
    ],
    howToUse: [
      'Lead with quota attainment in the Summary line.',
      'Quantify everything: ACV, win rate, sales cycle length, pipeline coverage.',
      'Mention methodology from the JD verbatim.',
      'List tools from the JD plus 2-3 strongest.',
    ],
    faq: [
      {
        question: 'How much should I quantify on a sales resume?',
        answer: 'Heavily. Sales hiring managers screen on numbers. Quota %, ACV, win rate, deal counts, territory size — all should appear with specifics.',
      },
      {
        question: 'Should I name accounts I\'ve sold to?',
        answer: 'Anonymized industry/segment is safer ("F500 fintech, $94K ACV") than named accounts. NDAs and confidentiality matter.',
      },
    ],
    relatedSlugs: ['marketing-manager', 'customer-service-representative', 'recruiter'],
  },
  {
    slug: 'teacher',
    jobTitle: 'Teacher',
    category: 'Education',
    shortDescription:
      'The keywords ATS systems screen for on teacher resumes — certifications, instructional methods, classroom tools, and the student-growth verbs principals screen for.',
    meta: {
      title: 'Teacher Resume Keywords (2026 ATS Guide)',
      description:
        'The exact keywords ATS systems screen for on teacher resumes. Categorized by certifications, instruction, classroom tools, and action verbs.',
    },
    intro:
      'Teacher resumes get screened on certifications, grade-level/subject match, and instructional methodology. State and district ATS systems are strict on credentials — list license type and state explicitly.',
    groups: [
      {
        category: 'Credentials',
        description: 'Teaching credentials. Match exactly.',
        keywords: ['State Teaching License', 'BCBA', 'M.Ed.', 'M.A.T.', 'B.A. Education', 'ESL Endorsement', 'ELL Endorsement', 'Special Education Endorsement', 'TESOL', 'National Board Certified'],
      },
      {
        category: 'Instruction',
        description: 'Instructional methodology and frameworks.',
        keywords: ['differentiation', 'lesson planning', 'standards-aligned', 'data-driven instruction', 'formative assessment', 'workshop model', 'small-group instruction', 'IEP implementation', '504 plan', 'response to intervention', 'RTI', 'PLC'],
      },
      {
        category: 'Classroom & Tools',
        description: 'Classroom management and tech tools.',
        keywords: ['classroom management', 'PBIS', 'Google Classroom', 'Canvas', 'Schoology', 'NWEA MAP', 'IXL', 'Khan Academy', 'iReady', 'parent communication', 'parent-teacher conferences'],
      },
      {
        category: 'Subjects & Grade Levels',
        description: 'Subject and grade-level keywords.',
        keywords: ['ELA', 'mathematics', 'science', 'social studies', 'STEM', 'STEAM', 'kindergarten', 'elementary', 'middle school', 'high school', 'AP', 'IB', 'dual-language'],
      },
    ],
    actionVerbs: [
      'Taught', 'Designed', 'Implemented', 'Differentiated', 'Assessed', 'Coached', 'Mentored', 'Collaborated', 'Improved', 'Increased', 'Communicated',
    ],
    softSkills: [
      'Family communication', 'Cultural competence', 'Patience under pressure', 'Collaboration with grade-level teams', 'Curriculum design',
    ],
    howToUse: [
      'List credentials at the top — state, license type, endorsements.',
      'Match grade level and subject from the JD verbatim.',
      'Quantify student growth using NWEA, MAP, state assessments, AP pass rates.',
      'List specific instructional methods you actually use, not buzzwords.',
    ],
    faq: [
      {
        question: 'Should teacher resumes include test-score growth?',
        answer: 'Yes — NWEA MAP growth, state assessment growth, AP pass rates. Frame as evidence of practice.',
      },
      {
        question: 'How important are endorsements?',
        answer: 'Heavy in some fields (ELL, special ed, AP/IB). Match the JD\'s required endorsements verbatim.',
      },
    ],
    relatedSlugs: ['social-worker', 'registered-nurse'],
  },
  {
    slug: 'graphic-designer',
    jobTitle: 'Graphic Designer',
    category: 'Design & Creative',
    shortDescription:
      'The keywords ATS systems screen for on graphic designer resumes — software, design specialties, brand work, and action verbs that demonstrate craft.',
    meta: {
      title: 'Graphic Designer Resume Keywords (2026 ATS Guide)',
      description:
        'The exact keywords ATS systems screen for on graphic designer resumes. Categorized by software, design areas, soft skills, and action verbs.',
    },
    intro:
      'Graphic designer resumes get screened on software fluency and design-area specialty. ATS screening is moderately strict on tools — Adobe Creative Cloud apps, Figma, motion tools all screened by exact name.',
    groups: [
      {
        category: 'Software',
        description: 'Design software. Match the JD\'s exact tools.',
        keywords: ['Adobe Creative Cloud', 'Photoshop', 'Illustrator', 'InDesign', 'After Effects', 'Premiere Pro', 'Figma', 'Sketch', 'XD', 'Procreate', 'Canva', 'Cinema 4D', 'Blender'],
      },
      {
        category: 'Design Areas',
        description: 'Design specialty areas.',
        keywords: ['brand identity', 'logo design', 'typography', 'layout design', 'editorial design', 'packaging design', 'print design', 'digital design', 'web design', 'motion graphics', 'illustration', 'icon design', 'design systems', 'brand guidelines'],
      },
      {
        category: 'Process & Methodology',
        description: 'Design process keywords.',
        keywords: ['art direction', 'concept development', 'creative brief', 'production-ready files', 'pre-press', 'asset library', 'style guide', 'design review', 'feedback iteration'],
      },
      {
        category: 'Output Formats',
        description: 'File formats and deliverables.',
        keywords: ['vector', 'raster', 'CMYK', 'RGB', 'PDF/X', 'EPS', 'SVG', 'AI', 'PSD', 'INDD', 'After Effects animations'],
      },
    ],
    actionVerbs: [
      'Designed', 'Created', 'Conceptualized', 'Art-Directed', 'Produced', 'Delivered', 'Iterated', 'Collaborated', 'Briefed', 'Refined',
    ],
    softSkills: [
      'Brand judgment', 'Feedback reception', 'Attention to detail', 'Project management', 'Creative direction', 'Cross-functional partnership',
    ],
    howToUse: [
      'Link your portfolio in the resume header.',
      'List Adobe + Figma even if you favor one — most JDs assume both.',
      'Mention design-area specialty (brand, editorial, motion, etc.) explicitly.',
      'Quantify outcomes when possible: campaign reach, conversion lift, brand-recognition metrics.',
    ],
    faq: [
      {
        question: 'How important is the portfolio for graphic designer roles?',
        answer: 'More important than the resume. The resume gets to the portfolio; the portfolio gets the interview. Link prominently.',
      },
      {
        question: 'Should I list AI tools (Midjourney, DALL-E, Adobe Firefly)?',
        answer: 'Yes if relevant to the JD. Many design teams in 2026 expect AI-tool fluency as part of the workflow.',
      },
    ],
    relatedSlugs: ['ux-designer', 'content-writer', 'copywriter'],
  },
  {
    slug: 'ux-designer',
    jobTitle: 'UX Designer',
    category: 'Design & Creative',
    shortDescription:
      'The keywords ATS systems screen for on UX designer resumes — research methods, design tools, accessibility, and action verbs that demonstrate process.',
    meta: {
      title: 'UX Designer Resume Keywords (2026 ATS Guide)',
      description:
        'The exact keywords ATS systems screen for on UX designer resumes. Categorized by research, design tools, accessibility, and action verbs.',
    },
    intro:
      'UX designer resumes get screened on shipped product, research method fluency, and design-system thinking. The strongest resumes lead with shipped outcomes (not concept work), back them with specific research methods, and demonstrate accessibility instincts.',
    groups: [
      {
        category: 'Tools',
        description: 'Design tools. Match the JD.',
        keywords: ['Figma', 'Sketch', 'Adobe XD', 'Framer', 'ProtoPie', 'Principle', 'Maze', 'UserTesting', 'Hotjar', 'FullStory'],
      },
      {
        category: 'Research Methods',
        description: 'User research and validation methods.',
        keywords: ['user research', 'usability testing', 'qualitative research', 'quantitative research', 'A/B testing', 'card sorting', 'tree testing', 'heuristic evaluation', 'cognitive walkthrough', 'survey design', 'Jobs-to-be-Done', 'persona development', 'journey mapping'],
      },
      {
        category: 'Design Practices',
        description: 'Design practices commonly called out in JDs.',
        keywords: ['interaction design', 'information architecture', 'wireframing', 'prototyping', 'design systems', 'component libraries', 'design tokens', 'mobile-first', 'responsive design'],
      },
      {
        category: 'Accessibility',
        description: 'Accessibility keywords. Increasingly required.',
        keywords: ['accessibility', 'WCAG', 'WCAG 2.1', 'WCAG 2.2', 'AA compliance', 'screen reader testing', 'keyboard navigation', 'color contrast', 'inclusive design', 'ARIA'],
      },
    ],
    actionVerbs: [
      'Researched', 'Designed', 'Prototyped', 'Tested', 'Iterated', 'Synthesized', 'Validated', 'Shipped', 'Lifted', 'Reduced', 'Improved',
    ],
    softSkills: [
      'Research synthesis', 'Cross-functional partnership with engineering and PM', 'Stakeholder communication', 'Feedback reception', 'Systems thinking',
    ],
    howToUse: [
      'Link your portfolio in the resume header.',
      'Lead with shipped product work — concept-only projects are fine in the portfolio, not the resume.',
      'Quantify research depth: number of interviews, usability tests, survey responses.',
      'Mention WCAG compliance level explicitly if relevant.',
    ],
    faq: [
      {
        question: 'How important is the portfolio for UX roles?',
        answer: 'Critical. Make sure the link is in the resume header. Hiring managers spend more time in your portfolio than your resume.',
      },
      {
        question: 'Should I list research tools and design tools separately?',
        answer: 'Often yes — they\'re different competencies. UserTesting and Maze are research; Figma and Framer are design.',
      },
    ],
    relatedSlugs: ['graphic-designer', 'product-manager', 'web-developer'],
  },
  {
    slug: 'devops-engineer',
    jobTitle: 'DevOps Engineer',
    category: 'Engineering & Technology',
    shortDescription:
      'The keywords ATS systems screen for on DevOps resumes — cloud platforms, IaC, container orchestration, and the reliability-focused action verbs hiring managers screen for.',
    meta: {
      title: 'DevOps Engineer Resume Keywords (2026 ATS Guide)',
      description:
        'The exact keywords ATS systems screen for on DevOps engineer resumes. Categorized by cloud, IaC, observability, and action verbs.',
    },
    intro:
      'DevOps engineer resumes get screened heavily on cloud-platform depth and IaC fluency. ATS screening is exact-match strict on cloud/tooling names — "AWS" and "Amazon Web Services" can be different to some parsers, "GitHub Actions" and "GH Actions" definitely are.',
    groups: [
      {
        category: 'Cloud Platforms',
        description: 'Cloud-provider depth. Match the JD.',
        keywords: ['AWS', 'GCP', 'Google Cloud Platform', 'Azure', 'EC2', 'S3', 'RDS', 'Lambda', 'ECS', 'EKS', 'GKE', 'Cloud Run', 'Azure Functions', 'multi-cloud', 'hybrid cloud'],
      },
      {
        category: 'Infrastructure as Code',
        description: 'IaC tooling.',
        keywords: ['Terraform', 'Pulumi', 'CloudFormation', 'Ansible', 'Chef', 'Puppet', 'Helm', 'Kustomize'],
      },
      {
        category: 'Containers & Orchestration',
        description: 'Container and orchestration tooling.',
        keywords: ['Docker', 'Kubernetes', 'k8s', 'Nomad', 'ECS', 'OpenShift', 'service mesh', 'Istio', 'Linkerd', 'Helm charts', 'ArgoCD', 'Flux'],
      },
      {
        category: 'CI/CD',
        description: 'CI/CD tooling.',
        keywords: ['CI/CD', 'GitHub Actions', 'GitLab CI', 'Jenkins', 'CircleCI', 'TeamCity', 'Bamboo', 'BuildKite', 'pipeline-as-code', 'GitOps'],
      },
      {
        category: 'Observability',
        description: 'Observability and reliability tooling.',
        keywords: ['Datadog', 'New Relic', 'Splunk', 'Prometheus', 'Grafana', 'ELK', 'OpenTelemetry', 'tracing', 'distributed tracing', 'SLO', 'SLI', 'SLA', 'on-call', 'incident response', 'PagerDuty', 'postmortem'],
      },
    ],
    actionVerbs: [
      'Architected', 'Migrated', 'Automated', 'Reduced', 'Improved', 'Monitored', 'Scaled', 'Hardened', 'Implemented', 'Operated', 'Owned',
    ],
    softSkills: [
      'On-call discipline', 'Incident-response leadership', 'Cross-team collaboration', 'Documentation', 'Postmortem rigor',
    ],
    howToUse: [
      'Lead bullets with reliability or velocity metrics: deploy frequency, MTTR, uptime.',
      'Match cloud platform exactly — "AWS" not "Amazon Web Services" if the JD says AWS.',
      'List IaC tool from the JD. Terraform is the most common; specify if you know others.',
      'Mention specific incidents you led or migrations you owned.',
    ],
    faq: [
      {
        question: 'Should I list cloud certifications?',
        answer: 'Yes — list AWS Solutions Architect, GCP Professional, etc. once. Helpful at resume screen.',
      },
      {
        question: 'How important is Kubernetes for modern DevOps roles?',
        answer: 'Very. Most modern DevOps JDs assume Kubernetes fluency. List it specifically; abbreviation "k8s" is accepted but Kubernetes is the safe form.',
      },
    ],
    relatedSlugs: ['software-engineer', 'web-developer'],
  },
];

export function getResumeKeywordsBySlug(slug: string): ResumeKeywordsEntry | undefined {
  return RESUME_KEYWORDS.find((e) => e.slug === slug);
}

export function getResumeKeywordsSlugs(): string[] {
  return RESUME_KEYWORDS.map((e) => e.slug);
}

export function getRelatedResumeKeywords(slug: string): ResumeKeywordsEntry[] {
  const current = getResumeKeywordsBySlug(slug);
  if (!current) return [];
  return current.relatedSlugs
    .map((s) => getResumeKeywordsBySlug(s))
    .filter((e): e is ResumeKeywordsEntry => Boolean(e));
}

export function groupResumeKeywordsByCategory(): Record<string, ResumeKeywordsEntry[]> {
  return RESUME_KEYWORDS.reduce<Record<string, ResumeKeywordsEntry[]>>((acc, ex) => {
    if (!acc[ex.category]) acc[ex.category] = [];
    acc[ex.category].push(ex);
    return acc;
  }, {});
}
