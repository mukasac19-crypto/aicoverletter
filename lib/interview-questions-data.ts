// Seed data for the /interview-questions/[slug] programmatic SEO surface.
// Each entry generates one indexable page with role-specific interview
// questions, sample STAR-formatted answers, what hiring panels screen for,
// and FAQ. Add entries here to ship more pages.

export type InterviewQuestion = {
  question: string;
  category: 'behavioral' | 'technical' | 'role-specific' | 'situational' | 'closing';
  whyItsAsked: string;
  howToAnswer: string;
  sampleAnswer?: string;
};

export type InterviewFaq = { question: string; answer: string };

export type InterviewQuestionsExample = {
  slug: string;
  jobTitle: string;
  category: string;
  shortDescription: string;
  meta: { title: string; description: string };
  intro: string;
  hiringPanelStructure: string;
  signalsScreened: string[];
  starFrameworkNote: string;
  questions: InterviewQuestion[];
  faq: InterviewFaq[];
  relatedSlugs: string[];
};

export const INTERVIEW_QUESTIONS: InterviewQuestionsExample[] = [
  {
    slug: 'software-engineer',
    jobTitle: 'Software Engineer',
    category: 'Engineering & Technology',
    shortDescription:
      'The 18 most common software engineer interview questions, what hiring panels are actually screening for, and how to structure answers that move you to the next round.',
    meta: {
      title: 'Software Engineer Interview Questions & Answers (2026 Guide)',
      description:
        'The most common software engineer interview questions with sample answers, what hiring panels screen for, and FAQ. Practice with CareerThings AI Interview Buddy.',
    },
    intro:
      'Software engineering interviews typically span 4-6 rounds: an initial screen, a coding round, a system design round (mid-level+), one or two behavioral rounds, and a hiring-manager close. The questions below cover the full loop. For each, we describe what the panel is actually screening for and how to structure an answer that demonstrates depth without sprawl.',
    hiringPanelStructure:
      'Most software engineering loops include: 1 phone screen with a recruiter, 1 coding round (60-90 min), 1 system design round (mid-level+), 1-2 behavioral rounds, and 1 close with the hiring manager. Each interviewer fills out a scorecard against specific competencies — coding, system design, ownership, collaboration, communication.',
    signalsScreened: [
      'Coding fluency — clean syntax, idiomatic code, edge cases',
      'Problem decomposition — breaking ambiguous problems into tractable pieces',
      'System design depth — trade-offs, scaling, data modeling',
      'Ownership signals — leading work, debugging hard issues, on-call',
      'Cross-functional collaboration with PMs, designers, SREs',
      'Communication — can you explain technical work to non-engineers',
    ],
    starFrameworkNote:
      'For behavioral questions, use the STAR format: Situation (context, 1-2 sentences), Task (your specific responsibility), Action (what YOU did, not your team), Result (measurable outcome). The most common mistake is glossing over Action — interviewers want to know what you specifically contributed, not what the team did.',
    questions: [
      {
        question: 'Tell me about yourself.',
        category: 'behavioral',
        whyItsAsked:
          'Sets the tone for the conversation, gives the interviewer a chance to find threads to pull on. Also a soft-screen for communication ability.',
        howToAnswer:
          'Use the present-past-future structure. ~90 seconds total. Start with what you do today (role, scope, recent shipping wins), pivot to a relevant past chapter (1-2 sentences max), and close with what you\'re looking for next.',
        sampleAnswer:
          '"I\'m a senior software engineer at a Series C SaaS company, where I\'ve spent the last two years on our payments platform. Most recently I led the migration of our checkout API to a serverless architecture — cut p95 latency by 38% and reduced error rates from 1.2% to under 0.1%. Before that I was at a smaller startup where I picked up most of my skills in Go and distributed systems. I\'m looking for a role with more system design scope, ideally in fintech, which is what drew me to this opportunity."',
      },
      {
        question: 'Walk me through your approach to a hard bug you solved recently.',
        category: 'behavioral',
        whyItsAsked:
          'Screens for debugging methodology, persistence, and the ability to communicate technical work to a non-engineer.',
        howToAnswer:
          'Pick a specific bug — recent, debuggable, with a clear root cause. Walk through symptom → hypothesis → tools used → root cause → fix → verification. Spend most of the time on the diagnostic path, not the fix.',
      },
      {
        question: 'Describe a time you disagreed with a teammate and how you handled it.',
        category: 'behavioral',
        whyItsAsked:
          'Screens for collaboration style and emotional regulation under disagreement. Companies want strong opinions, loosely held — not pushovers, not bulldozers.',
        howToAnswer:
          'Pick a real disagreement (technical or process). Describe both positions fairly, what you did to understand the other side, and how you arrived at a decision. Avoid stories where you "won" — interviewers want to see updating, not victory.',
      },
      {
        question: 'Reverse a linked list.',
        category: 'technical',
        whyItsAsked:
          'A classic warm-up problem. Tests basic data structure fluency and ability to write clean code under pressure.',
        howToAnswer:
          'Clarify: in-place or new list? Iterative or recursive? Then walk through the algorithm out loud before coding. Code carefully, narrate as you go, test with edge cases (empty list, single node, two nodes).',
      },
      {
        question: 'Find the longest substring without repeating characters.',
        category: 'technical',
        whyItsAsked:
          'A common medium-difficulty problem. Tests sliding-window technique and the ability to optimize from O(n²) to O(n).',
        howToAnswer:
          'Start with the brute force approach, name its complexity, then optimize. Use a hash map to track last-seen index of each character; advance the left pointer when you encounter a repeat. Test with empty string, all-same characters, and a long mixed string.',
      },
      {
        question: 'Design a URL shortener (like bit.ly).',
        category: 'technical',
        whyItsAsked:
          'Standard mid-level system design question. Tests ability to think about scale, data modeling, hashing, caching, and read-heavy workloads.',
        howToAnswer:
          'Clarify scope: read:write ratio (heavy read), latency target, custom URLs, analytics. Sketch a basic design: app servers, hashing function (base62 of an autoincrement ID), database (relational works fine), cache layer (Redis for hot URLs). Discuss trade-offs: hash collisions, sharding strategy, rate limiting. 30-40 minutes for a full pass.',
      },
      {
        question: 'How would you design Twitter\'s timeline feature?',
        category: 'technical',
        whyItsAsked:
          'A classic system design problem. Tests understanding of fan-out vs. fan-in, push vs. pull, caching strategies, and consistency trade-offs.',
        howToAnswer:
          'Clarify scope (home timeline, user timeline, search). Discuss fan-out: write fan-out for most users (precompute timelines on tweet), fall back to read fan-out (compute at read time) for celebrities with millions of followers. Walk through data model, caching, denormalization. Acknowledge trade-offs explicitly.',
      },
      {
        question: 'Explain the difference between TCP and UDP.',
        category: 'technical',
        whyItsAsked:
          'Tests networking fundamentals. Common in roles that involve infrastructure or real-time systems.',
        howToAnswer:
          'TCP: connection-oriented, reliable, ordered, slower (handshake, retransmission). UDP: connectionless, unreliable, no order guarantees, faster (no handshake). Use TCP for HTTP, file transfer, email; use UDP for video calls, games, DNS — anywhere latency matters more than reliability.',
      },
      {
        question: 'How do you decide between SQL and NoSQL?',
        category: 'technical',
        whyItsAsked:
          'Tests data modeling judgment. Many candidates have a strong default — interviewers want to see if you can reason from first principles.',
        howToAnswer:
          'Default to SQL for transactional data with relationships. Choose NoSQL when scale demands horizontal sharding, schema flexibility is essential, or access patterns are well-defined and write-heavy. The boring answer (SQL is fine for most things) is usually right.',
      },
      {
        question: 'Walk me through a recent project you\'re proud of.',
        category: 'behavioral',
        whyItsAsked:
          'Tests technical depth, ownership, and the ability to communicate work clearly to a varied audience.',
        howToAnswer:
          'Pick a project where you had clear ownership and the outcome was measurable. Describe: the problem, your role, key technical decisions you made, trade-offs you considered, the outcome with numbers, and what you learned. ~5 minutes total.',
      },
      {
        question: 'Tell me about a time you had to learn a new technology quickly.',
        category: 'behavioral',
        whyItsAsked:
          'Tests learning agility — a critical signal at all levels but especially mid-career and below.',
        howToAnswer:
          'Pick a real instance. Describe what triggered the need, how you approached learning (docs, tutorials, paired with someone, built a side project), what you produced, and the outcome. Specific learning method matters — interviewers screen out vague "I just figured it out" answers.',
      },
      {
        question: 'How do you approach code reviews?',
        category: 'behavioral',
        whyItsAsked:
          'Tests collaboration style and engineering rigor. Companies want reviewers who are constructive, fast, and consistent.',
        howToAnswer:
          'Describe what you look for: correctness first, then maintainability, then style. Talk about feedback style (specific, low-ego, asking questions when intent is unclear). Mention how fast you turn around reviews — most teams have a 24-hour expectation.',
      },
      {
        question: 'Describe a time you had to push back on a product or design decision.',
        category: 'behavioral',
        whyItsAsked:
          'Tests cross-functional collaboration style and the willingness to advocate for engineering quality without being obstructionist.',
        howToAnswer:
          'Pick a case where you pushed back and the outcome was good. Describe the disagreement, what data or reasoning you brought, how you presented it, and what was decided. Avoid "I was right and they were wrong" — show updating.',
      },
      {
        question: 'How do you handle being on-call?',
        category: 'role-specific',
        whyItsAsked:
          'Tests operational maturity. Most production engineering roles include on-call rotation.',
        howToAnswer:
          'Describe your approach: pre-shift prep (reading recent runbooks, checking active incidents), during-shift habits (responding fast, escalating early, documenting in real time), post-incident (writing postmortems, contributing to runbook updates). Mention any incidents you led.',
      },
      {
        question: 'How do you balance technical debt vs. shipping new features?',
        category: 'role-specific',
        whyItsAsked:
          'Tests engineering judgment and the ability to advocate for sustainability without being dogmatic.',
        howToAnswer:
          'Describe a working framework: explicitly track debt, allocate a percentage of sprint capacity to it (10-30% is common), prioritize debt that\'s slowing the team or risking incidents. Mention specific cleanups you led.',
      },
      {
        question: 'What are you looking for in your next role?',
        category: 'closing',
        whyItsAsked:
          'Tests motivation alignment. Companies want candidates whose stated wants match what the role actually offers.',
        howToAnswer:
          'Be specific: technical scope, team shape, growth path, mission. Match what you say to what the role actually offers — interviewers will check. Avoid pure compensation framing.',
      },
      {
        question: 'Why are you leaving your current company?',
        category: 'closing',
        whyItsAsked:
          'Screens for diplomacy and self-awareness. Trash-talking your current employer is an instant red flag.',
        howToAnswer:
          'Frame positively. Acknowledge what you\'ve gained at your current company, then describe what you\'re looking for next that the current role doesn\'t offer. Keep it short — 30-60 seconds.',
      },
      {
        question: 'Do you have any questions for me?',
        category: 'closing',
        whyItsAsked:
          'A test of preparation and curiosity. Candidates who don\'t ask thoughtful questions read as low-engagement.',
        howToAnswer:
          'Always have 3-5 questions ready, tailored to the interviewer\'s role. For engineers: "What\'s the most exciting technical problem the team is working on right now?" For managers: "How do you measure success on this team in the first 90 days?" For ICs: "What\'s a recent learning the team has had?"',
      },
    ],
    faq: [
      {
        question: 'How long should I prepare for software engineering interviews?',
        answer:
          'Depends on your starting point. New grads or candidates rusty on data structures: 4-8 weeks of focused practice. Experienced engineers: 2-4 weeks to refresh DSAs and run a few system design mocks. Spread practice over weeks rather than cramming.',
      },
      {
        question: 'Should I memorize answers to behavioral questions?',
        answer:
          'No. Memorize the structure (STAR), pick 5-7 stories that flex across different signals (leadership, conflict, technical depth, debugging, learning), and practice telling each one tightly. Rigid memorized answers sound canned.',
      },
      {
        question: 'How important is system design vs. coding?',
        answer:
          'Coding rounds dominate at junior levels. System design weight increases with seniority — at staff+ levels, system design is often the deciding round. Mid-level: roughly equal weight.',
      },
      {
        question: 'What if I get stuck on a coding problem?',
        answer:
          'Talk through your approach out loud. Most interviewers will give a hint if you\'re truly stuck. The worst move is silence — interviewers can\'t evaluate what they can\'t hear.',
      },
    ],
    relatedSlugs: ['data-analyst', 'product-manager', 'project-manager'],
  },
  {
    slug: 'product-manager',
    jobTitle: 'Product Manager',
    category: 'Product & Strategy',
    shortDescription:
      'The 16 most common product manager interview questions, including product-sense, execution, analytical, and behavioral rounds — with what hiring managers actually screen for.',
    meta: {
      title: 'Product Manager Interview Questions & Answers (2026 Guide)',
      description:
        'The most common product manager interview questions with structured answer guidance, hiring-panel framing, and FAQ. Practice with CareerThings AI Interview Buddy.',
    },
    intro:
      'PM interviews typically include four distinct round types: product sense, execution, analytical, and behavioral. The strongest candidates have a sharp framework for each and demonstrate genuine product instinct under ambiguity. Below are the most common questions across each round, with what the panel is actually screening for.',
    hiringPanelStructure:
      'Most PM loops include: 1 recruiter screen, 1 product-sense round (design a feature), 1 execution round (you have a metric problem, debug it), 1 analytical round (estimation or A/B test interpretation), 1-2 behavioral rounds, and a close with the hiring manager. Each round has its own scorecard.',
    signalsScreened: [
      'Product sense — instinct for what users actually need',
      'Customer empathy via discovery — interviews, usability, win/loss',
      'Analytical rigor — comfort with data, A/B tests, statistical thinking',
      'Strategic framing — "why now" and trade-offs',
      'Cross-functional leadership without authority',
      'Execution — shipping outcomes, not just features',
    ],
    starFrameworkNote:
      'For behavioral questions, use STAR but lean heavily on Action — what YOU did, not what your team did. PMs are evaluated on their ability to move groups; the action paragraph is your evidence.',
    questions: [
      {
        question: 'Walk me through a product you launched and what you learned.',
        category: 'behavioral',
        whyItsAsked:
          'The signature opening question. Tests ownership, outcome thinking, and ability to extract real lessons from shipped work.',
        howToAnswer:
          'Pick a launch with clear ownership, measurable outcome, and a real lesson. Structure: context (1 sentence), your role (1 sentence), discovery (2-3 sentences), trade-offs you made, outcome with metric, lesson learned that changed your future approach.',
      },
      {
        question: 'Design [a feature] for [a product]. (e.g., "Design a save feature for Instagram.")',
        category: 'technical',
        whyItsAsked:
          'The product-sense classic. Tests instinct, structured thinking, and the ability to design without writing code.',
        howToAnswer:
          'Use a framework: clarify the scope and goal (e.g., are we optimizing for retention, engagement, monetization?), identify user personas and their JTBD, brainstorm solutions, prioritize using a stated framework (RICE, impact/effort), pick one and detail it, define success metrics. 30-40 minutes total.',
      },
      {
        question: 'How would you decide whether to build feature X or feature Y?',
        category: 'technical',
        whyItsAsked:
          'Tests prioritization framework and judgment under ambiguity.',
        howToAnswer:
          'Establish goal first — what metric are we trying to move? Then evaluate each feature on impact (estimate the metric lift), effort (eng weeks), confidence (how sure are we?), and strategic fit. Make a recommendation, name what would change your mind.',
      },
      {
        question: 'Daily active users dropped 10% last week. How do you investigate?',
        category: 'technical',
        whyItsAsked:
          'The execution-round classic. Tests analytical instinct and ability to systematically narrow down a metric drop.',
        howToAnswer:
          'Confirm the data first (instrumentation issue? holiday? bot traffic?). Segment: by platform, geography, user cohort, acquisition source. Identify which segment is dropping disproportionately. Form hypothesis. Look at adjacent metrics (retention, conversion). Narrow down to root cause. Discuss what you\'d do to fix.',
      },
      {
        question: 'Estimate the daily revenue of [a popular product/store].',
        category: 'technical',
        whyItsAsked:
          'Tests structured estimation and comfort with order-of-magnitude reasoning.',
        howToAnswer:
          'State your approach: top-down (market size × penetration × ARPU) or bottom-up (users × frequency × price). Pick one, walk through the math out loud, sanity-check the answer against known anchors. Acknowledge uncertainty in your estimates.',
      },
      {
        question: 'Tell me about a time you had to say no to a stakeholder.',
        category: 'behavioral',
        whyItsAsked:
          'Tests influence without authority and the ability to disagree productively.',
        howToAnswer:
          'Pick a real case. Describe the request, why it conflicted with the roadmap, how you said no (with what data and reasoning), and the outcome. Show that the relationship survived — PMs who burn bridges are red flags.',
      },
      {
        question: 'How do you decide what to put on the roadmap?',
        category: 'role-specific',
        whyItsAsked:
          'Tests prioritization philosophy and operational rigor.',
        howToAnswer:
          'Describe a working framework: tie everything to a goal/OKR, score on impact and effort, leave room for unplanned work and bug fixes, balance shipping new features with paying down debt and investing in foundations. Mention how you communicate the roadmap and handle changes.',
      },
      {
        question: 'How do you measure the success of a feature you launched?',
        category: 'role-specific',
        whyItsAsked:
          'Tests analytical rigor and instrumentation discipline.',
        howToAnswer:
          'Define success metrics before shipping. Pick a primary metric, 1-2 secondary metrics, and guardrails (what would make you roll back?). Run as an A/B test where possible. Have a defined readout cadence and pre-committed decision criteria.',
      },
      {
        question: 'Describe a time you used data to change a decision.',
        category: 'behavioral',
        whyItsAsked:
          'Tests analytical instinct and willingness to update.',
        howToAnswer:
          'Pick a case where you had a hypothesis, ran an analysis or experiment, and the data changed your mind. The strongest answers describe being wrong publicly and updating cleanly.',
      },
      {
        question: 'How do you work with engineers?',
        category: 'role-specific',
        whyItsAsked:
          'Tests collaboration style with the function PMs partner with most closely.',
        howToAnswer:
          'Describe how you write PRDs (tight, with clear context and edge cases), how you handle scope discussions (collaborative, willing to cut), how you respond to technical pushback (curious, not defensive), and your involvement during build (visible, supportive, not micromanaging).',
      },
      {
        question: 'Walk me through the metrics you watch most closely in your current role.',
        category: 'behavioral',
        whyItsAsked:
          'Tests product fluency and analytical depth specific to your domain.',
        howToAnswer:
          'Be specific: name the metrics, their definitions, why each matters, and current values if you can share. Demonstrate you actually look at them — talk about a recent week where one shifted and what you did.',
      },
      {
        question: 'Tell me about a feature you launched that failed.',
        category: 'behavioral',
        whyItsAsked:
          'Tests self-awareness, learning agility, and intellectual honesty.',
        howToAnswer:
          'Pick a real failure (not "it was perfect except for one minor thing"). Describe what you shipped, the hypothesis, why it failed, what the data showed, and what you changed about your approach afterward. Don\'t blame the team or external factors.',
      },
      {
        question: 'How do you balance user needs with business needs?',
        category: 'role-specific',
        whyItsAsked:
          'Tests strategic instinct and willingness to engage with monetization tension.',
        howToAnswer:
          'Reject the false dichotomy — they usually align in the long run. Describe a real case where you found alignment, then a case where you had to make a hard trade-off. Talk about how you preserved trust with users when you tilted toward business.',
      },
      {
        question: 'What\'s a product you admire and why?',
        category: 'behavioral',
        whyItsAsked:
          'Tests product taste and the ability to articulate what makes a product good.',
        howToAnswer:
          'Pick a product you actually use (not the obvious answer everyone gives). Describe one specific design decision and what you think the team optimized for. Be willing to identify a weakness too — it shows real engagement.',
      },
      {
        question: 'How do you stay close to customers?',
        category: 'role-specific',
        whyItsAsked:
          'Tests discovery rigor — a strong differentiator between PMs.',
        howToAnswer:
          'Be specific: number of interviews per quarter, how you find them, how you take notes, how you synthesize, how you share findings with the team. Mention specific insights that led to product changes.',
      },
      {
        question: 'Why do you want to work here?',
        category: 'closing',
        whyItsAsked:
          'Tests motivation alignment and depth of research.',
        howToAnswer:
          'Be specific. Name the product surface that interests you, a recent move the company made that resonates, and what you\'d bring. Generic enthusiasm gets filtered.',
      },
    ],
    faq: [
      {
        question: 'What\'s the most important PM interview round?',
        answer:
          'Varies by company. Product sense and execution carry the most weight at most consumer companies; analytical and strategy rounds matter more at enterprise companies. Behavioral rounds are decisive when the score is close.',
      },
      {
        question: 'Do I need an MBA for PM interviews?',
        answer:
          'No. MBAs help with some companies\' new-grad pipelines but are not required. Tech companies broadly weight experience over credentials.',
      },
      {
        question: 'How long should answers be?',
        answer:
          '90 seconds for most behavioral questions. 30-40 minutes for product-sense questions. 20-30 minutes for execution problems. Watch the interviewer\'s body language — wrap up when they\'re ready to move on.',
      },
    ],
    relatedSlugs: ['software-engineer', 'data-analyst', 'marketing-manager'],
  },
  {
    slug: 'data-analyst',
    jobTitle: 'Data Analyst',
    category: 'Data & Analytics',
    shortDescription:
      'The most common data analyst interview questions across SQL, statistics, business judgment, and behavioral rounds — with the framework for each.',
    meta: {
      title: 'Data Analyst Interview Questions & Answers (2026 Guide)',
      description:
        'The most common data analyst interview questions: SQL, statistics, business case studies, and behavioral. Practice with CareerThings AI Interview Buddy.',
    },
    intro:
      'Data analyst interviews test four things: SQL fluency, statistical literacy, business judgment, and communication. The questions below cover the full range. The strongest candidates lead with the business outcome and back it with technical depth — not the other way around.',
    hiringPanelStructure:
      'Typical loop: 1 recruiter screen, 1 SQL round (live coding), 1 statistics/A-B test round, 1 case study (open-ended business problem), 1 behavioral, 1 close with hiring manager.',
    signalsScreened: [
      'SQL fluency — joins, window functions, CTEs',
      'Statistical literacy — A/B tests, sampling, confidence intervals',
      'Business judgment — translating ambiguous questions to clear analyses',
      'Communication — explaining findings to non-technical stakeholders',
      'Tool fluency — Looker/Tableau, Python or R',
    ],
    starFrameworkNote:
      'For behavioral questions: STAR format. For business case questions: structure your answer (problem → hypothesis → data needed → analysis → recommendation).',
    questions: [
      {
        question: 'Write a SQL query to find the second highest salary in an Employees table.',
        category: 'technical',
        whyItsAsked:
          'Classic SQL warm-up. Tests window functions, subqueries, and edge case awareness.',
        howToAnswer:
          'Start with a simple subquery: SELECT MAX(salary) FROM Employees WHERE salary < (SELECT MAX(salary) FROM Employees). Then mention the window function alternative using DENSE_RANK(). Discuss edge cases: ties, no second salary.',
      },
      {
        question: 'Find users who made purchases on three consecutive days.',
        category: 'technical',
        whyItsAsked:
          'Tests window functions and date arithmetic — common in retention analysis.',
        howToAnswer:
          'Use ROW_NUMBER() partitioned by user, ordered by date. Compute date - row_number*INTERVAL day. Group by that and user; users where the count is 3+ have consecutive days. Walk through it carefully.',
      },
      {
        question: 'Explain the difference between INNER JOIN and LEFT JOIN.',
        category: 'technical',
        whyItsAsked:
          'Fundamentals check. Surprising number of analysts get this wrong under pressure.',
        howToAnswer:
          'INNER JOIN returns only rows where the join key exists in both tables. LEFT JOIN returns all rows from the left table, plus matched rows from the right (NULL where no match). Use LEFT JOIN when you want to preserve all left-side records (e.g., all customers, even those with no orders).',
      },
      {
        question: 'You\'re running an A/B test. What metrics do you watch and how do you decide if it\'s significant?',
        category: 'technical',
        whyItsAsked:
          'Tests statistical literacy and experimentation rigor.',
        howToAnswer:
          'Define primary metric, 1-2 secondary, guardrails. Pre-register a sample size based on power analysis. Watch the test daily for clear failures, but only call significance after the planned duration. Use a confidence threshold (typically 95%). Mention the multiple-comparisons problem if running many metrics.',
      },
      {
        question: 'How would you investigate why daily active users dropped 15% yesterday?',
        category: 'technical',
        whyItsAsked:
          'A standard case-study question. Tests systematic thinking under ambiguity.',
        howToAnswer:
          'Confirm the data is real (instrumentation, lag, holiday). Segment: platform, geo, user cohort, acquisition source. Find which segment is dropping disproportionately. Check upstream metrics (signups, retention curves). Narrow to root cause. Recommend next steps.',
      },
      {
        question: 'When would you use a median instead of a mean?',
        category: 'technical',
        whyItsAsked:
          'Tests statistical instinct.',
        howToAnswer:
          'Use median when the distribution is skewed (income, session duration, response times). Mean is sensitive to outliers; median is robust. For business reporting, percentiles (p50, p95, p99) often communicate more than averages.',
      },
      {
        question: 'How do you handle missing data?',
        category: 'technical',
        whyItsAsked:
          'Tests data-handling judgment.',
        howToAnswer:
          'Depends on the cause. If missing-at-random and small percentage: drop those rows or impute (mean, median, model-based). If missing-not-at-random: investigate the cause first — sometimes the missingness itself is signal.',
      },
      {
        question: 'Walk me through a recent analysis where the answer surprised you.',
        category: 'behavioral',
        whyItsAsked:
          'Tests intellectual curiosity and willingness to update.',
        howToAnswer:
          'Pick a real case. Describe the question, your initial hypothesis, the data, what surprised you, and what action came out of it. Show updating without performative drama.',
      },
      {
        question: 'How do you communicate findings to non-technical stakeholders?',
        category: 'behavioral',
        whyItsAsked:
          'Tests communication craft — a major separator between strong and weak analysts.',
        howToAnswer:
          'Lead with the answer, not the methodology. Use plain English, not statistics jargon. One chart per insight. Pre-empt questions ("you might be wondering..."). Always tie findings to a recommendation.',
      },
      {
        question: 'Tell me about a time a stakeholder pushed back on your analysis.',
        category: 'behavioral',
        whyItsAsked:
          'Tests intellectual confidence and the ability to engage with disagreement productively.',
        howToAnswer:
          'Pick a real case. Describe the pushback, what you did to evaluate it (re-examine data? rerun? acknowledge a real flaw?), and the outcome. Show that you can hold ground when you\'re right and update when you\'re not.',
      },
      {
        question: 'What\'s the most interesting analysis you\'ve done?',
        category: 'behavioral',
        whyItsAsked:
          'Tests passion, depth, and the ability to communicate technical work in an engaging way.',
        howToAnswer:
          'Pick something with both technical depth and business impact. Walk through the question, the data complexity, the analytical approach, and the action that came out of it.',
      },
      {
        question: 'How do you decide what to analyze when you have unlimited data?',
        category: 'role-specific',
        whyItsAsked:
          'Tests prioritization — strong analysts pick the highest-leverage questions.',
        howToAnswer:
          'Anchor on business priorities. Triage requests by potential decision impact. Build self-serve dashboards for repeated questions; reserve deep analysis for novel high-stakes problems.',
      },
      {
        question: 'How comfortable are you with Python or R?',
        category: 'role-specific',
        whyItsAsked:
          'Tests technical breadth beyond SQL.',
        howToAnswer:
          'Be honest about depth. If primary tool is Python: mention pandas, numpy, scikit-learn, notebooks; describe a project. If primary tool is SQL: acknowledge it, mention any Python use, and show willingness to grow.',
      },
      {
        question: 'Do you have any questions for us?',
        category: 'closing',
        whyItsAsked:
          'Tests engagement and prep.',
        howToAnswer:
          'Have 3-5 ready: "What\'s the most ambiguous question the team has tackled recently?" "How is data maturity changing in this org?" "What separates a great analyst from a good one on this team?"',
      },
    ],
    faq: [
      {
        question: 'How important is Python for data analyst roles?',
        answer:
          'Depends on the team. Some teams are SQL-only; many expect basic Python (pandas, notebooks). For analytics-engineering or ML-adjacent roles, Python is non-negotiable. Always check the JD.',
      },
      {
        question: 'What SQL flavor should I prepare for?',
        answer:
          'Standard ANSI SQL is the safe baseline. If the company uses BigQuery, Snowflake, or Postgres, learn the specific window functions and date functions. Most interviews allow vendor-neutral syntax.',
      },
    ],
    relatedSlugs: ['software-engineer', 'product-manager', 'business-analyst'],
  },
  {
    slug: 'project-manager',
    jobTitle: 'Project Manager',
    category: 'Operations & Project Management',
    shortDescription:
      'The most common project manager interview questions, methodology choices, stakeholder-management scenarios, and how to demonstrate delivery discipline.',
    meta: {
      title: 'Project Manager Interview Questions & Answers (2026 Guide)',
      description:
        'The most common project manager interview questions with sample answers. Methodologies, stakeholder management, risk, scope, and behavioral. Practice with CareerThings AI.',
    },
    intro:
      'Project manager interviews focus on delivery: have you shipped complex initiatives on time and on budget, can you handle ambiguity, do you communicate proactively. The questions below cover the full loop.',
    hiringPanelStructure:
      'Typical loop: 1 recruiter screen, 1 hiring-manager round (deep on past projects), 1-2 cross-functional rounds (engineering, business stakeholders), 1 behavioral, 1 close.',
    signalsScreened: [
      'Complex initiatives delivered on time and on budget',
      'Methodology fluency (Agile, Scrum, Waterfall, hybrid)',
      'Stakeholder management across functions and levels',
      'Risk identification and mitigation',
      'Communication discipline — written and verbal',
    ],
    starFrameworkNote:
      'STAR format. Be specific about scope (budget, team size, duration) and outcome (early/late, under/over budget, customer impact).',
    questions: [
      {
        question: 'Walk me through the most complex project you\'ve managed.',
        category: 'behavioral',
        whyItsAsked:
          'The signature opening. Tests scope, ownership, and storytelling.',
        howToAnswer:
          'Pick a project relevant to the role. Describe scope (budget, timeline, team), key risks, methodology, your role, the outcome with numbers. ~5 minutes total.',
      },
      {
        question: 'How do you handle scope creep?',
        category: 'role-specific',
        whyItsAsked:
          'Tests delivery discipline and the ability to push back diplomatically.',
        howToAnswer:
          'Describe a working framework: change-request process, impact assessment (timeline, cost), escalation to sponsor when material. Mention a specific case where you said no productively.',
      },
      {
        question: 'Tell me about a project that went off-track.',
        category: 'behavioral',
        whyItsAsked:
          'Tests intellectual honesty and recovery skill.',
        howToAnswer:
          'Pick a real case. Describe what went wrong, when you noticed, what you did to recover, the outcome. Don\'t blame; focus on what you owned.',
      },
      {
        question: 'How do you decide between Agile and Waterfall?',
        category: 'technical',
        whyItsAsked:
          'Tests methodology judgment.',
        howToAnswer:
          'Agile when requirements are uncertain or expected to change; Waterfall when scope is fixed and regulated (compliance, hardware, large-scale construction). Hybrid for most large enterprise programs. Avoid dogma.',
      },
      {
        question: 'Walk me through how you build a project timeline.',
        category: 'role-specific',
        whyItsAsked:
          'Tests planning rigor.',
        howToAnswer:
          'Describe the steps: capture all deliverables, identify dependencies, estimate work (with team input, not solo), build a critical path, add buffer for risk, validate with sponsors.',
      },
      {
        question: 'How do you handle a key team member who isn\'t delivering?',
        category: 'behavioral',
        whyItsAsked:
          'Tests stakeholder-management discipline.',
        howToAnswer:
          'Start with curiosity (capacity? blockers? clarity?). Have a direct one-on-one. Document specifics. Escalate to manager only when collaborative effort hasn\'t worked. Avoid CC bombs.',
      },
      {
        question: 'What\'s your approach to risk management?',
        category: 'role-specific',
        whyItsAsked:
          'Tests delivery discipline at the project-management craft level.',
        howToAnswer:
          'Describe a working framework: identify risks early (with team input), assess probability and impact, mitigate or accept, monitor weekly, escalate when triggers fire. Mention a specific risk you mitigated successfully.',
      },
      {
        question: 'How do you manage up — keeping executives informed without spamming them?',
        category: 'role-specific',
        whyItsAsked:
          'Tests communication discipline at the senior-stakeholder level.',
        howToAnswer:
          'Describe a working cadence: weekly written status (concise, RAG-style), monthly steering committee meetings, immediate escalation for material risks. Tailor format to the executive\'s preference.',
      },
      {
        question: 'Tell me about a time you had to deliver bad news to a stakeholder.',
        category: 'behavioral',
        whyItsAsked:
          'Tests communication craft and emotional regulation.',
        howToAnswer:
          'Pick a real case. Describe the news, how you delivered it (direct, with context and a recovery plan), and the outcome. Show that you didn\'t soften the message into uselessness.',
      },
      {
        question: 'What tools do you use to manage projects?',
        category: 'role-specific',
        whyItsAsked:
          'Tools fluency check.',
        howToAnswer:
          'Match the JD. Common stack: Jira or Asana for tracking, Confluence or Notion for docs, Smartsheet or MS Project for Gantt, Slack for daily comms. Mention specific use cases.',
      },
      {
        question: 'How do you keep a project\'s budget on track?',
        category: 'role-specific',
        whyItsAsked:
          'Tests financial discipline.',
        howToAnswer:
          'Describe practices: weekly burn-rate review, forecasting against original baseline, change-control for budget changes, transparent stakeholder reporting on overspend.',
      },
      {
        question: 'Why do you want to work here?',
        category: 'closing',
        whyItsAsked:
          'Motivation alignment.',
        howToAnswer:
          'Be specific: name the program type, team scale, or domain that drew you. Generic enthusiasm gets filtered.',
      },
    ],
    faq: [
      {
        question: 'Should I get my PMP before applying for PM roles?',
        answer:
          'Depends on the company. Many enterprises require it; many tech companies don\'t care. Always check the JD. If you don\'t have it but the JD asks, mention any in-progress study or equivalent (CSM, PRINCE2).',
      },
      {
        question: 'Do PM interviews include technical questions?',
        answer:
          'Usually no — but expect deep questions about methodology, tools, and risk practices. For technical-program-manager roles, expect to discuss specific technical projects and tradeoffs.',
      },
    ],
    relatedSlugs: ['software-engineer', 'product-manager', 'business-analyst'],
  },
  {
    slug: 'marketing-manager',
    jobTitle: 'Marketing Manager',
    category: 'Marketing & Communications',
    shortDescription:
      'Marketing manager interview questions: pipeline impact, channel strategy, attribution, and the brand-vs-performance trade-offs hiring managers screen for.',
    meta: {
      title: 'Marketing Manager Interview Questions & Answers (2026 Guide)',
      description:
        'The most common marketing manager interview questions with structured answers. Channels, attribution, brand, and behavioral. Practice with CareerThings AI Interview Buddy.',
    },
    intro:
      'Marketing manager interviews focus on revenue impact, channel craft, and brand judgment. The strongest candidates lead with pipeline numbers and connect channel choices to business strategy.',
    hiringPanelStructure:
      'Typical loop: 1 recruiter screen, 1 hiring-manager round (deep on past programs), 1-2 cross-functional rounds (sales, product), 1 case study (e.g., "design a campaign for X"), 1 close.',
    signalsScreened: [
      'Pipeline or revenue impact',
      'Channel mastery — paid, lifecycle, content, events',
      'Comfort with attribution and dashboards',
      'Strong copywriting and brand judgment',
      'Cross-functional partnership with sales and product',
    ],
    starFrameworkNote:
      'STAR format. Quantify pipeline numbers and channel-specific outcomes.',
    questions: [
      {
        question: 'Walk me through the most successful campaign you\'ve run.',
        category: 'behavioral',
        whyItsAsked:
          'Signature opener. Tests outcome thinking and storytelling.',
        howToAnswer:
          'Pick a campaign with a measurable outcome (pipeline, MQL, revenue). Describe goal, audience, channel mix, creative, results. Be specific about your role.',
      },
      {
        question: 'How do you decide between paid and organic channels?',
        category: 'role-specific',
        whyItsAsked:
          'Tests channel strategy judgment.',
        howToAnswer:
          'Depends on stage and goals. Early-stage: paid for fast feedback loops, organic for compounding moats. Mature: rebalance toward organic as content and brand earn distribution. Discuss CAC payback as the framing.',
      },
      {
        question: 'Tell me about a campaign that underperformed and what you learned.',
        category: 'behavioral',
        whyItsAsked:
          'Tests honesty and learning.',
        howToAnswer:
          'Pick a real failure. Describe the hypothesis, the result, the diagnosis, and what changed in your approach.',
      },
      {
        question: 'How do you think about attribution?',
        category: 'technical',
        whyItsAsked:
          'Tests sophistication on a topic where most marketers are sloppy.',
        howToAnswer:
          'Acknowledge the complexity: last-touch is misleading, multi-touch is better but still imperfect, MMM helps for big spend. Use attribution as a tool for sharpening decisions, not winning credit fights.',
      },
      {
        question: 'How do you balance brand and performance marketing?',
        category: 'role-specific',
        whyItsAsked:
          'Tests strategic instinct.',
        howToAnswer:
          'They feed each other in the long run. Performance for short-term pipeline; brand for long-term CAC reduction and pricing power. Allocate based on stage and growth math; revisit annually.',
      },
      {
        question: 'Walk me through how you\'d launch a new product.',
        category: 'technical',
        whyItsAsked:
          'Tests cross-functional GTM thinking.',
        howToAnswer:
          'Use a structured framework: positioning, audience, messaging, channels, sales enablement, success metrics, post-launch optimization. 20-25 minutes.',
      },
      {
        question: 'How do you partner with sales?',
        category: 'role-specific',
        whyItsAsked:
          'Tests cross-functional fluency.',
        howToAnswer:
          'Describe practices: weekly sync, shared pipeline definitions, joint feedback loops on lead quality, account-based co-prosecution. Mention specific wins.',
      },
      {
        question: 'What metrics do you watch most closely?',
        category: 'role-specific',
        whyItsAsked:
          'Tests analytical fluency.',
        howToAnswer:
          'Be specific: pipeline sourced, CAC payback, MQL-to-SQL conversion, channel ROAS, content traffic-to-pipeline. Mention current values if you can share.',
      },
      {
        question: 'Show me a piece of writing you\'re proud of.',
        category: 'role-specific',
        whyItsAsked:
          'Tests craft.',
        howToAnswer:
          'Have 2-3 pieces ready (a blog post, an email campaign, a brief). Walk through audience, goal, creative choices, and outcome.',
      },
      {
        question: 'How do you stay sharp on the field?',
        category: 'closing',
        whyItsAsked:
          'Tests curiosity.',
        howToAnswer:
          'Be specific: 3-5 newsletters, 2-3 podcasts, communities you\'re in, recent ideas you\'ve adopted.',
      },
    ],
    faq: [
      {
        question: 'How do I prepare a portfolio for marketing interviews?',
        answer:
          'Have 3-5 case studies ready: each with goal, audience, channels, creative samples, results. Be ready to walk through them in 5 minutes each.',
      },
      {
        question: 'How important is creative judgment vs. analytical depth?',
        answer:
          'Both. Strong marketers can write a brief AND read an attribution model. Companies optimizing for one over the other get unbalanced teams.',
      },
    ],
    relatedSlugs: ['product-manager', 'data-analyst', 'sales-representative'],
  },
  {
    slug: 'registered-nurse',
    jobTitle: 'Registered Nurse',
    category: 'Healthcare',
    shortDescription:
      'Registered nurse interview questions covering clinical scenarios, communication with families, conflict, and the soft-skills nurse managers actually screen for.',
    meta: {
      title: 'Registered Nurse Interview Questions & Answers (2026 Guide)',
      description:
        'The most common RN interview questions with structured answers. Clinical scenarios, communication, conflict, and behavioral. Practice with CareerThings AI Interview Buddy.',
    },
    intro:
      'Nursing interviews focus on clinical judgment, communication, and emotional regulation under pressure. Unit managers want to see specific patient stories that demonstrate calm thinking and clear communication.',
    hiringPanelStructure:
      'Typical loop: 1 phone screen with HR, 1 unit-manager interview, 1 peer interview (panel of 2-3 nurses), sometimes 1 charge-nurse interview. Many hospitals also include a personality assessment.',
    signalsScreened: [
      'Clinical judgment in ambiguous situations',
      'Communication with families and interdisciplinary team',
      'Emotional regulation under pressure',
      'Specialty-specific competence (ICU, ED, peds, etc.)',
      'EHR and tools fluency',
    ],
    starFrameworkNote:
      'Use STAR for clinical scenarios. Be careful with patient privacy — anonymize details and avoid identifying information.',
    questions: [
      {
        question: 'Tell me about a difficult patient interaction and how you handled it.',
        category: 'behavioral',
        whyItsAsked:
          'Tests emotional regulation, de-escalation, and patient-centered care.',
        howToAnswer:
          'Pick a real case (anonymized). Describe the situation, the patient\'s emotional state, what you did to listen and de-escalate, and the outcome. Show empathy without being saccharine.',
      },
      {
        question: 'Walk me through a time you advocated for a patient.',
        category: 'behavioral',
        whyItsAsked:
          'Tests assertiveness with the interdisciplinary team and patient-first instincts.',
        howToAnswer:
          'Pick a case where you escalated a concern (pain management, medication question, family wishes). Describe what you noticed, who you communicated with, and the outcome.',
      },
      {
        question: 'How do you handle a doctor who you disagree with?',
        category: 'situational',
        whyItsAsked:
          'Tests assertiveness, communication craft, and respect for the chain of command.',
        howToAnswer:
          'Describe a working approach: ask questions first to understand the rationale, raise the concern with specifics, escalate to the charge nurse if the patient\'s safety is at stake. Show that you can hold ground without being adversarial.',
      },
      {
        question: 'Describe your experience with EHR documentation.',
        category: 'role-specific',
        whyItsAsked:
          'Tests EHR fluency and documentation discipline.',
        howToAnswer:
          'Name the system (Epic, Cerner, Meditech), describe what you document and at what intervals, and any specific Epic modules or workflows you\'re familiar with.',
      },
      {
        question: 'How do you prioritize when you have multiple critical patients?',
        category: 'situational',
        whyItsAsked:
          'Tests clinical triage instinct.',
        howToAnswer:
          'Describe a working framework: ABCs first (airway, breathing, circulation), then unstable vs. stable, then patient ratio considerations. Mention asking for help when needed.',
      },
      {
        question: 'Tell me about a mistake you made and how you handled it.',
        category: 'behavioral',
        whyItsAsked:
          'Tests honesty, transparency, and the willingness to learn.',
        howToAnswer:
          'Pick a real, low-severity mistake (med-administration timing miss, documentation error). Describe what happened, how you reported it, what changed afterward. Don\'t hide; don\'t over-flagellate.',
      },
      {
        question: 'How do you communicate with families during difficult moments?',
        category: 'situational',
        whyItsAsked:
          'Tests empathy and communication craft.',
        howToAnswer:
          'Describe practices: meet where they\'re at emotionally, give clear plain-language information, acknowledge what you don\'t know, follow up with consistent updates. Mention a specific case where you handled this well.',
      },
      {
        question: 'What\'s your experience with new graduate orientation as a preceptor?',
        category: 'role-specific',
        whyItsAsked:
          'Tests teaching ability — relevant for senior roles.',
        howToAnswer:
          'Name how many you\'ve precepted, your approach (gradual independence, daily debriefs, error-tolerant climate), and outcomes (retention, competency).',
      },
      {
        question: 'Why this hospital and this unit?',
        category: 'closing',
        whyItsAsked:
          'Tests motivation and research depth.',
        howToAnswer:
          'Be specific: Magnet status, recent recognition, a program you admire, the unit\'s patient population. Generic answers get filtered.',
      },
      {
        question: 'How do you take care of yourself in this profession?',
        category: 'closing',
        whyItsAsked:
          'Burnout is real and managers screen for self-awareness.',
        howToAnswer:
          'Be honest: rest, exercise, social support, mental-health support if needed. Show that you understand the demands and have a plan.',
      },
    ],
    faq: [
      {
        question: 'Should I bring my license and certifications to a nursing interview?',
        answer:
          'Bring copies. Some employers will need to verify before hire. Have license number, BLS, ACLS, and any specialty certs ready.',
      },
      {
        question: 'How do I handle questions about gaps in my employment?',
        answer:
          'Be honest. Gaps for family, education, or burnout recovery are common in nursing. Frame what you did during the gap and what you bring back.',
      },
    ],
    relatedSlugs: ['teacher', 'project-manager'],
  },
  {
    slug: 'teacher',
    jobTitle: 'Teacher',
    category: 'Education',
    shortDescription:
      'Teacher interview questions covering classroom management, differentiation, family communication, and the instructional rigor hiring principals screen for.',
    meta: {
      title: 'Teacher Interview Questions & Answers (2026 Guide)',
      description:
        'The most common teacher interview questions with structured answers. Classroom management, differentiation, family, and behavioral. Practice with CareerThings AI Interview Buddy.',
    },
    intro:
      'Teaching interviews focus on instructional craft, classroom management, and the ability to communicate with families and colleagues. Strong candidates anchor every answer in specific student-growth stories.',
    hiringPanelStructure:
      'Typical loop: 1 phone screen, 1 building-level interview (principal + instructional coach), sometimes a demo lesson, 1 panel interview with grade-level team. Many districts include a video-recorded teaching sample.',
    signalsScreened: [
      'Instructional craft — clear lesson structure, formative checks',
      'Classroom management — routines, consistency, relationships',
      'Differentiation for IEPs, ELLs, gifted students',
      'Family communication and PLC participation',
      'State certification status',
    ],
    starFrameworkNote:
      'Anchor every answer in a specific student-growth or classroom story. Generic philosophy without examples gets filtered.',
    questions: [
      {
        question: 'Walk me through your typical classroom day.',
        category: 'behavioral',
        whyItsAsked:
          'Tests instructional structure and routine discipline.',
        howToAnswer:
          'Describe a typical day end-to-end: greeting routine, do-now/bell-ringer, mini-lesson, work time/small groups, closing reflection. Be specific about timing and transitions.',
      },
      {
        question: 'Tell me about a time you turned around a struggling student.',
        category: 'behavioral',
        whyItsAsked:
          'Tests differentiation, persistence, and family/colleague partnership.',
        howToAnswer:
          'Pick a specific student (anonymized). Describe the situation, your interventions (specific instructional and relational), outcome with measurable growth.',
      },
      {
        question: 'How do you handle a disruptive student?',
        category: 'situational',
        whyItsAsked:
          'Tests classroom management craft.',
        howToAnswer:
          'Describe a tiered approach: relationship and curiosity first, clear expectations and consistent consequences, family contact, escalation only when needed. Avoid descriptions that read as adversarial.',
      },
      {
        question: 'How do you differentiate for students with IEPs?',
        category: 'role-specific',
        whyItsAsked:
          'Tests special-education collaboration.',
        howToAnswer:
          'Describe specific strategies (varied scaffolding, multiple modalities, collaboration with case managers and pull-out teachers). Mention how you check effectiveness.',
      },
      {
        question: 'How do you communicate with families?',
        category: 'role-specific',
        whyItsAsked:
          'Tests family-engagement discipline.',
        howToAnswer:
          'Describe practices: positive communication first (early in the year, ongoing), clear documentation, weekly newsletter or digital tool, prompt response to concerns. Quantify if you can ("30+ positive home contacts per quarter").',
      },
      {
        question: 'Tell me about a lesson that didn\'t go well.',
        category: 'behavioral',
        whyItsAsked:
          'Tests reflection and learning.',
        howToAnswer:
          'Pick a real case. Describe what failed, how you noticed (formative check, student question), what you changed for next time. Show growth-mindset framing.',
      },
      {
        question: 'How do you use data to inform instruction?',
        category: 'role-specific',
        whyItsAsked:
          'Tests data-driven instruction discipline.',
        howToAnswer:
          'Describe specific tools (NWEA MAP, exit tickets, formative quizzes), cadence (daily, weekly, monthly), and how data changes practice (regrouping, reteaching, intervention).',
      },
      {
        question: 'How do you handle a parent who disagrees with a grade?',
        category: 'situational',
        whyItsAsked:
          'Tests communication craft and conflict regulation.',
        howToAnswer:
          'Describe a working approach: listen first, share specific student work and rubric, find common ground, escalate to admin only when warranted. Stay anchored in evidence.',
      },
      {
        question: 'Why this school?',
        category: 'closing',
        whyItsAsked:
          'Tests motivation and research.',
        howToAnswer:
          'Be specific: a program, the school\'s mission, a leadership figure you admire. Generic answers get filtered.',
      },
      {
        question: 'What\'s your classroom-management philosophy in one sentence?',
        category: 'closing',
        whyItsAsked:
          'Tests clarity of philosophy and ability to articulate it.',
        howToAnswer:
          'Have one ready: e.g., "Clear expectations, consistent consequences, strong relationships — in that order." Be ready to support with specific routines.',
      },
    ],
    faq: [
      {
        question: 'Should I bring lesson plans to a teaching interview?',
        answer:
          'Yes. Bring 2-3 polished lesson plans (one for the grade/subject you\'re applying to). Some districts ask candidates to submit them in advance.',
      },
      {
        question: 'What if the school asks me to teach a demo lesson?',
        answer:
          'Prepare a tight 15-30 minute lesson with a clear objective, varied instructional approaches, and a formative check. Practice the timing.',
      },
    ],
    relatedSlugs: ['registered-nurse', 'project-manager'],
  },
  {
    slug: 'accountant',
    jobTitle: 'Accountant',
    category: 'Finance & Accounting',
    shortDescription:
      'Accountant interview questions covering close-cycle ownership, GAAP, ERP fluency, audit experience, and the technical depth controllers screen for.',
    meta: {
      title: 'Accountant Interview Questions & Answers (2026 Guide)',
      description:
        'The most common accountant interview questions with structured answers. Close cycle, reconciliations, audit, ERP. Practice with CareerThings AI Interview Buddy.',
    },
    intro:
      'Accountant interviews focus on technical depth (GAAP, close cycle, ERP fluency) and process discipline. Hiring managers want to see specific cases of reconciliation, audit-readiness, and journal-entry quality.',
    hiringPanelStructure:
      'Typical loop: 1 recruiter screen, 1 controller interview (deep technical), 1 manager interview, 1 cross-functional (often FP&A), 1 close.',
    signalsScreened: [
      'GAAP fluency and current CPA status',
      'Close-cycle ownership across multiple entities',
      'Reconciliation experience',
      'ERP fluency (NetSuite, SAP, Oracle, QuickBooks)',
      'Audit-ready documentation and SOX awareness',
    ],
    starFrameworkNote:
      'Be specific about close-cycle metrics, entities, accounts, and audit outcomes.',
    questions: [
      {
        question: 'Walk me through your month-end close process.',
        category: 'role-specific',
        whyItsAsked:
          'Signature opener for accountants.',
        howToAnswer:
          'Describe end-to-end: cutoff, accruals, intercompany, reconciliations, financial statements, variance analysis, executive review. Mention number of entities, days to close, and accuracy.',
      },
      {
        question: 'Explain the difference between accrual and cash accounting.',
        category: 'technical',
        whyItsAsked:
          'Fundamentals check.',
        howToAnswer:
          'Accrual: revenue recognized when earned, expenses when incurred. Cash: recorded when money moves. GAAP requires accrual for most companies. Cash is sometimes used for very small businesses or tax purposes.',
      },
      {
        question: 'What\'s your experience with revenue recognition under ASC 606?',
        category: 'technical',
        whyItsAsked:
          'Tests SaaS-specific or industry-specific knowledge.',
        howToAnswer:
          'Walk through the 5 steps: identify contract, identify performance obligations, determine transaction price, allocate price, recognize revenue. Mention specific cases where you\'ve applied this (ratable subscription, milestone-based, multi-element).',
      },
      {
        question: 'Describe a complex reconciliation you\'ve handled.',
        category: 'behavioral',
        whyItsAsked:
          'Tests technical depth and problem-solving.',
        howToAnswer:
          'Pick a real case (intercompany, fixed assets, revenue cutoff). Describe the complexity, your approach, the issue you found, the resolution.',
      },
      {
        question: 'Walk me through your experience with an external audit.',
        category: 'role-specific',
        whyItsAsked:
          'Tests audit-readiness experience.',
        howToAnswer:
          'Describe scope (which auditor, which entity), your role (preparing PBC, responding to requests, walking through controls), the outcome (clean opinion, deficiencies remediated). Mention specific experiences with SOX walkthroughs.',
      },
      {
        question: 'How do you handle a journal entry where you\'re not sure of the right treatment?',
        category: 'situational',
        whyItsAsked:
          'Tests intellectual honesty and process discipline.',
        howToAnswer:
          'Research first (GAAP guidance, internal policy), consult with senior colleagues, document the rationale. Show that you don\'t guess and you don\'t hide uncertainty.',
      },
      {
        question: 'What ERP systems have you used?',
        category: 'role-specific',
        whyItsAsked:
          'Tools fluency check.',
        howToAnswer:
          'Match the JD. Describe depth in 1-2 systems (modules, customizations, implementations). Avoid listing every system superficially.',
      },
      {
        question: 'How do you handle a tight close cycle when something goes wrong?',
        category: 'situational',
        whyItsAsked:
          'Tests calm under deadline.',
        howToAnswer:
          'Describe a real instance: triage the issue, escalate to controller, find a path forward (workaround, defer to next cycle if material adjusted, immediate fix). Show that you don\'t panic.',
      },
      {
        question: 'How comfortable are you with Excel?',
        category: 'role-specific',
        whyItsAsked:
          'Tests modeling fluency.',
        howToAnswer:
          'Be specific: pivot tables, INDEX-MATCH, SUMIFS, financial functions. Mention any modeling work (variance analysis, forecasting). Power Query / Power Pivot if you have it.',
      },
      {
        question: 'Why do you want to leave your current company?',
        category: 'closing',
        whyItsAsked:
          'Tests diplomacy.',
        howToAnswer:
          'Frame positively. Acknowledge gains, describe what you\'re looking for that the current role doesn\'t offer.',
      },
    ],
    faq: [
      {
        question: 'Do I need to be a CPA for accountant roles?',
        answer:
          'For staff and senior accountant roles, often yes (or candidate). For controller and director roles, almost always required. Always check the JD.',
      },
      {
        question: 'How important is industry experience for accounting?',
        answer:
          'Matters more for senior/controller roles. SaaS revenue recognition, manufacturing inventory, healthcare compliance — these are real specialties.',
      },
    ],
    relatedSlugs: ['business-analyst', 'data-analyst', 'project-manager'],
  },
];

