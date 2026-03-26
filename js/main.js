import { loginWithGoogle, logoutUser, watchAuthState } from "./auth.js";
import { state } from "./state.js";
import { t } from "./i18n.js";
import {
  els,
  startProgress,
  stopProgress,
  setBusy,
  showAuthGate,
  showApp,
  setUserUI,
  setPage,
  setView,
  applyLanguageToStaticUI,
  closeDayModal
} from "./ui.js";
import {
  cleanupSubscriptions,
  ensureProfileExists,
  subscribeProfile,
  openFirstAvailableCalendar,
  subscribeSharedCalendars,
  subscribeActiveCalendar,
  createCalendarForUser,
  loadOwnedCalendars,
  saveCalendarTitle,
  deleteCalendarById
} from "./db.js";
import {
  renderCalendarPage,
  setDayLegend,
  saveDayNote,
  clearDay
} from "./calendar.js";
import { renderSharePage, handleInvite } from "./share.js";
import { renderProfile, handleSaveProfile } from "./profile.js";

function canDeleteCurrentCalendar() {
  return state.currentUser && state.activeCalendarOwnerUid === state.currentUser.uid;
}

function renderOwnedCalendars() {
  els.ownedCalendarsList.innerHTML = "";

  if (!state.ownedCalendars.length) {
    const empty = document.createElement("div");
    empty.className = "small";
    empty.textContent = t(state.lang, "noCalendars");
    els.ownedCalendarsList.appendChild(empty);
    return;
  }

  state.ownedCalendars.forEach((calendar) => {
    const row = document.createElement("div");
    row.className = "calendar-list-item";

    const openBtn = document.createElement("button");
    openBtn.className = "calendar-open-btn";
    if (state.activeCalendarId === calendar.id) openBtn.classList.add("active");
    openBtn.textContent = calendar.title || t(state.lang, "myCalendarName");
    openBtn.addEventListener("click", () => openCalendar(calendar.id));

    row.appendChild(openBtn);

    if (calendar.ownerUid === state.currentUser?.uid) {
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "danger";
      deleteBtn.textContent = "×";
      deleteBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const ok = confirm(t(state.lang, "deleteCalendarConfirm"));
        if (!ok) return;
        await deleteCalendarById(calendar.id);
        await loadOwnedCalendars(state.currentUser);
        renderOwnedCalendars();

        if (state.activeCalendarId === calendar.id) {
          const next = await openFirstAvailableCalendar(state.currentUser);
          await openCalendar(next);
        }
      });
      row.appendChild(deleteBtn);
    }

    els.ownedCalendarsList.appendChild(row);
  });
}

function renderModalLegendOptions() {
  if (!state.calendar || !state.selectedDateKey) return;

  els.noteInput.value = state.calendar.entries?.[state.selectedDateKey]?.note || "";
  els.optionGrid.innerHTML = "";

  state.calendar.legends.forEach((legend) => {
    const item = document.createElement("div");
    item.className = "option";
    item.innerHTML = `
      <div class="swatch" style="background:${legend.color}"></div>
      <div>
        <div><strong>${legend.label}</strong></div>
        <div class="small">${state.lang === "zh" ? "点击选择颜色标签" : "Click to choose this label"}</div>
      </div>
    `;
    item.addEventListener("click", async () => {
      await setDayLegend(state.selectedDateKey, legend.id);
      renderAll();
      renderModalLegendOptions();
    });
    els.optionGrid.appendChild(item);
  });
}

function renderAll() {
  applyLanguageToStaticUI();
  renderOwnedCalendars();
  renderCalendarPage();
  renderSharePage();
  renderProfile();

  if (!els.dayModal.classList.contains("hidden")) {
    renderModalLegendOptions();
  }
}

async function openCalendar(id) {
  subscribeActiveCalendar(
    id,
    () => {
      renderAll();
    },
    () => {
      els.shareStatus.textContent = t(state.lang, "openCalendarFail");
    }
  );
}

function wirePageButtons() {
  document.querySelectorAll(".page-btn").forEach((btn) => {
    btn.addEventListener("click", () => setPage(btn.dataset.page));
  });
}

function wireViewButtons() {
  els.monthViewBtn.addEventListener("click", () => {
    setView("month");
    renderCalendarPage();
  });

  els.yearViewBtn.addEventListener("click", () => {
    setView("year");
    renderCalendarPage();
  });
}

function wireTopbarButtons() {
  els.prevBtn.addEventListener("click", () => {
    if (state.currentView === "month") {
      state.currentDate = new Date(state.currentDate.getFullYear(), state.currentDate.getMonth() - 1, 1);
    } else {
      state.currentDate = new Date(state.currentDate.getFullYear() - 1, 0, 1);
    }
    renderCalendarPage();
  });

  els.nextBtn.addEventListener("click", () => {
    if (state.currentView === "month") {
      state.currentDate = new Date(state.currentDate.getFullYear(), state.currentDate.getMonth() + 1, 1);
    } else {
      state.currentDate = new Date(state.currentDate.getFullYear() + 1, 0, 1);
    }
    renderCalendarPage();
  });

  els.todayBtn.addEventListener("click", () => {
    state.currentDate = new Date();
    state.currentView = "month";
    setView("month");
    renderCalendarPage();
  });
}

