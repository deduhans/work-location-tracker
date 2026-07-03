const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const now = new Date();
let viewYear = now.getFullYear();
let viewMonth = now.getMonth();

function toKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getTodayKey() {
  return toKey(now.getFullYear(), now.getMonth(), now.getDate());
}

async function getAllData() {
  return await chrome.storage.local.get(null);
}

async function saveLocation(location) {
  const today = getTodayKey();
  await chrome.storage.local.set({ [today]: location });
  await chrome.action.setBadgeText({ text: '' });
  renderAll();
}

async function renderAll() {
  const data = await getAllData();
  renderCalendar(data);
  renderStats(data);
  renderTodayPrompt(data);
}

function renderCalendar(data) {
  const grid = document.getElementById('calendar-grid');
  const label = document.getElementById('month-label');

  label.textContent = `${MONTH_NAMES[viewMonth]} ${viewYear}`;

  grid.innerHTML = '';

  const firstDay = new Date(viewYear, viewMonth, 1);
  const lastDay = new Date(viewYear, viewMonth + 1, 0);
  const todayKey = getTodayKey();

  let startDow = firstDay.getDay();
  startDow = startDow === 0 ? 6 : startDow - 1;

  for (let i = 0; i < startDow; i++) {
    const empty = document.createElement('div');
    empty.className = 'day-cell empty';
    grid.appendChild(empty);
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const key = toKey(viewYear, viewMonth, d);
    const location = data[key];
    const dayOfWeek = new Date(viewYear, viewMonth, d).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isToday = key === todayKey;

    const cell = document.createElement('div');
    let cls = 'day-cell';

    if (location === 'home') {
      cls += ' home';
    } else if (location === 'office') {
      cls += ' office';
    } else {
      cls += ' unlogged';
      if (isWeekend) cls += ' weekend';
    }

    if (isToday) cls += ' today';
    const isPastOrToday = key <= todayKey;
    if (isPastOrToday) cls += ' editable';
    cell.className = cls;

    if (isPastOrToday) {
      cell.addEventListener('click', (e) => {
        e.stopPropagation();
        showPopover(cell, key, location);
      });
    }

    const num = document.createElement('div');
    num.className = 'day-number';
    num.textContent = d;
    cell.appendChild(num);

    if (location === 'home') {
      const ind = document.createElement('div');
      ind.className = 'day-indicator';
      ind.textContent = 'H';
      cell.appendChild(ind);
    } else if (location === 'office') {
      const ind = document.createElement('div');
      ind.className = 'day-indicator';
      ind.textContent = 'O';
      cell.appendChild(ind);
    }

    grid.appendChild(cell);
  }
}

function renderStats(data) {
  const statsEl = document.getElementById('stats');
  let homeCount = 0;
  let officeCount = 0;

  const prefix = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-`;

  for (const [key, val] of Object.entries(data)) {
    if (!key.startsWith(prefix)) continue;
    if (val === 'home') homeCount++;
    else if (val === 'office') officeCount++;
  }

  statsEl.innerHTML = `
    <div class="stat-item">
      <div class="stat-dot home"></div>
      <span>${homeCount} Home</span>
    </div>
    <div class="stat-item">
      <div class="stat-dot office"></div>
      <span>${officeCount} Office</span>
    </div>
    <div class="stat-item">
      <span style="color:#CBD5E1">|</span>
      <span>${homeCount + officeCount} logged</span>
    </div>
  `;
}

function renderTodayPrompt(data) {
  const container = document.getElementById('today-prompt-container');
  const todayKey = getTodayKey();
  const isCurrentMonth = viewYear === now.getFullYear() && viewMonth === now.getMonth();

  if (isCurrentMonth && !data[todayKey]) {
    container.innerHTML = `
      <div class="today-prompt">
        <span class="today-prompt-text">Log today's location</span>
        <div class="today-prompt-btns">
          <button class="today-prompt-btn home" id="quick-home">🏠 Home</button>
          <button class="today-prompt-btn office" id="quick-office">🏢 Office</button>
        </div>
      </div>
    `;
    document.getElementById('quick-home').addEventListener('click', () => saveLocation('home'));
    document.getElementById('quick-office').addEventListener('click', () => saveLocation('office'));
  } else {
    container.innerHTML = '';
  }
}

let activePopover = null;

function dismissPopover() {
  if (activePopover) {
    activePopover.remove();
    activePopover = null;
  }
}

function showPopover(cell, dateKey, currentValue) {
  dismissPopover();

  const rect = cell.getBoundingClientRect();
  const popover = document.createElement('div');
  popover.className = 'day-popover';

  const options = [
    { label: '🏠 Home', value: 'home', cls: 'home' },
    { label: '🏢 Office', value: 'office', cls: 'office' },
    { label: '✕ Clear', value: null, cls: 'clear' },
  ];

  for (const opt of options) {
    const btn = document.createElement('button');
    btn.className = 'popover-btn ' + opt.cls;
    if (currentValue === opt.value) btn.classList.add('active');
    btn.textContent = opt.label;
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (opt.value) {
        await chrome.storage.local.set({ [dateKey]: opt.value });
      } else {
        await chrome.storage.local.remove(dateKey);
      }
      const todayKey = getTodayKey();
      if (dateKey === todayKey) {
        if (opt.value) {
          chrome.action.setBadgeText({ text: '' });
        } else {
          chrome.action.setBadgeText({ text: '!' });
          chrome.action.setBadgeBackgroundColor({ color: '#EF4444' });
        }
      }
      dismissPopover();
      renderAll();
    });
    popover.appendChild(btn);
  }

  document.body.appendChild(popover);
  activePopover = popover;

  const popW = 132;
  const popH = 108;
  let left = rect.left;
  let top = rect.bottom + 4;
  if (left + popW > window.innerWidth) left = window.innerWidth - popW - 4;
  if (top + popH > window.innerHeight) top = rect.top - popH - 4;
  popover.style.left = left + 'px';
  popover.style.top = top + 'px';
}

document.addEventListener('click', dismissPopover);

document.getElementById('prev-btn').addEventListener('click', () => {
  viewMonth--;
  if (viewMonth < 0) {
    viewMonth = 11;
    viewYear--;
  }
  renderAll();
});

document.getElementById('next-btn').addEventListener('click', () => {
  viewMonth++;
  if (viewMonth > 11) {
    viewMonth = 0;
    viewYear++;
  }
  renderAll();
});

renderAll();
