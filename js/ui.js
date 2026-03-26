import { i18n, t } from "./i18n.js";

export const state = {
  lang: localStorage.getItem("challenge_lang") || "zh",
  currentDate: new Date(),
  currentView: "month"
};

export const els = {
  progress: document.getElementById("topProgress"),
  gate: document.getElementById("authGate"),
  app: document.getElementById("app"),
  loginBtn: document.getElementById("loginBtn"),
  logoutBtn: document.getElementById("logoutBtn"),
  gateText: document.getElementById("gateText"),
  gateStatus: document.getElementById("gateStatus"),

  monthViewBtn: document.getElementById("monthViewBtn"),
  yearViewBtn: document.getElementById("yearViewBtn"),

  prevBtn: document.getElementById("prevBtn"),
  todayBtn: document.getElementById("todayBtn"),
  nextBtn: document.getElementById("nextBtn"),

  pageTitle: document.getElementById("pageTitle"),
  pageDesc: document.getElementById("pageDesc"),

  userAvatar: document.getElementById("userAvatar"),
  userName: document.getElementById("userName"),
  userEmail: document.getElementById("userEmail"),

  monthView: document.getElementById("monthView"),
  yearView: document.getElementById("yearView"),
  monthTitle: document.getElementById("monthTitle"),
  yearTitle: document.getElementById("yearTitle"),
  weekdayRow: document.getElementById("weekdayRow"),
  calendarGrid: document.getElementById("calendarGrid"),
  yearGrid: document.getElementById("yearGrid")
};

export function startProgress() {
  els.progress.classList.add("show");
  els.progress.style.width = "20%";
  setTimeout(() => { els.progress.style.width = "65%"; }, 120);
  setTimeout(() => { els.progress.style.width = "85%"; }, 280);
}

export function stopProgress() {
  els.progress.style.width = "100%";
  setTimeout(() => {
    els.progress.classList.remove("show");
    els.progress.style.width = "0%";
  }, 240);
}

export function setBusy(button, text, busy) {
  if (busy) {
    button.dataset.old = button.textContent;
    button.textContent = text;
    button.disabled = true;
    button.classList.add("busy-btn");
  } else {
    button.textContent = button.dataset.old || button.textContent;
    button.disabled = false;
    button.classList.remove("busy-btn");
  }
}

export function applyLanguage() {
  const lang = state.lang;
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";

  els.pageTitle.textContent = t(lang, "pageTitle");
  els.pageDesc.textContent = t(lang, "pageDesc");
  els.gateText.textContent = t(lang, "gateText");
  els.gateStatus.textContent = t(lang, "gateChecking");
  els.loginBtn.textContent = t(lang, "loginBtn");
  els.logoutBtn.textContent = t(lang, "logoutBtn");
  els.monthViewBtn.textContent = t(lang, "monthView");
  els.yearViewBtn.textContent = t(lang, "yearView");
  els.prevBtn.textContent = t(lang, "prev");
  els.todayBtn.textContent = t(lang, "today");
  els.nextBtn.textContent = t(lang, "next");

  renderWeekdays();
  renderCalendar();
}

export function setUser(user) {
  els.userAvatar.src = user.photoURL || "";
  els.userName.textContent = user.displayName || "User";
  els.userEmail.textContent = user.email || "";
}

export function showGate() {
  els.gate.classList.remove("hidden");
  els.app.classList.add("hidden");
}

export function showApp() {
  els.gate.classList.add("hidden");
  els.app.classList.remove("hidden");
}

export function setView(view) {
  state.currentView = view;

  els.monthViewBtn.classList.toggle("active", view === "month");
  els.yearViewBtn.classList.toggle("active", view === "year");

  els.monthView.classList.toggle("hidden", view !== "month");
  els.yearView.classList.toggle("hidden", view !== "year");

  renderCalendar();
}

export function moveDate(offset) {
  if (state.currentView === "month") {
    state.currentDate = new Date(
      state.currentDate.getFullYear(),
      state.currentDate.getMonth() + offset,
      1
    );
  } else {
    state.currentDate = new Date(
      state.currentDate.getFullYear() + offset,
      0,
      1
    );
  }
  renderCalendar();
}

export function resetToday() {
  state.currentDate = new Date();
  state.currentView = "month";
  setView("month");
}

function renderWeekdays() {
  const lang = state.lang;
  els.weekdayRow.innerHTML = "";
  i18n[lang].weekdays.forEach((day) => {
    const el = document.createElement("div");
    el.className = "weekday";
    el.textContent = day;
    els.weekdayRow.appendChild(el);
  });
}

function renderCalendar() {
  if (state.currentView === "month") {
    renderMonth();
  } else {
    renderYear();
  }
}

function renderMonth() {
  const lang = state.lang;
  const year = state.currentDate.getFullYear();
  const month = state.currentDate.getMonth();

  els.monthTitle.textContent =
    lang === "zh"
      ? `${year}年 ${month + 1}月`
      : `${i18n[lang].months[month]} ${year}`;

  els.calendarGrid.innerHTML = "";

  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const today = new Date();

  for (let i = 0; i < 42; i++) {
    let dayNum;
    let cellDate;
    let otherMonth = false;

    if (i < startWeekday) {
      dayNum = daysInPrevMonth - startWeekday + i + 1;
      cellDate = new Date(year, month - 1, dayNum);
      otherMonth = true;
    } else if (i >= startWeekday + daysInMonth) {
      dayNum = i - (startWeekday + daysInMonth) + 1;
      cellDate = new Date(year, month + 1, dayNum);
      otherMonth = true;
    } else {
      dayNum = i - startWeekday + 1;
      cellDate = new Date(year, month, dayNum);
    }

    const cell = document.createElement("div");
    cell.className = "day";
    if (otherMonth) cell.classList.add("other-month");

    if (
      cellDate.getFullYear() === today.getFullYear() &&
      cellDate.getMonth() === today.getMonth() &&
      cellDate.getDate() === today.getDate()
    ) {
      cell.classList.add("today");
    }

    cell.innerHTML = `<div class="day-number">${dayNum}</div>`;
    els.calendarGrid.appendChild(cell);
  }
}

function renderYear() {
  const lang = state.lang;
  const year = state.currentDate.getFullYear();

  els.yearTitle.textContent =
    lang === "zh" ? `${year}年 全年总览` : `${year} Year Overview`;

  els.yearGrid.innerHTML = "";

  for (let month = 0; month < 12; month++) {
    const box = document.createElement("div");
    box.className = "mini-month";

    const title = document.createElement("div");
    title.className = "mini-title";
    title.textContent = i18n[lang].months[month];
    box.appendChild(title);

    const w = document.createElement("div");
    w.className = "mini-weekdays";
    i18n[lang].weekdays.forEach((d) => {
      const el = document.createElement("div");
      el.textContent = d;
      w.appendChild(el);
    });
    box.appendChild(w);

    const days = document.createElement("div");
    days.className = "mini-days";

    const firstDay = new Date(year, month, 1);
    const startWeekday = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < startWeekday; i++) {
      const empty = document.createElement("div");
      empty.className = "mini-day empty";
      days.appendChild(empty);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const day = document.createElement("div");
      day.className = "mini-day";
      day.textContent = d;
      days.appendChild(day);
    }

    box.appendChild(days);
    els.yearGrid.appendChild(box);
  }
}