function wireCalendarActions() {
  els.createCalendarBtn.addEventListener("click", async () => {
    const title = prompt(t(state.lang, "createCalendarPrompt"), t(state.lang, "newCalendarDefault"));
    if (title === null) return;
    const id = await createCalendarForUser(state.currentUser, title.trim() || t(state.lang, "newCalendarDefault"));
    await loadOwnedCalendars(state.currentUser);
    renderOwnedCalendars();
    await openCalendar(id);
  });

  els.saveCalendarTitleBtn.addEventListener("click", async () => {
    await saveCalendarTitle(els.calendarTitleInput.value.trim() || t(state.lang, "myCalendarName"));
    await loadOwnedCalendars(state.currentUser);
    renderOwnedCalendars();
  });

  els.deleteCalendarBtn.addEventListener("click", async () => {
    if (!canDeleteCurrentCalendar()) return;
    const ok = confirm(t(state.lang, "deleteCalendarConfirm"));
    if (!ok) return;

    await deleteCalendarById(state.activeCalendarId);
    await loadOwnedCalendars(state.currentUser);
    renderOwnedCalendars();

    const next = await openFirstAvailableCalendar(state.currentUser);
    await openCalendar(next);
  });
}

function wireShareActions() {
  els.inviteBtn.addEventListener("click", handleInvite);
}

function wireProfileActions() {
  els.saveProfileBtn.addEventListener("click", handleSaveProfile);
}

function wireSettingsActions() {
  els.languageSelect.addEventListener("change", () => {
    state.lang = els.languageSelect.value;
    localStorage.setItem("challenge_lang", state.lang);
    renderAll();
  });
}

function wireModalActions() {
  els.closeModalBtn.addEventListener("click", closeDayModal);

  els.saveNoteBtn.addEventListener("click", async () => {
    if (!state.selectedDateKey) return;
    const ok = await saveDayNote(state.selectedDateKey, els.noteInput.value);
    if (ok) closeDayModal();
  });

  els.clearDayBtn.addEventListener("click", async () => {
    if (!state.selectedDateKey) return;
    const ok = await clearDay(state.selectedDateKey);
    if (ok) closeDayModal();
  });

  els.dayModal.addEventListener("click", (e) => {
    if (e.target === els.dayModal) closeDayModal();
  });

  window.addEventListener("open-calendar", async (e) => {
    await openCalendar(e.detail);
    setPage("calendarPage");
  });
}

async function handleSignedIn(user) {
  state.currentUser = user;
  setUserUI(user);

  await ensureProfileExists(user);
  subscribeProfile(user, renderProfile);

  await loadOwnedCalendars(user);
  subscribeSharedCalendars(user, renderSharePage);

  const firstId = await openFirstAvailableCalendar(user);
  await openCalendar(firstId);

  showApp();
  renderAll();
}

function handleSignedOut() {
  cleanupSubscriptions();
  state.currentUser = null;
  state.activeCalendarId = null;
  state.activeCalendarOwnerUid = null;
  state.ownedCalendars = [];
  state.sharedCalendars = [];
  state.calendar = null;
  showAuthGate();
}

function wireAuthButtons() {
  els.loginBtn.addEventListener("click", async () => {
    try {
      startProgress();
      setBusy(els.loginBtn, t(state.lang, "loggingIn"), true);
      els.gateStatus.textContent = t(state.lang, "loggingIn");
      await loginWithGoogle();
    } catch (err) {
      els.gateStatus.textContent = `登录失败: ${err.code || err.message || "unknown"}`;
      stopProgress();
      setBusy(els.loginBtn, "", false);
    }
  });

  els.logoutBtn.addEventListener("click", async () => {
    try {
      startProgress();
      setBusy(els.logoutBtn, t(state.lang, "loggingOut"), true);
      await logoutUser();
    } catch {
      stopProgress();
      setBusy(els.logoutBtn, "", false);
    }
  });
}

function init() {
  applyLanguageToStaticUI();
  setPage("calendarPage");
  setView("month");

  wireAuthButtons();
  wirePageButtons();
  wireViewButtons();
  wireTopbarButtons();
  wireCalendarActions();
  wireShareActions();
  wireProfileActions();
  wireSettingsActions();
  wireModalActions();

  watchAuthState(async (user) => {
    if (user) {
      await handleSignedIn(user);
    } else {
      handleSignedOut();
    }

    stopProgress();
    setBusy(els.loginBtn, "", false);
    setBusy(els.logoutBtn, "", false);
  });
}

init();
