// CareerThings AI extension popup. Reads the latest scraped job posting from
// chrome.storage.session (populated by content.js whenever the user is on a
// supported job page) and lets them stash it for use in the dashboard.

const SITE_BASE = 'https://careerthings.ai';

const elDetected = document.getElementById('job-detected');
const elNoJob = document.getElementById('no-job');
const elTitle = document.getElementById('job-title');
const elCompany = document.getElementById('job-company');
const elLocation = document.getElementById('job-location');
const btnSave = document.getElementById('save-job');
const btnTailor = document.getElementById('tailor-now');

async function getActiveTabId() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab?.id ?? null;
}

async function loadCurrentPosting() {
  const tabId = await getActiveTabId();
  if (tabId == null) {
    showNoJob();
    return;
  }
  const key = `posting:${tabId}`;
  const stored = await chrome.storage.session.get(key);
  const posting = stored[key];
  if (posting && posting.title) {
    showPosting(posting);
  } else {
    showNoJob();
  }
}

function showPosting(posting) {
  elDetected.classList.remove('hidden');
  elNoJob.classList.add('hidden');
  elTitle.textContent = posting.title || 'Untitled posting';
  elCompany.textContent = posting.company || 'Unknown company';
  elLocation.textContent = posting.location || '';
}

function showNoJob() {
  elDetected.classList.add('hidden');
  elNoJob.classList.remove('hidden');
}

btnSave.addEventListener('click', async () => {
  const tabId = await getActiveTabId();
  if (tabId == null) return;
  const stored = await chrome.storage.session.get(`posting:${tabId}`);
  const posting = stored[`posting:${tabId}`];
  if (!posting) return;

  await chrome.storage.local.set({
    [`saved:${Date.now()}`]: { ...posting, savedAt: new Date().toISOString() },
  });

  // Also send to the dashboard via deep link with hashed payload (fits 2KB URL budget).
  const payload = encodeURIComponent(JSON.stringify({
    title: posting.title,
    company: posting.company,
    location: posting.location,
    sourceUrl: posting.sourceUrl,
  }));
  chrome.tabs.create({
    url: `${SITE_BASE}/dashboard/jobs?source=extension&payload=${payload}`,
  });
});

btnTailor.addEventListener('click', async () => {
  const tabId = await getActiveTabId();
  if (tabId == null) return;
  const stored = await chrome.storage.session.get(`posting:${tabId}`);
  const posting = stored[`posting:${tabId}`];
  if (!posting) return;

  const payload = encodeURIComponent(JSON.stringify({
    title: posting.title,
    company: posting.company,
    location: posting.location,
    description: posting.description?.slice(0, 4000) ?? '',
    sourceUrl: posting.sourceUrl,
  }));
  chrome.tabs.create({
    url: `${SITE_BASE}/dashboard/cover-letters?source=extension&action=tailor&payload=${payload}`,
  });
});

loadCurrentPosting();
