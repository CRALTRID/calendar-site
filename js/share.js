export function generateShareLink(calendar) {
  const data = btoa(JSON.stringify(calendar));
  return `${location.origin}?share=${data}`;
}

export function loadSharedCalendar(state) {
  const params = new URLSearchParams(location.search);

  if (params.get("share")) {
    const cal = JSON.parse(atob(params.get("share")));
    state.calendars[cal.id] = cal;
  }
}
