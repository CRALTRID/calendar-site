import { t, i18n } from "./i18n.js";
import { state } from "./state.js";

export const els = {
  topProgress: document.getElementById("topProgress"),
  authGate: document.getElementById("authGate"),
  app: document.getElementById("app"),
  loginBtn: document.getElementById("loginBtn"),
  logoutBtn: document.getElementById("logoutBtn"),
  gateTitle: document.getElementById("gateTitle"),
  gateDesc: document.getElementById("gateDesc"),
  gateStatus: document.getElementById("gateStatus"),

  brandTitle: document.getElementById("brandTitle"),
  brandSubtitle: document.getElementById("brandSubtitle"),

  calendarSectionTitle: document.getElementById("calendarSectionTitle"),
  viewSectionTitle: document.getElementById("viewSectionTitle"),
  pageSectionTitle: document.getElementById("pageSectionTitle"),

  navCalendarBtn: document.getElementById("navCalendarBtn"),
  navSharedBtn: document.getElementById("navSharedBtn"),
  navProfileBtn: document.getElementById("navProfileBtn"),
  navSettingsBtn: document.getElementById("navSettingsBtn"),

  monthViewBtn: document.getElementById("monthViewBtn"),
  yearViewBtn: document.getElementById("yearViewBtn"),

  ownedCalendarsList: document.getElementById("ownedCalendarsList"),
  createCalendarBtn: document.getElementById("createCalendarBtn"),

  userAvatar: document.getElementById("userAvatar"),
  userName: document.getElementById("userName"),
  userEmail: document.getElementById("userEmail"),

  calendarPageTitle: document.getElementById("calendarPageTitle"),
  calendarPageDesc: document.getElementById("calendarPageDesc"),
  prevBtn: document.getElementById("prevBtn"),
  todayBtn: document.getElementById("todayBtn"),
  nextBtn: document.getElementById("nextBtn"),

  calendarTitleLabel: document.getElementById("calendarTitleLabel"),
  calendarOwnerHint: document.getElementById("calendarOwnerHint"),
  calendarTitleInput: document.getElementById("calendarTitleInput"),
  saveCalendarTitleBtn: document.getElementById("saveCalendarTitleBtn"),
  deleteCalendarBtn: document.getElementById("deleteCalendarBtn"),

  mainTitle: document.getElementById("mainTitle"),
  todayHint: document.getElementById("todayHint"),
  monthView: document.getElementById("monthView"),
  yearView: document.getElementById("yearView"),
  weekdayRow: document.getElementById("weekdayRow"),
  calendarGrid: document.getElementById("calendarGrid"),
  yearGrid: document.getElementById("yearGrid"),

  legendPanelTitle: document.getElementById("legendPanelTitle"),
  legendPanelHint: document.getElementById("legendPanelHint"),
  legendPanelDesc: document.getElementById("legendPanelDesc"),
  legendList: document.getElementById("legendList"),
  rangeCount: document.getElementById("rangeCount"),
  rangeLabel: document.getElementById("rangeLabel"),
  totalCount: document.getElementById("totalCount"),
  totalLabel: document.getElementById("totalLabel"),
  calendarBanner: document.getElementById("calendarBanner"),

  sharedPageTitle: document.getElementById("sharedPageTitle"),
  sharedPageDesc: document.getElementById("sharedPageDesc"),
  inviteTitle: document.getElementById("inviteTitle"),
  inviteDesc: document.getElementById("inviteDesc"),
  inviteEmailInput: document.getElementById("inviteEmailInput"),
  inviteRoleSelect: document.getElementById("inviteRoleSelect"),
  inviteBtn: document.getElementById("inviteBtn"),
  shareStatus: document.getElementById("shareStatus"),
  ownSharedTitle: document.getElementById("ownSharedTitle"),
  ownSharedDesc: document.getElementById("ownSharedDesc"),
  ownSharedUsersList: document.getElementById("ownSharedUsersList"),
  sharedWithMeTitle: document.getElementById("sharedWithMeTitle"),
  sharedWithMeDesc: document.getElementById("sharedWithMeDesc"),
  sharedCalendarsList: document.getElementById("sharedCalendarsList"),

  profilePageTitle: document.getElementById("profilePageTitle"),
  profilePageDesc: document.getElementById("profilePageDesc"),
  profileAvatar: document.getElementById("profileAvatar"),
  profileDisplayName: document.getElementById("profileDisplayName"),
  profileDisplayEmail: document.getElementById("profileDisplayEmail"),
  labelName: document.getElementById("labelName"),
  labelEmail: document.getElementById("labelEmail"),
  labelPhone: document.getElementById("labelPhone"),
  labelBirthday: document.getElementById("labelBirthday"),
  profileNameInput: document.getElementById("profileNameInput"),
  profileEmailInput: document.getElementById("profileEmailInput"),
  profilePhoneInput: document.getElementById("profilePhoneInput"),
  profileBirthdayInput: document.getElementById("profileBirthdayInput"),
  saveProfileBtn: document.getElementById("saveProfileBtn"),
  profileStatus: document.getElementById("profileStatus"),

  settingsPageTitle: document.getElementById("settingsPageTitle"),
  settingsPageDesc: document.getElementById("settingsPageDesc"),
  languageLabel: document.getElementById("languageLabel"),
  languageSelect: document.getElementById("languageSelect"),

  dayModal: document.getElementById("dayModal"),
  selectedDateText: document.getElementById("selectedDateText"),
  dateModalDesc: document.getElementById("dateModalDesc"),
  optionGrid: document.getElementById("optionGrid"),
  noteLabel: document.getElementById("noteLabel"),
  noteInput: document.getElementById("noteInput"),
  saveNoteBtn: document.getElementById("saveNoteBtn"),
  clearDayBtn: document.getElementById("clearDayBtn"),
  closeModalBtn: document.getElementById("closeModalBtn")
};

