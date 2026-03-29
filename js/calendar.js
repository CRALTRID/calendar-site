import { syncToCloud } from "./state.js";

function getKey(y, m, d) {
  return `${y}-${m + 1}-${d}`;
}

function getColor(v) {
  const colors = [
    "#ffffff", // 0
    "#fee2e2", // 1 红
    "#fef3c7"  // 2 黄
  ];
  return colors[v] || "#ffffff";
}

function getMonthName(m) {
  return [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ][m];
}

export function renderCalendar(container, state) {
  if (!container) return;

  if (state.currentView === "year") {
    renderYear(container, state);
  } else {
    renderMonth(container, state);
  }
}

function renderMonth(container, state) {
  const now = state.currentDate;
  const y = now.getFullYear();
  const m = now.getMonth();

  const days = new Date(y, m + 1, 0).getDate();
  const start = new Date(y, m, 1).getDay();
  const today = new Date();

  // 标题
  const title = document.getElementById("mainTitle");
  if (title) title.textContent = `${getMonthName(m)} ${y}`;

  let html = `
    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px;">
  `;

  // 空白补齐
  for (let i = 0; i < start; i++) {
    html += `<div></div>`;
  }

  for (let d = 1; d <= days; d++) {
    const key = getKey(y, m, d);
    const value = state.entries[key] || 0;

    const isToday =
      y === today.getFullYear() &&
      m === today.getMonth() &&
      d === today.getDate();

    html += `
      <div class="day" data-d="${d}"
        style="
          height:90px;
          border:1px solid #ddd;
          border-radius:10px;
          padding:8px;
          cursor:pointer;
          background:${getColor(value)};
          ${isToday ? "outline:2px solid black;" : ""}
        ">
        ${d}
      </div>
    `;
  }

  html += "</div>";
  container.innerHTML = html;

  // 点击事件
  container.querySelectorAll(".day").forEach(el => {
    el.onclick = async () => {
      const d = Number(el.dataset.d);
      const key = getKey(y, m, d);

      const next = ((state.entries[key] || 0) + 1) % 3;

      state.entries[key] = next;
      el.style.background = getColor(next);

      updateStats(state);

      await syncToCloud();
    };
  });

  updateStats(state);
}

function renderYear(container, state) {
  const y = state.currentDate.getFullYear();

  let html = `
    <div style="display:grid;grid-template-columns:repeat(12,1fr);gap:8px;">
  `;

  for (let m = 0; m < 12; m++) {
    html += `<div>`;

    const days = new Date(y, m + 1, 0).getDate();

    for (let d = 1; d <= days; d++) {
      const v = state.entries[getKey(y, m, d)] || 0;

      html += `
        <div style="
          width:12px;
          height:12px;
          margin:1px;
          background:${getColor(v)};
          display:inline-block;
        "></div>
      `;
    }

    html += `</div>`;
  }

  html += "</div>";
  container.innerHTML = html;
}

function updateStats(state) {
  const totalEl = document.getElementById("totalCount");
  const rangeEl = document.getElementById("rangeCount");

  const now = state.currentDate;
  const y = now.getFullYear();
  const m = now.getMonth();

  const prefix = `${y}-${m + 1}-`;

  const all = Object.entries(state.entries || {});
  const active = all.filter(([, v]) => v !== 0);
  const month = active.filter(([k]) => k.startsWith(prefix));

  if (totalEl) totalEl.textContent = active.length;
  if (rangeEl) rangeEl.textContent = month.length;
}
