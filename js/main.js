import { loginWithGoogle, logoutUser, watchAuthState } from "./auth.js";
import { state, syncFromCloud } from "./state.js";
import { renderCalendar } from "./calendar.js";

const $ = (id) => document.getElementById(id);

// ========= DOM =========
const loginBtn = $("loginBtn");
const logoutBtn = $("logoutBtn");

const authGate = $("authGate");
const app = $("app");

const userName = $("userName");
const userEmail = $("userEmail");
const userAvatar = $("userAvatar");

const calendarContainer = $("calendarContainer");

const prevBtn = $("prevBtn");
const todayBtn = $("todayBtn");
const nextBtn = $("nextBtn");

const monthViewBtn = $("monthViewBtn");
const yearViewBtn = $("yearViewBtn");

const shareBtn = $("shareBtn"); // 可选按钮

// ========= UI 初始化 =========
function fillUI() {
  $("gateTitle") && ($("gateTitle").textContent = "Challenge Hub");
  $("gateDesc") && ($("gateDesc").textContent = "Please sign in to continue.");

  loginBtn && (loginBtn.textContent = "Google Login");
  logoutBtn && (logoutBtn.textContent = "Logout");

  $("calendarPageTitle") && ($("calendarPageTitle").textContent = "Personal Challenge Calendar");
  $("calendarPageDesc") && ($("calendarPageDesc").textContent = "Click a day to mark it.");

  prevBtn && (prevBtn.textContent = "Previous");
  todayBtn && (todayBtn.textContent = "Today");
  nextBtn && (nextBtn.textContent = "Next");

  $("todayHint") && ($("todayHint").textContent = "Today is outlined in black");

  $("legendPanelTitle") && ($("legendPanelTitle").textContent = "Legend");
  $("legendPanelDesc") && ($("legendPanelDesc").textContent = "Click day to cycle white/red/yellow");

  $("rangeLabel") && ($("rangeLabel").textContent = "This month");
  $("totalLabel") && ($("totalLabel").textContent = "Total");
}

// ========= 页面切换 =========
function showGate() {
  authGate?.classList.remove("hidden");
  app?.classList.add("hidden");
}

function showApp() {
  authGate?.classList.add("hidden");
  app?.classList.remove("hidden");
}

// ========= 渲染 =========
function render() {
  renderCalendar(calendarContainer, state);
}

// ========= 用户信息 =========
function updateUser(user) {
  if (!user) return;

  if (userName) userName.textContent = user.displayName || "User";
  if (userEmail) userEmail.textContent = user.email || "";
  if (userAvatar && user.photoURL) userAvatar.src = user.photoURL;
}

// ========= 顶部按钮 =========
function bindNavigation() {
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

// ========= 视图切换 =========
function bindViewSwitch() {
  monthViewBtn && (monthViewBtn.onclick = () => {
    state.currentView = "month";
    monthViewBtn.classList.add("active");
    yearViewBtn?.classList.remove("active");
    render();
  });

  yearViewBtn && (yearViewBtn.onclick = () => {
    state.currentView = "year";
    yearViewBtn.classList.add("active");
    monthViewBtn?.classList.remove("active");
    render();
  });
}

// ========= 分享功能 =========
function bindShare() {
  if (!shareBtn) return;

  shareBtn.onclick = () => {
    const data = btoa(JSON.stringify(state.entries));
    const link = `${location.origin}?data=${data}`;

    navigator.clipboard.writeText(link);
    alert("Share link copied!");
  };

  // 打开别人分享
  const params = new URLSearchParams(location.search);
  if (params.get("data")) {
    try {
      state.entries = JSON.parse(atob(params.get("data")));
    } catch {}
  }
}

// ========= 登录监听 =========
watchAuthState(async (user) => {
  state.currentUser = user;

  if (user) {
    updateUser(user);

    // ☁️ 从云加载
    await syncFromCloud();

    showApp();
    render();
  } else {
    showGate();
  }
});

// ========= 登录按钮 =========
loginBtn && (loginBtn.onclick = async () => {
  try {
    await loginWithGoogle();
  } catch (err) {
    alert(err.message);
  }
});

logoutBtn && (logoutBtn.onclick = async () => {
  try {
    await logoutUser();
  } catch (err) {
    alert(err.message);
  }
});

// ========= 初始化 =========
fillUI();
bindNavigation();
bindViewSwitch();
bindShare();
