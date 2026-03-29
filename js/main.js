import { loginWithGoogle, logoutUser, watchAuthState } from "./auth.js";
import { state, syncFromCloud } from "./state.js";
import { renderCalendar } from "./calendar.js";
import { createCalendar } from "./calendarManager.js";
import { loadSharedCalendar } from "./share.js";

const container = document.getElementById("calendar");

document.getElementById("loginBtn").onclick = loginWithGoogle;
document.getElementById("logoutBtn").onclick = logoutUser;

watchAuthState(async user => {
  state.currentUser = user;

  if (user) {
    await syncFromCloud();

    if (!state.currentCalendarId) {
      createCalendar("My Calendar");
    }

    renderCalendar(container, state);
  }
});

loadSharedCalendar(state);