export function startProgress() {
  els.topProgress.classList.add("show");
  els.topProgress.style.width = "20%";
  setTimeout(() => { els.topProgress.style.width = "65%"; }, 100);
  setTimeout(() => { els.topProgress.style.width = "85%"; }, 280);
}

export function stopProgress() {
  els.topProgress.style.width = "100%";
  setTimeout(() => {
    els.topProgress.classList.remove("show");
    els.topProgress.style.width = "0%";
  }, 260);
}

export function setBusy(button, busyText, busy = true) {
  if (busy) {
    button.dataset.oldText = button.textContent;
    button.textContent = busyText;
    button.disabled = true;
  } else {
    button.textContent = button.dataset.oldText || button.textContent;
    button.disabled = false;
  }
}

export function showAuthGate() {
  els.authGate.classList.remove("hidden");
  els.app.classList.add("hidden");
}

export function showApp() {
  els.authGate.classList.add("hidden");
  els.app.classList.remove("hidden");
}

export function setUserUI(user) {
  els.userAvatar.src = user.photoURL || "";
  els.userName.textContent = user.displayName || "User";
  els.userEmail.textContent = user.email || "";

  els.profileAvatar.src = user.photoURL || "";
  els.profileDisplayName.textContent = user.displayName || "User";
  els.profileDisplayEmail.textContent = user.email || "";
  els.profileEmailInput.value = user.email || "";
}

export function setPage(pageId) {
  state.activePage = pageId;

  document.querySelectorAll(".page").forEach((page) => {
    page.classList.toggle("active", page.id === pageId);
  });

  document.querySelectorAll(".page-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.page === pageId);
  });
}

export function setView(view) {
  state.currentView = view;
  els.monthViewBtn.classList.toggle("active", view === "month");
  els.yearViewBtn.classList.toggle("active", view === "year");
  els.monthView.classList.toggle("hidden", view !== "month");
  els.yearView.classList.toggle("hidden", view !== "year");
}