export function getInterviewQuestionsBySlug(slug: string): InterviewQuestionsExample | undefined {
  return INTERVIEW_QUESTIONS.find((e) => e.slug === slug);
}

export function getInterviewQuestionsSlugs(): string[] {
  return INTERVIEW_QUESTIONS.map((e) => e.slug);
}

export function getRelatedInterviewQuestions(slug: string): InterviewQuestionsExample[] {
  const current = getInterviewQuestionsBySlug(slug);
  if (!current) return [];
  return current.relatedSlugs
    .map((s) => getInterviewQuestionsBySlug(s))
    .filter((e): e is InterviewQuestionsExample => Boolean(e));
}

export function groupInterviewQuestionsByCategory(): Record<string, InterviewQuestionsExample[]> {
  return INTERVIEW_QUESTIONS.reduce<Record<string, InterviewQuestionsExample[]>>((acc, ex) => {
    if (!acc[ex.category]) acc[ex.category] = [];
    acc[ex.category].push(ex);
    return acc;
  }, {});
}

// ---------- Seniority modifier support ----------

import type { SeniorityModifier } from './seniority-modifiers';

const IQ_LABELS: Record<SeniorityModifier, string> = {
  'entry-level': 'Entry-Level',
  junior: 'Junior',
  senior: 'Senior',
  lead: 'Lead',
  manager: 'Manager',
};

