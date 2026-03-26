import { t } from "./i18n.js";

export const state = {
  lang: localStorage.getItem("challenge_lang") || "zh",
  currentUser: null,
  currentDate: new Date(),
  currentView: "month",
  selectedDateKey: null,
  activePage: "calendarPage",
  activeCalendarId: null,
  activeCalendarOwnerUid: null,
  ownedCalendars: [],
  sharedCalendars: [],
  profile: {
    name: "",
    phoneNumber: "",
    birthday: "",
    email: "",
    emailLower: "",
    photoURL: "",
    displayName: ""
  },
  calendar: null
};

export function makeDefaultCalendar(lang) {
  return {
    title: t(lang, "newCalendarDefault"),
    ownerUid: "",
    ownerEmail: "",
    ownerName: "",
    legends: [
      { id: "red", color: "#f87171", label: lang === "zh" ? "挑战 A" : "Challenge A" },
      { id: "orange", color: "#fb923c", label: lang === "zh" ? "挑战 B" : "Challenge B" },
      { id: "yellow", color: "#facc15", label: lang === "zh" ? "挑战 C" : "Challenge C" },
      { id: "green", color: "#4ade80", label: lang === "zh" ? "挑战 D" : "Challenge D" },
      { id: "blue", color: "#60a5fa", label: lang === "zh" ? "挑战 E" : "Challenge E" },
      { id: "purple", color: "#c084fc", label: lang === "zh" ? "挑战 F" : "Challenge F" }
    ],
    entries: {},
    sharedWith: [],
    sharedMeta: {},
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
}
