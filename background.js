function getTodayKey() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

async function checkAndPrompt() {
  const today = getTodayKey();
  const data = await chrome.storage.local.get(today);
  if (!data[today]) {
    await chrome.action.setBadgeText({ text: '!' });
    await chrome.action.setBadgeBackgroundColor({ color: '#EF4444' });
    chrome.windows.create({
      url: chrome.runtime.getURL('prompt.html'),
      type: 'popup',
      width: 460,
      height: 320,
      focused: true
    });
  } else {
    await chrome.action.setBadgeText({ text: '' });
  }
}

chrome.runtime.onStartup.addListener(checkAndPrompt);
chrome.runtime.onInstalled.addListener((details) => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  if (details.reason === 'install') checkAndPrompt();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local') return;
  const today = getTodayKey();
  if (changes[today] && changes[today].newValue) {
    chrome.action.setBadgeText({ text: '' });
  }
});