const IQ_INTROS: Record<SeniorityModifier, (job: string) => string> = {
  'entry-level': (job) =>
    `Entry-level ${job.toLowerCase()} interviews focus heavily on potential, learning agility, and core fundamentals. The questions below are the most common ones in entry-level loops; the strongest candidates anchor every answer in coursework, internships, or side-project specifics — not vague hypotheticals.`,
  junior: (job) =>
    `Junior ${job.toLowerCase()} interviews mix fundamentals with early-career project work. The questions below are common across junior loops. Strong candidates lead with the most ambitious project they've shipped and demonstrate eagerness to learn without performing inexperience.`,
  senior: (job) =>
    `Senior ${job.toLowerCase()} interviews screen for depth, scope of ownership, and the ability to operate under ambiguity without much oversight. Expect deeper technical questions, more open-ended scenarios, and sharper screening on cross-functional collaboration.`,
  lead: (job) =>
    `Lead ${job.toLowerCase()} interviews go beyond senior — they test technical judgment at scope, ability to set direction, and capacity to grow other senior people. Expect architecture deep-dives, decision frameworks, and questions on how you've influenced peers without authority.`,
  manager: (job) =>
    `${IQ_LABELS.manager} ${job.toLowerCase()} interviews focus heavily on people leadership: hiring, growing reports, performance management, and partnering across functions. Be ready with at least one specific story for each of those areas.`,
};

