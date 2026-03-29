import { persistEntries } from "./state.js";

function getEntryKey(year, month, day) {
  return `${year}-${month + 1}-${day}`;
}

function getEntryColor(value) {
  const colors = {
    0: "#ffffff",
    1: "#fee2e2",
    2: "#fef3c7"
  };
  return colors[value] || "#ffffff";
}

function getMonthName(month) {
  return [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ][month];
}

function updateStats(state) {
  const totalCountEl = document.getElementById("totalCount");
  const rangeCountEl = document.getElementById("rangeCount");

  const current = state.currentDate || new Date();
  const year = current.getFullYear();
  const month = current.getMonth();
  const monthPrefix = `${year}-${month + 1}-`;

  const allEntries = Object.entries(state.entries || {});
  const activeEntries = allEntries.filter(([, value]) => value !== 0);
  const currentMonthEntries = activeEntries.filter(([key]) =>
    key.startsWith(monthPrefix)
  );

  if (totalCountEl) totalCountEl.textContent = String(activeEntries.length);
  if (rangeCountEl) rangeCountEl.textContent = String(currentMonthEntries.length);
}

function bindDayClicks(container, state, year, month) {
  const dayEls = container.querySelectorAll(".calendar-day");

  dayEls.forEach((el) => {
    el.addEventListener("click", () => {
      const day = Number(el.dataset.day);
      const key = getEntryKey(year, month, day);

      if (!state.entries) state.entries = {};

      const current = state.entries[key] || 0;
      const next = (current + 1) % 3;

      state.entries[key] = next;
      el.style.background = getEntryColor(next);

      persistEntries();
      updateStats(state);
    });
  });
}

export function renderCalendar(container, state) {
  if (!container) return;

  const current = state.currentDate || new Date();
  const year = current.getFullYear();
  const month = current.getMonth();

  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const mainTitle = document.getElementById("mainTitle");
  if (mainTitle) {
    mainTitle.textContent = `${getMonthName(month)} ${year}`;
  }

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  let html = `
    <div class="calendar-weekdays" style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px;margin-bottom:8px;">
      ${weekdays.map((day) => `
        <div style="text-align:center;color:#6b7280;font-weight:600;padding:8px 0;">
          ${day}
        </div>
      `).join("")}
    </div>

    <div class="calendar-days" style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px;">
  `;

  for (let i = 0; i < startWeekday; i++) {
    html += `
      <div style="
        min-height:100px;
        border:1px solid #e5e7eb;
        border-radius:14px;
        background:#f9fafb;
      "></div>
    `;
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const key = getEntryKey(year, month, day);
    const value = state.entries?.[key] || 0;
    const bgColor = getEntryColor(value);

    const isToday =
      year === today.getFullYear() &&
      month === today.getMonth() &&
      day === today.getDate();

    html += `
      <div
        class="calendar-day"
        data-day="${day}"
        style="
          min-height:100px;
          border:1px solid #e5e7eb;
          border-radius:14px;
          background:${bgColor};
          padding:10px;
          cursor:pointer;
          transition:background .15s ease;
          ${isToday ? "outline:2px solid #111827; outline-offset:-2px;" : ""}
        "
      >
        <div style="font-weight:700;font-size:15px;">${day}</div>
      </div>
    `;
  }

  html += `</div>`;
  container.innerHTML = html;

  bindDayClicks(container, state, year, month);
  updateStats(state);
}
