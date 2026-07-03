# Work Location Tracker — Installation Guide

## What this does

Every time you open Chrome or Edge, a small popup appears asking where you're working. Click **Home** or **Office**. That's it. At the end of the month, open the extension to see your calendar and export a CSV for your timesheet.

---

## Installation (one-time setup, ~2 minutes)

### Step 1 — Unzip

Download the `work-location-tracker.zip` file and unzip it into a **permanent location** — somewhere you won't accidentally delete or move it (e.g. `Documents\work-location-tracker`).

> ⚠️ Important: Chrome reads the extension files directly from this folder. If you move or delete the folder later, the extension will stop working.

---

### Step 2 — Open the Extensions page

**In Chrome:** Type `chrome://extensions` in the address bar and press Enter.

**In Edge:** Type `edge://extensions` in the address bar and press Enter.

---

### Step 3 — Enable Developer Mode

In the top-right corner of the Extensions page, toggle the **Developer mode** switch to ON.

---

### Step 4 — Load the extension

Click the **"Load unpacked"** button (appears after enabling Developer mode).

In the folder picker that opens, navigate to the unzipped `work-location-tracker` folder and click **Select Folder**.

---

### Step 5 — Done!

The **Work Location Tracker** extension now appears in your list of extensions and in the browser toolbar (you may need to pin it by clicking the puzzle-piece icon in the toolbar).

The next time you open the browser, a popup dialog will ask where you're working.

---

## Daily use

- **Daily popup** — Appears automatically when you open the browser (once per day). Click 🏠 Home or 🏢 Office. The dialog closes itself.
- **Calendar view** — Click the extension icon in the toolbar to see the full monthly calendar.
- **Log today from calendar** — If you missed the popup, the calendar view shows a "Log today's location" bar at the top.
- **Export CSV** — Click the "Export CSV" button in the calendar view to download a spreadsheet of the current month.

---

## Troubleshooting

**The popup doesn't appear on startup**
The popup fires once when the browser starts. If you already have Chrome/Edge running in the background (system tray), close it fully and reopen it.

**The extension shows an error after moving files**
Reload the extension: go to `chrome://extensions`, find Work Location Tracker, and click the refresh icon. If the folder was moved, you'll need to load it again from the new location.

**I want to clear all my data**
Go to `chrome://extensions` → Work Location Tracker → Details → Extension options → or use the DevTools console on any extension page: `chrome.storage.local.clear()`.
