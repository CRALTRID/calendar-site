import { loginWithGoogle, logoutUser, watchAuthState } from "./auth.js";
import { state } from "./state.js";
import { renderCalendar } from "./calendar.js";

const gateTitle = document.getElementById("gateTitle");
const gateDesc = document.getElementById("gateDesc");
const loginBtn = document.getElementById("loginBtn");
const gateStatus = document.getElementById("gateStatus");

const authGate = document.getElementById("authGate");
const app = document.getElementById("app");

const logoutBtn = document.getElementById("logoutBtn");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const userAvatar = document.getElementById("userAvatar");

const brandTitle = document.getElementById("brandTitle");
const brandSubtitle = document.getElementById("brandSubtitle");
const calendarSectionTitle = document.getElementById("calendarSectionTitle");
const viewSectionTitle = document.getElementById("viewSectionTitle");
const pageSectionTitle = document.getElementById("pageSectionTitle");

const navCalendarBtn = document.getElementById("navCalendarBtn");
const navSharedBtn = document.getElementById("navSharedBtn");
const navProfileBtn = document.getElementById("navProfileBtn");
const navSettingsBtn = document.getElementById("navSettingsBtn");

const monthViewBtn = document.getElementById("monthViewBtn");
const yearViewBtn = document.getElementById("yearViewBtn");
const createCalendarBtn = document.getElementById("createCalendarBtn");

const calendarPageTitle = document.getElementById("calendarPageTitle");
const calendarPageDesc = document.getElementById("calendarPageDesc");
const prevBtn = document.getElementById("prevBtn");
const todayBtn = document.getElementById("todayBtn");
const nextBtn = document.getElementById("nextBtn");

const calendarTitleLabel = document.getElementById("calendarTitleLabel");
const saveCalendarTitleBtn = document.getElementById("saveCalendarTitleBtn");
const deleteCalendarBtn = document.getElementById("deleteCalendarBtn");
const todayHint = document.getElementById("todayHint");

const legendPanelTitle = document.getElementById("legendPanelTitle");
const legendPanelHint = document.getElementById("legendPanelHint");
const legendPanelDesc = document.getElementById("legendPanelDesc");
const totalLabel = document.getElementById("totalLabel");
const rangeLabel = document.getElementById("rangeLabel");
const calendarBanner = document.getElementById("calendarBanner");

const calendarContainer = document.getElementById("calendarContainer");

function fillStaticText() {
  gateTitle.textContent = "Challenge Hub";
  gateDesc.textContent = "Please sign in to continue.";
  loginBtn.textContent = "Google Login";
  logoutBtn.textContent = "Logout";

  if (brandTitle) brandTitle.textContent = "Challenge Hub";
  if (brandSubtitle) brandSubtitle.textContent = "Personal workspace";

  if (calendarSectionTitle) calendarSectionTitle.textContent = "Calendars";
  if (viewSectionTitle) viewSectionTitle.textContent = "View";
  if (pageSectionTitle) pageSectionTitle.textContent = "Pages";

  if (navCalendarBtn) navCalendarBtn.textContent = "Calendar";
  if (navSharedBtn) navSharedBtn.textContent = "Sharing";
  if (navProfileBtn) navProfileBtn.textContent = "Profile";
  if (navSettingsBtn) navSettingsBtn.textContent = "Settings";

  if (monthViewBtn) monthViewBtn.textContent = "Month View";
  if (yearViewBtn) yearViewBtn.textContent = "Year View";
  if (createCalendarBtn) createCalendarBtn.textContent = "New Calendar";

  if (calendarPageTitle) calendarPageTitle.textContent = "Personal Challenge Calendar";
  if (calendarPageDesc) calendarPageDesc.textContent = "Basic running version";
  if (prevBtn) prevBtn.textContent = "Previous";
  if (todayBtn) todayBtn.textContent = "Today";
  if (nextBtn) nextBtn.textContent = "Next";

  if (calendarTitleLabel) calendarTitleLabel.textContent = "Calendar Title";
  if (saveCalendarTitleBtn) saveCalendarTitleBtn.textContent = "Save Title";
  if (deleteCalendarBtn) deleteCalendarBtn.textContent = "Delete";
  if (todayHint) todayHint.textContent = "Today is outlined in black";

  if (legendPanelTitle) legendPanelTitle.textContent = "Legend";
  if (legendPanelHint) legendPanelHint.textContent = "Current calendar";
  if (legendPanelDesc) legendPanelDesc.textContent = "Labels and counts will go here.";
  if (totalLabel) totalLabel.textContent = "Total recorded days";
  if (rangeLabel) rangeLabel.textContent = "Recorded this month";
  if (calendarBanner) calendarBanner.textContent = "Core layout is working.";
}

function showGate() {
  authGate.classList.remove("hidden");
  app.classList.add("hidden");
}

function showApp() {
  authGate.classList.add("hidden");
  app.classList.remove("hidden");
}

fillStaticText();

watchAuthState((user) => {
  state.currentUser = user;

  if (user) {
    if (userName) userName.textContent = user.displayName || "User";
    if (userEmail) userEmail.textContent = user.email || "";
    if (userAvatar) userAvatar.src = user.photoURL || "";

    showApp();

    if (calendarContainer) {
      renderCalendar(calendarContainer, state);
    }
  } else {
    gateStatus.textContent = "Not signed in";
    showGate();
  }
});

loginBtn.addEventListener("click", async () => {
  try {
    await loginWithGoogle();
  } catch (err) {
    gateStatus.textContent = err.code || err.message || "login failed";
  }
});

logoutBtn.addEventListener("click", async () => {
  try {
    await logoutUser();
  } catch (err) {
    gateStatus.textContent = err.code || err.message || "logout failed";
  }
});
