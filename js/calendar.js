import { getCurrentCalendar } from "./calendarManager.js";
import { syncToCloud } from "./state.js";

export function renderCalendar(container, state) {
  const cal = getCurrentCalendar();
  if (!cal) return;

  const y = state.currentDate.getFullYear();
  const m = state.currentDate.getMonth();

  const days = new Date(y, m + 1, 0).getDate();

  let html = `<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px;">`;

  for (let d = 1; d <= days; d++) {
    const key = `${y}-${m + 1}-${d}`;
    const v = cal.entries[key] || 0;

    html += `
      <div data-d="${d}" style="
        height:80px;
        border:1px solid #ddd;
        background:${v === 1 ? "#fee2e2" : v === 2 ? "#fef3c7" : "#fff"};
      ">
        ${d}
      </div>
    `;
  }

  html += "</div>";
  container.innerHTML = html;

  container.querySelectorAll("div[data-d]").forEach(el => {
    el.onclick = async () => {
      const d = el.dataset.d;
      const key = `${y}-${m + 1}-${d}`;

      cal.entries[key] = ((cal.entries[key] || 0) + 1) % 3;

      await syncToCloud();
      renderCalendar(container, state);
    };
  });
}
