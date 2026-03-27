import { loginWithGoogle, logoutUser, watchAuthState } from "./auth.js";
import { state } from "./state.js";
import { renderCalendar } from "./calendar.js";

const gateTitle = document.getElementById("gateTitle");
const gateDesc = document.getElementById("gateDesc");
const loginBtn = document.getElementById("loginBtn");
const gateStatus = document.getElementById("gateStatus");

const authGate = document.getElementById("authGate");
const app = document.getElementById("app");

const logoutBtn = document.getElementById("logoutBtn");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const userAvatar = document.getElementById("userAvatar");

const calendarContainer = document.getElementById("calendarContainer");

gateTitle.textContent = "Challenge Hub";
gateDesc.textContent = "Please sign in to continue.";
loginBtn.textContent = "Google Login";
logoutBtn.textContent = "Logout";

function showGate() {
  authGate.classList.remove("hidden");
  app.classList.add("hidden");
}

function showApp() {
  authGate.classList.add("hidden");
  app.classList.remove("hidden");
}

watchAuthState((user) => {
  state.currentUser = user;

  if (user) {
    userName.textContent = user.displayName || "User";
    userEmail.textContent = user.email || "";
    userAvatar.src = user.photoURL || "";

    showApp();

    // ⭐ 关键：渲染日历
    renderCalendar(calendarContainer, state);
  } else {
    showGate();
  }
});

loginBtn.addEventListener("click", async () => {
  try {
    await loginWithGoogle();
  } catch (err) {
    gateStatus.textContent = err.message;
  }
});

logoutBtn.addEventListener("click", async () => {
  await logoutUser();
});
