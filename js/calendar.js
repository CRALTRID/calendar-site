import { state } from "./state.js";
import { t, i18n } from "./i18n.js";
import { els, getDateKey, getMonthPrefix, renderWeekdays, openDayModal } from "./ui.js";
import { saveCurrentCalendar } from "./db.js";

export function canEditCurrentCalendar() {
  if (!state.currentUser || !state.activeCalendarOwnerUid || !state.calendar) return false;
  if (state.currentUser.uid === state.activeCalendarOwnerUid) return true;
  return state.calendar.sharedMeta?.[state.currentUser.uid]?.role === "editor";
}

export function getEntry(dateKey) {
  return state.calendar?.entries?.[dateKey] || null;
}

export function getLegendById(id) {
  return state.calendar?.legends?.find((l) => l.id === id) || null;
}

export function getLegendTotalCount(legendId) {
  return Object.values(state.calendar?.entries || {}).filter((entry) => entry?.legendId === legendId).length;
}

export function getLegendRangeCount(legendId) {
  const year = state.currentDate.getFullYear();
  const month = state.currentDate.getMonth();

  if (state.currentView === "month") {
    const prefix = getMonthPrefix(year, month);
    return Object.entries(state.calendar?.entries || {}).filter(([key, entry]) => {
      return key.startsWith(prefix) && entry?.legendId === legendId;
    }).length;
  }

  const yearPrefix = `${year}-`;
  return Object.entries(state.calendar?.entries || {}).filter(([key, entry]) => {
    return key.startsWith(yearPrefix) && entry?.legendId === legendId;
  }).length;
}

export function renderLegendEditor() {
  if (!state.calendar) return;

  els.legendList.innerHTML = "";

  state.calendar.legends.forEach((legend) => {
    const row = document.createElement("div");
    row.className = "legend-item";

    const color = document.createElement("input");
    color.type = "color";
    color.className = "legend-color";
    color.value = legend.color;
    color.disabled = !canEditCurrentCalendar();

    const main = document.createElement("div");

    const input = document.createElement("input");
    input.value = legend.label;
    input.disabled = !canEditCurrentCalendar();

    const count = document.createElement("div");
    count.className = "legend-count";
    count.textContent =
      state.lang === "zh"
        ? `当前 ${getLegendRangeCount(legend.id)} 次 / 总共 ${getLegendTotalCount(legend.id)} 次`
        : `${getLegendRangeCount(legend.id)} in range / ${getLegendTotalCount(legend.id)} total`;

    color.addEventListener("input", async () => {
      legend.color = color.value;
      await saveCurrentCalendar();
    });

    input.addEventListener("change", async () => {
      legend.label = input.value.trim() || (state.lang === "zh" ? "未命名" : "Untitled");
      await saveCurrentCalendar();
    });

    main.appendChild(input);
    main.appendChild(count);

    row.appendChild(color);
    row.appendChild(main);
    els.legendList.appendChild(row);
  });
}

export function renderStats() {
  const total = Object.keys(state.calendar?.entries || {}).length;
  els.totalCount.textContent = total;

  const year = state.currentDate.getFullYear();
  const month = state.currentDate.getMonth();

  if (state.currentView === "month") {
    const prefix = getMonthPrefix(year, month);
    const count = Object.keys(state.calendar?.entries || {}).filter((k) => k.startsWith(prefix)).length;
    els.rangeCount.textContent = count;
    els.rangeLabel.textContent = t(state.lang, "rangeMonth");
  } else {
    const yearPrefix = `${year}-`;
    const count = Object.keys(state.calendar?.entries || {}).filter((k) => k.startsWith(yearPrefix)).length;
    els.rangeCount.textContent = count;
    els.rangeLabel.textContent = t(state.lang, "rangeYear");
  }
}

