import { state, syncToCloud } from "./state.js";

export function createCalendar(name) {
  const id = Date.now().toString();

  state.calendars[id] = {
    id,
    name,
    entries: {},
    members: [],
    owner: state.currentUser.uid
  };

  state.currentCalendarId = id;

  syncToCloud();
}

export function deleteCalendar(id) {
  delete state.calendars[id];
  syncToCloud();
}

export function getCurrentCalendar() {
  return state.calendars[state.currentCalendarId];
}