export function applyLanguageToStaticUI() {
  const lang = state.lang;

  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";

  els.gateTitle.textContent = t(lang, "gateTitle");
  els.gateDesc.textContent = t(lang, "gateDesc");
  els.loginBtn.textContent = t(lang, "loginGoogle");
  els.logoutBtn.textContent = t(lang, "logout");

  els.brandTitle.textContent = t(lang, "brandTitle");
  els.brandSubtitle.textContent = t(lang, "brandSubtitle");
  els.calendarSectionTitle.textContent = t(lang, "calendarSectionTitle");
  els.viewSectionTitle.textContent = t(lang, "viewSectionTitle");
  els.pageSectionTitle.textContent = t(lang, "pageSectionTitle");

  els.navCalendarBtn.textContent = t(lang, "navCalendar");
  els.navSharedBtn.textContent = t(lang, "navShared");
  els.navProfileBtn.textContent = t(lang, "navProfile");
  els.navSettingsBtn.textContent = t(lang, "navSettings");

  els.monthViewBtn.textContent = t(lang, "monthView");
  els.yearViewBtn.textContent = t(lang, "yearView");

  els.createCalendarBtn.textContent = t(lang, "createCalendar");

  els.calendarPageTitle.textContent = t(lang, "calendarPageTitle");
  els.calendarPageDesc.textContent = t(lang, "calendarPageDesc");
  els.prevBtn.textContent = t(lang, "prev");
  els.todayBtn.textContent = t(lang, "today");
  els.nextBtn.textContent = t(lang, "next");
  els.calendarTitleLabel.textContent = t(lang, "calendarTitleSectionLabel");
  els.saveCalendarTitleBtn.textContent = t(lang, "saveCalendarTitle");
  els.deleteCalendarBtn.textContent = t(lang, "deleteCalendar");
  els.todayHint.textContent = t(lang, "todayHint");
  els.legendPanelTitle.textContent = t(lang, "legendPanelTitle");
  els.legendPanelHint.textContent = t(lang, "legendPanelHint");
  els.legendPanelDesc.textContent = t(lang, "legendPanelDesc");
  els.totalLabel.textContent = t(lang, "totalLabel");
  els.calendarBanner.textContent = t(lang, "calendarBanner");

  els.sharedPageTitle.textContent = t(lang, "sharedPageTitle");
  els.sharedPageDesc.textContent = t(lang, "sharedPageDesc");
  els.inviteTitle.textContent = t(lang, "inviteTitle");
  els.inviteDesc.textContent = t(lang, "inviteDesc");
  els.inviteEmailInput.placeholder = t(lang, "invitePlaceholder");
  els.inviteBtn.textContent = t(lang, "inviteBtn");
  els.inviteRoleSelect.innerHTML = `
    <option value="editor">${t(lang, "inviteRoleEditor")}</option>
    <option value="viewer">${t(lang, "inviteRoleViewer")}</option>
  `;
  els.ownSharedTitle.textContent = t(lang, "ownSharedTitle");
  els.ownSharedDesc.textContent = t(lang, "ownSharedDesc");
  els.sharedWithMeTitle.textContent = t(lang, "sharedWithMeTitle");
  els.sharedWithMeDesc.textContent = t(lang, "sharedWithMeDesc");

  els.profilePageTitle.textContent = t(lang, "profilePageTitle");
  els.profilePageDesc.textContent = t(lang, "profilePageDesc");
  els.labelName.textContent = t(lang, "labelName");
  els.labelEmail.textContent = t(lang, "labelEmail");
  els.labelPhone.textContent = t(lang, "labelPhone");
  els.labelBirthday.textContent = t(lang, "labelBirthday");
  els.profileNameInput.placeholder = t(lang, "namePlaceholder");
  els.profilePhoneInput.placeholder = t(lang, "phonePlaceholder");
  els.saveProfileBtn.textContent = t(lang, "saveProfile");

  els.settingsPageTitle.textContent = t(lang, "settingsPageTitle");
  els.settingsPageDesc.textContent = t(lang, "settingsPageDesc");
  els.languageLabel.textContent = t(lang, "languageLabel");
  els.languageSelect.value = lang;

  els.dateModalDesc.textContent = t(lang, "dateModalDesc");
  els.noteLabel.textContent = t(lang, "noteLabel");
  els.noteInput.placeholder = t(lang, "notePlaceholder");
  els.saveNoteBtn.textContent = t(lang, "saveNote");
  els.clearDayBtn.textContent = t(lang, "clearDay");
}

export function renderWeekdays() {
  els.weekdayRow.innerHTML = "";
  i18n[state.lang].weekdays.forEach((day) => {
    const el = document.createElement("div");
    el.className = "weekday";
    el.textContent = day;
    els.weekdayRow.appendChild(el);
  });
}

export function formatDateKey(dateKey) {
  const [y, m, d] = dateKey.split("-");
  if (state.lang === "zh") return `${y}年${Number(m)}月${Number(d)}日`;
  return `${i18n[state.lang].months[Number(m) - 1]} ${Number(d)}, ${y}`;
}

export function getDateKey(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
}

export function getMonthPrefix(year, month) {
  return `${year}-${String(month + 1).padStart(2, "0")}-`;
}

export function openDayModal(dateKey) {
  state.selectedDateKey = dateKey;
  els.selectedDateText.textContent = formatDateKey(dateKey);
  els.dayModal.classList.remove("hidden");
}

export function closeDayModal() {
  state.selectedDateKey = null;
  els.dayModal.classList.add("hidden");
}
