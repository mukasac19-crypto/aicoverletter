// CareerThings AI extension content script. Runs on supported job sites,
// detects whether the page contains a job posting, and stashes the parsed
// posting into chrome.storage.session keyed by tab id. The popup reads this
// when the user clicks the extension icon.
//
// Heuristics-only: each supported site has a tiny site-specific selector set
// with a generic fallback. We do not call any API and do not transmit data.

(function () {
  const SUPPORTED_HOSTS = [
    'linkedin.com',
    'indeed.com',
    'glassdoor.com',
    'greenhouse.io',
    'lever.co',
    'ashbyhq.com',
    'workable.com',
    'smartrecruiters.com',
    'myworkdayjobs.com',
    'wellfound.com',
    'hiringcafe.com',
  ];

  function host() {
    return location.hostname.replace(/^www\./, '');
  }

  function matchHost(domain) {
    return host() === domain || host().endsWith(`.${domain}`);
  }

  function text(selector) {
    const el = document.querySelector(selector);
    return el ? el.innerText.trim() : '';
  }

  function firstNonEmpty(selectors) {
    for (const s of selectors) {
      const v = text(s);
      if (v) return v;
    }
    return '';
  }

  function detectPosting() {
    if (matchHost('linkedin.com')) {
      return {
        title: firstNonEmpty([
          '.job-details-jobs-unified-top-card__job-title',
          '.jobs-unified-top-card__job-title',
          'h1.t-24',
          'h1',
        ]),
        company: firstNonEmpty([
          '.job-details-jobs-unified-top-card__company-name',
          '.jobs-unified-top-card__company-name',
          'a[data-test-job-company-name]',
        ]),
        location: firstNonEmpty([
          '.job-details-jobs-unified-top-card__bullet',
          '.jobs-unified-top-card__bullet',
        ]),
        description: firstNonEmpty([
          '#job-details',
          '.jobs-description-content__text',
        ]),
      };
    }
    if (matchHost('indeed.com')) {
      return {
        title: firstNonEmpty(['h1.jobsearch-JobInfoHeader-title', 'h1']),
        company: firstNonEmpty([
          '[data-testid="inlineHeader-companyName"]',
          '[data-testid="jobsearch-CompanyInfoContainer"] a',
        ]),
        location: firstNonEmpty([
          '[data-testid="inlineHeader-companyLocation"]',
          '[data-testid="job-location"]',
        ]),
        description: firstNonEmpty(['#jobDescriptionText']),
      };
    }
    if (matchHost('greenhouse.io')) {
      return {
        title: firstNonEmpty(['.app-title', 'h1.app-title', 'h1']),
        company: firstNonEmpty(['.company-name', '.app-title + div']),
        location: firstNonEmpty(['.location', '.app-location']),
        description: firstNonEmpty(['#content', '.app-content', 'main']),
      };
    }
    if (matchHost('lever.co')) {
      return {
        title: firstNonEmpty(['.posting-headline h2', '.posting-page h2', 'h2']),
        company: firstNonEmpty(['.main-header-logo + div', 'header h1']),
        location: firstNonEmpty(['.location', '.posting-categories .location']),
        description: firstNonEmpty(['.section-wrapper .section', '.posting-page']),
      };
    }
    if (matchHost('ashbyhq.com')) {
      return {
        title: firstNonEmpty(['h1', '[class*="title"]']),
        company: firstNonEmpty(['header [class*="org"]', 'header h2']),
        location: firstNonEmpty(['[class*="location"]']),
        description: firstNonEmpty(['main', '[class*="description"]']),
      };
    }
    if (matchHost('myworkdayjobs.com')) {
      return {
        title: firstNonEmpty(['h2[data-automation-id="jobPostingHeader"]', 'h2']),
        company: firstNonEmpty(['[data-automation-id="company"]', 'header img']),
        location: firstNonEmpty(['[data-automation-id="locations"]']),
        description: firstNonEmpty([
          '[data-automation-id="jobPostingDescription"]',
          'div[role="main"]',
        ]),
      };
    }
    if (matchHost('workable.com') || matchHost('smartrecruiters.com') || matchHost('wellfound.com') || matchHost('hiringcafe.com') || matchHost('glassdoor.com')) {
      return {
        title: firstNonEmpty(['h1']),
        company: firstNonEmpty(['header h2', '[class*="company"]', 'h2']),
        location: firstNonEmpty(['[class*="location"]']),
        description: firstNonEmpty(['main', '[class*="description"]', 'article']),
      };
    }
    return null;
  }

  function isSupported() {
    return SUPPORTED_HOSTS.some(matchHost);
  }

  function publish() {
    if (!isSupported()) return;
    const posting = detectPosting();
    if (!posting || !posting.title) return;

    chrome.runtime.sendMessage({
      type: 'POSTING_DETECTED',
      posting: {
        ...posting,
        sourceUrl: location.href,
        sourceHost: host(),
        detectedAt: new Date().toISOString(),
      },
    });
  }

  // Run on initial load and on SPA navigations.
  publish();

  let lastUrl = location.href;
  const observer = new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      // Wait for the SPA to render before scraping.
      setTimeout(publish, 600);
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
