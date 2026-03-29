import { loginWithGoogle, logoutUser, watchAuthState } from "./auth.js";
import { state } from "./state.js";
import { renderCalendar } from "./calendar.js";

const $ = (id) => document.getElementById(id);

const gateTitle = $("gateTitle");
const gateDesc = $("gateDesc");
const loginBtn = $("loginBtn");
const gateStatus = $("gateStatus");

const authGate = $("authGate");
const app = $("app");

const logoutBtn = $("logoutBtn");
const userName = $("userName");
const userEmail = $("userEmail");
const userAvatar = $("userAvatar");

const brandTitle = $("brandTitle");
const brandSubtitle = $("brandSubtitle");
const calendarSectionTitle = $("calendarSectionTitle");
const viewSectionTitle = $("viewSectionTitle");
const pageSectionTitle = $("pageSectionTitle");

const navCalendarBtn = $("navCalendarBtn");
const navSharedBtn = $("navSharedBtn");
const navProfileBtn = $("navProfileBtn");
const navSettingsBtn = $("navSettingsBtn");

const monthViewBtn = $("monthViewBtn");
const yearViewBtn = $("yearViewBtn");
const createCalendarBtn = $("createCalendarBtn");

const calendarPageTitle = $("calendarPageTitle");
const calendarPageDesc = $("calendarPageDesc");

const prevBtn = $("prevBtn");
const todayBtn = $("todayBtn");
const nextBtn = $("nextBtn");

const calendarTitleLabel = $("calendarTitleLabel");
const calendarOwnerHint = $("calendarOwnerHint");
const calendarTitleInput = $("calendarTitleInput");
const saveCalendarTitleBtn = $("saveCalendarTitleBtn");
const deleteCalendarBtn = $("deleteCalendarBtn");
const todayHint = $("todayHint");

const legendPanelTitle = $("legendPanelTitle");
const legendPanelHint = $("legendPanelHint");
const legendPanelDesc = $("legendPanelDesc");
const totalLabel = $("totalLabel");
const rangeLabel = $("rangeLabel");
const calendarBanner = $("calendarBanner");

const totalCount = $("totalCount");
const rangeCount = $("rangeCount");

const calendarContainer = $("calendarContainer");

function fillUI() {
  if (gateTitle) gateTitle.textContent = "Challenge Hub";
  if (gateDesc) gateDesc.textContent = "Please sign in to continue.";
  if (loginBtn) loginBtn.textContent = "Google Login";
  if (logoutBtn) logoutBtn.textContent = "Logout";

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
  if (calendarPageDesc) calendarPageDesc.textContent = "Click a day to mark it.";

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

  if (totalCount && !totalCount.textContent) totalCount.textContent = "0";
  if (rangeCount && !rangeCount.textContent) rangeCount.textContent = "0";
}

function showGate() {
  if (authGate) authGate.classList.remove("hidden");
  if (app) app.classList.add("hidden");
}

function showApp() {
  if (authGate) authGate.classList.add("hidden");
  if (app) app.classList.remove("hidden");
}

function renderCurrentCalendar() {
  if (calendarContainer) {
    renderCalendar(calendarContainer, state);
  }
}

function bindTopNavigation() {
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

function bindSidebarActions() {
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

      const targetPage = document.getElementById(pageId);
      if (targetPage) targetPage.classList.add("active");

      btn.classList.add("active");
    });
  });
}

function updateUserCard(user) {
  if (userName) userName.textContent = user?.displayName || "User";
  if (userEmail) userEmail.textContent = user?.email || "";
  if (userAvatar && user?.photoURL) {
    userAvatar.src = user.photoURL;
  }
}

fillUI();
bindTopNavigation();
bindSidebarActions();
bindPageButtons();

watchAuthState((user) => {
  state.currentUser = user;

  if (user) {
    updateUserCard(user);
    if (gateStatus) {
      gateStatus.textContent = `Signed in as ${user.email || "user"}`;
    }
    showApp();
    renderCurrentCalendar();
  } else {
    if (gateStatus) gateStatus.textContent = "Not signed in";
    showGate();
  }
});

if (loginBtn) {
  loginBtn.onclick = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      if (gateStatus) {
        gateStatus.textContent = `Firebase: ${err.message || err.code || "login failed"}`;
      }
    }
  };
}

if (logoutBtn) {
  logoutBtn.onclick = async () => {
    try {
      await logoutUser();
    } catch (err) {
      if (gateStatus) {
        gateStatus.textContent = `Firebase: ${err.message || err.code || "logout failed"}`;
      }
    }
  };
}
