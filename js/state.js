import { saveUserData, loadUserData } from "./db.js";

export const state = {
  currentUser: null,
  currentCalendarId: "default",
  calendars: {},
  currentDate: new Date(),
  currentView: "month"
};

export async function syncFromCloud() {
  if (!state.currentUser) return;

  const data = await loadUserData(state.currentUser.uid);

  if (data.calendars) {
    state.calendars = {
      ...state.calendars,
      ...data.calendars
    };
  }
}

export async function syncToCloud() {
  if (!state.currentUser) return;

  await saveUserData(state.currentUser.uid, {
    calendars: state.calendars
  });
}