export function renderMonthView() {
  const year = state.currentDate.getFullYear();
  const month = state.currentDate.getMonth();

  els.mainTitle.textContent =
    state.lang === "zh"
      ? `${year}年 ${month + 1}月`
      : `${i18n[state.lang].months[month]} ${year}`;

  els.calendarGrid.innerHTML = "";

  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const todayKey = getDateKey(new Date());

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

    const dateKey = getDateKey(cellDate);
    const entry = getEntry(dateKey);
    const legend = entry?.legendId ? getLegendById(entry.legendId) : null;

    const day = document.createElement("div");
    day.className = "day";
    if (otherMonth) day.classList.add("other-month");
    if (dateKey === todayKey) day.classList.add("today");
    if (legend) day.style.background = legend.color;

    day.innerHTML = `<div class="day-number">${dayNum}</div>`;

    if (legend) {
      const label = document.createElement("div");
      label.className = "entry-label";
      label.textContent = legend.label;
      day.appendChild(label);
    }

    if (entry?.note) {
      const note = document.createElement("div");
      note.className = "entry-note";
      note.textContent = entry.note;
      day.appendChild(note);
    }

    day.addEventListener("click", () => openDayModal(dateKey));
    els.calendarGrid.appendChild(day);
  }
}

export function renderYearView() {
  const year = state.currentDate.getFullYear();

  els.mainTitle.textContent =
    state.lang === "zh"
      ? `${year}年 全年总览`
      : `${year} Year Overview`;

  els.yearGrid.innerHTML = "";

  for (let month = 0; month < 12; month++) {
    const box = document.createElement("div");
    box.className = "mini-month";

    const title = document.createElement("div");
    title.className = "mini-title";
    title.textContent = i18n[state.lang].months[month];
    box.appendChild(title);

    const weekdays = document.createElement("div");
    weekdays.className = "mini-weekdays";
    i18n[state.lang].weekdays.forEach((d) => {
      const el = document.createElement("div");
      el.textContent = d;
      weekdays.appendChild(el);
    });
    box.appendChild(weekdays);

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
      const date = new Date(year, month, d);
      const dateKey = getDateKey(date);
      const entry = getEntry(dateKey);
      const legend = entry?.legendId ? getLegendById(entry.legendId) : null;

      const cell = document.createElement("div");
      cell.className = "mini-day";
      if (legend) cell.style.background = legend.color;
      cell.textContent = d;
      cell.addEventListener("click", () => openDayModal(dateKey));
      days.appendChild(cell);
    }

    box.appendChild(days);
    els.yearGrid.appendChild(box);
  }
}

export function renderCalendarPage() {
  if (!state.calendar) return;

  renderWeekdays();
  renderLegendEditor();
  renderStats();

  els.calendarTitleInput.value = state.calendar.title || t(state.lang, "myCalendarName");
  els.calendarOwnerHint.textContent =
    state.activeCalendarOwnerUid === state.currentUser?.uid
      ? t(state.lang, "calendarOwnerHintMine")
      : t(state.lang, "calendarOwnerHintShared");

  els.calendarTitleInput.disabled = state.activeCalendarOwnerUid !== state.currentUser?.uid;
  els.saveCalendarTitleBtn.disabled = state.activeCalendarOwnerUid !== state.currentUser?.uid;
  els.deleteCalendarBtn.disabled = state.activeCalendarOwnerUid !== state.currentUser?.uid;

  if (state.currentView === "month") {
    renderMonthView();
  } else {
    renderYearView();
  }
}

export async function setDayLegend(dateKey, legendId) {
  if (!canEditCurrentCalendar()) return;
  const oldNote = state.calendar.entries[dateKey]?.note || "";
  state.calendar.entries[dateKey] = {
    legendId,
    note: oldNote
  };
  await saveCurrentCalendar();
}

export async function saveDayNote(dateKey, note) {
  if (!canEditCurrentCalendar()) return false;
  if (!state.calendar.entries[dateKey]) {
    state.calendar.entries[dateKey] = {
      legendId: null,
      note: note.trim()
    };
  } else {
    state.calendar.entries[dateKey].note = note.trim();
  }
  await saveCurrentCalendar();
  return true;
}

export async function clearDay(dateKey) {
  if (!canEditCurrentCalendar()) return false;
  delete state.calendar.entries[dateKey];
  await saveCurrentCalendar();
  return true;
}
