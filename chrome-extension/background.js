// CareerThings AI extension service worker.
// Receives posting events from content scripts, persists per-tab in
// chrome.storage.session, and toggles the extension badge to show that a
// posting is available.

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message?.type !== 'POSTING_DETECTED') return;
  const tabId = sender.tab?.id;
  if (tabId == null) return;

  chrome.storage.session.set({
    [`posting:${tabId}`]: message.posting,
  });

  chrome.action.setBadgeBackgroundColor({ color: '#ea580c' });
  chrome.action.setBadgeText({ tabId, text: '•' });
  chrome.action.setTitle({
    tabId,
    title: `Save "${(message.posting.title || 'this job').slice(0, 60)}" to CareerThings AI`,
  });
});

// Clear stored postings when a tab closes (we use storage.session anyway, but
// being explicit prevents stale entries during long browser sessions).
chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.session.remove(`posting:${tabId}`);
});
