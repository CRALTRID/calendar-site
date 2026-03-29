function getMonthKey(year, month, day) {
  return `${year}-${month + 1}-${day}`;
}

function getColorByValue(value) {
  const colors = [
    "#ffffff", // 0 = none
    "#fee2e2", // 1 = red
    "#fef3c7"  // 2 = yellow
  ];
  return colors[value] || "#ffffff";
}

export function renderCalendar(container, state) {
  if (!container) return;

  const now = state.currentDate || new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const mainTitle = document.getElementById("mainTitle");
  if (mainTitle) {
    mainTitle.textContent = `${monthNames[month]} ${year}`;
  }

  let html = `
    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px;margin-bottom:8px;">
      ${weekdays.map((d) => `
        <div style="text-align:center;color:#6b7280;font-weight:600;padding:8px 0;">
          ${d}
        </div>
      `).join("")}
    </div>

    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px;">
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

  for (let d = 1; d <= daysInMonth; d++) {
    const isToday =
      year === today.getFullYear() &&
      month === today.getMonth() &&
      d === today.getDate();

    const key = getMonthKey(year, month, d);
    const value = state.entries?.[key] || 0;
    const bgColor = getColorByValue(value);

    html += `
      <div
        class="calendar-day"
        data-day="${d}"
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
        <div style="font-weight:700;font-size:15px;">${d}</div>
      </div>
    `;
  }

  html += `</div>`;

  container.innerHTML = html;

  const dayEls = container.querySelectorAll(".calendar-day");
  dayEls.forEach((el) => {
    el.addEventListener("click", () => {
      const day = Number(el.dataset.day);
      const key = getMonthKey(year, month, day);

      if (!state.entries) state.entries = {};

      const current = state.entries[key] || 0;
      const next = (current + 1) % 3; // 0 -> 1 -> 2 -> 0

      state.entries[key] = next;
      el.style.background = getColorByValue(next);

      updateStats(state);
    });
  });

  updateStats(state);
}

function updateStats(state) {
  const rangeCountEl = document.getElementById("rangeCount");
  const totalCountEl = document.getElementById("totalCount");

  const now = state.currentDate || new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const monthPrefix = `${year}-${month + 1}-`;

  const allEntries = Object.entries(state.entries || {});
  const activeEntries = allEntries.filter(([, value]) => value !== 0);

  const monthEntries = activeEntries.filter(([key]) => key.startsWith(monthPrefix));

  if (rangeCountEl) {
    rangeCountEl.textContent = String(monthEntries.length);
  }

  if (totalCountEl) {
    totalCountEl.textContent = String(activeEntries.length);
  }
}