const IQ_SIGNAL_PREPEND: Record<SeniorityModifier, string[]> = {
  'entry-level': [
    'Learning agility — concrete examples of picking up new skills fast',
    'Fundamentals — comfort with the core technical concepts of the role',
  ],
  junior: [
    'Most ambitious shipped work — the upper bound of what you can do',
    'Eagerness to learn paired with execution discipline',
  ],
  senior: [
    'Scope — cross-team work, ambiguous problems, hardest-part ownership',
    'Independence — ability to operate without close oversight',
  ],
  lead: [
    'Architectural / strategic judgment that shaped team direction',
    'Growing peers — mentorship, technical leadership without authority',
  ],
  manager: [
    'Team size, reporting structure, business outcomes owned',
    'Specific growth stories — promotions, hires, hard performance calls',
  ],
};

export function applyInterviewModifier(
  example: InterviewQuestionsExample,
  modifier: SeniorityModifier,
): InterviewQuestionsExample {
  const label = IQ_LABELS[modifier];
  const labeledTitle = `${label} ${example.jobTitle}`;
  return {
    ...example,
    slug: `${modifier}-${example.slug}`,
    jobTitle: labeledTitle,
    meta: {
      title: `${labeledTitle} Interview Questions & Sample Answers`,
      description: `Common ${label.toLowerCase()} ${example.jobTitle.toLowerCase()} interview questions with sample answers, hiring-panel insights, and FAQ. Practice with CareerThings AI Interview Buddy.`,
    },
    shortDescription: `Common ${label.toLowerCase()} ${example.jobTitle.toLowerCase()} interview questions with sample answers and seniority-specific guidance.`,
    intro: IQ_INTROS[modifier](example.jobTitle),
    signalsScreened: [...IQ_SIGNAL_PREPEND[modifier], ...example.signalsScreened],
  };
}
