import { loginWithGoogle, logoutUser, watchAuthState } from "./auth.js";
import { state } from "./state.js";
import { renderCalendar } from "./calendar.js";

const $ = (id) => document.getElementById(id);

const gateTitle = $("gateTitle");
const gateDesc = $("gateDesc");
const loginBtn = $("loginBtn");
const gateStatus = $("gateStatus");

const authGate = $("authGate");
const app = $("app");

const logoutBtn = $("logoutBtn");
const userName = $("userName");
const userEmail = $("userEmail");
const userAvatar = $("userAvatar");

const prevBtn = $("prevBtn");
const todayBtn = $("todayBtn");
const nextBtn = $("nextBtn");

const calendarContainer = $("calendarContainer");

function fillUI() {
  gateTitle.textContent = "Challenge Hub";
  gateDesc.textContent = "Please sign in to continue.";
  loginBtn.textContent = "Google Login";
  if (logoutBtn) logoutBtn.textContent = "Logout";

  $("calendarPageTitle") && ($("calendarPageTitle").textContent = "Personal Challenge Calendar");
  $("calendarPageDesc") && ($("calendarPageDesc").textContent = "Click a day to mark it.");
  $("todayHint") && ($("todayHint").textContent = "Today is outlined in black");

  prevBtn && (prevBtn.textContent = "Previous");
  todayBtn && (todayBtn.textContent = "Today");
  nextBtn && (nextBtn.textContent = "Next");

  $("legendPanelTitle") && ($("legendPanelTitle").textContent = "Legend");
  $("legendPanelDesc") && ($("legendPanelDesc").textContent = "Click a day to cycle white / red / yellow.");
  $("rangeLabel") && ($("rangeLabel").textContent = "Recorded this month");
  $("totalLabel") && ($("totalLabel").textContent = "Total recorded days");
}

function showGate() {
  authGate.classList.remove("hidden");
  app.classList.add("hidden");
}

function showApp() {
  authGate.classList.add("hidden");
  app.classList.remove("hidden");
}

function render() {
  renderCalendar(calendarContainer, state);
}

function bindNav() {
  prevBtn && (prevBtn.onclick = () => {
    state.currentDate = new Date(
      state.currentDate.getFullYear(),
      state.currentDate.getMonth() - 1,
      1
    );
    render();
  });

  nextBtn && (nextBtn.onclick = () => {
    state.currentDate = new Date(
      state.currentDate.getFullYear(),
      state.currentDate.getMonth() + 1,
      1
    );
    render();
  });

  todayBtn && (todayBtn.onclick = () => {
    state.currentDate = new Date();
    render();
  });
}

fillUI();
bindNav();

watchAuthState((user) => {
  state.currentUser = user;

  if (user) {
    userName && (userName.textContent = user.displayName || "User");
    userEmail && (userEmail.textContent = user.email || "");
    userAvatar && (userAvatar.src = user.photoURL || "");

    gateStatus.textContent = `Signed in as ${user.email || "user"}`;
    showApp();
    render();
  } else {
    gateStatus.textContent = "Not signed in";
    showGate();
  }
});

loginBtn.onclick = async () => {
  try {
    await loginWithGoogle();
  } catch (e) {
    gateStatus.textContent = e.message;
  }
};

logoutBtn && (logoutBtn.onclick = async () => {
  try {
    await logoutUser();
  } catch (e) {
    gateStatus.textContent = e.message;
  }
});
