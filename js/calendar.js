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

    html += `
      <div
        class="calendar-day"
        data-day="${d}"
        style="
          min-height:100px;
          border:1px solid #e5e7eb;
          border-radius:14px;
          background:#fff;
          padding:10px;
          cursor:pointer;
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
      const day = el.dataset.day;
      alert(`Clicked ${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
    });
  });
}
