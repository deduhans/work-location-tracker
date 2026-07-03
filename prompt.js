function getTodayKey() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

document.getElementById('date').textContent = new Date().toLocaleDateString('en-GB', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

async function saveLocation(location) {
  const today = getTodayKey();
  await chrome.storage.local.set({ [today]: location });
  window.close();
}

document.getElementById('home-btn').addEventListener('click', () => saveLocation('home'));
document.getElementById('office-btn').addEventListener('click', () => saveLocation('office'));
