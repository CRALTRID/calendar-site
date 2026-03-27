export function renderCalendar(container, state) {
  if (!container) return;

  const now = state.currentDate || new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  let html = `
    <div style="max-width: 980px; margin: 24px auto; background: white; border-radius: 20px; padding: 20px; box-shadow: 0 10px 28px rgba(15,23,42,.06);">
      <h2 style="margin: 0 0 16px;">${year}-${String(month + 1).padStart(2, "0")}</h2>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px;margin-bottom:8px;">
        ${weekdays.map(d => `<div style="text-align:center;color:#6b7280;font-weight:600;padding:8px 0;">${d}</div>`).join("")}
      </div>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px;">
  `;

  for (let i = 0; i < startWeekday; i++) {
    html += `<div style="min-height:90px;border:1px solid #e5e7eb;border-radius:14px;background:#f9fafb;"></div>`;
  }

  for (let d = 1; d <= daysInMonth; d++) {
    html += `
      <div style="min-height:90px;border:1px solid #e5e7eb;border-radius:14px;background:#fff;padding:10px;">
        <div style="font-weight:700;">${d}</div>
      </div>
    `;
  }

  html += `
      </div>
    </div>
  `;

  container.innerHTML = html;
}
