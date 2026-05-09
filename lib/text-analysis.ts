// Lightweight client-side text analysis helpers used by /tools/ats-checker
// and /tools/keyword-extractor. Pure functions — no API calls, no model use,
// no PII storage. Runs in the browser.

export const STOPWORDS = new Set([
  'a','an','and','are','as','at','be','by','for','from','has','have','he','her','hers','his',
  'i','in','is','it','its','of','on','or','that','the','their','they','this','to','was','were',
  'will','with','you','your','yours','our','ours','we','us','but','not','if','then','than',
  'do','does','did','done','doing','am','been','being','having','had','can','could','should',
  'would','may','might','must','shall','about','above','after','again','against','all','any',
  'because','before','below','between','both','during','each','few','further','here','how',
  'into','itself','just','more','most','no','nor','off','once','only','other','out','over',
  'own','same','so','some','such','too','under','until','up','very','what','when','where',
  'which','while','who','whom','why','also','etc','via','use','using','used','one','two',
  'role','position','candidate','company','team','work','working','experience','years',
  'looking','seeking','required','strong','ability','able','plus','new','like','help','great',
  'across','within','well','include','includes','including','must','need','needs','please',
  'apply','applying','minimum','related','similar','equivalent','requirements','responsibilities',
  'qualifications','duties','offer','offers','offering','offered','full','part','time','remote',
  'hybrid','onsite','etc.','—','-','&',
]);

const TECHNICAL_TERMS = new Set([
  'react','vue','angular','svelte','typescript','javascript','python','java','rust','golang','go',
  'node','nodejs','express','fastapi','django','flask','rails','spring','aws','gcp','azure',
  'kubernetes','docker','terraform','helm','jenkins','github','gitlab','ci/cd','rest','graphql',
  'sql','nosql','postgres','postgresql','mysql','mongodb','redis','dynamodb','snowflake','bigquery',
  'spark','kafka','airflow','dbt','tableau','looker','powerbi','figma','sketch','salesforce',
  'hubspot','marketo','jira','asana','linear','notion','slack','zoom','agile','scrum','kanban',
  'tdd','bdd','rest','grpc','microservices','monolith','serverless','lambda','ec2','s3','rds',
  'figma','sketch','adobe','photoshop','illustrator','indesign','aftereffects','premiere',
  'epic','cerner','meditech','workday','sap','netsuite','oracle','quickbooks','excel',
  'powerpoint','word','google','workspace','outlook','linkedin','swift','kotlin','scala',
  'cpp','c++','c#','dotnet','php','laravel','symfony','wordpress','shopify','magento',
  'bls','acls','pals','rn','bsn','msn','cna','phr','shrm','cpa','cma','cfa','pmp','csm',
  'prince2','ats','seo','sem','crm','erp','hris','hcm','saas','b2b','b2c','dtc','kpi','okr',
  'mql','sql','arr','mrr','cac','ltv','nps','csat','dau','mau','wau','aov','gmv','dcf',
  'roi','poc','mvp','rfp','sow','nda','sla','sox','gdpr','hipaa','soc','pci',
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#./\- ]/g, ' ')
    .split(/\s+/)
    .map((t) => t.replace(/^[-./]+|[-./]+$/g, ''))
    .filter((t) => t.length >= 2);
}

export function termFrequency(text: string): Map<string, number> {
  const tokens = tokenize(text);
  const freq = new Map<string, number>();
  for (const tok of tokens) {
    if (STOPWORDS.has(tok)) continue;
    if (/^\d+$/.test(tok)) continue;
    freq.set(tok, (freq.get(tok) || 0) + 1);
  }
  return freq;
}

export function topKeywords(text: string, n = 25): { term: string; count: number; isTechnical: boolean }[] {
  const freq = termFrequency(text);
  const entries = Array.from(freq.entries())
    .map(([term, count]) => ({
      term,
      count,
      isTechnical: TECHNICAL_TERMS.has(term),
    }))
    .sort((a, b) => {
      // Technical terms boosted; otherwise sort by frequency desc
      if (a.isTechnical !== b.isTechnical) return a.isTechnical ? -1 : 1;
      return b.count - a.count;
    });
  return entries.slice(0, n);
}

export type AtsResult = {
  score: number;
  matched: string[];
  missing: string[];
  jdKeywordCount: number;
  resumeKeywordCount: number;
};

export function compareForAts(jd: string, resume: string): AtsResult {
  const jdKeywords = topKeywords(jd, 30).map((k) => k.term);
  const resumeTokens = new Set(tokenize(resume));
  const matched: string[] = [];
  const missing: string[] = [];
  for (const kw of jdKeywords) {
    if (resumeTokens.has(kw)) matched.push(kw);
    else missing.push(kw);
  }
  const score = jdKeywords.length === 0 ? 0 : Math.round((matched.length / jdKeywords.length) * 100);
  return {
    score,
    matched,
    missing,
    jdKeywordCount: jdKeywords.length,
    resumeKeywordCount: resumeTokens.size,
  };
}

export function detectFormattingIssues(resumeText: string): string[] {
  const issues: string[] = [];
  if (resumeText.length < 200) {
    issues.push('Resume text is unusually short — paste the full resume content for the most accurate read.');
  }
  if (/(•|•){10,}/.test(resumeText) === false && resumeText.split(/\n/).length < 8) {
    issues.push('Few line breaks detected — make sure your resume uses clear section breaks. ATS parsers struggle with single-block layouts.');
  }
  if (/[\u{1F300}-\u{1FAFF}]/u.test(resumeText)) {
    issues.push('Emojis detected. ATS systems often strip or misparse them — consider removing.');
  }
  if (/\t{2,}/.test(resumeText)) {
    issues.push('Tab-aligned columns detected. Multi-column layouts break in many ATS parsers — use a single column.');
  }
  if (resumeText.toLowerCase().includes('objective:') && !resumeText.toLowerCase().includes('summary')) {
    issues.push('"Objective" section detected. Modern resumes use a "Summary" section instead — update the heading.');
  }
  if (resumeText.split(/\n/).filter(Boolean).length > 80) {
    issues.push('Resume looks longer than two pages. Recruiters skim — aim for 1 page (under 8 years experience) or 2 pages max.');
  }
  return issues;
}
