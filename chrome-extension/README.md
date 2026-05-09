# CareerThings AI — Chrome Extension

A minimal Chrome extension that detects job postings on supported job sites
(LinkedIn, Indeed, Greenhouse, Lever, Ashby, Workday, etc.) and lets the user
save them to CareerThings AI in one click for tailoring cover letters and
resumes.

## Why this exists

Beyond the user-facing utility, the extension is part of the SEO strategy: a
real installable Chrome extension earns:

1. **Branded search volume** — installs drive "CareerThings extension" queries.
2. **Backlinks** — career advisors and Reddit threads link to free tools
   that ship as Chrome extensions far more readily than to SaaS landing pages.
3. **Chrome Web Store presence** — a separate distribution surface with its
   own SEO discoverability inside Google's product graph.

Teal's job tracker is the canonical example: their extension is the
single biggest contributor to their branded search and editorial coverage.

## Files

- `manifest.json` — MV3 manifest, host permissions for major job sites.
- `background.js` — service worker; receives postings from content scripts
  and stashes them in `chrome.storage.session`.
- `content.js` — runs on supported job sites, detects job-posting markup,
  and sends the parsed posting to the background script.
- `popup.html` / `popup.css` / `popup.js` — branded popup UI shown when
  the user clicks the extension icon.
- `icons/` — extension icons (16, 32, 48, 128 px). **Not yet committed —
  see "Setup" below.**

## Setup (before publishing)

1. Generate icons at 16, 32, 48, 128 px from `public/careerthingslogo.png`.
   Save them in `chrome-extension/icons/icon-{size}.png`.
2. Update the `homepage_url` in `manifest.json` to the production domain.
3. Update `SITE_BASE` in `popup.js` to the production domain.
4. Add a privacy policy at `https://careerthings.ai/legal/extension-privacy`
   and link it from the Chrome Web Store listing.

## Local install (for testing)

1. Open `chrome://extensions`.
2. Enable "Developer mode" (top right).
3. Click "Load unpacked" and select this folder.
4. Visit a supported job site (e.g. a LinkedIn job posting). The extension
   icon will show a dot badge when a posting is detected.

## Supported sites

LinkedIn Jobs, Indeed, Glassdoor, Greenhouse, Lever, Ashby, Workable,
SmartRecruiters, Workday (myworkdayjobs.com), Wellfound, hiringcafe.

Each site has site-specific selectors with a generic fallback. Adding new
sites is a one-block addition in `content.js`.

## Privacy

The extension reads page content only on the supported job sites listed
in `manifest.json`. Detected postings are stored locally in
`chrome.storage.session` (tab-scoped, cleared when the browser closes) and
in `chrome.storage.local` (only when the user clicks "Save"). No data is
transmitted to any server until the user explicitly clicks "Save to
CareerThings" or "Tailor a cover letter," at which point the posting is
sent to the user's CareerThings AI dashboard via URL parameters.

## Publishing checklist

- [ ] Generate icons at 16/32/48/128.
- [ ] Update `homepage_url` and `SITE_BASE` for production.
- [ ] Write privacy policy.
- [ ] Write Chrome Web Store listing (description, screenshots, promo
      tile, marquee tile).
- [ ] Pay one-time $5 Chrome Web Store dev fee.
- [ ] Submit and wait for review.
