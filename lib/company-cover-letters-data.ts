// Seed data for the /cover-letter-for/[slug] programmatic SEO surface.
// One indexable page per company, keyword-rich, with company-specific tone,
// values, and a tailored sample. This is the silo competitors largely ignore —
// "cover letter for Google", "cover letter for Tesla" are high-intent searches
// with weak existing top-10 results.

export type CompanyFaq = { question: string; answer: string };

export type CompanyCoverLetter = {
  slug: string;
  companyName: string;
  industry: string;
  shortDescription: string;
  meta: { title: string; description: string };
  intro: string;
  cultureSignals: string[];
  valueKeywords: string[];
  applicationTips: string[];
  sampleLetter: {
    greeting: string;
    paragraphs: string[];
    closing: string;
    signature: string;
  };
  faq: CompanyFaq[];
  relatedSlugs: string[];
};

export const COMPANY_COVER_LETTERS: CompanyCoverLetter[] = [
  {
    slug: 'google',
    companyName: 'Google',
    industry: 'Technology / Search & Cloud',
    shortDescription:
      'A cover letter for Google built around technical depth, "Googleyness," and the user-impact thinking that surfaces in every interview loop.',
    meta: {
      title: 'Cover Letter for Google — Example & Writing Guide',
      description:
        'A proven cover letter example for Google jobs, with culture-specific tips, keywords, and FAQ. Tailor it to your specific role with CareerThings AI.',
    },
    intro:
      'Cover letters for Google are read by recruiters who screen thousands per quarter. The strongest ones lead with measurable user impact, demonstrate technical depth (regardless of role), and reflect the cultural attributes Google calls "Googleyness" — humility, comfort with ambiguity, intellectual curiosity. Generic cover letters get filtered fast.',
    cultureSignals: [
      'User-first thinking (Google\'s first principle)',
      'Comfort with ambiguity and large scale',
      'Bias for data — claims backed by evidence',
      'Intellectual humility — willingness to be wrong',
      'Cross-functional collaboration across product, eng, research',
    ],
    valueKeywords: [
      'user impact', 'scale', 'data-driven', 'experimentation', 'launch',
      '20% project', 'OKRs', 'cross-functional', 'AI/ML', 'cloud', 'Android',
      'design sprints', 'Googleyness', 'general cognitive ability', 'ambiguity',
    ],
    applicationTips: [
      'Lead with one specific shipped outcome at scale — Google thinks in millions and billions of users.',
      'Reference a Google product or paper specifically. Hiring panels notice when candidates have read the work.',
      'Show data fluency even in non-technical roles. "We A/B tested" beats "we redesigned."',
      'Keep it tight — 300-400 words. Recruiters move fast through high volume.',
      'Avoid generic enthusiasm ("I\'ve always loved Google"). Show what you\'ll bring, not what you admire.',
    ],
    sampleLetter: {
      greeting: 'Dear Google Hiring Team,',
      paragraphs: [
        'When the Cloud Run team published the post on cold-start optimizations earlier this year, it landed exactly where I\'ve spent the last three years of my career — building serverless platforms at scale. The role you\'ve posted maps directly to that work, which is why I\'m writing.',
        'I\'m a senior software engineer with six years building production distributed systems, currently leading a team of four at a Series C SaaS. Last year I drove the migration of our core API from a monolith to a Knative-based serverless platform serving 40M monthly users — with a 38% p95 latency reduction and a 60% drop in idle compute spend. I work daily in Go and Python, lead our weekly architecture review, and have mentored two engineers who were promoted to senior in the last 18 months.',
        'What I\'d bring to Google specifically is rigor, calm under ambiguity, and a strong instinct for separating signal from noise. I\'m comfortable being the most junior person on a hard problem and the most senior on an unclear one. I read carefully, write clearly, and try to be wrong loudly so we can move on faster.',
        'I\'d welcome the chance to talk about the role and where I think I could contribute. Thank you for the consideration.',
      ],
      closing: 'Best regards,',
      signature: 'Your Name',
    },
    faq: [
      {
        question: 'How important is Googleyness in a cover letter?',
        answer:
          'Important, but show don\'t tell. Demonstrate intellectual humility through specific examples (a time you were wrong, a hard call you got right) rather than claiming to "embody Google\'s values."',
      },
      {
        question: 'Should I mention specific Google products?',
        answer:
          'Yes — one or two, specifically and accurately. Reference a recent launch, a paper, or a product update that connects to your background. Generic "I love Google" gets filtered.',
      },
      {
        question: 'How long should my cover letter for Google be?',
        answer:
          '300-400 words. Recruiters read hundreds per quarter — clarity and concision are the audition.',
      },
    ],
    relatedSlugs: ['meta', 'amazon', 'apple', 'microsoft'],
  },
  {
    slug: 'meta',
    companyName: 'Meta',
    industry: 'Technology / Social & VR',
    shortDescription:
      'A cover letter for Meta that demonstrates impact at scale, speed of execution, and the kind of "move fast" instinct hiring managers screen for.',
    meta: {
      title: 'Cover Letter for Meta — Example & Writing Guide',
      description:
        'A proven cover letter example for Meta (Facebook, Instagram, WhatsApp, Reality Labs), with culture-specific tips and FAQ. Tailor with CareerThings AI.',
    },
    intro:
      'Meta hiring screens heavily on impact — specifically, large impact delivered fast. The strongest cover letters lead with billions of users, ship velocity, or revenue moved. Meta\'s cultural language ("be bold," "focus on long-term impact," "move fast," "be open") shows up in interview rubrics; the best candidates demonstrate these without needing to name them.',
    cultureSignals: [
      'Impact at scale — billions of users, $X in revenue, point-percentage shifts that mean millions',
      'Speed of execution — shipping iterations, not perfecting features',
      '"Be bold" — taking on hard, ambiguous problems',
      'Strong opinions, loosely held — direct disagreement is welcomed',
      'Comfort with rapid context switching across surfaces',
    ],
    valueKeywords: [
      'impact', 'scale', 'velocity', 'A/B testing', 'experimentation',
      'Facebook', 'Instagram', 'WhatsApp', 'Reality Labs', 'AI',
      'metrics', 'user growth', 'engagement', 'monetization', 'ranking',
    ],
    applicationTips: [
      'Quantify in millions/billions where you can — Meta thinks in those units.',
      'Lead with impact, not process. "Drove 2.4% lift in DAU" beats "led a redesign."',
      'Reference a specific Meta product surface or recent launch.',
      'Show ship velocity — number of launches, experiments run, A/B tests.',
      'Avoid "passion for connecting the world" — generic language gets filtered.',
    ],
    sampleLetter: {
      greeting: 'Dear Meta Hiring Team,',
      paragraphs: [
        'The Reels growth team\'s public work on cold-start ranking is the cleanest piece of recommendations engineering I\'ve read this year, and it overlaps directly with the work I\'ve been doing for the last three years.',
        'I\'m a senior software engineer with six years building recommendation and ranking systems at consumer-scale. Most recently I owned the candidate-generation layer for a 60M-MAU video product, where I shipped 14 experiments in 2024 — eight winners, drove a cumulative 4.1% lift in time spent and a 2.4% lift in 7-day retention. I work daily in Python, PyTorch, and Spark, with strong instincts for offline-online metric translation and A/B testing rigor.',
        'What I\'d bring to Meta is the velocity and rigor that comes from running experiments at scale: clean instrumentation, sharp readouts, and honest postmortems on the losers. I\'m comfortable disagreeing in design reviews and changing my mind when the data calls.',
        'I\'d welcome the chance to discuss the role. Thank you for the consideration.',
      ],
      closing: 'Best regards,',
      signature: 'Your Name',
    },
    faq: [
      {
        question: 'How important is "move fast" framing for Meta cover letters?',
        answer:
          'Important, but demonstrated rather than claimed. Show ship velocity — number of experiments, launches, iterations — instead of writing "I move fast."',
      },
      {
        question: 'Should I mention specific Meta surfaces (FB, IG, WhatsApp)?',
        answer:
          'Yes, especially the surface most relevant to the role. Reference a specific feature or recent launch that connects to your background.',
      },
    ],
    relatedSlugs: ['google', 'amazon', 'netflix', 'microsoft'],
  },
  {
    slug: 'amazon',
    companyName: 'Amazon',
    industry: 'Technology / E-commerce & AWS',
    shortDescription:
      'A cover letter for Amazon built around the Leadership Principles, customer obsession, and the kind of dive-deep, deliver-results thinking the bar raisers screen for.',
    meta: {
      title: 'Cover Letter for Amazon — Example & Writing Guide',
      description:
        'A proven cover letter example for Amazon, with Leadership Principles guidance, ATS keywords, and FAQ. Tailor it with CareerThings AI.',
    },
    intro:
      'Amazon cover letters are different from any other tech company\'s: the Leadership Principles aren\'t a wall poster, they\'re the literal interview rubric. The strongest cover letters demonstrate 2-3 LPs through specific stories — not by naming them, but by structuring the story to make the principle obvious.',
    cultureSignals: [
      'Customer Obsession — start with the customer and work backwards',
      'Ownership — long-term thinking, not just your team',
      'Bias for Action — speed matters; many decisions are reversible',
      'Dive Deep — comfort going from CEO-level to data-row-level in one meeting',
      'Deliver Results — focus on the right outputs, not effort',
    ],
    valueKeywords: [
      'Leadership Principles', 'customer obsession', 'bias for action', 'ownership',
      'dive deep', 'invent and simplify', 'deliver results', 'frugality',
      'AWS', 'retail', 'FBA', 'Prime', 'two-pizza team', 'narrative', 'PR/FAQ',
      'STAR format',
    ],
    applicationTips: [
      'Use STAR-format thinking: situation, task, action, result. Amazon interviewers do.',
      'Lead with a customer-obsessed outcome — bonus if you reversed an earlier decision because of customer signal.',
      'Show one moment of "Dive Deep" — got to root cause, not surface fix.',
      'Quantify everything. Amazon screens on numbers.',
      'Skip flowery language. Amazon\'s writing culture (PR/FAQ, six-pagers) values directness.',
    ],
    sampleLetter: {
      greeting: 'Dear Amazon Hiring Team,',
      paragraphs: [
        'Last year I made a customer-driven decision that ran counter to our quarterly roadmap: we shipped a free version of a previously-paid feature after 22 customer interviews showed it was the single biggest barrier to activation. Trial-to-paid conversion lifted 18% in the next quarter. The role you\'ve posted reads like exactly the kind of customer-obsessed product work I most want to keep doing.',
        'I\'m a senior product manager with six years in B2B SaaS, currently owning growth for a 200K-customer fintech. Beyond the example above, I run a discovery cadence of 40+ customer interviews per quarter, ship 8-12 experiments, and partner closely with engineering on the harder builds. I\'ve written narrative-style PRDs (six-pagers) since reading the Amazon style guide three years ago — they make my teams\' decisions sharper.',
        'What I\'d bring to Amazon is a strong customer-first instinct, comfort with ambiguity, and the discipline to dig until I find root cause. I\'m calm in disagree-and-commit conversations and I take ownership beyond my immediate scope.',
        'I\'d welcome the chance to discuss the role. Thank you for the consideration.',
      ],
      closing: 'Best regards,',
      signature: 'Your Name',
    },
    faq: [
      {
        question: 'Should my cover letter explicitly reference the Leadership Principles?',
        answer:
          'No, demonstrate them through stories. Naming the LPs reads as performative; structuring the story so the LP is obvious is what experienced interviewers screen for.',
      },
      {
        question: 'How does Amazon\'s narrative culture affect cover letter writing?',
        answer:
          'Be direct, data-led, and concise. Amazon\'s six-pager culture rewards clean prose. Avoid flowery language and lead with the outcome.',
      },
    ],
    relatedSlugs: ['google', 'meta', 'microsoft', 'apple'],
  },
  {
    slug: 'apple',
    companyName: 'Apple',
    industry: 'Technology / Hardware & Services',
    shortDescription:
      'A cover letter for Apple built around craft, attention to detail, and the disciplined quiet that defines Apple\'s working culture.',
    meta: {
      title: 'Cover Letter for Apple — Example & Writing Guide',
      description:
        'A polished cover letter example for Apple, with culture-specific guidance, ATS keywords, and FAQ. Tailor with CareerThings AI.',
    },
    intro:
      'Cover letters for Apple favor restraint over volume — Apple\'s culture rewards craft, precision, and the kind of quiet excellence that doesn\'t need to announce itself. The strongest ones demonstrate deep attention to detail, ownership of a specific surface customers care about, and a working style that fits Apple\'s collaborative-but-confidential rhythm.',
    cultureSignals: [
      'Craft — attention to detail in every artifact',
      'Functional excellence — depth in your role',
      'Confidentiality — comfort working on things you can\'t talk about',
      'Cross-functional collaboration with hardware, software, design',
      'Quiet ownership without self-promotion',
    ],
    valueKeywords: [
      'craft', 'attention to detail', 'user experience', 'iOS', 'macOS',
      'hardware-software integration', 'privacy', 'accessibility', 'design',
      'quality', 'pixel-perfect', 'engineering rigor', 'launch', 'cross-functional',
    ],
    applicationTips: [
      'Restraint over volume. Apple\'s culture values quality — your cover letter is an artifact.',
      'Show one piece of work where the craft was the point.',
      'Reference an Apple product specifically and accurately — Apple readers notice.',
      'Avoid name-dropping or self-promotion. Quiet confidence wins.',
      'Keep it 250-350 words. Density beats length.',
    ],
    sampleLetter: {
      greeting: 'Dear Apple Hiring Team,',
      paragraphs: [
        'When the iOS Notes team shipped collaborative editing two years ago, the cursor handling on conflicts was the cleanest implementation I\'d seen across any productivity app. That kind of detail is the work I most want to be part of.',
        'I\'m a senior software engineer with seven years building iOS apps, currently the tech lead for a Series D consumer SaaS used by 2M monthly users. I\'ve owned our note-editing surface end-to-end for two years — including an offline-first sync rewrite that reduced merge conflicts by 90% on bad networks. I write Swift daily, contribute to our internal accessibility audit, and pair frequently with our design team on interaction details that don\'t show up in Figma.',
        'What I\'d bring to Apple is a working style that fits the rhythm: deep focus, comfortable with confidentiality, and a strong instinct for the difference between something good and something done. I read carefully and I take craft seriously.',
        'I\'d welcome the chance to talk about the role. Thank you for the consideration.',
      ],
      closing: 'Best regards,',
      signature: 'Your Name',
    },
    faq: [
      {
        question: 'How important is craft framing for Apple cover letters?',
        answer:
          'Very. Apple\'s culture is built around it. Demonstrate craft through one specific story rather than claiming it as a value.',
      },
      {
        question: 'Should I mention specific Apple products?',
        answer:
          'Yes, but accurately. Apple readers notice when candidates have engaged carefully with the product. Reference a specific feature or behavior, not just the brand.',
      },
    ],
    relatedSlugs: ['google', 'microsoft', 'meta', 'tesla'],
  },
  {
    slug: 'microsoft',
    companyName: 'Microsoft',
    industry: 'Technology / Cloud & Productivity',
    shortDescription:
      'A cover letter for Microsoft built around the growth-mindset culture, customer success, and the breadth of impact across Azure, M365, and gaming.',
    meta: {
      title: 'Cover Letter for Microsoft — Example & Writing Guide',
      description:
        'A polished cover letter example for Microsoft, with culture-specific tips, keywords, and FAQ. Tailor with CareerThings AI.',
    },
    intro:
      'Microsoft cover letters work best when they reflect the post-Nadella growth-mindset culture: learning over knowing, customer success over feature ship, and clear positioning across whichever business unit (Azure, M365, Gaming, AI) you\'re applying into. Lead with customer impact and one specific learning moment.',
    cultureSignals: [
      'Growth mindset — learning from failure, not avoiding it',
      'Customer success orientation',
      'Diversity and inclusion in working style',
      'Cross-org collaboration across Azure, M365, GitHub, LinkedIn, gaming',
      'Comfort with enterprise scale and complexity',
    ],
    valueKeywords: [
      'Azure', 'Microsoft 365', 'GitHub', 'Copilot', 'AI', 'enterprise',
      'customer success', 'growth mindset', 'learn-it-all', 'inclusion',
      'cross-org', 'C#', '.NET', 'Power Platform', 'Office', 'Windows',
    ],
    applicationTips: [
      'Reference the specific business unit (Azure, M365, GitHub, Gaming) — they\'re distinct cultures.',
      'Show one growth moment — a failure you learned from, a skill you built.',
      'Lead with customer impact, especially enterprise-scale outcomes.',
      'Mention enterprise complexity if relevant — Microsoft sells to the Fortune 500.',
    ],
    sampleLetter: {
      greeting: 'Dear Microsoft Hiring Team,',
      paragraphs: [
        'Azure Container Apps shipped its scale-to-zero update last quarter, and the underlying Knative work is exactly where I\'ve spent the last three years of my career. I\'m writing because the role on the Azure compute team maps directly to that experience.',
        'I\'m a senior software engineer with six years building serverless and containerized infrastructure. At my current company I led the migration of our core API from a monolith to a Knative-based platform serving 40M monthly users. The migration shipped two months ahead of plan and reduced our compute spend by 60% — but the more important outcome was the postmortem on the SEV-1 we hit at week three, which became my team\'s reference doc on how to roll out scale-to-zero safely. I write Go and Python daily, run our weekly architecture review, and have mentored two engineers to senior promotions.',
        'What I\'d bring to Microsoft is the breadth of perspective that comes from running into hard things on the way down — not just up — combined with the discipline to ship enterprise-quality work. I read carefully, write clearly, and take customer feedback as the most reliable signal we have.',
        'I\'d welcome the chance to discuss the role. Thank you for the consideration.',
      ],
      closing: 'Best regards,',
      signature: 'Your Name',
    },
    faq: [
      {
        question: 'How does the business unit affect a Microsoft cover letter?',
        answer:
          'Significantly. Azure, M365, GitHub, and Gaming have very different cultures and product motions. Tailor the cover letter to the specific BU.',
      },
      {
        question: 'Should I mention growth-mindset framing explicitly?',
        answer:
          'Demonstrate it, don\'t name it. Show one moment of learning from failure or building a new skill — it carries the framing without performing it.',
      },
    ],
    relatedSlugs: ['google', 'amazon', 'meta', 'apple'],
  },
  {
    slug: 'tesla',
    companyName: 'Tesla',
    industry: 'Automotive / Energy / AI',
    shortDescription:
      'A cover letter for Tesla built around speed, hardcore execution, and first-principles thinking — the culture that ships against the impossible.',
    meta: {
      title: 'Cover Letter for Tesla — Example & Writing Guide',
      description:
        'A polished cover letter example for Tesla, with culture-specific tips, keywords, and FAQ. Tailor with CareerThings AI.',
    },
    intro:
      'Tesla cover letters work best when they\'re short, punchy, and specific. Tesla\'s culture rewards execution speed, comfort with hard problems, and willingness to work intensely. The strongest cover letters lead with a hard project shipped fast, demonstrate first-principles thinking, and skip the filler.',
    cultureSignals: [
      'First-principles thinking — willingness to question assumptions',
      'Speed of execution under intense pressure',
      'Cross-discipline range — software, mechanical, electrical, manufacturing',
      'Direct communication, no filler',
      'Comfort with ambiguous, never-been-done-before work',
    ],
    valueKeywords: [
      'first principles', 'manufacturing', 'autonomy', 'autopilot', 'FSD',
      'energy', 'powerwall', 'gigafactory', 'AI', 'robotics', 'controls',
      'automotive', 'embedded systems', 'hardware-software', 'production',
    ],
    applicationTips: [
      'Cut every word that isn\'t earning its place. Tesla rewards direct writing.',
      'Lead with a hard, fast-shipped outcome. Demonstrate intensity through specifics.',
      'Show first-principles thinking — a moment you challenged a default and the result.',
      'Mention a specific Tesla product or recent launch.',
      'Skip the corporate language. Tesla\'s tone is direct.',
    ],
    sampleLetter: {
      greeting: 'Dear Tesla Hiring Team,',
      paragraphs: [
        'I\'ve spent the last three years building real-time controls software for industrial robots. The Optimus controls work and the integration challenges between perception and actuation are exactly where I want to keep working.',
        'In my current role I led the rewrite of our motion-planning stack from C++/ROS to a custom real-time scheduler that cut planning latency from 14ms to 3.8ms — work that shipped in seven months and unblocked our throughput target by 22%. I write C++ and Rust daily, with a strong background in linear algebra and modern controls. Last year I authored two internal papers on contact-rich manipulation that became the team\'s reference docs.',
        'What I\'d bring to Tesla is intensity, speed, and the discipline to debug at every layer of the stack. I\'m comfortable on hard problems with no clear answer and I work fast.',
        'I\'d welcome the chance to discuss the role. Thank you for the consideration.',
      ],
      closing: 'Best regards,',
      signature: 'Your Name',
    },
    faq: [
      {
        question: 'How short should a Tesla cover letter be?',
        answer:
          '200-300 words. Tesla rewards directness — every paragraph has to earn its place.',
      },
      {
        question: 'Should I match Tesla\'s intense work culture in framing?',
        answer:
          'Show, don\'t tell. Demonstrate intensity through what you shipped and how fast — don\'t claim "I work hard."',
      },
    ],
    relatedSlugs: ['google', 'apple', 'amazon', 'meta'],
  },
  {
    slug: 'netflix',
    companyName: 'Netflix',
    industry: 'Media & Technology',
    shortDescription:
      'A cover letter for Netflix built around the high-performance culture, business judgment, and the keeper-test thinking that defines hiring there.',
    meta: {
      title: 'Cover Letter for Netflix — Example & Writing Guide',
      description:
        'A proven cover letter example for Netflix, with culture-specific tips, keywords, and FAQ. Tailor with CareerThings AI.',
    },
    intro:
      'Netflix cover letters work differently. The "Dream Team" culture means hiring is heavily filtered through the keeper test — would the manager fight to keep this person? The strongest cover letters demonstrate stunning-colleague-level outcomes, sharp business judgment, and clear ownership.',
    cultureSignals: [
      'Stunning-colleague threshold — clearly above the bar',
      'Business judgment — context over control',
      'Sharp written communication',
      'Comfort with high autonomy and high accountability',
      'Direct disagreement and feedback',
    ],
    valueKeywords: [
      'context not control', 'keeper test', 'high performance', 'dream team',
      'streaming', 'content', 'recommendations', 'ML', 'experimentation',
      'memo culture', 'business impact', 'autonomy', 'ownership',
    ],
    applicationTips: [
      'Lead with one outcome that demonstrates stunning-colleague level — not just competent, but clearly above-bar.',
      'Show business judgment — a call you made with incomplete information that turned out right.',
      'Write tightly. Netflix\'s memo culture rewards clear prose.',
      'Mention specific Netflix products or recent strategic moves.',
    ],
    sampleLetter: {
      greeting: 'Dear Netflix Hiring Team,',
      paragraphs: [
        'Last year I made a call that ran counter to our quarterly roadmap: we cut a high-cost ML model that was driving only marginal lifts in a long-tail surface, freeing 22% of our team\'s GPU budget to go after a much bigger personalization win. The reallocation generated a 4.1% lift in 30-day retention. The role you\'ve posted on the personalization team reads like exactly the kind of high-judgment ML product work I most want to do.',
        'I\'m a senior ML engineer with six years building recommendation systems at consumer-scale. Beyond the example above, I\'ve owned the candidate-generation layer for a 60M-MAU video product, shipped 14 ranking experiments in 2024 (eight winners), and authored the team\'s reference doc on offline-online metric translation. I write Python, PyTorch, and SQL daily, and I run our weekly experiment readout.',
        'What I\'d bring to Netflix is sharp judgment under ambiguity, comfort disagreeing in writing, and the discipline to follow a counter-intuitive call all the way to the result. I read carefully, hold strong opinions, and update fast.',
        'I\'d welcome the chance to talk through the role. Thank you for the consideration.',
      ],
      closing: 'Best regards,',
      signature: 'Your Name',
    },
    faq: [
      {
        question: 'How does Netflix\'s memo culture affect cover letter writing?',
        answer:
          'It rewards clarity, brevity, and strong opinions. Treat the cover letter as a short memo: lead with the outcome, support with evidence, end clean.',
      },
      {
        question: 'Should I name-check Netflix culture documents?',
        answer:
          'No. Demonstrate the principles through stories rather than referencing the deck. Performative quotes from the culture deck signal you\'ve only read it, not lived it.',
      },
    ],
    relatedSlugs: ['google', 'meta', 'amazon', 'spotify'],
  },
  {
    slug: 'spotify',
    companyName: 'Spotify',
    industry: 'Music Streaming & Audio',
    shortDescription:
      'A cover letter for Spotify built around audio-first thinking, squad-based collaboration, and the data-driven product instincts that separate strong candidates.',
    meta: {
      title: 'Cover Letter for Spotify — Example & Writing Guide',
      description:
        'A proven cover letter example for Spotify, with squad-culture tips, keywords, and FAQ. Tailor with CareerThings AI.',
    },
    intro:
      'Spotify\'s squad-and-tribe model means the strongest cover letters demonstrate small-team ownership, autonomous decision-making, and strong cross-functional partnership. The audio-first product DNA also rewards candidates who think about audio specifically — not just "content" generically.',
    cultureSignals: [
      'Squad-based ownership — small autonomous teams',
      'Audio-first product thinking',
      'Strong data and experimentation culture',
      'Cross-functional partnership with design and research',
      'Inclusive, low-ego working style',
    ],
    valueKeywords: [
      'audio', 'podcast', 'streaming', 'recommendations', 'discovery',
      'squad', 'tribe', 'A/B testing', 'experimentation', 'personalization',
      'creator', 'free vs premium', 'engagement', 'retention',
    ],
    applicationTips: [
      'Reference an audio-specific product or feature (Discover Weekly, Wrapped, podcast surfaces).',
      'Show small-team ownership — squads at Spotify are ~6-8 people.',
      'Demonstrate experimentation rigor and data fluency.',
      'Skip generic "I love music" framing. Be specific.',
    ],
    sampleLetter: {
      greeting: 'Dear Spotify Hiring Team,',
      paragraphs: [
        'Discover Weekly remains the best example of personalization-as-content I\'ve seen in any product, and the squad behind it has been a model I\'ve referenced often. I\'m writing because the role on the Discovery team reads like exactly the kind of small-team, audio-first product work I most want to be doing.',
        'I\'m a product manager with five years in consumer media, currently leading a 7-person squad at a Series C podcast platform. We own discovery for 4M monthly listeners. Last year I shipped 11 experiments and led a homepage rebuild that lifted plays-per-listener 18% and improved 30-day retention from 62% to 71%. I run weekly experiment readouts, partner closely with our research team on listener interviews (40+ in 2024), and write tight PRDs that engineering teams say they actually use.',
        'What I\'d bring to Spotify is a strong audio-product instinct, comfort in small-team autonomy, and the discipline to instrument carefully and read experiments honestly.',
        'I\'d welcome the chance to talk through the role. Thank you for the consideration.',
      ],
      closing: 'Best regards,',
      signature: 'Your Name',
    },
    faq: [
      {
        question: 'How does Spotify\'s squad model affect cover letter writing?',
        answer:
          'It rewards demonstrating small-team ownership and autonomy. Show that you\'ve worked in 6-8 person teams with end-to-end ownership of a surface.',
      },
      {
        question: 'Should I mention specific Spotify products?',
        answer:
          'Yes — Discover Weekly, Wrapped, podcast surfaces, or whichever connects to the role. Spotify employees notice when candidates engage with specific features.',
      },
    ],
    relatedSlugs: ['netflix', 'meta', 'google'],
  },
  {
    slug: 'salesforce',
    companyName: 'Salesforce',
    industry: 'Enterprise SaaS / CRM',
    shortDescription:
      'A cover letter for Salesforce built around customer success, Ohana culture, and the enterprise-scale thinking that defines hiring across the cloud portfolio.',
    meta: {
      title: 'Cover Letter for Salesforce — Example & Writing Guide',
      description:
        'A polished cover letter example for Salesforce, with Ohana-culture tips, keywords, and FAQ. Tailor with CareerThings AI.',
    },
    intro:
      'Salesforce cover letters work best when they reflect the Ohana culture — customer-success-first, mission-driven, and warm in tone — paired with strong enterprise-scale fluency. Lead with customer outcomes, especially F500 ones, and demonstrate values alignment without performing it.',
    cultureSignals: [
      'Customer success orientation — top Salesforce value',
      'Ohana culture — family-style team energy',
      'Mission-driven framing (giving, equality, sustainability)',
      'Enterprise complexity comfort',
      'Trailblazer mindset — skill-building and certifications',
    ],
    valueKeywords: [
      'customer success', 'Ohana', 'Trailhead', 'Sales Cloud', 'Service Cloud',
      'Marketing Cloud', 'Salesforce CRM', 'Apex', 'Lightning', 'enterprise',
      'F500', 'admin', 'Trailblazer', 'CTA', 'integration', 'AppExchange',
    ],
    applicationTips: [
      'Lead with a customer outcome — ideally enterprise (F500 if relevant).',
      'Mention Trailhead badges or certifications if relevant — Salesforce values them.',
      'Reference the specific cloud (Sales, Service, Marketing, Data Cloud).',
      'Match the warmth of the Ohana culture without being saccharine.',
    ],
    sampleLetter: {
      greeting: 'Dear Salesforce Hiring Team,',
      paragraphs: [
        'I\'ve spent the last four years implementing Service Cloud across F500 customers, most recently leading a deployment for a 12,000-agent insurance company that cut average handle time by 22% and lifted CSAT from 78 to 86. The role on the Service Cloud customer-success team reads like exactly the kind of work I most want to keep doing.',
        'I\'m a Salesforce solution architect with 5+ years on the platform, currently a Senior Principal at a top SI partner. I hold Application Architect certification and 28 Trailhead badges, with deep experience in Service Cloud, Omni-Channel, and Service Console design. Beyond the F500 deployment above, I\'ve led 6 customer success outcomes that became internal case studies for the practice, and I co-led the team\'s migration to Lightning across 14 customers.',
        'What I\'d bring to Salesforce is the dual fluency — deep technical platform expertise paired with strong customer-relationship instincts — that the customer success function needs. I love this work and I love this platform.',
        'I\'d welcome the chance to discuss the role. Thank you for the consideration.',
      ],
      closing: 'Best regards,',
      signature: 'Your Name',
    },
    faq: [
      {
        question: 'How important are Salesforce certifications and Trailhead badges in a cover letter?',
        answer:
          'Important for technical roles, less for non-technical. Mention certifications once, briefly. Trailhead activity signals investment in the platform.',
      },
      {
        question: 'Should I mention the Ohana culture explicitly?',
        answer:
          'Demonstrate it through warmth and customer-success framing rather than naming it. Performative culture references are common and get filtered.',
      },
    ],
    relatedSlugs: ['microsoft', 'google', 'amazon'],
  },
  {
    slug: 'jpmorgan-chase',
    companyName: 'JPMorgan Chase',
    industry: 'Financial Services',
    shortDescription:
      'A cover letter for JPMorgan Chase built around analytical rigor, regulatory awareness, and the kind of structured thinking financial-services hiring panels screen for.',
    meta: {
      title: 'Cover Letter for JPMorgan Chase — Example & Writing Guide',
      description:
        'A polished cover letter example for JPMorgan Chase, with culture-specific tips, keywords, and FAQ. Tailor with CareerThings AI.',
    },
    intro:
      'JPMorgan Chase cover letters reward analytical rigor, polish, and clear connection to one of the firm\'s lines of business (consumer banking, asset & wealth management, commercial banking, corporate & investment bank). The strongest demonstrate quantitative depth, awareness of regulatory context, and the kind of structured thinking that earns trust at scale.',
    cultureSignals: [
      'Analytical rigor across quantitative and qualitative work',
      'Awareness of regulatory and risk context',
      'Polish and professionalism in written communication',
      'Line-of-business specificity (CCB, AWM, CIB, CB)',
      'Long-term tenure orientation',
    ],
    valueKeywords: [
      'investment banking', 'asset management', 'wealth management',
      'consumer banking', 'risk management', 'compliance', 'KYC', 'AML',
      'fixed income', 'equities', 'M&A', 'capital markets', 'credit',
      'Bloomberg', 'SQL', 'VBA', 'Python', 'modeling', 'CFA',
    ],
    applicationTips: [
      'Specify the line of business clearly. CIB, CCB, AWM, and CB are very different cultures.',
      'Lead with one analytical outcome — model accuracy, deal closed, AUM grown.',
      'Mention regulatory awareness if relevant — KYC, AML, Volcker, Basel.',
      'Maintain a polished, professional tone. JPM is more formal than tech.',
    ],
    sampleLetter: {
      greeting: 'Dear JPMorgan Chase Hiring Team,',
      paragraphs: [
        'I\'m writing to express my interest in the analyst role within the Asset & Wealth Management group. Over the last three years I\'ve built a deep foundation in equity research and portfolio construction at a long-only fund, and the work AWM has published on systematic factor strategies aligns directly with my interests.',
        'I\'m a CFA Level III candidate with three years as an associate at a $4B AUM equity fund. My responsibilities include screening, fundamental analysis, and portfolio construction across our mid-cap growth strategy. Last year I authored four investment cases that contributed to position-sizing decisions; one was the largest contributor to alpha in the strategy. I work daily in Bloomberg, Excel, and Python (pandas, statsmodels), and I\'m comfortable building and stress-testing factor models.',
        'What I\'d bring to JPMorgan Chase is rigor, intellectual humility, and the discipline to update positions when new data warrants it. I\'m drawn to AWM\'s scale and the breadth of strategies the team operates.',
        'I\'d welcome the chance to discuss the role. Thank you for the consideration.',
      ],
      closing: 'Sincerely,',
      signature: 'Your Name',
    },
    faq: [
      {
        question: 'How formal should a JPMorgan Chase cover letter be?',
        answer:
          'More formal than tech-company cover letters. Use "Sincerely" rather than "Best," maintain a polished tone, and avoid casual language.',
      },
      {
        question: 'Should I mention the CFA or other certifications?',
        answer:
          'Yes — list current status (Level I, II, III candidate) clearly. CFA is highly respected at JPM.',
      },
    ],
    relatedSlugs: ['google', 'amazon', 'salesforce'],
  },
  {
    slug: 'mckinsey',
    companyName: 'McKinsey',
    industry: 'Management Consulting',
    shortDescription:
      'A cover letter for McKinsey built around problem-solving rigor, leadership impact, and the kind of structured insight the partner-level reader expects.',
    meta: {
      title: 'Cover Letter for McKinsey — Example & Writing Guide',
      description:
        'A polished cover letter example for McKinsey, with culture-specific tips, keywords, and FAQ. Tailor with CareerThings AI.',
    },
    intro:
      'McKinsey cover letters are read by people who screen thousands per recruiting cycle. The strongest ones show problem-solving rigor (a structured story arc), demonstrated leadership (formal or informal), and one specific result that communicates "this person finished hard things." Generic cover letters get filtered in seconds.',
    cultureSignals: [
      'Problem-solving rigor — structured thinking, MECE-flavored',
      'Leadership impact — moved a group toward an outcome',
      'Distinctive achievement — clearly above the cohort average',
      'Strong written and verbal communication',
      'Personal alignment with the firm\'s values',
    ],
    valueKeywords: [
      'problem-solving', 'leadership', 'distinctive impact', 'analytical',
      'structured thinking', 'consulting', 'engagement', 'client', 'workstream',
      'hypothesis-driven', 'top-down', 'pyramid principle', 'Excel', 'PowerPoint',
    ],
    applicationTips: [
      'Use a tight three-paragraph structure: hook + qualifications + close.',
      'Lead with a distinctive achievement that demonstrates rigor and impact.',
      'Show one leadership story — ideally where you moved a group through ambiguity.',
      'Maintain a polished, formal tone.',
      'Tailor to the specific office and practice if known.',
    ],
    sampleLetter: {
      greeting: 'Dear McKinsey Recruiting Team,',
      paragraphs: [
        'In my final undergraduate year I led a 12-person research team analyzing carbon-pricing impacts on a regional manufacturing economy. Over six months we produced a 60-page report that the state\'s economic development office cited in its 2025 strategy memo, and that work is the most distinctive achievement on my resume.',
        'I\'m a recent graduate with degrees in economics and computer science, and I\'m applying to the Business Analyst role in your San Francisco office. Beyond the research project, I\'ve built modeling skills through summer internships at a strategy boutique (where I supported two private-equity due-diligence engagements) and built an analytical foundation in Excel, Python, and Tableau. I write quickly under pressure — last year I authored three publications for the school\'s policy review with editorial deadlines under 72 hours.',
        'What I\'d bring to McKinsey is the discipline that comes from finishing hard things: the carbon-pricing report, the dual-major workload, two summer engagements. I want to keep solving problems that matter, with people who care about doing it well.',
        'I\'d welcome the chance to discuss the role and your San Francisco practice. Thank you for the consideration.',
      ],
      closing: 'Sincerely,',
      signature: 'Your Name',
    },
    faq: [
      {
        question: 'Should I mention specific McKinsey practices or offices?',
        answer:
          'Yes if you have a specific reason for them. Generic interest in "any office" is fine but specificity (e.g., "your Boston office and the Healthcare Practice") signals research.',
      },
      {
        question: 'How formal should a McKinsey cover letter be?',
        answer:
          'Formal. Use "Sincerely," maintain polish, and avoid casual language. McKinsey hiring is more traditional than tech.',
      },
    ],
    relatedSlugs: ['jpmorgan-chase', 'google', 'amazon'],
  },
  {
    slug: 'deloitte',
    companyName: 'Deloitte',
    industry: 'Professional Services / Consulting',
    shortDescription:
      'A cover letter for Deloitte built around service-line fit, client-impact stories, and the breadth of work across audit, consulting, tax, and risk advisory.',
    meta: {
      title: 'Cover Letter for Deloitte — Example & Writing Guide',
      description:
        'A polished cover letter example for Deloitte, with service-line guidance, keywords, and FAQ. Tailor with CareerThings AI.',
    },
    intro:
      'Deloitte cover letters work best when they connect specifically to one of the four service lines — audit, consulting, tax, or risk & financial advisory — and demonstrate fit for that business. Lead with a client-impact story (or its academic equivalent if you\'re early-career) and show comfort with the firm\'s scale.',
    cultureSignals: [
      'Service-line fit (Audit, Consulting, Tax, Risk & FA)',
      'Client-impact orientation',
      'Comfort with large, matrix organizations',
      'Industry vertical familiarity',
      'Continuous-learning mindset (CPA, certifications)',
    ],
    valueKeywords: [
      'audit', 'consulting', 'tax', 'risk advisory', 'financial advisory',
      'client engagement', 'workstream', 'CPA', 'big four', 'public accounting',
      'SOX', 'IFRS', 'GAAP', 'industry vertical', 'matrix organization',
    ],
    applicationTips: [
      'Specify the service line clearly. Audit, Consulting, Tax, and RFA have very different cultures.',
      'Mention industry vertical fit if you have it (FSI, healthcare, energy, retail).',
      'For new grads: connect coursework, leadership, and internships to the service line.',
      'For experienced hires: lead with specific client outcomes.',
    ],
    sampleLetter: {
      greeting: 'Dear Deloitte Recruiting Team,',
      paragraphs: [
        'I\'m a CPA candidate with two summers of audit internship experience at a regional firm, applying for the Audit Senior Assistant role in your Atlanta office. Deloitte\'s leadership in technology-driven audit (Omnia) and the firm\'s healthcare-vertical depth are the reasons I\'m specifically interested in this position.',
        'In my most recent internship I supported three audit engagements across a hospital system, a fintech, and a manufacturing client. I owned testing for revenue and AR for the hospital engagement, identifying three exceptions that became the focus of management\'s remediation plan. I work fluently in Excel, have built basic familiarity with audit data analytics tools, and complete the CPA exam Q2 of next year. Outside the internship I served as treasurer for my university\'s student investment fund (managing $180K of endowment capital across 14 positions).',
        'What I\'d bring to Deloitte is rigor, professional polish, and the discipline to learn the firm\'s methodologies quickly. The healthcare audit specialty is exactly where I want to build my career.',
        'I\'d welcome the chance to discuss the role. Thank you for the consideration.',
      ],
      closing: 'Sincerely,',
      signature: 'Your Name',
    },
    faq: [
      {
        question: 'How important is service-line specificity for a Deloitte cover letter?',
        answer:
          'Very. Audit, Consulting, Tax, and RFA are essentially separate businesses with different cultures and hiring criteria. Tailor accordingly.',
      },
      {
        question: 'Should I mention industry vertical fit?',
        answer:
          'Yes — Deloitte organizes by industry vertical (FSI, healthcare, energy, etc.). If you have relevant industry experience or coursework, name it.',
      },
    ],
    relatedSlugs: ['mckinsey', 'jpmorgan-chase'],
  },
];

export function getCompanyCoverLetterBySlug(slug: string): CompanyCoverLetter | undefined {
  return COMPANY_COVER_LETTERS.find((c) => c.slug === slug);
}

export function getCompanyCoverLetterSlugs(): string[] {
  return COMPANY_COVER_LETTERS.map((c) => c.slug);
}

export function getRelatedCompanies(slug: string): CompanyCoverLetter[] {
  const current = getCompanyCoverLetterBySlug(slug);
  if (!current) return [];
  return current.relatedSlugs
    .map((s) => getCompanyCoverLetterBySlug(s))
    .filter((c): c is CompanyCoverLetter => Boolean(c));
}
