const STORAGE_KEY = "challenge_entries_v1";

function loadEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveEntries(entries) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {}
}

export const state = {
  lang: "en",
  currentUser: null,
  currentDate: new Date(),
  currentView: "month",
  entries: loadEntries()
};

export function persistEntries() {
  saveEntries(state.entries || {});
}
