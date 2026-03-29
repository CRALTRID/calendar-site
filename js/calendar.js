import { persistEntries } from "./state.js";

function keyOf(y, m, d) {
  return `${y}-${m + 1}-${d}`;
}

function colorOf(v) {
  return ["#ffffff", "#fee2e2", "#fef3c7"][v] || "#ffffff";
}

function monthName(m) {
  return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][m];
}

export function renderCalendar(container, state) {
  if (!container) return;

  const now = state.currentDate || new Date();
  const y = now.getFullYear();
  const m = now.getMonth();

  const first = new Date(y, m, 1);
  const start = first.getDay();
  const days = new Date(y, m + 1, 0).getDate();
  const today = new Date();

  const title = document.getElementById("mainTitle");
  if (title) title.textContent = `${monthName(m)} ${y}`;

  const weekdays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  let html = `
    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px;margin-bottom:8px;">
      ${weekdays.map(d => `<div style="text-align:center;color:#6b7280;font-weight:600;padding:8px 0;">${d}</div>`).join("")}
    </div>
    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px;">
  `;

  for (let i = 0; i < start; i++) {
    html += `<div style="min-height:100px;border:1px solid #e5e7eb;border-radius:14px;background:#f9fafb;"></div>`;
  }

  for (let d = 1; d <= days; d++) {
    const isToday =
      y === today.getFullYear() &&
      m === today.getMonth() &&
      d === today.getDate();

    const k = keyOf(y, m, d);
    const v = state.entries?.[k] || 0;

    html += `
      <div class="calendar-day" data-day="${d}"
        style="
          min-height:100px;
          border:1px solid #e5e7eb;
          border-radius:14px;
          background:${colorOf(v)};
          padding:10px;
          cursor:pointer;
          transition:all .15s;
          ${isToday ? "outline:2px solid #111827; outline-offset:-2px;" : ""}
        ">
        <div style="font-weight:700;font-size:15px;">${d}</div>
      </div>
    `;
  }

  html += `</div>`;
  container.innerHTML = html;

  const cells = container.querySelectorAll(".calendar-day");
  cells.forEach(el => {
    el.onclick = () => {
      const d = Number(el.dataset.day);
      const k = keyOf(y, m, d);
      const cur = state.entries[k] || 0;
      const next = (cur + 1) % 3;

      state.entries[k] = next;
      el.style.background = colorOf(next);

      persistEntries();
      updateStats(state);
    };
  });

  updateStats(state);
}

function updateStats(state) {
  const now = state.currentDate || new Date();
  const y = now.getFullYear();
  const m = now.getMonth();

  const prefix = `${y}-${m + 1}-`;

  const all = Object.entries(state.entries || {});
  const active = all.filter(([,v]) => v !== 0);
  const month = active.filter(([k]) => k.startsWith(prefix));

  const totalEl = document.getElementById("totalCount");
  const rangeEl = document.getElementById("rangeCount");

  if (totalEl) totalEl.textContent = String(active.length);
  if (rangeEl) rangeEl.textContent = String(month.length);
}
