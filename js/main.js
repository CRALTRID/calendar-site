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
const calendarOwnerHint = document.getElementById("calendarOwnerHint");
const calendarTitleInput = document.getElementById("calendarTitleInput");
const saveCalendarTitleBtn = document.getElementById("saveCalendarTitleBtn");
const deleteCalendarBtn = document.getElementById("deleteCalendarBtn");
const todayHint = document.getElementById("todayHint");

const legendPanelTitle = document.getElementById("legendPanelTitle");
const legendPanelHint = document.getElementById("legendPanelHint");
const legendPanelDesc = document.getElementById("legendPanelDesc");
const totalLabel = document.getElementById("totalLabel");
const rangeLabel = document.getElementById("rangeLabel");
const calendarBanner = document.getElementById("calendarBanner");

const totalCount = document.getElementById("totalCount");
const rangeCount = document.getElementById("rangeCount");

const calendarContainer = document.getElementById("calendarContainer");

function fillStaticText() {
  gateTitle.textContent = "Challenge Hub";
  gateDesc.textContent = "Please sign in to continue.";
  loginBtn.textContent = "Google Login";
  logoutBtn.textContent = "Logout";

  if (brandTitle) brandTitle.textContent = "Challenge Hub";
  if (brandSubtitle) brandSubtitle.textContent = "Personal workspace";

  if (calendarSectionTitle) calendarSectionTitle.textContent = "CALENDARS";
  if (viewSectionTitle) viewSectionTitle.textContent = "VIEW";
  if (pageSectionTitle) pageSectionTitle.textContent = "PAGES";

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
  if (calendarOwnerHint) calendarOwnerHint.textContent = "";
  if (saveCalendarTitleBtn) saveCalendarTitleBtn.textContent = "Save Title";
  if (deleteCalendarBtn) deleteCalendarBtn.textContent = "Delete";
  if (todayHint) todayHint.textContent = "Today is outlined in black";

  if (legendPanelTitle) legendPanelTitle.textContent = "Legend";
  if (legendPanelHint) legendPanelHint.textContent = "Current calendar";
  if (legendPanelDesc) legendPanelDesc.textContent = "Click a day to cycle white / red / yellow.";
  if (rangeLabel) rangeLabel.textContent = "Recorded this month";
  if (totalLabel) totalLabel.textContent = "Total recorded days";
  if (calendarBanner) calendarBanner.textContent = "Core layout is working.";

  if (calendarTitleInput && !calendarTitleInput.value) {
    calendarTitleInput.value = "My Calendar";
  }

  if (totalCount) totalCount.textContent = "0";
  if (rangeCount) rangeCount.textContent = "0";
}

function showGate() {
  authGate.classList.remove("hidden");
  app.classList.add("hidden");
}

function showApp() {
  authGate.classList.add("hidden");
  app.classList.remove("hidden");
}

function renderCurrentCalendar() {
  if (calendarContainer) {
    renderCalendar(calendarContainer, state);
  }
}

function bindNavigationButtons() {
  if (prevBtn) {
    prevBtn.onclick = () => {
      state.currentDate = new Date(
        state.currentDate.getFullYear(),
        state.currentDate.getMonth() - 1,
        1
      );
      renderCurrentCalendar();
    };
  }

  if (nextBtn) {
    nextBtn.onclick = () => {
      state.currentDate = new Date(
        state.currentDate.getFullYear(),
        state.currentDate.getMonth() + 1,
        1
      );
      renderCurrentCalendar();
    };
  }

  if (todayBtn) {
    todayBtn.onclick = () => {
      state.currentDate = new Date();
      renderCurrentCalendar();
    };
  }
}

function bindSidebarButtons() {
  if (monthViewBtn) {
    monthViewBtn.onclick = () => {
      state.currentView = "month";
      monthViewBtn.classList.add("active");
      if (yearViewBtn) yearViewBtn.classList.remove("active");
      renderCurrentCalendar();
    };
  }

  if (yearViewBtn) {
    yearViewBtn.onclick = () => {
      state.currentView = "year";
      yearViewBtn.classList.add("active");
      if (monthViewBtn) monthViewBtn.classList.remove("active");
      alert("Year View will be added next.");
    };
  }

  if (createCalendarBtn) {
    createCalendarBtn.onclick = () => {
      const name = prompt("Enter new calendar name:");
      if (name && calendarTitleInput) {
        calendarTitleInput.value = name;
      }
    };
  }

  if (saveCalendarTitleBtn) {
    saveCalendarTitleBtn.onclick = () => {
      alert("Calendar title saved.");
    };
  }

  if (deleteCalendarBtn) {
    deleteCalendarBtn.onclick = () => {
      const ok = confirm("Delete this calendar?");
      if (ok && calendarTitleInput) {
        calendarTitleInput.value = "";
      }
    };
  }
}

function bindPageButtons() {
  const pages = document.querySelectorAll(".page");
  const pageButtons = document.querySelectorAll(".page-btn");

  pageButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const pageId = btn.dataset.page;
      if (!pageId) return;

      pages.forEach((page) => page.classList.remove("active"));
      pageButtons.forEach((b) => b.classList.remove("active"));

      const target = document.getElementById(pageId);
      if (target) target.classList.add("active");
      btn.classList.add("active");
    });
  });
}

fillStaticText();
bindNavigationButtons();
bindSidebarButtons();
bindPageButtons();

watchAuthState((user) => {
  state.currentUser = user;

  if (user) {
    if (userName) userName.textContent = user.displayName || "User";
    if (userEmail) userEmail.textContent = user.email || "";
    if (userAvatar) userAvatar.src = user.photoURL || "";

    gateStatus.textContent = `Signed in as ${user.email || "user"}`;
    showApp();
    renderCurrentCalendar();
  } else {
    gateStatus.textContent = "Not signed in";
    showGate();
  }
});

loginBtn.addEventListener("click", async () => {
  try {
    await loginWithGoogle();
  } catch (err) {
    gateStatus.textContent = `Firebase: ${err.message || err.code || "login failed"}`;
  }
});

logoutBtn.addEventListener("click", async () => {
  try {
    await logoutUser();
  } catch (err) {
    gateStatus.textContent = `Firebase: ${err.message || err.code || "logout failed"}`;
  }
});
